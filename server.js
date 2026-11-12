const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Connected SSE broadcast clients (res -> client metadata)
const sseClients = new Set();
const sseClientMeta = new Map();
let nextSseClientId = 1;

// Connected CS2 GSI clients (clientKey -> client metadata)
const gsiClientsMap = new Map();
const GSI_CLIENT_TIMEOUT_MS = 20000; // 20s without GSI heartbeat/packet marks client disconnected

// Server-side Connection & Activity Log Store (capped at 100 entries)
const MAX_SERVER_LOGS = 100;
const serverLogs = [];
let nextLogId = 1;

function formatClientIp(req) {
  const forwarded = req && req.headers && req.headers['x-forwarded-for'];
  const raw = (forwarded ? String(forwarded).split(',')[0].trim() : (req && req.socket && req.socket.remoteAddress)) || '127.0.0.1';
  return raw.replace(/^::ffff:/i, '');
}

function formatTimestamp(ms = Date.now()) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function getClientsSummary() {
  const now = Date.now();
  const gsiClients = Array.from(gsiClientsMap.values()).map(c => ({
    id: c.id,
    name: c.name,
    steamId: c.steamId,
    ip: c.ip,
    mode: c.mode,
    team: c.team,
    slot: c.slot || null,
    connectedAt: c.connectedAt,
    lastSeenAt: c.lastSeenAt,
    ageMs: Math.max(0, now - c.lastSeenAt),
    packetsReceived: c.packetsReceived
  }));

  const displayClients = Array.from(sseClientMeta.values()).map(d => ({
    id: d.id,
    ip: d.ip,
    view: d.view,
    userAgent: d.userAgent,
    connectedAt: d.connectedAt,
    uptimeSec: Math.max(0, Math.round((now - d.connectedAt) / 1000))
  }));

  return {
    gsiCount: gsiClients.length,
    displayCount: displayClients.length,
    gsiClients,
    displayClients
  };
}

function broadcastSseEvent(payloadObj) {
  const data = JSON.stringify(payloadObj);
  for (const res of sseClients) {
    try {
      res.write(`data: ${data}\n\n`);
    } catch (_) {}
  }
}

function recordServerLog({ level = 'INFO', category = 'system', title, message, meta = {}, notify = true }) {
  const now = Date.now();
  const entry = {
    id: `log-${nextLogId++}`,
    timestamp: now,
    timeFormatted: formatTimestamp(now),
    level,
    category, // 'gsi_connect' | 'gsi_disconnect' | 'display_connect' | 'display_disconnect' | 'cfg_download' | 'system'
    title,
    message,
    meta
  };

  serverLogs.unshift(entry);
  if (serverLogs.length > MAX_SERVER_LOGS) {
    serverLogs.length = MAX_SERVER_LOGS;
  }

  const logLine = `[${entry.timeFormatted}] [${level}] [${category.toUpperCase()}] ${title} — ${message}`;
  if (level === 'WARN' || level === 'ERROR') {
    console.warn(logLine);
  } else {
    console.log(logLine);
  }

  if (notify) {
    broadcastSseEvent({
      type: 'client_event',
      event: entry,
      clients: getClientsSummary(),
      logs: serverLogs.slice(0, 40)
    });
  }

  return entry;
}

// Aggregated Multi-Client & Spectator GSI State
const gsiStore = {
  lastPacketAt: null,
  packetsReceived: 0,
  ingestionMode: 'waiting', // 'spectator_allplayers' | 'multi_client' | 'waiting'
  humanTeamSide: 'CT',
  botTeamSide: 'T',
  map: {
    name: 'de_mirage',
    phase: 'live',
    round: 1,
    ctScore: 0,
    tScore: 0
  },
  round: {
    phase: 'live', // 'freezetime' | 'live' | 'over'
    winTeam: null,
    bomb: null, // null | 'planted' | 'defused' | 'exploded'
    bombPlantedAt: null,
    phaseTimeLeft: 115
  },
  // Keyed by steamid or player name for multi-client aggregation
  humanPlayersMap: new Map(),
  // Up to 10 bot statuses when allplayers is available, or inferred
  bots: [],
  killfeed: [],
  bannerAlert: null
};

// Weapon metadata lookup for CS2 internal weapon names
const WEAPON_CATALOG = {
  weapon_ak47: { id: 'ak47', name: 'AK-47', category: 'rifle', clipMax: 30 },
  weapon_m4a1: { id: 'm4a4', name: 'M4A4', category: 'rifle', clipMax: 30 },
  weapon_m4a1_silencer: { id: 'm4a1s', name: 'M4A1-S', category: 'rifle', clipMax: 20 },
  weapon_awp: { id: 'awp', name: 'AWP', category: 'sniper', clipMax: 5 },
  weapon_ssg08: { id: 'ssg08', name: 'SSG 08', category: 'sniper', clipMax: 10 },
  weapon_galilar: { id: 'galil', name: 'Galil AR', category: 'rifle', clipMax: 35 },
  weapon_famas: { id: 'famas', name: 'FAMAS', category: 'rifle', clipMax: 25 },
  weapon_aug: { id: 'aug', name: 'AUG', category: 'rifle', clipMax: 30 },
  weapon_sg556: { id: 'sg553', name: 'SG 553', category: 'rifle', clipMax: 30 },
  weapon_mp9: { id: 'mp9', name: 'MP9', category: 'smg', clipMax: 30 },
  weapon_mac10: { id: 'mac10', name: 'MAC-10', category: 'smg', clipMax: 30 },
  weapon_mp7: { id: 'mp7', name: 'MP7', category: 'smg', clipMax: 30 },
  weapon_ump45: { id: 'ump45', name: 'UMP-45', category: 'smg', clipMax: 25 },
  weapon_p90: { id: 'p90', name: 'P90', category: 'smg', clipMax: 50 },
  weapon_xm1014: { id: 'xm1014', name: 'XM1014', category: 'heavy', clipMax: 7 },
  weapon_nova: { id: 'nova', name: 'Nova', category: 'heavy', clipMax: 8 },
  weapon_deagle: { id: 'deagle', name: 'Desert Eagle', category: 'pistol', clipMax: 7 },
  weapon_usp_silencer: { id: 'usps', name: 'USP-S', category: 'pistol', clipMax: 12 },
  weapon_glock: { id: 'glock', name: 'Glock-18', category: 'pistol', clipMax: 20 },
  weapon_hkp2000: { id: 'p2000', name: 'P2000', category: 'pistol', clipMax: 13 },
  weapon_p250: { id: 'p250', name: 'P250', category: 'pistol', clipMax: 13 },
  weapon_fiveseven: { id: 'fiveseven', name: 'Five-SeveN', category: 'pistol', clipMax: 20 },
  weapon_tec9: { id: 'tec9', name: 'Tec-9', category: 'pistol', clipMax: 18 },
  weapon_cz75a: { id: 'cz75', name: 'CZ75-Auto', category: 'pistol', clipMax: 12 },
  weapon_revolver: { id: 'revolver', name: 'R8 Revolver', category: 'pistol', clipMax: 8 },
  weapon_taser: { id: 'zeus', name: 'Zeus x27', category: 'gear', clipMax: 1 }
};

