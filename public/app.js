/* ==========================================================================
   CS2 STADIUM BROADCAST HUD // 1080p Real-Time Telemetry & 5v10 Engine
   ========================================================================== */

const WEAPON_SVGS = {
  ak47: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 44L58 38L64 26H152L166 22H228L244 30H296V35H258L250 40H218L206 44H170L182 74L164 78L148 46H104L92 68H76L82 45H58L24 64L12 58L16 44Z" fill="currentColor" opacity="0.92"/>
    <path d="M72 31H146V37H72V31ZM172 27H222V33H172V27Z" fill="#080c13"/>
    <rect x="278" y="25" width="6" height="10" fill="currentColor"/>
  </svg>`,
  m4a1s: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 36H48L56 30H94L102 20H154L162 28H232V32H308V41H232V44H166L174 74L156 76L146 46H110L98 68H82L88 46H54L46 58H12V36Z" fill="currentColor" opacity="0.92"/>
    <rect x="242" y="30" width="66" height="13" rx="2" fill="currentColor"/>
    <path d="M106 24H148V30H106V24Z" fill="#080c13"/>
  </svg>`,
  m4a4: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 34H58L66 28H168L176 31H244V34H294V40H244V44H172L180 73L162 76L150 46H112L100 68H84L90 46H60L50 60H18V34Z" fill="currentColor" opacity="0.92"/>
    <path d="M96 32H160V38H96V32Z" fill="#080c13"/>
  </svg>`,
  awp: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 38H56L68 32H214V34H312V40H214V44H152L144 66H126L130 46H98L88 64H72L78 46H54L44 58H8V38Z" fill="currentColor" opacity="0.95"/>
    <path d="M88 18H196L188 26H96L88 18Z" fill="currentColor"/>
    <rect x="112" y="25" width="8" height="8" fill="currentColor"/>
    <rect x="164" y="25" width="8" height="8" fill="currentColor"/>
  </svg>`,
  mp9: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M58 34H96V26H208L218 32H256V40H218V46H184V78H168V46H136L124 68H106L114 44H68V54H58V34Z" fill="currentColor" opacity="0.92"/>
  </svg>`,
  mac10: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M84 26H196V48H154L146 78H126L132 48H94V60H84V26ZM196 34H232V41H196V34Z" fill="currentColor" opacity="0.92"/>
  </svg>`,
  galil: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 36H62L74 28H222L236 33H292V39H236L222 44H170L180 74L162 76L148 46H106L94 68H78L84 46H58L22 54V36Z" fill="currentColor" opacity="0.92"/>
  </svg>`,
  famas: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 32L48 18H188L204 32H268V40H204V48H146L136 68H118L124 48H82L90 76H72L62 48H28V32ZM66 26H172V33H66V26Z" fill="currentColor" opacity="0.92"/>
  </svg>`,
  deagle: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M92 24H228L234 38H220L214 44H152L138 74H110L122 44H92V24Z" fill="currentColor" opacity="0.92"/>
    <path d="M138 30H212V35H138V30Z" fill="#080c13"/>
  </svg>`,
  usps: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M76 28H188V31H258V42H188V45H138L126 72H102L112 45H76V28Z" fill="currentColor" opacity="0.92"/>
  </svg>`,
  glock: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M98 28H210V42H150L138 72H114L124 42H98V28Z" fill="currentColor" opacity="0.92"/>
  </svg>`,
  knife: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M58 42H128V32L136 32V58H128V48H58V42ZM136 36H246L272 46L236 52H136V36Z" fill="currentColor" opacity="0.92"/>
  </svg>`
};

const UTILITY_SVGS = {
  smoke: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="7" y="6" width="10" height="15" rx="2" fill="currentColor" fill-opacity="0.22"/>
    <path d="M9 6V3h6v3M7 11h10M7 16h10"/>
  </svg>`,
  flash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2" fill="currentColor" fill-opacity="0.28"/>
  </svg>`,
  he: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="13" r="7" fill="currentColor" fill-opacity="0.24"/>
    <path d="M10 6V3h5l2 2M8 13h8M12 9v8"/>
  </svg>`,
  molotov: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 3c2 3 5 5.5 5 10a5 5 0 0 1-10 0c0-4.5 3-7 5-10z" fill="currentColor" fill-opacity="0.28"/>
  </svg>`,
  decoy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="7"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>`,
  defuseKit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M6 3l6 7 6-7M8 21l4-9 4 9M5 12h14"/>
  </svg>`,
  c4: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor" fill-opacity="0.25"/>
    <path d="M7 10h4v4H7zM15 10h2M15 14h2"/>
  </svg>`,
  helmetArmor: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 4a3 3 0 0 1 3 3v2H9V9a3 3 0 0 1 3-3z"/>
  </svg>`,
  kevlarOnly: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L4 6v5.5c0 4.8 3.4 9.3 8 10.5 4.6-1.2 8-5.7 8-10.5V6l-8-3z"/>
  </svg>`
};

function getOperatorPortraitSvg(slotIdx, isAlive, isFlashed) {
  const visorColor = isFlashed ? '#ffffff' : 'var(--squad-accent)';
  const baseOpacity = isAlive ? '1' : '0.32';
  return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity:${baseOpacity}">
    <path d="M14 76C14 58 24 50 40 50C56 50 66 58 66 76" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="2"/>
    <path d="M23 28C23 16 30 10 40 10C50 10 57 16 57 28V42C57 48 50 53 40 53C30 53 23 48 23 42V28Z" fill="#0d131f" stroke="currentColor" stroke-width="2"/>
    <path d="M27 28H53L50 36H30L27 28Z" fill="${visorColor}"/>
    <circle cx="22" cy="34" r="3" fill="${visorColor}"/>
    <circle cx="58" cy="34" r="3" fill="${visorColor}"/>
    ${!isAlive ? `<path d="M18 18L62 62M62 18L18 62" stroke="#f7364c" stroke-width="4"/>` : ''}
  </svg>`;
}

// 11 CT-Side & 11 T-Side Full-Bleed CS2 Lobby Card Backgrounds
const CT_CARD_BACKGROUNDS = [
  { id: 1, url: '/assets/ct-model-01.jpg', label: '01: SAS // WAREHOUSE // M4A1-S' },
  { id: 2, url: '/assets/ct-model-02.jpg', label: '02: GIGN // NUKE SILO // AWP ASIIMOV (ADS)' },
  { id: 3, url: '/assets/ct-model-03.jpg', label: '03: FROGMAN // ANCIENT // M4A4 HOWL (KNEEL)' },
  { id: 4, url: '/assets/ct-model-04.jpg', label: '04: GSG-9 // OVERPASS // PRINTSTREAM (LOW)' },
  { id: 5, url: '/assets/ct-model-05.jpg', label: '05: FBI SWAT // OFFICE // USP-S KILL CONFIRMED' },
  { id: 6, url: '/assets/ct-model-06.jpg', label: '06: KSK // ANUBIS // FAMAS COMMEMORATION' },
  { id: 7, url: '/assets/ct-model-07.jpg', label: '07: FBI HRT // VERTIGO // MP9 STARLIGHT (LOW)' },
  { id: 8, url: '/assets/ct-model-08.jpg', label: '08: DESERT SAS // MIRAGE // BLUE PHOSPHOR' },
  { id: 9, url: '/assets/ct-model-09.jpg', label: '09: JTF2 // TRAIN // AWP DRAGON LORE' },
  { id: 10, url: '/assets/ct-model-10.jpg', label: '10: GENDARMERIE // CACHE // DEAGLE BLAZE' },
  { id: 11, url: '/assets/ct-model-11.jpg', label: '11: BREACHER // INFERNO // M4A4 NEO-NOIR' }
];

