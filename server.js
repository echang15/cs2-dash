const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Connected SSE broadcast clients
const sseClients = new Set();

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
  let activeWeapon = null;
  const grenades = [];
  let hasC4 = false;

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
      if (w.state === 'active') {
        activeWeapon = {
          id: 'knife',
          name: 'Tactical Knife',
          skin: w.paintkit && w.paintkit !== 'default' ? w.paintkit.replace(/_/g, ' ').toUpperCase() : 'STANDARD ISSUE',
          category: 'knife',
          clip: 0,
          clipMax: 0,
          reserve: 0,
          state: 'active'
        };
      }
      continue;
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
    hasC4
  };
}

function normalizeGsiPlayer(steamId, rawPlayer, slotIndex = 0) {
  const state = rawPlayer.state || {};
  const stats = rawPlayer.match_stats || {};
  const parsedWeapons = parsePlayerWeapons(rawPlayer.weapons || {});

  const roundsPlayed = Math.max(1, gsiStore.map.round || 1);
  const kills = typeof stats.kills === 'number' ? stats.kills : 0;
  const deaths = typeof stats.deaths === 'number' ? stats.deaths : 0;
  const assists = typeof stats.assists === 'number' ? stats.assists : 0;
  const mvps = typeof stats.mvps === 'number' ? stats.mvps : 0;
  const roundDmg = typeof state.round_totaldmg === 'number' ? state.round_totaldmg : 0;

  return {
    id: steamId,
    slot: slotIndex + 1,
    name: rawPlayer.name || `OPERATOR ${slotIndex + 1}`,
    team: rawPlayer.team || gsiStore.humanTeamSide,
    health: typeof state.health === 'number' ? state.health : 100,
    armor: typeof state.armor === 'number' ? state.armor : 100,
    helmet: Boolean(state.helmet),
    defuseKit: Boolean(state.defusekit),
    hasC4: parsedWeapons.hasC4,
    flashed: typeof state.flashed === 'number' ? state.flashed : 0,
    burning: typeof state.burning === 'number' ? state.burning : 0,
    smoked: typeof state.smoked === 'number' ? state.smoked : 0,
    money: typeof state.money === 'number' ? state.money : 800,
    equipValue: typeof state.equip_value === 'number' ? state.equip_value : 0,
    roundKills: typeof state.round_kills === 'number' ? state.round_kills : 0,
    roundKillHs: typeof state.round_killhs === 'number' ? state.round_killhs : 0,
    roundDamage: roundDmg,
    kills,
    deaths,
    assists,
    mvps,
    adr: Math.round((kills * 82 + roundDmg) / roundsPlayed),
    hsPercent: kills > 0 ? Math.min(100, Math.round(((state.round_killhs || Math.ceil(kills * 0.48)) / Math.max(1, kills)) * 100)) : 0,
    primaryWeapon: parsedWeapons.primary,
    secondaryWeapon: parsedWeapons.secondary,
    activeWeapon: parsedWeapons.activeWeapon,
    grenades: parsedWeapons.grenades,
    lastSeenAt: Date.now()
  };
}