function parsePlayerWeapons(weaponsObj = {}) {
  let primary = null;
  let secondary = null;
  let knife = null;
  let activeWeapon = null;
  const grenades = [];
  let hasC4 = false;
  let hasZeus = false;

  for (const key of Object.keys(weaponsObj)) {
    const w = weaponsObj[key];
    if (!w || !w.name) continue;
    const rawName = w.name;
    const type = (w.type || '').toLowerCase();

    if (rawName === 'weapon_c4' || type === 'c4') {
      hasC4 = true;
      continue;
    }

    if (type === 'grenade' || rawName.includes('grenade') || rawName.includes('flashbang') || rawName.includes('molotov') || rawName.includes('incgrenade') || rawName.includes('decoy')) {
      let gType = 'he';
      if (rawName.includes('flashbang')) gType = 'flash';
      else if (rawName.includes('smokegrenade')) gType = 'smoke';
      else if (rawName.includes('molotov') || rawName.includes('incgrenade')) gType = 'molotov';
      else if (rawName.includes('decoy')) gType = 'decoy';
      const count = w.ammo_reserve || 1;
      for (let i = 0; i < count; i++) {
        grenades.push(gType);
      }
      continue;
    }

    if (type === 'knife' || rawName.includes('knife') || rawName.includes('bayonet')) {
      const meta = WEAPON_CATALOG[rawName];
      const knifeObj = {
        id: 'knife',
        name: (meta && meta.name) ? meta.name : 'Tactical Knife',
        skin: w.paintkit && w.paintkit !== 'default' ? w.paintkit.replace(/_/g, ' ').toUpperCase() : 'STANDARD ISSUE',
        category: 'knife',
        clip: 0,
        clipMax: 0,
        reserve: 0,
        state: w.state || 'holstered'
      };
      knife = knifeObj;
      if (w.state === 'active') {
        activeWeapon = knifeObj;
      }
      continue;
    }

    if (rawName.includes('taser')) {
      hasZeus = true;
    }

    const meta = WEAPON_CATALOG[rawName] || {
      id: rawName.replace('weapon_', ''),
      name: rawName.replace('weapon_', '').toUpperCase(),
      category: type === 'pistol' ? 'pistol' : 'rifle',
      clipMax: w.ammo_clip_max || 30
    };

    const parsedWeapon = {
      id: meta.id,
      name: meta.name,
      skin: w.paintkit && w.paintkit !== 'default' ? w.paintkit.replace(/_/g, ' ').toUpperCase() : 'FACTORY ISSUE',
      category: meta.category,
      clip: typeof w.ammo_clip === 'number' ? w.ammo_clip : meta.clipMax,
      clipMax: w.ammo_clip_max || meta.clipMax,
      reserve: typeof w.ammo_reserve === 'number' ? w.ammo_reserve : 90,
      state: w.state || 'holstered'
    };

    if (meta.category === 'pistol' || type === 'pistol') {
      secondary = parsedWeapon;
    } else {
      primary = parsedWeapon;
    }

    if (w.state === 'active') {
      activeWeapon = parsedWeapon;
    }
  }

  return {
    primary,
    secondary,
    activeWeapon: activeWeapon || primary || secondary || {
      id: 'knife',
      name: 'Combat Knife',
      skin: 'STANDARD ISSUE',
      category: 'knife',
      clip: 0,
      clipMax: 0,
      reserve: 0,
      state: 'active'
    },
    grenades: grenades.slice(0, 4),
    knife,
    hasC4,
    hasZeus
  };
}

const DEFAULT_BOT_NAMES = [
  'BOT VLADIMIR', 'BOT IGOR', 'BOT DMITRI', 'BOT BORIS', 'BOT VIKTOR',
  'BOT YURI', 'BOT SERGEI', 'BOT NIKOLAI', 'BOT PAVEL', 'BOT ANTON'
];

// Per-player & per-bot state trackers for real-time GSI killfeed & cumulative stats
const playerCombatTracker = new Map();
const botHealthTracker = new Map();
let nextKillfeedSeq = 1;

function pushServerKillfeedEvent({
  attacker,
  attackerType = 'human',
  attackerSlot = null,
  attackerId = null,
  weaponName = 'AK-47',
  victim,
  victimType = 'bot',
  victimSlot = null,
  isHs = false,
  roundKills = 1
}) {
  const entry = {
    id: `gsi-kf-${Date.now()}-${nextKillfeedSeq++}`,
    timestamp: Date.now(),
    attacker,
    attackerType,
    attackerSlot,
    attackerId,
    weaponName,
    victim,
    victimType,
    victimSlot,
    isHs: Boolean(isHs),
    roundKills: Number(roundKills) || 1,
    extraTag: ''
  };
  gsiStore.killfeed.unshift(entry);
  if (gsiStore.killfeed.length > 10) {
    gsiStore.killfeed.length = 10;
  }
  return entry;
}

function resolveKillWeaponName(parsedWeapons, tracker) {
  const active = parsedWeapons.activeWeapon;
  const primary = parsedWeapons.primary;
  const secondary = parsedWeapons.secondary;

  // If player quick-switched to knife right after firing primary/secondary, detect ammo drop
  if (active && active.category === 'knife') {
    if (primary && tracker && typeof tracker.lastPrimaryClip === 'number' && primary.clip < tracker.lastPrimaryClip) {
      return primary.name;
    }
    if (secondary && tracker && typeof tracker.lastSecondaryClip === 'number' && secondary.clip < tracker.lastSecondaryClip) {
      return secondary.name;
    }
  }

  if (active && active.name) return active.name;
  if (primary && primary.name) return primary.name;
  if (secondary && secondary.name) return secondary.name;
  return gsiStore.humanTeamSide === 'CT' ? 'M4A1-S' : 'AK-47';
}