const T_CARD_BACKGROUNDS = [
  { id: 1, url: '/assets/t-model-01.jpg', label: '01: PHOENIX // WAREHOUSE // CLASSIC AK-47' },
  { id: 2, url: '/assets/t-model-02.jpg', label: '02: PROFESSIONALS // VAULT // GOLD ARABESQUE' },
  { id: 3, url: '/assets/t-model-03.jpg', label: '03: ELITE CREW // DUST II // AWP GUNGNIR' },
  { id: 4, url: '/assets/t-model-04.jpg', label: '04: SABRE // OVERPASS // RIFLE VULCAN (LOW)' },
  { id: 5, url: '/assets/t-model-05.jpg', label: '05: GUERRILLA // ANUBIS // WILD LOTUS (CROUCH)' },
  { id: 6, url: '/assets/t-model-06.jpg', label: '06: AZTEC REBEL // ANCIENT // HOWL (KNEEL)' },
  { id: 7, url: '/assets/t-model-07.jpg', label: '07: STREET SOLDIER // NEON // DEAGLE FADE' },
  { id: 8, url: '/assets/t-model-08.jpg', label: '08: CARTEL RAIDER // MIRAGE // FUEL INJECTOR' },
  { id: 9, url: '/assets/t-model-09.jpg', label: '09: BALKAN HEAVY // INFERNO // REDLINE' },
  { id: 10, url: '/assets/t-model-10.jpg', label: '10: MIAMI DARRYL // VAULT // CASE HARDENED' },
  { id: 11, url: '/assets/t-model-11.jpg', label: '11: MARKSMAN // ARCHWAY // AWP PRINCE (ADS)' }
];

function getCardBackgroundUrl(side, bgId) {
  const list = side === 'T' ? T_CARD_BACKGROUNDS : CT_CARD_BACKGROUNDS;
  const found = list.find(item => item.id === Number(bgId)) || list[0];
  return found.url;
}

// Default 5 Human Operators Roster (each with a distinct default CT and T lobby background!)
const DEFAULT_CALLSIGNS = [
  { name: 'VORTEX', ctBg: 4, tBg: 2 },
  { name: 'KAIROS', ctBg: 2, tBg: 3 },
  { name: 'NYX', ctBg: 3, tBg: 1 },
  { name: 'HEX', ctBg: 8, tBg: 8 },
  { name: 'RONIN', ctBg: 9, tBg: 10 }
];

const BOT_NAMES = [
  'BOT VLADIMIR', 'BOT IGOR', 'BOT DMITRI', 'BOT BORIS', 'BOT VIKTOR',
  'BOT YURI', 'BOT SERGEI', 'BOT NIKOLAI', 'BOT PAVEL', 'BOT ANTON'
];

// Global Dashboard State
const appState = {
  mode: 'simulation', // 'simulation' | 'gsi'
  simPaused: false,
  humanSide: 'CT',
  botSide: 'T',
  mapName: 'DE_MIRAGE',
  roundNumber: 18,
  humanScore: 11,
  botScore: 6,
  roundPhase: 'live', // 'freezetime' | 'live' | 'planted' | 'over'
  roundTimeLeft: 74.0,
  bombTimeLeft: 40.0,
  humanTeamName: 'APEX VANGUARD',
  botTeamName: 'BOT SWARM (10)',
  targetSquadSize: 5,
  lastKillfeedSig: '',
  calloutText: 'STADIUM TELEMETRY LOCKED // 5 HUMANS VS 10 BOTS',
  calloutHighlight: false,
  customCallsigns: DEFAULT_CALLSIGNS.map(c => ({ ...c })),
  players: [],
  bots: [],
  killfeed: [],
  killCelebrations: {},
  prevGsiKills: {},
  damageTrails: [100, 100, 100, 100, 100],
  lanIp: window.location.hostname || '127.0.0.1',
  port: window.location.port || '3000'
};

function triggerPlayerKillFlash(slotIdx, details = {}) {
  if (slotIdx < 0 || slotIdx > 4) return;
  if (!appState.killCelebrations) appState.killCelebrations = {};
  const now = Date.now();
  const rk = Number(details.roundKills) || 1;
  const labelMap = {
    1: 'ELIMINATION // +1 KILL',
    2: 'DOUBLE KILL // 2K',
    3: 'TRIPLE KILL // 3K',
    4: 'QUAD KILL // 4K',
    5: 'ACE // 5K WIPE!'
  };
  appState.killCelebrations[slotIdx] = {
    startedAt: now,
    expiresAt: now + 1850,
    headline: labelMap[Math.min(5, Math.max(1, rk))] || 'ELIMINATION // +1 KILL',
    victim: details.victim || 'TARGET',
    weaponName: details.weaponName || 'RIFLE',
    isHs: Boolean(details.isHs),
    roundKills: rk
  };
}

function createInitialSimSquad(side = 'CT', count = appState.targetSquadSize) {
  const isCT = side === 'CT';
  const loadouts = [
    {
      primary: isCT
        ? { id: 'm4a1s', name: 'M4A1-S', skin: 'PRINTSTREAM', clip: 20, clipMax: 20, reserve: 80 }
        : { id: 'ak47', name: 'AK-47', skin: 'VULCAN', clip: 30, clipMax: 30, reserve: 90 },
      secondary: isCT
        ? { id: 'usps', name: 'USP-S', skin: 'KILL CONFIRMED', clip: 12, clipMax: 12, reserve: 24 }
        : { id: 'glock', name: 'Glock-18', skin: 'FADE', clip: 20, clipMax: 20, reserve: 120 },
      grenades: ['smoke', 'flash', 'flash', 'he'],
      money: 4850,
      equipValue: 5450,
      kills: 26, deaths: 9, assists: 7, adr: 124, hsPercent: 62, roundKills: 2, roundDamage: 245
    },
    {
      primary: { id: 'awp', name: 'AWP', skin: 'ASIIMOV', clip: 5, clipMax: 5, reserve: 30 },
      secondary: { id: 'deagle', name: 'Desert Eagle', skin: 'BLAZE', clip: 7, clipMax: 7, reserve: 35 },
      grenades: ['smoke', 'flash', 'molotov', 'he'],
      money: 6200,
      equipValue: 6850,
      kills: 31, deaths: 7, assists: 4, adr: 138, hsPercent: 39, roundKills: 3, roundDamage: 310
    },
    {
      primary: isCT
        ? { id: 'm4a4', name: 'M4A4', skin: 'HOWL', clip: 28, clipMax: 30, reserve: 90 }
        : { id: 'ak47', name: 'AK-47', skin: 'WILD LOTUS', clip: 27, clipMax: 30, reserve: 90 },
      secondary: isCT
        ? { id: 'usps', name: 'USP-S', skin: 'NEO-NOIR', clip: 12, clipMax: 12, reserve: 24 }
        : { id: 'deagle', name: 'Desert Eagle', skin: 'PRINTSTREAM', clip: 7, clipMax: 7, reserve: 35 },
      grenades: ['smoke', 'flash', 'molotov'],
      money: 3900,
      equipValue: 5200,
      kills: 19, deaths: 11, assists: 14, adr: 96, hsPercent: 54, roundKills: 1, roundDamage: 142
    },
    {
      primary: isCT
        ? { id: 'm4a1s', name: 'M4A1-S', skin: 'BLUE PHOSPHOR', clip: 18, clipMax: 20, reserve: 80 }
        : { id: 'galil', name: 'Galil AR', skin: 'CHATTERBOX', clip: 35, clipMax: 35, reserve: 90 },
      secondary: { id: 'deagle', name: 'Desert Eagle', skin: 'CODE RED', clip: 7, clipMax: 7, reserve: 35 },
      grenades: ['smoke', 'he', 'flash'],
      money: 5100,
      equipValue: 5100,
      kills: 22, deaths: 10, assists: 9, adr: 108, hsPercent: 58, roundKills: 1, roundDamage: 168
    },
    {
      primary: isCT
        ? { id: 'mp9', name: 'MP9', skin: 'STARLIGHT PROTECTOR', clip: 30, clipMax: 30, reserve: 120 }
        : { id: 'ak47', name: 'AK-47', skin: 'GOLD ARABESQUE', clip: 30, clipMax: 30, reserve: 90 },
      secondary: isCT
        ? { id: 'usps', name: 'USP-S', skin: 'CYREX', clip: 12, clipMax: 12, reserve: 24 }
        : { id: 'glock', name: 'Glock-18', skin: 'VOGUE', clip: 20, clipMax: 20, reserve: 120 },
      grenades: ['smoke', 'flash', 'molotov', 'he'],
      money: 7450,
      equipValue: 4950,
      kills: 24, deaths: 8, assists: 11, adr: 115, hsPercent: 61, roundKills: 1, roundDamage: 184
    }
  ];

  const safeCount = Math.max(1, Math.min(5, count || 5));
  return loadouts.slice(0, safeCount).map((item, idx) => ({
    id: `sim-human-${idx + 1}`,
    slot: idx + 1,
    name: appState.customCallsigns[idx].name,
    role: appState.customCallsigns[idx].role,
    team: side,
    health: idx === 3 ? 68 : idx === 2 ? 84 : 100,
    armor: idx === 3 ? 82 : 100,
    helmet: true,
    defuseKit: isCT,
    hasC4: !isCT && idx === Math.min(2, safeCount - 1),
    flashed: 0,
    burning: 0,
    reloading: false,
    money: item.money,
    equipValue: item.equipValue,
    kills: item.kills,
    deaths: item.deaths,
    assists: item.assists,
    adr: item.adr,
    hsPercent: item.hsPercent,
    roundKills: item.roundKills,
    roundDamage: item.roundDamage,
    primaryWeapon: { ...item.primary },
    secondaryWeapon: { ...item.secondary },
    activeWeapon: { ...item.primary },
    grenades: [...item.grenades]
  }));
}