function handleGsiPayload(payload) {
  gsiStore.lastPacketAt = Date.now();
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
      gsiStore.round.bombPlantedAt = Date.now();
      gsiStore.bannerAlert = {
        type: 'bomb',
        title: 'BOMB PLANTED // 40s COUNTDOWN ACTIVE',
        subtitle: 'C4 ARMED — DEFUSE THRESHOLD 10s (5s WITH KIT)',
        timestamp: Date.now()
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

    // Determine human side (side with real SteamID64 players or <= 5 players vs bot swarm)
    let humanSide = gsiStore.humanTeamSide;
    const ctHumans = teamCounts.CT.filter(([sid, p]) => /^7656119\d{10}$/.test(sid) && !/^BOT\s/i.test(p.name || ''));
    const tHumans = teamCounts.T.filter(([sid, p]) => /^7656119\d{10}$/.test(sid) && !/^BOT\s/i.test(p.name || ''));

    if (ctHumans.length > 0 && tHumans.length === 0) {
      humanSide = 'CT';
    } else if (tHumans.length > 0 && ctHumans.length === 0) {
      humanSide = 'T';
    } else if (teamCounts.CT.length > 0 && teamCounts.T.length > 0) {
      if (teamCounts.CT.length <= 5 && teamCounts.T.length > teamCounts.CT.length) {
        humanSide = 'CT';
      } else if (teamCounts.T.length <= 5 && teamCounts.CT.length > teamCounts.T.length) {
        humanSide = 'T';
      }
    }
    gsiStore.humanTeamSide = humanSide;
    gsiStore.botTeamSide = humanSide === 'CT' ? 'T' : 'CT';

    const rawHumanTeam = teamCounts[humanSide];
    const filteredHumans = rawHumanTeam.filter(([sid, p]) => !/^BOT\s/i.test(p.name || ''));
    const humanEntries = (filteredHumans.length > 0 ? filteredHumans : rawHumanTeam).slice(0, 5);
    const botEntries = teamCounts[gsiStore.botTeamSide].slice(0, 10);

    gsiStore.humanPlayersMap.clear();
    humanEntries.forEach(([sid, p], idx) => {
      const normalized = normalizeGsiPlayer(sid, p, idx);
      gsiStore.humanPlayersMap.set(sid, normalized);
    });

    gsiStore.bots = botEntries.map(([sid, p], idx) => ({
      id: sid,
      name: p.name || `BOT ${idx + 1}`,
      health: p.state && typeof p.state.health === 'number' ? p.state.health : 0,
      armor: p.state && typeof p.state.armor === 'number' ? p.state.armor : 0
    }));
  } else if (payload.player && (payload.player.steamid || payload.player.name)) {
    // Individual player client mode (aggregates 1 to 5 human PCs dynamically)
    if (gsiStore.ingestionMode === 'waiting') {
      gsiStore.ingestionMode = 'multi_client';
    }

    const sid = payload.player.steamid || payload.player.name;
    const providerSid = payload.provider && payload.provider.steamid;
    const isOwnPlayer = !providerSid || providerSid === sid;
    const isBotPlayer = /^BOT\s/i.test(payload.player.name || '');

    if (isOwnPlayer && payload.player.team) {
      gsiStore.humanTeamSide = payload.player.team;
      gsiStore.botTeamSide = payload.player.team === 'CT' ? 'T' : 'CT';
    }

    // Only track human squad members (ignore bots if a dead player spectates a bot)
    if (!isBotPlayer && (isOwnPlayer || payload.player.team === gsiStore.humanTeamSide)) {
      // Prune stale disconnected players (> 45s without packet)
      const now = Date.now();
      for (const [k, v] of gsiStore.humanPlayersMap.entries()) {
        if (now - (v.lastSeenAt || now) > 45000 && k !== sid) {
          gsiStore.humanPlayersMap.delete(k);
        }
      }

      const keys = Array.from(gsiStore.humanPlayersMap.keys());
      const existingIdx = keys.indexOf(sid);
      const slotIdx = existingIdx >= 0 ? existingIdx : gsiStore.humanPlayersMap.size;
      if (slotIdx < 5) {
        const normalized = normalizeGsiPlayer(sid, payload.player, slotIdx);
        gsiStore.humanPlayersMap.set(sid, normalized);
      }
    }

    // Re-index slots 1..N cleanly
    Array.from(gsiStore.humanPlayersMap.values()).forEach((p, idx) => {
      p.slot = idx + 1;
    });

    // In multi-client mode (no spectator allplayers), infer remaining bots out of 10 from squad roundKills
    const totalRoundBotKills = Array.from(gsiStore.humanPlayersMap.values())
      .slice(0, 5)
      .reduce((sum, p) => sum + (p.roundKills || 0), 0);
    const deadBotsCount = Math.min(10, totalRoundBotKills);
    gsiStore.bots = Array.from({ length: 10 }, (_, idx) => ({
      id: `bot-${idx + 1}`,
      name: `BOT ${idx + 1}`,
      health: idx < deadBotsCount ? 0 : 100,
      armor: idx < deadBotsCount ? 0 : 100
    }));
  }

  broadcastGsiUpdate();
}

function getSerializedGsiState() {
  const humanPlayers = Array.from(gsiStore.humanPlayersMap.values()).slice(0, 5);
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
    bannerAlert: gsiStore.bannerAlert
  };
}

function broadcastGsiUpdate() {
  const data = JSON.stringify({
    type: 'gsi_update',
    state: getSerializedGsiState()
  });
  for (const res of sseClients) {
    res.write(`data: ${data}\n\n`);
  }
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
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        handleGsiPayload(payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // SSE Real-Time Broadcast Endpoint
  if (req.method === 'GET' && url.pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write(`data: ${JSON.stringify({ type: 'connected', state: getSerializedGsiState(), lanIp: getLocalIpAddress(), port: PORT })}\n\n`);
    sseClients.add(res);
    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // Downloadable CS2 GSI Config File
  if (req.method === 'GET' && url.pathname === '/gamestate_integration_cs2dash.cfg') {
    const cfg = generateGsiConfig(req.headers.host);
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
      state: getSerializedGsiState()
    }));
    return;
  }

  // Reset Multi-Client Roster
  if (req.method === 'POST' && url.pathname === '/api/reset') {
    gsiStore.humanPlayersMap.clear();
    gsiStore.bots = [];
    gsiStore.ingestionMode = 'waiting';
    broadcastGsiUpdate();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // Serve Static Files (including /player and /player/:slot routes)
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  if (url.pathname === '/player' || /^\/player\/[1-5]$/.test(url.pathname)) {
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
  console.log(`CS2 Stadium Broadcast Server running at http://localhost:${PORT}`);
  console.log(`CS2 GSI Endpoint ready at http://${getLocalIpAddress()}:${PORT}/gsi`);
});