function isBotSteamIdOrName(sid, name) {
  if (/^BOT\s/i.test(name || '')) return true;
  if (!sid || sid === '0') return true;
  // Valve reserved Bot SteamID64 range in CS2
  if (/^765611979602657\d{2}$/.test(String(sid))) return true;
  return false;
}

function normalizeGsiPlayer(steamId, rawPlayer, slotIndex = 0, newlyDeadBotNames = []) {
  const state = rawPlayer.state || {};
  const stats = rawPlayer.match_stats || {};
  const parsedWeapons = parsePlayerWeapons(rawPlayer.weapons || {});

  const roundsPlayed = Math.max(1, gsiStore.map.round || 1);
  const currentRound = gsiStore.map.round || 1;
  const health = typeof state.health === 'number' ? state.health : 100;
  const roundKills = typeof state.round_kills === 'number' ? state.round_kills : 0;
  const roundKillHs = typeof state.round_killhs === 'number' ? state.round_killhs : 0;
  const rawRoundDmg = typeof state.round_totaldmg === 'number' ? state.round_totaldmg : 0;
  const rawStatsKills = typeof stats.kills === 'number' ? stats.kills : null;
  const rawStatsDeaths = typeof stats.deaths === 'number' ? stats.deaths : null;
  const rawStatsAssists = typeof stats.assists === 'number' ? stats.assists : null;
  const mvps = typeof stats.mvps === 'number' ? stats.mvps : 0;
  const playerName = rawPlayer.name || `OPERATOR ${slotIndex + 1}`;

  const currPrimaryId = parsedWeapons.primary ? parsedWeapons.primary.id : null;
  const currPrimaryClip = parsedWeapons.primary ? parsedWeapons.primary.clip : null;
  const currSecondaryId = parsedWeapons.secondary ? parsedWeapons.secondary.id : null;
  const currSecondaryClip = parsedWeapons.secondary ? parsedWeapons.secondary.clip : null;

  let tracker = playerCombatTracker.get(steamId);
  if (!tracker) {
    const initialTotalKills = rawStatsKills !== null ? Math.max(rawStatsKills, roundKills) : roundKills;
    const initialTotalDeaths = rawStatsDeaths !== null ? rawStatsDeaths : (health <= 0 ? 1 : 0);
    const initialAssists = rawStatsAssists !== null ? rawStatsAssists : 0;
    const priorKills = Math.max(0, initialTotalKills - roundKills);
    const initialHsKills = roundKillHs + Math.round(priorKills * 0.48);
    const initialRoundDmg = rawRoundDmg > 0 ? rawRoundDmg : (roundKills * 100);
    const priorDmgEstimate = priorKills * 95 + initialAssists * 40;
    tracker = {
      firstRoundSeen: currentRound,
      lastRound: currentRound,
      roundsObserved: 1,
      baseKillsAtRoundStart: priorKills,
      lastEffectiveKills: initialTotalKills,
      lastRoundKills: roundKills,
      lastRoundKillHs: roundKillHs,
      totalHsKills: initialHsKills,
      lastEffectiveDeaths: initialTotalDeaths,
      lastEffectiveAssists: initialAssists,
      lastHealth: health,
      unconfirmedChipDamage: 0,
      currentRoundDamage: initialRoundDmg,
      completedRoundsDamage: priorDmgEstimate,
      roundHistory: {
        [currentRound]: { rNum: currentRound, val: initialRoundDmg, kills: roundKills }
      },
      lastPrimaryId: currPrimaryId,
      lastPrimaryClip: currPrimaryClip,
      lastSecondaryId: currSecondaryId,
      lastSecondaryClip: currSecondaryClip
    };
    playerCombatTracker.set(steamId, tracker);
  } else {
    // Detect round reset ONLY when round_kills drops back down (e.g., new round freezetime)
    // or when map.round advances AND round_kills is 0
    const isNewRoundReset =
      roundKills < tracker.lastRoundKills ||
      (currentRound !== tracker.lastRound && roundKills === 0);

    if (isNewRoundReset) {
      // Finalize completed round damage (if no rawRoundDmg was sent, use confirmed kills + bounded chip)
      const finalizedRoundDmg = rawRoundDmg > 0
        ? rawRoundDmg
        : Math.min(1000, tracker.lastRoundKills * 100 + Math.min(65, tracker.unconfirmedChipDamage || 0));
      tracker.roundHistory[tracker.lastRound] = {
        rNum: tracker.lastRound,
        val: finalizedRoundDmg,
        kills: tracker.lastRoundKills
      };
      tracker.completedRoundsDamage += finalizedRoundDmg;
      tracker.roundsObserved += 1;
      tracker.lastRound = currentRound;
      tracker.baseKillsAtRoundStart = tracker.lastEffectiveKills;
      tracker.lastRoundKills = 0;
      tracker.lastRoundKillHs = 0;
      tracker.unconfirmedChipDamage = 0;
      tracker.currentRoundDamage = 0;
    } else if (currentRound !== tracker.lastRound) {
      tracker.lastRound = currentRound;
    }

    // Detect if match was restarted (e.g. mp_restartgame where stats.kills drops to 0)
    if (rawStatsKills === 0 && roundKills === 0 && tracker.lastEffectiveKills > 0 && currentRound <= 1) {
      tracker.firstRoundSeen = 1;
      tracker.baseKillsAtRoundStart = 0;
      tracker.lastEffectiveKills = 0;
      tracker.totalHsKills = 0;
      tracker.lastEffectiveDeaths = 0;
      tracker.lastEffectiveAssists = 0;
      tracker.unconfirmedChipDamage = 0;
      tracker.currentRoundDamage = 0;
      tracker.completedRoundsDamage = 0;
      tracker.roundsObserved = 1;
      tracker.roundHistory = {};
    }

    const computedTotalKills = Math.max(
      rawStatsKills !== null ? rawStatsKills : 0,
      tracker.baseKillsAtRoundStart + roundKills
    );

    const killsDelta = Math.max(
      roundKills - tracker.lastRoundKills,
      computedTotalKills - tracker.lastEffectiveKills
    );
    const hsDelta = Math.max(0, roundKillHs - tracker.lastRoundKillHs);

    // Estimate bounded chip damage when bullets are fired during live round (capped so wall-sprays never inflate ADR)
    let shotChipAdded = 0;
    if (health > 0 && gsiStore.round.phase !== 'freezetime') {
      if (currPrimaryId && currPrimaryId === tracker.lastPrimaryId && typeof tracker.lastPrimaryClip === 'number' && currPrimaryClip < tracker.lastPrimaryClip) {
        const fired = tracker.lastPrimaryClip - currPrimaryClip;
        if (fired > 0 && fired <= 10) {
          shotChipAdded += fired * 8;
        }
      }
      if (currSecondaryId && currSecondaryId === tracker.lastSecondaryId && typeof tracker.lastSecondaryClip === 'number' && currSecondaryClip < tracker.lastSecondaryClip) {
        const fired = tracker.lastSecondaryClip - currSecondaryClip;
        if (fired > 0 && fired <= 8) {
          shotChipAdded += fired * 7;
        }
      }
    }

    if (killsDelta > 0 && killsDelta <= 5) {
      const usedWeaponName = resolveKillWeaponName(parsedWeapons, tracker);
      for (let k = 0; k < killsDelta; k++) {
        const isHsKill = k < hsDelta;
        const killNumInRound = Math.min(10, Math.max(1, roundKills - (killsDelta - 1 - k)));
        const victimBotName = newlyDeadBotNames.length > 0
          ? newlyDeadBotNames.shift()
          : DEFAULT_BOT_NAMES[(killNumInRound - 1 + slotIndex * 2) % DEFAULT_BOT_NAMES.length];

        pushServerKillfeedEvent({
          attacker: playerName,
          attackerType: 'human',
          attackerSlot: slotIndex + 1,
          attackerId: steamId,
          weaponName: usedWeaponName,
          victim: victimBotName,
          victimType: 'bot',
          isHs: isHsKill,
          roundKills: killNumInRound
        });
      }
      tracker.totalHsKills += hsDelta;
      // A confirmed kill absorbs prior chip damage on that target (1 kill = 100 HP in CS2)
      tracker.unconfirmedChipDamage = 0;
    } else if (shotChipAdded > 0) {
      tracker.unconfirmedChipDamage = Math.min(72, (tracker.unconfirmedChipDamage || 0) + shotChipAdded);
    }

    if (rawRoundDmg > 0) {
      // Exact CS2 round_totaldmg is available
      tracker.currentRoundDamage = rawRoundDmg;
    } else {
      tracker.currentRoundDamage = Math.min(1000, roundKills * 100 + (tracker.unconfirmedChipDamage || 0));
    }

    // Detect if this human player was just eliminated
    const diedThisTick = tracker.lastHealth > 0 && health <= 0;
    const statsDeathsIncreased = rawStatsDeaths !== null && rawStatsDeaths > tracker.lastEffectiveDeaths;
    if (diedThisTick || statsDeathsIncreased) {
      tracker.lastEffectiveDeaths = rawStatsDeaths !== null
        ? Math.max(rawStatsDeaths, tracker.lastEffectiveDeaths + (diedThisTick ? 1 : 0))
        : tracker.lastEffectiveDeaths + 1;

      if (diedThisTick) {
        const aliveBot = gsiStore.bots.find(b => b.health > 0);
        const killerBotName = (aliveBot && aliveBot.name) || DEFAULT_BOT_NAMES[slotIndex % DEFAULT_BOT_NAMES.length];
        const botWeapon = gsiStore.botTeamSide === 'T' ? 'AK-47' : 'M4A1-S';
        pushServerKillfeedEvent({
          attacker: killerBotName,
          attackerType: 'bot',
          weaponName: botWeapon,
          victim: playerName,
          victimType: 'human',
          victimSlot: slotIndex + 1,
          isHs: false,
          roundKills: 1
        });
      }
    }

    if (rawStatsAssists !== null && rawStatsAssists > tracker.lastEffectiveAssists) {
      const assistsGained = rawStatsAssists - tracker.lastEffectiveAssists;
      tracker.lastEffectiveAssists = rawStatsAssists;
      if (rawRoundDmg === 0 && assistsGained > 0) {
        tracker.unconfirmedChipDamage = Math.min(85, (tracker.unconfirmedChipDamage || 0) + assistsGained * 42);
        tracker.currentRoundDamage = Math.min(1000, roundKills * 100 + tracker.unconfirmedChipDamage);
      }
    }

    tracker.lastEffectiveKills = Math.max(tracker.lastEffectiveKills + Math.max(0, killsDelta), computedTotalKills);
    tracker.lastRoundKills = roundKills;
    tracker.lastRoundKillHs = roundKillHs;
    tracker.lastHealth = health;
    tracker.lastPrimaryId = currPrimaryId;
    tracker.lastPrimaryClip = currPrimaryClip;
    tracker.lastSecondaryId = currSecondaryId;
    tracker.lastSecondaryClip = currSecondaryClip;
    tracker.roundHistory[currentRound] = {
      rNum: currentRound,
      val: tracker.currentRoundDamage,
      kills: roundKills
    };
  }

  const kills = tracker.lastEffectiveKills;
  const deaths = tracker.lastEffectiveDeaths;
  const assists = tracker.lastEffectiveAssists;
  const roundDmg = tracker.currentRoundDamage;
  const totalDmgSoFar = tracker.completedRoundsDamage + roundDmg;
  // In CS2, during buy phase (freezetime) of Round N > 1 before any damage is dealt, ADR is divided by N-1 completed rounds
  const adrDenominator = (gsiStore.round.phase === 'freezetime' && currentRound > 1 && roundDmg === 0)
    ? Math.max(1, currentRound - 1)
    : Math.max(1, currentRound);
  const adr = Math.round(totalDmgSoFar / adrDenominator);
  const hsPercent = kills > 0
    ? Math.min(100, Math.round((tracker.totalHsKills / Math.max(1, kills)) * 100))
    : 0;

  return {
    id: steamId,
    slot: slotIndex + 1,
    name: playerName,
    team: rawPlayer.team || gsiStore.humanTeamSide,
    health,
    armor: typeof state.armor === 'number' ? state.armor : 100,
    helmet: Boolean(state.helmet),
    defuseKit: Boolean(state.defusekit),
    hasC4: parsedWeapons.hasC4,
    flashed: typeof state.flashed === 'number' ? state.flashed : 0,
    burning: typeof state.burning === 'number' ? state.burning : 0,
    smoked: typeof state.smoked === 'number' ? state.smoked : 0,
    money: typeof state.money === 'number' ? state.money : 800,
    equipValue: typeof state.equip_value === 'number' ? state.equip_value : 0,
    roundKills,
    roundKillHs,
    roundDamage: roundDmg,
    roundHistory: tracker.roundHistory,
    kills,
    deaths,
    assists,
    mvps,
    score: typeof stats.score === 'number' ? stats.score : (kills * 2 + assists),
    adr,
    totalDamage: totalDmgSoFar,
    hsPercent,
    activity: rawPlayer.activity || 'playing',
    observerSlot: typeof rawPlayer.observer_slot === 'number' ? rawPlayer.observer_slot : null,
    primaryWeapon: parsedWeapons.primary,
    secondaryWeapon: parsedWeapons.secondary,
    knifeWeapon: parsedWeapons.knife || null,
    activeWeapon: parsedWeapons.activeWeapon,
    grenades: parsedWeapons.grenades,
    hasZeus: Boolean(parsedWeapons.hasZeus),
    lastSeenAt: Date.now()
  };
}