function createInitialBotSwarm() {
  return BOT_NAMES.map((name, idx) => ({
    id: `bot-${idx + 1}`,
    name,
    health: idx < 2 ? 0 : idx === 2 ? 42 : 100,
    armor: idx < 2 ? 0 : 100
  }));
}

function pushKillfeedEvent(attacker, attackerType, weaponName, victim, victimType, isHs = false, extraTag = '') {
  appState.killfeed.unshift({
    id: `${Date.now()}-${Math.random()}`,
    attacker,
    attackerType,
    weaponName,
    victim,
    victimType,
    isHs,
    extraTag
  });
  if (appState.killfeed.length > 5) {
    appState.killfeed.length = 5;
  }
}

function initSimulationState() {
  appState.players = createInitialSimSquad(appState.humanSide, appState.targetSquadSize);
  appState.bots = createInitialBotSwarm();
  appState.damageTrails = appState.players.map(p => p.health);
  appState.killfeed = [
    {
      id: 'kf-1',
      attacker: appState.customCallsigns[Math.min(1, appState.players.length - 1)].name,
      attackerType: 'human',
      weaponName: 'AWP',
      victim: 'BOT VLADIMIR',
      victimType: 'bot',
      isHs: true,
      extraTag: ''
    },
    {
      id: 'kf-2',
      attacker: appState.customCallsigns[0].name,
      attackerType: 'human',
      weaponName: appState.humanSide === 'CT' ? 'M4A1-S' : 'AK-47',
      victim: 'BOT IGOR',
      victimType: 'bot',
      isHs: true,
      extraTag: ''
    }
  ];
}

/* ==========================================================================
   1080P STAGE SCALING ENGINE
   ========================================================================== */
function updateStageScale() {
  const scaleX = window.innerWidth / 1920;
  const scaleY = window.innerHeight / 1080;
  const scale = Math.min(scaleX, scaleY);
  document.documentElement.style.setProperty('--stage-scale', scale.toFixed(4));
}

window.addEventListener('resize', updateStageScale);
updateStageScale();

/* ==========================================================================
   DOM RENDERING ENGINE
   ========================================================================== */
function formatMoney(val) {
  return '$' + Number(val || 0).toLocaleString('en-US');
}