function handleGsiPayload(payload, clientIp = '127.0.0.1') {
  const now = Date.now();
  gsiStore.lastPacketAt = now;
  gsiStore.packetsReceived += 1;

  // 1. Map & Scores
  if (payload.map) {
    gsiStore.map.name = payload.map.name || gsiStore.map.name;
    gsiStore.map.phase = payload.map.phase || gsiStore.map.phase;
    gsiStore.map.round = typeof payload.map.round === 'number' ? payload.map.round + 1 : gsiStore.map.round;
    if (payload.map.team_ct && typeof payload.map.team_ct.score === 'number') {
      gsiStore.map.ctScore = payload.map.team_ct.score;
    }
    if (payload.map.team_t && typeof payload.map.team_t.score === 'number') {
      gsiStore.map.tScore = payload.map.team_t.score;
    }
  }

  // 2. Round & Bomb State
  if (payload.round) {
    const prevBomb = gsiStore.round.bomb;
    gsiStore.round.phase = payload.round.phase || gsiStore.round.phase;
    gsiStore.round.winTeam = payload.round.win_team || null;
    gsiStore.round.bomb = payload.round.bomb || null;

    if (gsiStore.round.bomb === 'planted' && prevBomb !== 'planted') {
      gsiStore.round.bombPlantedAt = now;
      gsiStore.bannerAlert = {
        type: 'bomb',
        title: 'BOMB PLANTED // 40s COUNTDOWN ACTIVE',
        subtitle: 'C4 ARMED — DEFUSE THRESHOLD 10s (5s WITH KIT)',
        timestamp: now
      };
    } else if (!gsiStore.round.bomb) {
      gsiStore.round.bombPlantedAt = null;
    }
  }

  if (payload.phase_countdowns && payload.phase_countdowns.phase_ends_in) {
    const sec = parseFloat(payload.phase_countdowns.phase_ends_in);
    if (!Number.isNaN(sec)) {
      gsiStore.round.phaseTimeLeft = Math.max(0, sec);
    }
  }

  // 3. Spectator `allplayers` mode vs Individual `player` multi-client mode
  if (payload.allplayers && Object.keys(payload.allplayers).length > 0) {
    gsiStore.ingestionMode = 'spectator_allplayers';
    const entries = Object.entries(payload.allplayers);

    const teamCounts = { CT: [], T: [] };
    for (const [sid, p] of entries) {
      const team = p.team === 'T' ? 'T' : 'CT';
      teamCounts[team].push([sid, p]);
    }

    // Determine human side (side with real SteamID64 players or <= 10 non-bot players vs bot swarm)
    let humanSide = gsiStore.humanTeamSide;
    const ctHumans = teamCounts.CT.filter(([sid, p]) => /^7656119\d{10}$/.test(sid) && !isBotSteamIdOrName(sid, p.name));
    const tHumans = teamCounts.T.filter(([sid, p]) => /^7656119\d{10}$/.test(sid) && !isBotSteamIdOrName(sid, p.name));

    if (ctHumans.length > 0 && tHumans.length === 0) {
      humanSide = 'CT';
    } else if (tHumans.length > 0 && ctHumans.length === 0) {
      humanSide = 'T';
    } else if (teamCounts.CT.length > 0 && teamCounts.T.length > 0) {
      const ctNonBots = teamCounts.CT.filter(([sid, p]) => !isBotSteamIdOrName(sid, p.name));
      const tNonBots = teamCounts.T.filter(([sid, p]) => !isBotSteamIdOrName(sid, p.name));
      if (ctNonBots.length > 0 && tNonBots.length === 0) {
        humanSide = 'CT';
      } else if (tNonBots.length > 0 && ctNonBots.length === 0) {
        humanSide = 'T';
      } else if (teamCounts.CT.length <= 10 && teamCounts.T.length > teamCounts.CT.length) {
        humanSide = 'CT';
      } else if (teamCounts.T.length <= 10 && teamCounts.CT.length > teamCounts.T.length) {
        humanSide = 'T';
      }
    }
    gsiStore.humanTeamSide = humanSide;
    gsiStore.botTeamSide = humanSide === 'CT' ? 'T' : 'CT';

    const rawHumanTeam = teamCounts[humanSide];
    const filteredHumans = rawHumanTeam.filter(([sid, p]) => !isBotSteamIdOrName(sid, p.name));
    const humanEntries = (filteredHumans.length > 0 ? filteredHumans : rawHumanTeam).slice(0, 10);
    const botEntries = teamCounts[gsiStore.botTeamSide].slice(0, 10);

    // Detect any bots whose health just dropped to 0 on this packet
    const newlyDeadBotNames = [];
    gsiStore.bots = botEntries.map(([sid, p], idx) => {
      const botName = p.name || DEFAULT_BOT_NAMES[idx] || `BOT ${idx + 1}`;
      const currHp = p.state && typeof p.state.health === 'number' ? p.state.health : 0;
      const prevHp = botHealthTracker.get(sid);
      if (typeof prevHp === 'number' && prevHp > 0 && currHp <= 0) {
        newlyDeadBotNames.push(botName);
      }
      botHealthTracker.set(sid, currHp);
      return {
        id: sid,
        name: botName,
        health: currHp,
        armor: p.state && typeof p.state.armor === 'number' ? p.state.armor : 0
      };
    });

    gsiStore.humanPlayersMap.clear();
    humanEntries.forEach(([sid, p], idx) => {
      const normalized = normalizeGsiPlayer(sid, p, idx, newlyDeadBotNames);
      gsiStore.humanPlayersMap.set(sid, normalized);
    });

    // If any bot died this tick and no player's round_kills delta consumed it yet (e.g. spectated player or delayed stat)
    if (newlyDeadBotNames.length > 0 && humanEntries.length > 0) {
      const activeHuman = Array.from(gsiStore.humanPlayersMap.values()).find(h => h.health > 0) ||
        Array.from(gsiStore.humanPlayersMap.values())[0];
      if (activeHuman) {
        const weaponName = (activeHuman.activeWeapon && activeHuman.activeWeapon.name) || 'AK-47';
        while (newlyDeadBotNames.length > 0) {
          const deadBot = newlyDeadBotNames.shift();
          pushServerKillfeedEvent({
            attacker: activeHuman.name,
            attackerType: 'human',
            attackerSlot: activeHuman.slot,
            attackerId: activeHuman.id,
            weaponName,
            victim: deadBot,
            victimType: 'bot',
            isHs: false,
            roundKills: Math.max(1, activeHuman.roundKills || 1)
          });
        }
      }
    }

    // Track Spectator GSI Client connection
    const specKey = `spectator-${clientIp}`;
    const existingSpec = gsiClientsMap.get(specKey);
    if (!existingSpec) {
      const specClient = {
        id: specKey,
        name: 'SPECTATOR OBSERVER PC',
        steamId: (payload.provider && payload.provider.steamid) || 'OBSERVER',
        ip: clientIp,
        mode: 'spectator_allplayers',
        team: humanSide,
        slot: null,
        connectedAt: now,
        lastSeenAt: now,
        packetsReceived: 1
      };
      gsiClientsMap.set(specKey, specClient);
      recordServerLog({
        level: 'INFO',
        category: 'gsi_connect',
        title: 'CS2 SPECTATOR CLIENT CONNECTED',
        message: `Observer PC (${clientIp}) streaming ${humanEntries.length}v${botEntries.length} telemetry on ${gsiStore.map.name.toUpperCase()}`,
        meta: { client: specClient }
      });
    } else {
      existingSpec.lastSeenAt = now;
      existingSpec.packetsReceived += 1;
      existingSpec.team = humanSide;
    }
  } else if (payload.player && (payload.player.steamid || payload.player.name)) {
    // Individual player client mode (aggregates 1 to 5 human PCs dynamically)
    if (gsiStore.ingestionMode === 'waiting') {
      gsiStore.ingestionMode = 'multi_client';
    }

    const sid = String(payload.player.steamid || payload.player.name);
    const providerSid = payload.provider && payload.provider.steamid ? String(payload.provider.steamid) : null;
    const isOwnPlayer = !providerSid || providerSid === sid;
    const isBotPlayer = isBotSteamIdOrName(sid, payload.player.name);

    if (isOwnPlayer && payload.player.team && !isBotPlayer) {
      gsiStore.humanTeamSide = payload.player.team;
      gsiStore.botTeamSide = payload.player.team === 'CT' ? 'T' : 'CT';
    }

    // If the local player (`providerSid`) is spectating someone else (`!isOwnPlayer`), it means the local player is dead this round!
    if (!isOwnPlayer && providerSid && gsiStore.humanPlayersMap.has(providerSid)) {
      const ownEntry = gsiStore.humanPlayersMap.get(providerSid);
      const ownTracker = playerCombatTracker.get(providerSid);
      if (ownEntry && ownEntry.health > 0) {
        ownEntry.health = 0;
        ownEntry.armor = 0;
        ownEntry.flashed = 0;
        ownEntry.burning = 0;
        ownEntry.deaths = (ownEntry.deaths || 0) + 1;
        if (ownTracker) {
          ownTracker.prevHealth = 0;
          ownTracker.deaths = Math.max(ownTracker.deaths || 0, ownEntry.deaths);
        }
        const botIdx = ((ownEntry.slot || 1) + (gsiStore.map.round || 1)) % DEFAULT_BOT_NAMES.length;
        const killerBot = isBotPlayer && payload.player.name
          ? (payload.player.name.toUpperCase().startsWith('BOT ') ? payload.player.name : `BOT ${payload.player.name.toUpperCase()}`)
          : DEFAULT_BOT_NAMES[botIdx];
        const botWeapon = gsiStore.botTeamSide === 'T' ? 'AK-47' : 'M4A1-S';
        pushServerKillfeedEvent({
          attacker: killerBot,
          attackerType: 'bot',
          weaponName: botWeapon,
          victim: ownEntry.name,
          victimType: 'human',
          victimSlot: ownEntry.slot,
          victimId: providerSid,
          isHs: false
        });
      }
    }

    // Only track human squad members (update own player or an already-registered human teammate being spectated)
    if (!isBotPlayer && (isOwnPlayer || gsiStore.humanPlayersMap.has(sid))) {
      const keys = Array.from(gsiStore.humanPlayersMap.keys());
      const existingIdx = keys.indexOf(sid);
      const slotIdx = existingIdx >= 0 ? existingIdx : gsiStore.humanPlayersMap.size;
      if (slotIdx < 10) {
        const normalized = normalizeGsiPlayer(sid, payload.player, slotIdx);
        gsiStore.humanPlayersMap.set(sid, normalized);
      }

      // Re-index slots 1..N cleanly
      Array.from(gsiStore.humanPlayersMap.values()).forEach((p, idx) => {
        p.slot = idx + 1;
      });

      const assignedPlayer = gsiStore.humanPlayersMap.get(sid);
      const assignedSlot = assignedPlayer ? assignedPlayer.slot : slotIdx + 1;
      const playerName = payload.player.name || `OPERATOR ${assignedSlot}`;

      // Track Individual CS2 Player GSI Client connection (only for the actual client PC `isOwnPlayer`)
      if (isOwnPlayer) {
        const existingClient = gsiClientsMap.get(sid);
        if (!existingClient) {
          const clientEntry = {
            id: sid,
            name: playerName,
            steamId: sid,
            ip: clientIp,
            mode: 'multi_client',
            team: payload.player.team || gsiStore.humanTeamSide,
            slot: assignedSlot,
            connectedAt: now,
            lastSeenAt: now,
            packetsReceived: 1
          };
          gsiClientsMap.set(sid, clientEntry);
          recordServerLog({
            level: 'INFO',
            category: 'gsi_connect',
            title: `CS2 CLIENT CONNECTED // ${playerName}`,
            message: `Slot ${String(assignedSlot).padStart(2, '0')} (${clientIp}) joined squad telemetry [${gsiClientsMap.size} PC(s) active]`,
            meta: { client: clientEntry }
          });
        } else {
          existingClient.name = playerName;
          existingClient.ip = clientIp;
          existingClient.team = payload.player.team || existingClient.team;
          existingClient.slot = assignedSlot;
          existingClient.lastSeenAt = now;
          existingClient.packetsReceived += 1;
        }
      } else if (providerSid && gsiClientsMap.has(providerSid)) {
        const existingClient = gsiClientsMap.get(providerSid);
        existingClient.lastSeenAt = now;
        existingClient.packetsReceived += 1;
      }
    } else if (providerSid && gsiClientsMap.has(providerSid)) {
      // Update heartbeat even while dead player is spectating a teammate/bot
      const existingClient = gsiClientsMap.get(providerSid);
      existingClient.lastSeenAt = now;
      existingClient.packetsReceived += 1;
    }

    // In multi-client mode (no spectator allplayers), infer remaining bots out of 10 from squad roundKills
    const totalRoundBotKills = Array.from(gsiStore.humanPlayersMap.values())
      .slice(0, 10)
      .reduce((sum, p) => sum + (p.roundKills || 0), 0);
    const deadBotsCount = Math.min(10, totalRoundBotKills);
    gsiStore.bots = Array.from({ length: 10 }, (_, idx) => ({
      id: `bot-${idx + 1}`,
      name: `BOT ${idx + 1}`,
      health: idx < deadBotsCount ? 0 : 100,
      armor: idx < deadBotsCount ? 0 : 100
    }));
  } else {
    // Heartbeat / menu payload from a CS2 client not yet in a match
    const providerSid = (payload.provider && payload.provider.steamid) ? String(payload.provider.steamid) : `menu-${clientIp}`;
    const existingClient = gsiClientsMap.get(providerSid);
    if (!existingClient) {
      const clientEntry = {
        id: providerSid,
        name: `CS2 CLIENT (${clientIp})`,
        steamId: providerSid,
        ip: clientIp,
        mode: 'menu_standby',
        team: gsiStore.humanTeamSide,
        slot: null,
        connectedAt: now,
        lastSeenAt: now,
        packetsReceived: 1
      };
      gsiClientsMap.set(providerSid, clientEntry);
      recordServerLog({
        level: 'INFO',
        category: 'gsi_connect',
        title: 'CS2 CLIENT CONNECTED (LOBBY/MENU)',
        message: `CS2 instance at ${clientIp} (SteamID: ${providerSid}) connected and waiting for match`,
        meta: { client: clientEntry }
      });
    } else {
      existingClient.lastSeenAt = now;
      existingClient.packetsReceived += 1;
    }
  }

  broadcastGsiUpdate();
}

// Periodic check for disconnected/timed-out CS2 GSI clients
setInterval(() => {
  const now = Date.now();
  let changed = false;

  for (const [key, client] of gsiClientsMap.entries()) {
    if (now - client.lastSeenAt > GSI_CLIENT_TIMEOUT_MS) {
      gsiClientsMap.delete(key);
      if (gsiStore.humanPlayersMap.has(key)) {
        gsiStore.humanPlayersMap.delete(key);
      }
      changed = true;
      const durationSec = Math.max(1, Math.round((now - client.connectedAt) / 1000));
      recordServerLog({
        level: 'WARN',
        category: 'gsi_disconnect',
        title: `CS2 CLIENT DISCONNECTED // ${client.name}`,
        message: `No GSI heartbeat from ${client.ip} for ${Math.round(GSI_CLIENT_TIMEOUT_MS / 1000)}s (session lasted ${durationSec}s)`,
        meta: { client }
      });
    }
  }

  if (changed) {
    // Re-index remaining players
    Array.from(gsiStore.humanPlayersMap.values()).forEach((p, idx) => {
      p.slot = idx + 1;
      if (gsiClientsMap.has(p.id)) {
        gsiClientsMap.get(p.id).slot = idx + 1;
      }
    });
    if (gsiClientsMap.size === 0) {
      gsiStore.ingestionMode = 'waiting';
    }
    broadcastGsiUpdate();
  }
}, 4000);