function formatClock(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

function renderTopHeader() {
  const isCT = appState.humanSide === 'CT';
  document.body.className = isCT ? 'human-side-ct' : 'human-side-t';

  const squadCount = Math.max(1, appState.players.length);
  const botCount = appState.bots.length || 10;
  document.documentElement.style.setProperty('--active-player-count', String(squadCount));

  document.getElementById('human-faction-code').textContent = appState.humanSide;
  const stackSubEl = document.getElementById('human-stack-sub');
  if (stackSubEl) stackSubEl.textContent = squadCount === 1 ? 'SOLO' : `${squadCount} STACK`;

  document.getElementById('human-side-pill').textContent = isCT ? 'COUNTER-TERRORISTS' : 'TERRORISTS';
  document.getElementById('bot-faction-code').textContent = appState.botSide;
  document.getElementById('bot-side-pill').textContent = isCT ? 'TERRORISTS' : 'COUNTER-TERRORISTS';

  document.getElementById('human-team-name').textContent = appState.humanTeamName;
  document.getElementById('bot-team-name').textContent = appState.botTeamName;

  document.getElementById('human-score').textContent = appState.humanScore;
  document.getElementById('bot-score').textContent = appState.botScore;

  const squadBtn = document.getElementById('btn-squad-size');
  if (squadBtn) squadBtn.textContent = `SQUAD: ${squadCount}v${botCount}`;

  // Team economy totals
  const totalBank = appState.players.reduce((acc, p) => acc + (p.money || 0), 0);
  const totalEquip = appState.players.reduce((acc, p) => acc + (p.equipValue || 0), 0);
  document.getElementById('human-team-bank').textContent = formatMoney(totalBank);
  document.getElementById('human-team-equip').textContent = formatMoney(totalEquip);

  // Human N-player alive pips
  const humansAlive = appState.players.filter(p => p.health > 0).length;
  document.getElementById('human-alive-text').textContent = `${humansAlive} / ${squadCount}`;
  const humanPipsEl = document.getElementById('human-alive-pips');
  humanPipsEl.innerHTML = appState.players.map(p => {
    const aliveClass = p.health <= 0 ? 'dead' : p.health <= 25 ? 'alive low-hp' : 'alive';
    return `<div class="unit-pip ${aliveClass}" title="${p.name}: ${p.health} HP">
      <div class="unit-pip-fill" style="height:${Math.max(0, p.health)}%"></div>
    </div>`;
  }).join('');

  // Bot 10-unit swarm matrix
  const botsAlive = appState.bots.filter(b => b.health > 0).length;
  const botTotalHp = appState.bots.reduce((acc, b) => acc + Math.max(0, b.health), 0);
  document.getElementById('bot-alive-text').textContent = `${botsAlive} / ${botCount}`;
  document.getElementById('bot-total-hp').textContent = `${botTotalHp} HP`;
  document.getElementById('bot-threat-level').textContent =
    botsAlive >= 7 ? 'SWARM SURGE' : botsAlive >= 4 ? 'CONTESTED' : botsAlive > 0 ? 'DEPLETED' : 'WIPED';

  const botPipsEl = document.getElementById('bot-alive-pips');
  botPipsEl.innerHTML = appState.bots.map(b => {
    const aliveClass = b.health <= 0 ? 'dead' : b.health <= 30 ? 'alive low-hp' : 'alive';
    return `<div class="unit-pip ${aliveClass}" title="${b.name}: ${b.health} HP">
      <div class="unit-pip-fill" style="height:${Math.max(0, b.health)}%"></div>
    </div>`;
  }).join('');

  // Center Clock & Bomb State
  const clockModule = document.getElementById('center-clock-module');
  const phaseBadge = document.getElementById('round-phase-badge');
  const timerDigits = document.getElementById('round-timer-digits');
  const trackFill = document.getElementById('timer-track-fill');
  const defuseHint = document.getElementById('defuse-hint-label');

  document.getElementById('map-badge').textContent = `${appState.mapName.toUpperCase()} // ${squadCount}v${botCount}`;
  document.getElementById('round-number-badge').textContent = `ROUND ${appState.roundNumber} / 24`;

  if (appState.roundPhase === 'planted') {
    clockModule.classList.add('bomb-planted');
    phaseBadge.className = 'round-phase-badge planted';
    phaseBadge.textContent = 'C4 PLANTED';
    timerDigits.textContent = `${appState.bombTimeLeft.toFixed(1)}s`;
    const pct = Math.max(0, Math.min(100, (appState.bombTimeLeft / 40) * 100));
    trackFill.style.width = `${pct}%`;
    if (appState.bombTimeLeft <= 5) {
      defuseHint.textContent = 'CRITICAL: NO DEFUSE TIME LEFT!';
    } else if (appState.bombTimeLeft <= 10) {
      defuseHint.textContent = 'KIT REQUIRED (<10.0s REMAINING)';
    } else {
      defuseHint.textContent = '40s C4 TIMER // 10s NO-KIT | 5s KIT';
    }
  } else {
    clockModule.classList.remove('bomb-planted');
    phaseBadge.className = `round-phase-badge ${appState.roundPhase === 'freezetime' ? 'freezetime' : ''}`;
    phaseBadge.textContent = appState.roundPhase === 'freezetime' ? 'BUY PHASE' : 'ROUND LIVE';
    timerDigits.textContent = formatClock(appState.roundTimeLeft);
    const pct = Math.max(0, Math.min(100, (appState.roundTimeLeft / 115) * 100));
    trackFill.style.width = `${pct}%`;
    defuseHint.textContent = humansAlive === 1 && botsAlive >= 2
      ? `CLUTCH ALERT: 1 vs ${botsAlive} BOTS`
      : 'MR12 STADIUM FEED';
  }

  const calloutEl = document.getElementById('callout-alert-text');
  calloutEl.textContent = appState.calloutText;
  calloutEl.className = `callout-alert-text ${appState.calloutHighlight ? 'highlight' : ''}`;
}

function renderKillfeed() {
  const sig = appState.killfeed.map(k => k.id).join('|');
  if (sig === appState.lastKillfeedSig) return;
  appState.lastKillfeedSig = sig;

  const container = document.getElementById('killfeed-items');
  container.innerHTML = appState.killfeed.map(item => `
    <div class="kill-pill">
      <span class="kill-attacker ${item.attackerType}">${item.attacker}</span>
      <span class="kill-weapon-tag">${item.weaponName}</span>
      ${item.isHs ? `<span class="kill-hs-badge">[HS]</span>` : ''}
      ${item.extraTag ? `<span class="kill-hs-badge">[${item.extraTag}]</span>` : ''}
      <span class="kill-victim ${item.victimType}">${item.victim}</span>
    </div>
  `).join('');
}

function renderPlayersStage() {
  const stageEl = document.getElementById('players-stage-grid');

  stageEl.innerHTML = appState.players.map((p, idx) => {
    const isAlive = p.health > 0;
    const isLowHp = isAlive && p.health <= 25;
    const isMidHp = isAlive && p.health > 25 && p.health <= 55;
    const isFlashed = isAlive && p.flashed > 30;
    const isBurning = isAlive && p.burning > 20;

    const trailHp = Math.max(p.health, appState.damageTrails[idx] || p.health);
    const hpStateClass = !isAlive ? 'zero' : isLowHp ? 'critical' : isMidHp ? 'mid' : '';

    const weapon = p.activeWeapon || p.primaryWeapon || {
      id: 'knife',
      name: 'Combat Knife',
      skin: 'STANDARD ISSUE',
      clip: 0,
      clipMax: 0,
      reserve: 0
    };
    const weaponSvg = WEAPON_SVGS[weapon.id] || WEAPON_SVGS.ak47;
    const clipPct = weapon.clipMax > 0 ? Math.max(0, Math.min(100, (weapon.clip / weapon.clipMax) * 100)) : 100;
    const isLowAmmo = weapon.clipMax > 0 && weapon.clip <= Math.ceil(weapon.clipMax * 0.28);

    const sidearm = p.secondaryWeapon || { name: 'USP-S', clip: 12, reserve: 24 };

    // Build 4 grenade slots
    const grenadeSlotsHtml = [0, 1, 2, 3].map(slotIdx => {
      const gType = p.grenades && p.grenades[slotIdx];
      if (!gType) {
        return `<div class="grenade-slot">
          <span class="grenade-slot-label">EMPTY</span>
        </div>`;
      }
      const labelMap = { smoke: 'SMOKE', flash: 'FLASH', he: 'HE GREN', molotov: 'MOLOTOV', decoy: 'DECOY' };
      return `<div class="grenade-slot occupied">
        ${UTILITY_SVGS[gType] || UTILITY_SVGS.he}
        <span class="grenade-slot-label">${labelMap[gType] || 'UTIL'}</span>
      </div>`;
    }).join('');

    // Kit or C4 slot
    let gearSlotHtml = `<div class="gear-kit-slot"><span class="grenade-slot-label">NO KIT</span></div>`;
    if (p.hasC4) {
      gearSlotHtml = `<div class="gear-kit-slot has-c4">
        ${UTILITY_SVGS.c4}
        <span class="grenade-slot-label">C4 BOMB</span>
      </div>`;
    } else if (p.defuseKit) {
      gearSlotHtml = `<div class="gear-kit-slot has-kit">
        ${UTILITY_SVGS.defuseKit}
        <span class="grenade-slot-label">DEF KIT</span>
      </div>`;
    }

    // Status pills
    const statusPills = [];
    if (!isAlive) {
      statusPills.push(`<span class="status-pill dead-tag">ELIMINATED // KIA</span>`);
    } else {
      if (isFlashed) statusPills.push(`<span class="status-pill flashed">FLASHED ${Math.round((p.flashed / 255) * 100)}%</span>`);
      if (isBurning) statusPills.push(`<span class="status-pill burning">BURNING</span>`);
      if (p.hasC4) statusPills.push(`<span class="status-pill c4-carrier">C4 CARRIER</span>`);
      else if (p.defuseKit) statusPills.push(`<span class="status-pill defuse-kit">DEFUSE KIT</span>`);
      if (statusPills.length === 0) statusPills.push(`<span class="status-pill alive-ready">COMBAT READY</span>`);
    }

    const kdRatio = (p.kills / Math.max(1, p.deaths)).toFixed(2);
    const dmgPct = Math.min(100, Math.round((p.roundDamage / 500) * 100));
    const currentSide = (p.team || appState.humanSide) === 'T' ? 'T' : 'CT';
    const sideClass = currentSide === 'T' ? 'side-t' : 'side-ct';
    const slotCfg = appState.customCallsigns[idx] || DEFAULT_CALLSIGNS[idx] || DEFAULT_CALLSIGNS[0];
    const activeBgId = currentSide === 'T' ? (slotCfg.tBg || 1) : (slotCfg.ctBg || 1);
    const bgUrl = getCardBackgroundUrl(currentSide, activeBgId);

    const now = Date.now();
    const celeb = appState.killCelebrations[idx];
    const isKillFlash = Boolean(celeb && isAlive && now < celeb.expiresAt);
    const killAnimDelayMs = isKillFlash ? Math.max(0, now - celeb.startedAt) : 0;

    const killBannerHtml = isKillFlash ? `
      <div class="kill-flash-banner" aria-live="polite">
        <div class="kill-flash-top-line">
          <span class="kill-flash-icon">&#9760;</span>
          <span class="kill-flash-headline">${celeb.headline}</span>
          ${celeb.isHs ? `<span class="kill-flash-hs-pill">HEADSHOT</span>` : ''}
        </div>
        <div class="kill-flash-sub-line">
          <span>${celeb.weaponName}</span>
          <span>&bull;</span>
          <span>FRAGGED ${celeb.victim}</span>
        </div>
      </div>
    ` : '';

    return `
      <article class="player-stadium-card ${sideClass} ${!isAlive ? 'is-dead' : ''} ${isLowHp ? 'low-health' : ''} ${isFlashed ? 'is-flashed' : ''} ${isBurning ? 'is-burning' : ''} ${isKillFlash ? 'is-kill-flash' : ''}" id="player-card-${idx + 1}" style="--card-model-bg: url('${bgUrl}'); --kill-anim-delay: -${killAnimDelayMs}ms;">
        ${killBannerHtml}
        
        <!-- ZONE 1: OPERATOR IDENTITY & STATUS -->
        <div class="card-zone-identity">
          <div class="operator-hero-row">
            <div class="operator-name-block">
              <h2 class="operator-callsign" data-edit-callsign="${idx}" title="Click to edit callsign" style="cursor:pointer;">${p.name}</h2>
              <div class="operator-sub-status">
                ${statusPills.join('')}
              </div>
            </div>
            <div class="operator-avatar-frame" data-cycle-bg="${idx}" title="Click to cycle ${currentSide} Lobby Background (${activeBgId}/11)" style="cursor:pointer;">
              ${getOperatorPortraitSvg(idx, isAlive, isFlashed)}
            </div>
          </div>
        </div>

        <!-- ZONE 2: GIANT VITALS (HEALTH & ARMOR) -->
        <div class="card-zone-vitals">
          <div class="vitals-numbers-row">
            <div class="hp-primary-cluster">
              <span class="hp-giant-value ${hpStateClass}">${p.health}</span>
              <span class="hp-unit-label">HP</span>
            </div>

            <div class="armor-cluster ${p.armor <= 0 ? 'no-armor' : ''}">
              <div class="armor-icon-wrap">
                ${p.helmet ? UTILITY_SVGS.helmetArmor : UTILITY_SVGS.kevlarOnly}
              </div>
              <span class="armor-value">${p.armor}</span>
              <span class="armor-type-sub">${p.helmet ? 'HELM+KEV' : 'KEVLAR'}</span>
            </div>
          </div>

          <div class="hp-bar-outer">
            <div class="hp-bar-damage-trail" style="width:${trailHp}%"></div>
            <div class="hp-bar-current ${hpStateClass}" style="width:${p.health}%"></div>
            <div class="hp-bar-segments-overlay"></div>
          </div>
        </div>

        <!-- ZONE 3: PRIMARY WEAPON SILHOUETTE & AMMO TELEMETRY -->
        <div class="card-zone-weapons">
          <div class="weapon-header-row">
            <div class="weapon-name-group">
              <span class="weapon-title">${weapon.name}</span>
              <span class="weapon-skin-sub">${weapon.skin || 'FACTORY ISSUE'}</span>
            </div>
            <span class="weapon-state-tag ${p.reloading ? 'reloading' : ''}">
              ${p.reloading ? 'RELOADING' : isLowAmmo ? 'LOW AMMO' : 'EQUIPPED'}
            </span>
          </div>

          <div class="weapon-silhouette-stage">
            ${weaponSvg}
          </div>

          <div class="ammo-telemetry-row">
            <div class="ammo-counter-nums">
              <span class="ammo-clip-big ${weapon.clip === 0 ? 'empty' : isLowAmmo ? 'low' : ''}">${weapon.clip}</span>
              <span class="ammo-reserve-sub">/ ${weapon.reserve}</span>
            </div>

            <div class="ammo-bar-sidearm-col">
              <div class="magazine-bullet-track">
                <div class="magazine-bullet-fill ${isLowAmmo ? 'low' : ''}" style="width:${clipPct}%"></div>
              </div>
              <div class="sidearm-mini-row">
                <span>SIDEARM: <strong class="sidearm-name">${sidearm.name}</strong></span>
                <span>${sidearm.clip} / ${sidearm.reserve}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ZONE 4: UTILITY BELT & ECONOMY -->
        <div class="card-zone-utility">
          <div class="utility-belt-row">
            ${grenadeSlotsHtml}
            ${gearSlotHtml}
          </div>

          <div class="economy-telemetry-row">
            <div class="player-cash-block">
              <span class="cash-label">BANK</span>
              <span class="cash-amount">${formatMoney(p.money)}</span>
            </div>
            <div class="equip-val-block">
              LOADOUT VALUE <strong>${formatMoney(p.equipValue)}</strong>
            </div>
          </div>
        </div>

        <!-- ZONE 5: PRESENTER MATCH STATS FOOTER -->
        <div class="card-zone-stats">
          <div class="stats-grid-4">
            <div class="stat-cell highlight">
              <span class="stat-cell-label">KILLS</span>
              <span class="stat-cell-val">${p.kills}</span>
            </div>
            <div class="stat-cell">
              <span class="stat-cell-label">DEATHS</span>
              <span class="stat-cell-val">${p.deaths}</span>
            </div>
            <div class="stat-cell">
              <span class="stat-cell-label">ASSISTS</span>
              <span class="stat-cell-val">${p.assists}</span>
            </div>
            <div class="stat-cell">
              <span class="stat-cell-label">ADR</span>
              <span class="stat-cell-val">${p.adr}</span>
            </div>
          </div>

          <div class="round-damage-footer">
            <div class="round-dmg-meta">
              <span>K/D <strong>${kdRatio}</strong> &bull; HS <strong>${p.hsPercent}%</strong></span>
              <span>ROUND DMG <strong>${p.roundDamage}</strong></span>
            </div>
            <div class="round-dmg-track">
              <div class="round-dmg-fill" style="width:${dmgPct}%"></div>
            </div>
          </div>
        </div>

      </article>
    `;
  }).join('');
}

function renderAll() {
  renderTopHeader();
  renderKillfeed();
  renderPlayersStage();
}

/* ==========================================================================
   SIMULATION TICK & SCENARIO TRIGGERS
   ========================================================================== */
setInterval(() => {
  // Smoothly decay damage trails & flash/burn statuses
  appState.players.forEach((p, idx) => {
    if (appState.damageTrails[idx] > p.health) {
      appState.damageTrails[idx] = Math.max(p.health, appState.damageTrails[idx] - 4);
    } else {
      appState.damageTrails[idx] = p.health;
    }
    if (p.flashed > 0) p.flashed = Math.max(0, p.flashed - 18);
    if (p.burning > 0) p.burning = Math.max(0, p.burning - 15);
  });

  if (appState.mode !== 'simulation' || appState.simPaused) {
    renderAll();
    return;
  }

  // Advance round or bomb clock
  if (appState.roundPhase === 'planted') {
    appState.bombTimeLeft = Math.max(0, appState.bombTimeLeft - 0.25);
    if (appState.bombTimeLeft <= 0) {
      triggerNewRound();
      return;
    }
  } else {
    appState.roundTimeLeft = Math.max(0, appState.roundTimeLeft - 0.25);
    if (appState.roundTimeLeft <= 0) {
      triggerNewRound();
      return;
    }
  }

  // Random live combat micro-events (ammo firing, reloads, skirmishes)
  if (Math.random() < 0.35) {
    const alivePlayers = appState.players.filter(p => p.health > 0);
    if (alivePlayers.length > 0) {
      const shooter = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const w = shooter.activeWeapon;
      if (w && w.clipMax > 0 && !shooter.reloading) {
        const shots = Math.min(w.clip, Math.ceil(Math.random() * 3));
        w.clip -= shots;
        shooter.roundDamage += shots * 14;
        if (w.clip <= 0 && w.reserve > 0) {
          shooter.reloading = true;
          setTimeout(() => {
            const refill = Math.min(w.clipMax, w.reserve);
            w.clip = refill;
            w.reserve -= refill;
            shooter.reloading = false;
          }, 1100);
        }
      }
    }
  }

  // Occasional bot elimination or skirmish damage
  if (Math.random() < 0.11) {
    triggerFirefightStep(false);
  }

  renderAll();
}, 250);

function triggerFirefightStep(announce = true) {
  const aliveHumans = appState.players.filter(p => p.health > 0);
  const aliveBots = appState.bots.filter(b => b.health > 0);

  if (aliveHumans.length === 0 || aliveBots.length === 0) {
    triggerNewRound();
    return;
  }

  const attacker = aliveHumans[Math.floor(Math.random() * aliveHumans.length)];
  const targetBot = aliveBots[Math.floor(Math.random() * aliveBots.length)];
  const attackerIdx = appState.players.indexOf(attacker);
  const dmgToBot = announce ? 100 : (45 + Math.floor(Math.random() * 65));
  targetBot.health = Math.max(0, targetBot.health - dmgToBot);
  attacker.roundDamage += Math.min(100, dmgToBot);

  if (attacker.activeWeapon && attacker.activeWeapon.clip > 0) {
    attacker.activeWeapon.clip = Math.max(0, attacker.activeWeapon.clip - 3);
  }

  if (targetBot.health === 0) {
    attacker.kills += 1;
    attacker.roundKills = Math.min(5, attacker.roundKills + 1);
    attacker.money = Math.min(16000, attacker.money + 300);
    const isHs = Math.random() < 0.58;
    const usedWeapon = attacker.activeWeapon ? attacker.activeWeapon.name : 'AK-47';
    pushKillfeedEvent(
      attacker.name,
      'human',
      usedWeapon,
      targetBot.name,
      'bot',
      isHs
    );
    triggerPlayerKillFlash(attackerIdx, {
      victim: targetBot.name,
      weaponName: usedWeapon,
      isHs,
      roundKills: attacker.roundKills
    });
    const remainingBots = appState.bots.filter(b => b.health > 0).length;
    if (attacker.roundKills >= 3) {
      appState.calloutText = `MULTI-KILL // ${attacker.name} (${attacker.roundKills}K THIS ROUND) — ${remainingBots} BOTS REMAIN`;
      appState.calloutHighlight = true;
    } else if (announce) {
      appState.calloutText = `ELIMINATION // ${attacker.name} TOOK DOWN ${targetBot.name} (${remainingBots}/10 BOTS LEFT)`;
      appState.calloutHighlight = false;
    }
  }

  // Bot return fire on a human player
  if (Math.random() < 0.55) {
    const victimHuman = aliveHumans[Math.floor(Math.random() * aliveHumans.length)];
    const hitDmg = 14 + Math.floor(Math.random() * 26);
    victimHuman.health = Math.max(0, victimHuman.health - hitDmg);
    victimHuman.armor = Math.max(0, victimHuman.armor - Math.ceil(hitDmg * 0.35));
    if (victimHuman.health === 0) {
      victimHuman.deaths += 1;
      pushKillfeedEvent(targetBot.name, 'bot', 'AK-47', victimHuman.name, 'human', false);
    }
  }

  renderAll();
}

function triggerPlantBomb() {
  if (appState.roundPhase === 'planted') {
    appState.roundPhase = 'live';
    appState.calloutText = 'C4 DEFUSED // ROUND CLOCK RESTORED';
    appState.calloutHighlight = false;
  } else {
    appState.roundPhase = 'planted';
    appState.bombTimeLeft = 40.0;
    appState.calloutText = 'ALERT: C4 PLANTED AT SITE A // 40.0s DETONATION COUNTDOWN';
    appState.calloutHighlight = true;
  }
  renderAll();
}

function triggerFlashSquad() {
  appState.players.forEach((p, i) => {
    if (p.health > 0 && i < 3) {
      p.flashed = 240;
    }
    if (p.health > 0 && i === 3) {
      p.burning = 180;
    }
  });
  appState.calloutText = 'TACTICAL UTILITY SURGE // FLASHBANG & MOLOTOV DETONATED ON SITE';
  appState.calloutHighlight = true;
  renderAll();
}

function triggerClutchScenario() {
  appState.players.forEach((p, idx) => {
    if (idx === 0) {
      p.health = 34;
      p.armor = 76;
      p.roundKills = 3;
      p.roundDamage = 365;
    } else {
      p.health = 0;
    }
  });
  appState.bots.forEach((b, idx) => {
    b.health = idx < 4 ? (idx === 0 ? 55 : 100) : 0;
  });
  appState.roundPhase = 'planted';
  appState.bombTimeLeft = 24.5;
  appState.calloutText = `CLUTCH SITUATION // ${appState.players[0].name} (34 HP) IN A 1 vs 4 AGAINST BOT SWARM!`;
  appState.calloutHighlight = true;
  renderAll();
}

function triggerNewRound() {
  appState.roundNumber = (appState.roundNumber % 24) + 1;
  appState.humanScore += 1;
  appState.roundPhase = 'live';
  appState.roundTimeLeft = 115.0;
  appState.bombTimeLeft = 40.0;
  appState.killCelebrations = {};
  appState.players = createInitialSimSquad(appState.humanSide, appState.targetSquadSize);
  appState.players.forEach(p => {
    p.health = 100;
    p.armor = 100;
    p.roundKills = 0;
    p.roundDamage = 0;
  });
  appState.bots = BOT_NAMES.map((name, idx) => ({
    id: `bot-${idx + 1}`,
    name,
    health: 100,
    armor: 100
  }));
  appState.damageTrails = appState.players.map(() => 100);
  appState.calloutText = `ROUND ${appState.roundNumber} STARTED // FULL BUY ${appState.players.length} HUMANS VS ${appState.bots.length} BOTS`;
  appState.calloutHighlight = false;
  renderAll();
}

function triggerSwapSides() {
  appState.humanSide = appState.humanSide === 'CT' ? 'T' : 'CT';
  appState.botSide = appState.humanSide === 'CT' ? 'T' : 'CT';
  appState.players = createInitialSimSquad(appState.humanSide, appState.targetSquadSize);
  appState.calloutText = `FACTION SWAP // ${appState.humanTeamName} NOW ON ${appState.humanSide === 'CT' ? 'COUNTER-TERRORIST' : 'TERRORIST'} SIDE`;
  appState.calloutHighlight = false;
  renderAll();
}

function setSquadSize(newSize) {
  const count = Math.max(1, Math.min(5, Number(newSize) || 5));
  appState.targetSquadSize = count;
  appState.players = createInitialSimSquad(appState.humanSide, count);
  appState.damageTrails = appState.players.map(p => p.health);
  appState.calloutText = `SQUAD FORMAT UPDATED // ${count} HUMANS VS 10 BOTS (${count}v10)`;
  appState.calloutHighlight = false;

  const modalBtns = document.querySelectorAll('#modal-squad-size-btns button');
  modalBtns.forEach(btn => {
    btn.classList.toggle('active', Number(btn.getAttribute('data-size')) === count);
  });

  renderAll();
}

/* ==========================================================================
   LIVE CS2 GSI SERVER-SENT EVENTS CONNECTION
   ========================================================================== */
function applyServerGsiState(serverState) {
  if (!serverState || serverState.ingestionMode === 'waiting' || !serverState.humanPlayers || serverState.humanPlayers.length === 0) {
    return;
  }

  appState.mode = 'gsi';
  const detectedCount = Math.max(1, Math.min(5, serverState.humanPlayers.length));
  const badge = document.getElementById('gsi-source-badge');
  const badgeText = document.getElementById('gsi-source-text');
  badge.classList.add('gsi-live');
  badgeText.textContent = serverState.ingestionMode === 'spectator_allplayers'
    ? `CS2 GSI LIVE (${detectedCount}v${(serverState.bots && serverState.bots.length) || 10} SPECTATOR)`
    : `CS2 GSI LIVE (${detectedCount} PC${detectedCount > 1 ? 's' : ''} DETECTED)`;

  appState.humanSide = serverState.humanTeamSide || 'CT';
  appState.botSide = serverState.botTeamSide || 'T';
  appState.mapName = (serverState.map && serverState.map.name) || 'DE_MIRAGE';
  appState.roundNumber = (serverState.map && serverState.map.round) || 1;
  appState.humanScore = appState.humanSide === 'CT'
    ? (serverState.map.ctScore || 0)
    : (serverState.map.tScore || 0);
  appState.botScore = appState.botSide === 'CT'
    ? (serverState.map.ctScore || 0)
    : (serverState.map.tScore || 0);

  if (serverState.round) {
    if (serverState.round.bomb === 'planted') {
      appState.roundPhase = 'planted';
      if (serverState.round.bombPlantedAt) {
        const elapsed = (Date.now() - serverState.round.bombPlantedAt) / 1000;
        appState.bombTimeLeft = Math.max(0, 40 - elapsed);
      }
    } else {
      appState.roundPhase = serverState.round.phase || 'live';
      appState.roundTimeLeft = serverState.round.phaseTimeLeft || 115;
    }
  }

  // Dynamically adapt to the exact number of detected human players (e.g. 2v10, 3v10, 5v10)
  const baseDefaults = createInitialSimSquad(appState.humanSide, 5);
  appState.players = serverState.humanPlayers.slice(0, 5).map((gp, idx) => {
    const pKey = gp.id || gp.name || `slot-${idx}`;
    const prevK = appState.prevGsiKills[pKey];
    const currK = Number(gp.kills || 0);
    if (prevK !== undefined && currK > prevK) {
      triggerPlayerKillFlash(idx, {
        victim: 'BOT TARGET',
        weaponName: (gp.activeWeapon && gp.activeWeapon.name) || 'WEAPON',
        isHs: Boolean(gp.roundKillHs && gp.roundKillHs > 0),
        roundKills: Number(gp.roundKills) || 1
      });
    }
    appState.prevGsiKills[pKey] = currK;

    return {
      ...baseDefaults[idx],
      ...gp
    };
  });
  appState.targetSquadSize = appState.players.length;

  while (appState.damageTrails.length < appState.players.length) {
    appState.damageTrails.push(100);
  }

  if (serverState.bots && serverState.bots.length > 0) {
    appState.bots = serverState.bots.slice(0, 10);
  }

  if (serverState.bannerAlert && serverState.bannerAlert.title) {
    appState.calloutText = serverState.bannerAlert.title;
    appState.calloutHighlight = true;
  }

  renderAll();
}

function connectSse() {
  if (typeof EventSource === 'undefined') return;
  try {
    const es = new EventSource('/events');
    es.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        if (payload.lanIp) {
          appState.lanIp = payload.lanIp;
          appState.port = payload.port || 3000;
          updateGsiConfigModalText();
        }
        if (payload.state) {
          applyServerGsiState(payload.state);
        }
      } catch (_) {}
    };
  } catch (_) {}
}

/* ==========================================================================
   MODAL & PRESENTER UI CONTROLS
   ========================================================================== */
function updateGsiConfigModalText() {
  const host = `${appState.lanIp}:${appState.port}`;
  const cfgText = `"CS2 Stadium Broadcast Dashboard GSI"
{
  "uri" "http://${host}/gsi"
  "timeout" "5.0"
  "buffer"  "0.05"
  "throttle" "0.05"
  "heartbeat" "5.0"
  "data"
  {
    "provider"               "1"
    "map"                    "1"
    "round"                  "1"
    "player_id"              "1"
    "player_state"           "1"
    "player_weapons"         "1"
    "player_match_stats"     "1"
    "allplayers_id"          "1"
    "allplayers_state"       "1"
    "allplayers_match_stats" "1"
    "allplayers_weapons"     "1"
    "phase_countdowns"       "1"
    "bomb"                   "1"
  }
}`;
  const box = document.getElementById('cfg-code-box');
  if (box) box.textContent = cfgText;
}

function saveCustomRoster() {
  try {
    localStorage.setItem('cs2_custom_roster', JSON.stringify(appState.customCallsigns));
  } catch (_) {}
}

function initRosterEditor() {
  try {
    const savedHuman = localStorage.getItem('cs2_human_team_name');
    const savedBot = localStorage.getItem('cs2_bot_team_name');
    if (savedHuman) appState.humanTeamName = savedHuman;
    if (savedBot) appState.botTeamName = savedBot;

    const savedRoster = localStorage.getItem('cs2_custom_roster');
    if (savedRoster) {
      const parsed = JSON.parse(savedRoster);
      if (Array.isArray(parsed) && parsed.length === 5) {
        appState.customCallsigns = parsed.map((item, i) => ({
          name: item.name || DEFAULT_CALLSIGNS[i].name,
          ctBg: Number(item.ctBg) || DEFAULT_CALLSIGNS[i].ctBg,
          tBg: Number(item.tBg) || DEFAULT_CALLSIGNS[i].tBg
        }));
        appState.players.forEach((p, i) => {
          if (appState.customCallsigns[i] && appState.mode === 'simulation') {
            p.name = appState.customCallsigns[i].name;
          }
        });
      }
    }
  } catch (_) {}

  const humanInput = document.getElementById('input-human-team-name');
  const botInput = document.getElementById('input-bot-team-name');
  if (humanInput) {
    humanInput.value = appState.humanTeamName;
    humanInput.addEventListener('input', (e) => {
      appState.humanTeamName = e.target.value.trim().toUpperCase() || 'HUMAN SQUAD';
      try { localStorage.setItem('cs2_human_team_name', appState.humanTeamName); } catch (_) {}
      renderAll();
    });
  }
  if (botInput) {
    botInput.value = appState.botTeamName;
    botInput.addEventListener('input', (e) => {
      appState.botTeamName = e.target.value.trim().toUpperCase() || 'BOT SWARM';
      try { localStorage.setItem('cs2_bot_team_name', appState.botTeamName); } catch (_) {}
      renderAll();
    });
  }

  const grid = document.getElementById('roster-editor-grid');
  grid.innerHTML = appState.customCallsigns.map((c, idx) => {
    const ctBgOptions = CT_CARD_BACKGROUNDS.map(bg =>
      `<option value="${bg.id}" ${Number(c.ctBg || DEFAULT_CALLSIGNS[idx].ctBg) === bg.id ? 'selected' : ''}>${bg.label}</option>`
    ).join('');

    const tBgOptions = T_CARD_BACKGROUNDS.map(bg =>
      `<option value="${bg.id}" ${Number(c.tBg || DEFAULT_CALLSIGNS[idx].tBg) === bg.id ? 'selected' : ''}>${bg.label}</option>`
    ).join('');

    return `
      <div class="roster-slot-card">
        <div class="roster-input-group">
          <label for="callsign-input-${idx}">OPERATOR 0${idx + 1} CALLSIGN</label>
          <input type="text" id="callsign-input-${idx}" value="${c.name}" maxlength="14" />
        </div>
        <div class="roster-input-group">
          <label for="ct-bg-select-${idx}">CT LOBBY SKIN (1-11)</label>
          <select id="ct-bg-select-${idx}">${ctBgOptions}</select>
        </div>
        <div class="roster-input-group">
          <label for="t-bg-select-${idx}">T LOBBY SKIN (1-11)</label>
          <select id="t-bg-select-${idx}">${tBgOptions}</select>
        </div>
      </div>
    `;
  }).join('');

  appState.customCallsigns.forEach((_, idx) => {
    const nameInput = document.getElementById(`callsign-input-${idx}`);
    const ctBgSelect = document.getElementById(`ct-bg-select-${idx}`);
    const tBgSelect = document.getElementById(`t-bg-select-${idx}`);

    nameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim().toUpperCase() || `OP 0${idx + 1}`;
      appState.customCallsigns[idx].name = val;
      if (appState.players[idx]) {
        appState.players[idx].name = val;
      }
      saveCustomRoster();
      renderAll();
    });

    if (ctBgSelect) {
      ctBgSelect.addEventListener('change', (e) => {
        appState.customCallsigns[idx].ctBg = Number(e.target.value) || 1;
        saveCustomRoster();
        renderAll();
      });
    }

    if (tBgSelect) {
      tBgSelect.addEventListener('change', (e) => {
        appState.customCallsigns[idx].tBg = Number(e.target.value) || 1;
        saveCustomRoster();
        renderAll();
      });
    }
  });
}