function getSerializedGsiState() {
  const humanPlayers = Array.from(gsiStore.humanPlayersMap.values()).slice(0, 10);
  return {
    lastPacketAt: gsiStore.lastPacketAt,
    packetsReceived: gsiStore.packetsReceived,
    ingestionMode: gsiStore.ingestionMode,
    humanTeamSide: gsiStore.humanTeamSide,
    botTeamSide: gsiStore.botTeamSide,
    map: gsiStore.map,
    round: gsiStore.round,
    humanPlayers,
    bots: gsiStore.bots,
    killfeed: gsiStore.killfeed,
    bannerAlert: gsiStore.bannerAlert,
    clients: getClientsSummary()
  };
}

function broadcastGsiUpdate() {
  broadcastSseEvent({
    type: 'gsi_update',
    state: getSerializedGsiState(),
    clients: getClientsSummary()
  });
}

function getLocalIpAddress() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

function generateGsiConfig(hostHeader) {
  const host = hostHeader || `${getLocalIpAddress()}:${PORT}`;
  return `"CS2 Stadium Broadcast Dashboard GSI"
{
  "uri" "http://${host}/gsi"
  "timeout" "5.0"
  "buffer"  "0.05"
  "throttle" "0.05"
  "heartbeat" "5.0"
  "data"
  {
    "provider"            "1"
    "map"                 "1"
    "round"               "1"
    "player_id"           "1"
    "player_state"        "1"
    "player_weapons"      "1"
    "player_match_stats"  "1"
    "allplayers_id"       "1"
    "allplayers_state"    "1"
    "allplayers_match_stats" "1"
    "allplayers_weapons"  "1"
    "phase_countdowns"    "1"
    "bomb"                "1"
  }
}
`;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // CORS headers for cross-machine LAN GSI & browser tools
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // CS2 GSI Ingestion Endpoint (POST /gsi or POST /)
  if (req.method === 'POST' && (url.pathname === '/gsi' || url.pathname === '/')) {
    const clientIp = formatClientIp(req);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        handleGsiPayload(payload, clientIp);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        recordServerLog({
          level: 'WARN',
          category: 'system',
          title: 'INVALID GSI PAYLOAD',
          message: `Malformed JSON received on /gsi from ${clientIp}`,
          notify: false
        });
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // SSE Real-Time Broadcast Endpoint
  if (req.method === 'GET' && url.pathname === '/events') {
    const clientIp = formatClientIp(req);
    const viewParam = url.searchParams.get('view') || 'squad';
    const slotParam = url.searchParams.get('slot');
    const viewLabel = viewParam === 'player'
      ? `PLAYER VIEW${slotParam ? ` (SLOT ${String(slotParam).padStart(2, '0')})` : ''}`
      : 'SQUAD BROADCAST HUD';
    const displayId = `display-${nextSseClientId++}`;
    const meta = {
      id: displayId,
      ip: clientIp,
      view: viewLabel,
      userAgent: String(req.headers['user-agent'] || 'Browser Display').slice(0, 80),
      connectedAt: Date.now()
    };

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    sseClients.add(res);
    sseClientMeta.set(res, meta);

    recordServerLog({
      level: 'INFO',
      category: 'display_connect',
      title: `DISPLAY CLIENT CONNECTED // ${viewLabel}`,
      message: `Dashboard viewer at ${clientIp} connected (${sseClients.size} active display${sseClients.size === 1 ? '' : 's'})`,
      meta: { display: meta }
    });

    res.write(`data: ${JSON.stringify({
      type: 'connected',
      clientId: displayId,
      state: getSerializedGsiState(),
      clients: getClientsSummary(),
      logs: serverLogs.slice(0, 40),
      lanIp: getLocalIpAddress(),
      port: PORT
    })}\n\n`);

    req.on('close', () => {
      const closedMeta = sseClientMeta.get(res);
      sseClients.delete(res);
      sseClientMeta.delete(res);
      if (closedMeta) {
        const durationSec = Math.max(1, Math.round((Date.now() - closedMeta.connectedAt) / 1000));
        recordServerLog({
          level: 'INFO',
          category: 'display_disconnect',
          title: `DISPLAY CLIENT DISCONNECTED // ${closedMeta.view}`,
          message: `Viewer at ${closedMeta.ip} closed stream after ${durationSec}s (${sseClients.size} active)`,
          meta: { display: closedMeta }
        });
      }
    });
    return;
  }

  // Downloadable CS2 GSI Config File
  if (req.method === 'GET' && url.pathname === '/gamestate_integration_cs2dash.cfg') {
    const clientIp = formatClientIp(req);
    const cfg = generateGsiConfig(req.headers.host);
    recordServerLog({
      level: 'INFO',
      category: 'cfg_download',
      title: 'CS2 GSI CONFIG DOWNLOADED',
      message: `Client ${clientIp} downloaded gamestate_integration_cs2dash.cfg`,
      meta: { ip: clientIp }
    });
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="gamestate_integration_cs2dash.cfg"'
    });
    res.end(cfg);
    return;
  }

  // API State Snapshot
  if (req.method === 'GET' && url.pathname === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      lanIp: getLocalIpAddress(),
      port: PORT,
      state: getSerializedGsiState(),
      clients: getClientsSummary(),
      logs: serverLogs.slice(0, 40)
    }));
    return;
  }

  // API Connection Logs & Active Clients
  if (req.method === 'GET' && url.pathname === '/api/logs') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      clients: getClientsSummary(),
      logs: serverLogs
    }));
    return;
  }

  // Simulate / Test Client Connection Notification
  if (req.method === 'POST' && url.pathname === '/api/test-notification') {
    const clientIp = formatClientIp(req);
    const sampleCallsigns = ['VORTEX', 'KAIROS', 'NYX', 'HEX', 'RONIN', 'CYPHER', 'VALKYRIE', 'SPECTRE', 'BLITZ', 'TITAN'];
    const callsign = sampleCallsigns[Math.floor(Math.random() * sampleCallsigns.length)];
    const slotNum = (gsiClientsMap.size % 10) + 1;
    const entry = recordServerLog({
      level: 'INFO',
      category: 'gsi_connect',
      title: `CS2 CLIENT CONNECTED // ${callsign}`,
      message: `Simulated Operator ${callsign} (${clientIp}) connected on Slot ${String(slotNum).padStart(2, '0')}`,
      meta: { simulated: true, name: callsign, ip: clientIp, slot: slotNum }
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, event: entry }));
    return;
  }

  // Reset Multi-Client Roster
  if (req.method === 'POST' && url.pathname === '/api/reset') {
    const clientIp = formatClientIp(req);
    gsiStore.humanPlayersMap.clear();
    gsiClientsMap.clear();
    playerCombatTracker.clear();
    botHealthTracker.clear();
    gsiStore.bots = [];
    gsiStore.killfeed = [];
    gsiStore.ingestionMode = 'waiting';
    recordServerLog({
      level: 'INFO',
      category: 'system',
      title: 'GSI ROSTER & CLIENTS RESET',
      message: `Client roster cleared by ${clientIp}`
    });
    broadcastGsiUpdate();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // Serve Static Files (including /player and /player/:slot routes)
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  if (url.pathname === '/player' || /^\/player\/([1-9]|10)$/.test(url.pathname)) {
    filePath = '/player.html';
  }
  const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, '');
  const absPath = path.join(PUBLIC_DIR, safePath);

  fs.readFile(absPath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(absPath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const lanIp = getLocalIpAddress();
  recordServerLog({
    level: 'INFO',
    category: 'system',
    title: 'STADIUM BROADCAST SERVER ONLINE',
    message: `Listening on http://localhost:${PORT} | LAN GSI Endpoint: http://${lanIp}:${PORT}/gsi`,
    notify: false
  });
});