function cyclePlayerCardSkin(slotIdx) {
  const cfg = appState.customCallsigns[slotIdx];
  if (!cfg) return;
  const isT = appState.humanSide === 'T';
  if (isT) {
    cfg.tBg = ((Number(cfg.tBg) || 1) % 11) + 1;
    const sel = document.getElementById(`t-bg-select-${slotIdx}`);
    if (sel) sel.value = String(cfg.tBg);
    const skinInfo = T_CARD_BACKGROUNDS.find(b => b.id === cfg.tBg);
    appState.calloutText = `OP 0${slotIdx + 1} (${cfg.name}) T SKIN -> ${skinInfo ? skinInfo.label : cfg.tBg}`;
  } else {
    cfg.ctBg = ((Number(cfg.ctBg) || 1) % 11) + 1;
    const sel = document.getElementById(`ct-bg-select-${slotIdx}`);
    if (sel) sel.value = String(cfg.ctBg);
    const skinInfo = CT_CARD_BACKGROUNDS.find(b => b.id === cfg.ctBg);
    appState.calloutText = `OP 0${slotIdx + 1} (${cfg.name}) CT SKIN -> ${skinInfo ? skinInfo.label : cfg.ctBg}`;
  }
  appState.calloutHighlight = false;
  saveCustomRoster();
  renderAll();
}

function shuffleAllCardSkins() {
  const poolCt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].sort(() => Math.random() - 0.5);
  const poolT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].sort(() => Math.random() - 0.5);
  appState.customCallsigns.forEach((cfg, idx) => {
    cfg.ctBg = poolCt[idx];
    cfg.tBg = poolT[idx];
    const ctSel = document.getElementById(`ct-bg-select-${idx}`);
    const tSel = document.getElementById(`t-bg-select-${idx}`);
    if (ctSel) ctSel.value = String(cfg.ctBg);
    if (tSel) tSel.value = String(cfg.tBg);
  });
  appState.calloutText = `SHUFFLED LOBBY SKINS // ASSIGNED UNIQUE ${appState.humanSide} OPERATOR BACKGROUNDS (11 CT / 11 T POOL)`;
  appState.calloutHighlight = true;
  saveCustomRoster();
  renderAll();
}

function bindControls() {
  const modal = document.getElementById('gsi-modal');

  // Delegate clicks on player card callsigns or skin cyclers
  const stageGrid = document.getElementById('players-stage-grid');
  if (stageGrid) {
    stageGrid.addEventListener('click', (e) => {
      const cycleEl = e.target.closest('[data-cycle-bg]');
      if (cycleEl) {
        const idx = Number(cycleEl.getAttribute('data-cycle-bg'));
        cyclePlayerCardSkin(idx);
        return;
      }
      const callsignEl = e.target.closest('[data-edit-callsign]');
      if (callsignEl) {
        const idx = Number(callsignEl.getAttribute('data-edit-callsign'));
        modal.classList.add('open');
        const inp = document.getElementById(`callsign-input-${idx}`);
        if (inp) { inp.focus(); inp.select(); }
      }
    });
  }

  const btnShuffleBgs = document.getElementById('btn-shuffle-bgs');
  if (btnShuffleBgs) {
    btnShuffleBgs.addEventListener('click', () => {
      shuffleAllCardSkins();
    });
  }

  const btnPause = document.getElementById('btn-toggle-sim');
  btnPause.addEventListener('click', () => {
    appState.mode = 'simulation';
    appState.simPaused = !appState.simPaused;
    btnPause.textContent = appState.simPaused ? 'RESUME SIM' : 'PAUSE SIM';
    btnPause.classList.toggle('active', !appState.simPaused);
  });

  const btnSquadSize = document.getElementById('btn-squad-size');
  if (btnSquadSize) {
    btnSquadSize.addEventListener('click', () => {
      const cycleMap = { 5: 2, 2: 3, 3: 4, 4: 5, 1: 2 };
      const nextSize = cycleMap[appState.players.length] || 5;
      setSquadSize(nextSize);
    });
  }

  document.querySelectorAll('#modal-squad-size-btns button').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = Number(btn.getAttribute('data-size')) || 5;
      setSquadSize(size);
    });
  });

  // Click team names on scoreboard header to open team name editor
  const humanTitleEl = document.getElementById('human-team-name');
  if (humanTitleEl) {
    humanTitleEl.addEventListener('click', () => {
      modal.classList.add('open');
      const inp = document.getElementById('input-human-team-name');
      if (inp) { inp.focus(); inp.select(); }
    });
  }
  const botTitleEl = document.getElementById('bot-team-name');
  if (botTitleEl) {
    botTitleEl.addEventListener('click', () => {
      modal.classList.add('open');
      const inp = document.getElementById('input-bot-team-name');
      if (inp) { inp.focus(); inp.select(); }
    });
  }

  document.getElementById('btn-sim-firefight').addEventListener('click', () => {
    triggerFirefightStep(true);
  });

  document.getElementById('btn-sim-bomb').addEventListener('click', () => {
    triggerPlantBomb();
  });

  document.getElementById('btn-sim-flash').addEventListener('click', () => {
    triggerFlashSquad();
  });

  document.getElementById('btn-sim-clutch').addEventListener('click', () => {
    triggerClutchScenario();
  });

  document.getElementById('btn-sim-newround').addEventListener('click', () => {
    triggerNewRound();
  });

  document.getElementById('btn-swap-sides').addEventListener('click', () => {
    triggerSwapSides();
  });

  document.getElementById('btn-open-gsi').addEventListener('click', () => {
    updateGsiConfigModalText();
    modal.classList.add('open');
  });

  document.getElementById('btn-close-gsi').addEventListener('click', () => {
    modal.classList.remove('open');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.remove('open');
  });

  document.getElementById('btn-copy-cfg').addEventListener('click', (e) => {
    const text = document.getElementById('cfg-code-box').textContent;
    navigator.clipboard.writeText(text);
    e.target.textContent = 'COPIED!';
    setTimeout(() => { e.target.textContent = 'COPY .CFG'; }, 1500);
  });

  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
}

// Boot Dashboard
initSimulationState();
initRosterEditor();
updateGsiConfigModalText();
bindControls();
renderAll();
connectSse();
