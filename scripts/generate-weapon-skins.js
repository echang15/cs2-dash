/**
 * Generates skinned SVG silhouette images for popular CS2 skins on each weapon
 * into public/assets/weapons/skins/ and builds public/weapon-skins-manifest.js.
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'weapons', 'skins');
const MANIFEST_PATH = path.join(__dirname, '..', 'public', 'weapon-skins-manifest.js');

// Exact weapon silhouette geometry matching WEAPON_SVGS in public/app.js
const WEAPON_SHAPES = {
  ak47: {
    body: 'M10 43L14 38L66 34L72 25H158L166 28H222L236 29L244 35H280L285 20H291L293 35H302L308 32V40L292 40V43H242L236 45H222L218 47H170L166 46H156L164 60L178 78L161 83L145 63L136 46H114L108 55H94L91 46H87L75 70H58L68 45L56 46L20 62L10 57V43Z',
    cutouts: '<path d="M78 29H150V34H78V29ZM172 32H216V36H172V32ZM172 39H214V43H172V39ZM95 46H106L103 52H95V46Z" fill="#080c13"/><rect x="242" y="41" width="46" height="2" fill="#080c13" opacity="0.6"/>'
  },
  m4a1s: {
    body: 'M8 33L14 29H54L60 33H74L80 26L92 18H146L154 26H206L213 17H220L223 32H234V28H312V40H234V37H222V42H206L202 45H154L148 46L152 75L133 77L127 46H112L106 55H92L89 46H85L74 69H58L67 45H56L46 58L12 52L8 46V33Z',
    cutouts: '<path d="M22 36H46L42 46H22V36ZM96 22H140V27H96V22ZM160 31H198V35H160V31ZM160 38H198V41H160V38ZM93 46H104L101 52H93V46Z" fill="#080c13"/><path d="M244 28V40M262 28V40M296 28V40" stroke="#080c13" stroke-width="1.5"/>'
  },
  m4a4: {
    body: 'M14 33L20 29H62L68 33H82L86 22H98L102 26H160L164 24H226L234 17H241L244 32H284V30H300V39H284V37H244V42H228L224 46H162L156 47L166 77L147 80L135 47H118L112 56H98L95 47H91L80 70H64L73 46H62L52 59L18 53L14 46V33Z',
    cutouts: '<path d="M28 36H52L48 46H28V36ZM90 30H154V35H90V30ZM170 30H218V34H170V30ZM170 38H218V42H170V38ZM99 47H110L107 53H99V47Z" fill="#080c13"/>'
  },
  awp: {
    body: 'M6 34L14 31H48L56 28H86L92 31H104V24H82V14H132L136 11H146L150 14H206V25H168V31H224V33H298V30H314V41H298V38H224V43H212L216 49H186L182 45H158L154 65H128L130 46H112L106 55H92L88 46H82L74 62H44L38 52H18L12 58H6V34Z',
    cutouts: '<path d="M48 39H74L68 53H50L44 45L48 39ZM114 24H156V31H114V24ZM94 46H104L101 52H94V46Z" fill="#080c13"/>'
  },
  ssg08: {
    body: 'M12 36L20 31H64L74 34H94V25H84V16H126L130 13H140L144 16H186V25H160V33H226V34H308V39H226V43H164L154 58H132L134 45H112L106 54H92L88 45L78 64H64L72 45H54L46 54H16L12 48V36Z',
    cutouts: '<path d="M104 25H148V33H104V25ZM94 45H104L101 51H94V45Z" fill="#080c13"/>'
  },
  galil: {
    body: 'M12 34H74L80 26H164L170 29H228L238 20H244L246 33H284V31H298V39H284V38H244L238 43H226L222 46H166L158 46L170 78L152 82L138 46H116L110 55H96L93 46H88L76 70H60L70 45H18L12 52V34Z',
    cutouts: '<path d="M22 38H68V42H22V38ZM86 30H156V35H86V30ZM174 33H218V39H174V33Z" fill="#080c13"/>'
  },
  famas: {
    body: 'M22 30L34 28H54L64 16H198L208 28H222V32H264V30H278V39H264V37H222V45H204L198 48H136L130 58H114L112 48H106L96 70H80L88 48H72L66 78H48L52 48H30L22 54V30Z',
    cutouts: '<path d="M72 22H188L192 29H68L72 22ZM116 48H126L124 54H116V48Z" fill="#080c13"/>'
  },
  aug: {
    body: 'M20 32H88L98 16H184L180 24H166L172 30H218V33H276V39H218V44H182L178 72H164L166 45H132L126 56H110L106 46L96 70H80L88 48H68L60 80H42L48 48H24L20 54V32Z',
    cutouts: '<path d="M106 21H158L162 29H102L106 21Z" fill="#080c13"/>'
  },
  sg553: {
    body: 'M14 34H76L82 26H104V16H158V26H168L174 29H232L238 22H244L246 33H282V31H296V39H282V38H244L238 43H166L158 46L168 78L150 81L138 46H116L110 55H96L92 46L80 69H64L74 45H22L14 52V34Z',
    cutouts: '<path d="M26 38H68L64 42H26V38ZM174 33H224V38H174V33Z" fill="#080c13"/>'
  },
  mp9: {
    body: 'M44 33H106L112 24H212L218 29H248V38H218V44H206L204 68H190L190 44H164L158 84H140L144 52H128L124 44H106L48 49L44 44V33Z',
    cutouts: '<path d="M54 37H102L100 43L54 45V37ZM120 29H198V34H120V29ZM130 44H142V49H130V44Z" fill="#080c13"/>'
  },
  mac10: {
    body: 'M62 34H94V22H102V25H194V21H202V31H234V40H222V56H214V40H202V46H158L152 55H142L138 84H118L122 46H94V39H68V46H62V34Z',
    cutouts: '<path d="M106 30H186V36H106V30ZM142 46H152L149 52H142V46Z" fill="#080c13"/>'
  },
  mp7: {
    body: 'M46 34H94L98 22H214L218 31H242V39H218V44H204L202 68H188V44H160L152 80H132L138 46H94V39H54V46H46V34Z',
    cutouts: '<path d="M108 28H202V34H108V28Z" fill="#080c13"/>'
  },
  ump45: {
    body: 'M24 33H88L94 24H214L222 30H258V38H222V44H170L180 82L162 84L150 45H124L118 54H104L94 70H78L88 45H28L24 52V33Z',
    cutouts: '<path d="M34 37H82L78 42H34V37ZM104 29H204V35H104V29Z" fill="#080c13"/>'
  },
  p90: {
    body: 'M38 30H64V22H172L178 14H220L224 26H236V32H254V39H236V58L222 64H194L188 52H164L156 68H132L136 50H94L88 66H38V30Z',
    cutouts: '<path d="M56 40H84L80 54H56V40ZM102 38H132L128 50H102V38ZM168 38H190L186 48H168V38Z" fill="#080c13"/>'
  },
  xm1014: {
    body: 'M12 42L56 36L74 26H162L168 28H304V33H286V36H298V41H236L230 46H166L160 42H112L106 52H92L80 70H64L74 46L56 48L18 62L10 56L12 42Z',
    cutouts: '<path d="M84 30H154V35H84V30ZM172 36H226V42H172V36Z" fill="#080c13"/>'
  },
  nova: {
    body: 'M12 42L58 36L76 27H158L164 29H306V34H284V37H296V41H234L228 47H168L162 41H110L104 50H90L72 50L20 62L10 56L12 42Z',
    cutouts: '<path d="M174 37H224V43H174V37Z" fill="#080c13"/>'
  },
  deagle: {
    body: 'M84 26L92 20H98L102 22H232L238 26V41H222L216 45H158L150 56H126L114 78H84L80 74L96 46L82 43L90 36L84 26Z',
    cutouts: '<path d="M138 27H216V33H138V27ZM126 45H146L142 52H124L126 45Z" fill="#080c13"/>'
  },
  usps: {
    body: 'M66 26L74 22H176V27H268V39H176V44H138L132 54H112L102 76H74L70 72L84 44L72 41V26H66Z',
    cutouts: '<path d="M84 27H164V32H84V27ZM112 44H130L126 50H110L112 44Z" fill="#080c13"/><path d="M192 27V39M252 27V39" stroke="#080c13" stroke-width="1.5"/>'
  },
  glock: {
    body: 'M88 23H212V40H204L200 44H152L148 55H124L112 78H84L98 45L86 42V23H88Z',
    cutouts: '<path d="M96 27H116V35H96V27ZM126 44H144V51H124L126 44Z" fill="#080c13"/>'
  },
  p250: {
    body: 'M90 24L98 21H204L208 26V41H198L192 45H148L142 55H122L110 76H84L96 45L84 41L90 24Z',
    cutouts: '<path d="M104 27H192V32H104V27ZM122 45H140L136 51H120L122 45Z" fill="#080c13"/>'
  },
  p2000: {
    body: 'M88 24L96 21H206V40H196L190 45H148L142 55H122L110 76H84L96 45L84 41L88 24Z',
    cutouts: '<path d="M102 27H192V32H102V27ZM122 45H140L136 51H120L122 45Z" fill="#080c13"/>'
  },
  fiveseven: {
    body: 'M86 25L96 21H214L218 27V41H206L200 45H152L146 56H124L112 78H84L96 46L82 42L86 25Z',
    cutouts: '<path d="M104 27H202V31H104V27ZM124 45H142L138 52H122L124 45Z" fill="#080c13"/>'
  },
  tec9: {
    body: 'M76 24H224V38H202V44H178L174 82H154L158 44H136L130 54H112L102 76H78L90 44H76V24Z',
    cutouts: '<path d="M140 28H214V33H140V28ZM114 44H130L126 50H112L114 44Z" fill="#080c13"/>'
  },
  cz75: {
    body: 'M82 25L92 21H212V38H196L184 74H166L176 44H146L140 54H120L108 76H82L94 45L80 41L82 25Z',
    cutouts: '<path d="M100 27H196V32H100V27ZM120 44H138L134 50H118L120 44Z" fill="#080c13"/>'
  },
  revolver: {
    body: 'M78 28L92 20H238L242 25V40H168L162 46H146L140 56H118L104 78H78L92 48L76 42L78 28Z',
    cutouts: '<path d="M118 27H156V41H118V27ZM170 26H228V31H170V26ZM120 46H138L134 52H118L120 46Z" fill="#080c13"/>'
  },
  zeus: {
    body: 'M92 24H206L214 28V44H198L192 48H146L140 56H122L110 76H84L96 48L86 42L92 24Z',
    cutouts: '<path d="M136 30L158 26L150 35H168L142 42L148 34H136V30Z" fill="#080c13"/>'
  },
  knife: {
    body: 'M36 45C36 38.9 40.9 34 47 34C51.2 34 54.8 36.4 56.6 39.8H122V26H132V34H146L150 30L154 34L158 30L162 34L166 30L170 34H244L284 44L254 55C236 58 210 58 184 56H132V64H122V51H56.6C54.8 54.6 51.2 57 47 57C40.9 57 36 52.1 36 45Z',
    cutouts: '<circle cx="47" cy="45.5" r="5.5" fill="#080c13"/><path d="M142 41H234V45H142V41ZM68 42H114V48H68V42Z" fill="#080c13"/>'
  }
};

// Reusable CS2 skin finish styles (gradients + clipped pattern overlays)
const SKIN_THEMES = {
  asiimov: {
    stops: [['0%', '#f8fafc'], ['55%', '#e2e8f0'], ['100%', '#cbd5e1']],
    overlay: '<polygon points="0,0 115,0 85,90 0,90" fill="#f97316"/><polygon points="105,0 135,0 105,90 75,90" fill="#111827"/><polygon points="195,0 250,0 220,90 165,90" fill="#f97316"/><polygon points="245,0 264,0 234,90 215,90" fill="#0f172a"/>'
  },
  printstream: {
    stops: [['0%', '#f8fafc'], ['45%', '#f1f5f9'], ['78%', '#e0e7ff'], ['100%', '#fce7f3']],
    overlay: '<polygon points="0,60 320,38 320,90 0,90" fill="#0f172a" opacity="0.88"/><line x1="0" y1="58" x2="320" y2="36" stroke="#38bdf8" stroke-width="2" opacity="0.85"/><line x1="0" y1="62" x2="320" y2="40" stroke="#f472b6" stroke-width="1.5" opacity="0.8"/>'
  },
  vulcan: {
    stops: [['0%', '#0f172a'], ['50%', '#1e293b'], ['100%', '#020617']],
    overlay: '<polygon points="55,0 140,0 110,90 25,90" fill="#f8fafc" opacity="0.92"/><polygon points="88,0 112,0 82,90 58,90" fill="#38bdf8"/><polygon points="175,0 240,0 215,90 150,90" fill="#0ea5e9" opacity="0.85"/><line x1="0" y1="36" x2="320" y2="36" stroke="#f8fafc" stroke-width="2" opacity="0.8"/>'
  },
  fade: {
    stops: [['0%', '#facc15'], ['35%', '#fb7185'], ['70%', '#c084fc'], ['100%', '#6366f1']],
    overlay: '<rect x="0" y="0" width="320" height="90" fill="url(#sheen)" opacity="0.25"/>'
  },
  howl: {
    stops: [['0%', '#450a0a'], ['45%', '#dc2626'], ['80%', '#f97316'], ['100%', '#facc15']],
    overlay: '<polygon points="90,0 210,0 175,90 55,90" fill="#ef4444" opacity="0.45"/><polygon points="150,15 240,0 205,90 120,90" fill="#fb923c" opacity="0.4"/>'
  },
  wild_lotus: {
    stops: [['0%', '#064e3b'], ['50%', '#10b981'], ['100%', '#065f46']],
    overlay: '<circle cx="115" cy="40" r="24" fill="#f472b6" opacity="0.65"/><circle cx="185" cy="44" r="20" fill="#fb7185" opacity="0.6"/><circle cx="235" cy="36" r="14" fill="#fde047" opacity="0.5"/>'
  },
  gold_arabesque: {
    stops: [['0%', '#b45309'], ['35%', '#facc15'], ['65%', '#fef08a'], ['100%', '#d97706']],
    overlay: '<line x1="0" y1="30" x2="320" y2="55" stroke="#fffbeb" stroke-width="2" opacity="0.45"/><line x1="0" y1="50" x2="320" y2="25" stroke="#78350f" stroke-width="2" opacity="0.35"/>'
  },
  redline: {
    stops: [['0%', '#18181b'], ['50%', '#27272a'], ['100%', '#09090b']],
    overlay: '<line x1="0" y1="37" x2="320" y2="37" stroke="#ef4444" stroke-width="3"/><line x1="0" y1="45" x2="320" y2="45" stroke="#dc2626" stroke-width="1.5" opacity="0.8"/>'
  },
  bloodsport: {
    stops: [['0%', '#dc2626'], ['45%', '#f8fafc'], ['75%', '#1e293b'], ['100%', '#ef4444']],
    overlay: '<polygon points="75,0 130,0 105,90 50,90" fill="#facc15" opacity="0.85"/><polygon points="165,0 200,0 175,90 140,90" fill="#0f172a" opacity="0.85"/>'
  },
  case_hardened: {
    stops: [['0%', '#1d4ed8'], ['30%', '#93c5fd'], ['58%', '#f59e0b'], ['82%', '#a855f7'], ['100%', '#2563eb']],
    overlay: '<circle cx="140" cy="38" r="35" fill="#3b82f6" opacity="0.45"/><circle cx="215" cy="42" r="28" fill="#fbbf24" opacity="0.4"/>'
  },
  slate: {
    stops: [['0%', '#334155'], ['50%', '#1e293b'], ['100%', '#0f172a']],
    overlay: '<line x1="0" y1="35" x2="320" y2="35" stroke="#64748b" stroke-width="1.5" opacity="0.5"/>'
  },
  fire_serpent: {
    stops: [['0%', '#14532d'], ['45%', '#22c55e'], ['80%', '#eab308'], ['100%', '#0f766e']],
    overlay: '<polygon points="100,0 185,0 155,90 70,90" fill="#38bdf8" opacity="0.35"/><polygon points="160,0 230,0 200,90 130,90" fill="#ef4444" opacity="0.35"/>'
  },
  blue_phosphor: {
    stops: [['0%', '#0f172a'], ['35%', '#1d4ed8'], ['70%', '#38bdf8'], ['100%', '#0284c7']],
    overlay: '<polygon points="60,0 190,0 140,90 10,90" fill="#7dd3fc" opacity="0.28"/>'
  },
  hyper_beast: {
    stops: [['0%', '#06b6d4'], ['35%', '#ec4899'], ['70%', '#f97316'], ['100%', '#84cc16']],
    overlay: '<circle cx="120" cy="40" r="30" fill="#f43f5e" opacity="0.5"/><circle cx="195" cy="42" r="26" fill="#22d3ee" opacity="0.5"/>'
  },
  hot_rod: {
    stops: [['0%', '#991b1b'], ['50%', '#ef4444'], ['100%', '#7f1d1d']],
    overlay: '<rect x="0" y="0" width="320" height="90" fill="url(#sheen)" opacity="0.3"/>'
  },
  cyrex: {
    stops: [['0%', '#0f172a'], ['50%', '#1e293b'], ['100%', '#020617']],
    overlay: '<polygon points="0,0 145,0 115,90 0,90" fill="#f8fafc" opacity="0.9"/><polygon points="115,0 155,0 125,90 85,90" fill="#ef4444"/>'
  },
  neo_noir: {
    stops: [['0%', '#1e1b4b'], ['45%', '#db2777'], ['80%', '#38bdf8'], ['100%', '#0f172a']],
    overlay: '<polygon points="90,0 175,0 145,90 60,90" fill="#f472b6" opacity="0.4"/><polygon points="160,0 230,0 200,90 130,90" fill="#22d3ee" opacity="0.35"/>'
  },
  kill_confirmed: {
    stops: [['0%', '#7f1d1d'], ['50%', '#dc2626'], ['100%', '#450a0a']],
    overlay: '<circle cx="135" cy="36" r="20" fill="#f8fafc" opacity="0.85"/><polygon points="155,20 215,35 175,62" fill="#fef2f2" opacity="0.7"/>'
  },
  blaze: {
    stops: [['0%', '#18181b'], ['55%', '#27272a'], ['82%', '#f97316'], ['100%', '#facc15']],
    overlay: '<polygon points="165,0 265,0 245,90 140,90" fill="#fb923c" opacity="0.55"/>'
  },
  code_red: {
    stops: [['0%', '#ef4444'], ['50%', '#b91c1c'], ['100%', '#f8fafc']],
    overlay: '<polygon points="110,0 165,0 135,90 80,90" fill="#f8fafc" opacity="0.85"/><line x1="0" y1="36" x2="320" y2="36" stroke="#111827" stroke-width="2"/>'
  },
  kumicho_dragon: {
    stops: [['0%', '#4c1d95'], ['50%', '#7c3aed'], ['100%', '#cbd5e1']],
    overlay: '<polygon points="120,0 240,0 210,90 90,90" fill="#e2e8f0" opacity="0.5"/>'
  },
  dragon_lore: {
    stops: [['0%', '#ca8a04'], ['50%', '#facc15'], ['82%', '#4d7c0f'], ['100%', '#991b1b']],
    overlay: '<polygon points="105,0 220,0 185,90 70,90" fill="#ef4444" opacity="0.32"/><circle cx="170" cy="40" r="18" fill="#fef08a" opacity="0.45"/>'
  },
  lightning_strike: {
    stops: [['0%', '#312e81'], ['50%', '#6d28d9'], ['100%', '#1e1b4b']],
    overlay: '<polyline points="65,45 120,28 145,42 215,24 265,40" fill="none" stroke="#e0e7ff" stroke-width="3.5" opacity="0.9"/>'
  },
  gungnir: {
    stops: [['0%', '#0c4a6e'], ['45%', '#0284c7'], ['80%', '#bae6fd'], ['100%', '#0369a1']],
    overlay: '<line x1="0" y1="36" x2="320" y2="36" stroke="#f8fafc" stroke-width="2.5" opacity="0.65"/>'
  },
  chatterbox: {
    stops: [['0%', '#78350f'], ['50%', '#facc15'], ['100%', '#451a03']],
    overlay: '<polygon points="110,0 180,0 155,90 85,90" fill="#fde047" opacity="0.5"/>'
  },
  commemoration: {
    stops: [['0%', '#b45309'], ['50%', '#fbbf24'], ['100%', '#92400e']],
    overlay: '<line x1="0" y1="38" x2="320" y2="38" stroke="#fef3c7" stroke-width="2" opacity="0.6"/>'
  },
  starlight_protector: {
    stops: [['0%', '#f8fafc'], ['55%', '#e0e7ff'], ['100%', '#fcd34d']],
    overlay: '<polygon points="100,0 185,0 155,90 70,90" fill="#60a5fa" opacity="0.45"/><line x1="0" y1="42" x2="320" y2="42" stroke="#f59e0b" stroke-width="2"/>'
  },
  vogue: {
    stops: [['0%', '#be123c'], ['45%', '#fb7185'], ['80%', '#facc15'], ['100%', '#4f46e5']],
    overlay: '<circle cx="145" cy="36" r="22" fill="#fef08a" opacity="0.45"/>'
  },
  neon_rider: {
    stops: [['0%', '#ec4899'], ['50%', '#8b5cf6'], ['100%', '#06b6d4']],
    overlay: '<polygon points="95,0 175,0 145,90 65,90" fill="#22d3ee" opacity="0.45"/>'
  },
  doppler: {
    stops: [['0%', '#0f172a'], ['35%', '#1d4ed8'], ['70%', '#7e22ce'], ['100%', '#0284c7']],
    overlay: '<circle cx="165" cy="44" r="40" fill="#38bdf8" opacity="0.35"/>'
  },
  crimson_web: {
    stops: [['0%', '#7f1d1d'], ['50%', '#dc2626'], ['100%', '#450a0a']],
    overlay: '<line x1="120" y1="20" x2="260" y2="65" stroke="#09090b" stroke-width="1.5" opacity="0.7"/><line x1="160" y1="65" x2="260" y2="25" stroke="#09090b" stroke-width="1.5" opacity="0.7"/>'
  },
  marble_fade: {
    stops: [['0%', '#eab308'], ['45%', '#ef4444'], ['85%', '#2563eb'], ['100%', '#1d4ed8']],
    overlay: '<rect x="0" y="0" width="320" height="90" fill="url(#sheen)" opacity="0.2"/>'
  },
  tiger_tooth: {
    stops: [['0%', '#b45309'], ['50%', '#f59e0b'], ['100%', '#fbbf24']],
    overlay: '<polygon points="120,0 138,0 112,90 94,90" fill="#78350f" opacity="0.55"/><polygon points="175,0 193,0 167,90 149,90" fill="#78350f" opacity="0.55"/><polygon points="225,0 243,0 217,90 199,90" fill="#78350f" opacity="0.55"/>'
  },
  emerald_dragon: {
    stops: [['0%', '#064e3b'], ['50%', '#10b981'], ['100%', '#34d399']],
    overlay: '<circle cx="150" cy="40" r="24" fill="#fde047" opacity="0.35"/>'
  },
  fuel_injector: {
    stops: [['0%', '#ca8a04'], ['55%', '#facc15'], ['100%', '#1e293b']],
    overlay: '<polygon points="135,0 215,0 195,90 115,90" fill="#334155" opacity="0.55"/>'
  },
  olympus: {
    stops: [['0%', '#1e3a8a'], ['45%', '#38bdf8'], ['80%', '#facc15'], ['100%', '#f8fafc']],
    overlay: '<polyline points="110,38 155,28 195,44" fill="none" stroke="#fef08a" stroke-width="3" opacity="0.85"/>'
  }
};

// Popular skins per weapon (covers all simulation presets + top iconic CS2 skins for every gun)
const POPULAR_WEAPON_SKINS = {
  ak47: [
    { slug: 'vulcan', label: 'VULCAN', theme: 'vulcan', aliases: ['VULCAN', 'CU VULCAN'] },
    { slug: 'asiimov', label: 'ASIIMOV', theme: 'asiimov', aliases: ['ASIIMOV', 'ASIMOV'] },
    { slug: 'wild_lotus', label: 'WILD LOTUS', theme: 'wild_lotus', aliases: ['WILD LOTUS'] },
    { slug: 'gold_arabesque', label: 'GOLD ARABESQUE', theme: 'gold_arabesque', aliases: ['GOLD ARABESQUE'] },
    { slug: 'redline', label: 'REDLINE', theme: 'redline', aliases: ['REDLINE'] },
    { slug: 'bloodsport', label: 'BLOODSPORT', theme: 'bloodsport', aliases: ['BLOODSPORT'] },
    { slug: 'case_hardened', label: 'CASE HARDENED', theme: 'case_hardened', aliases: ['CASE HARDENED', 'AQ OILDROP'] },
    { slug: 'fire_serpent', label: 'FIRE SERPENT', theme: 'fire_serpent', aliases: ['FIRE SERPENT'] },
    { slug: 'slate', label: 'SLATE', theme: 'slate', aliases: ['SLATE'] }
  ],
  m4a1s: [
    { slug: 'printstream', label: 'PRINTSTREAM', theme: 'printstream', aliases: ['PRINTSTREAM'] },
    { slug: 'blue_phosphor', label: 'BLUE PHOSPHOR', theme: 'blue_phosphor', aliases: ['BLUE PHOSPHOR'] },
    { slug: 'hyper_beast', label: 'HYPER BEAST', theme: 'hyper_beast', aliases: ['HYPER BEAST'] },
    { slug: 'hot_rod', label: 'HOT ROD', theme: 'hot_rod', aliases: ['HOT ROD'] },
    { slug: 'cyrex', label: 'CYREX', theme: 'cyrex', aliases: ['CYREX'] },
    { slug: 'fade', label: 'FADE', theme: 'fade', aliases: ['FADE'] }
  ],
  m4a4: [
    { slug: 'howl', label: 'HOWL', theme: 'howl', aliases: ['HOWL'] },
    { slug: 'asiimov', label: 'ASIIMOV', theme: 'asiimov', aliases: ['ASIIMOV', 'ASIMOV'] },
    { slug: 'neo_noir', label: 'NEO-NOIR', theme: 'neo_noir', aliases: ['NEO NOIR', 'NEO-NOIR'] },
    { slug: 'emperor', label: 'THE EMPEROR', theme: 'gungnir', aliases: ['EMPEROR', 'THE EMPEROR'] }
  ],
  awp: [
    { slug: 'asiimov', label: 'ASIIMOV', theme: 'asiimov', aliases: ['ASIIMOV', 'ASIMOV'] },
    { slug: 'dragon_lore', label: 'DRAGON LORE', theme: 'dragon_lore', aliases: ['DRAGON LORE'] },
    { slug: 'fade', label: 'FADE', theme: 'fade', aliases: ['FADE'] },
    { slug: 'hyper_beast', label: 'HYPER BEAST', theme: 'hyper_beast', aliases: ['HYPER BEAST'] },
    { slug: 'lightning_strike', label: 'LIGHTNING STRIKE', theme: 'lightning_strike', aliases: ['LIGHTNING STRIKE'] },
    { slug: 'gungnir', label: 'GUNGNIR', theme: 'gungnir', aliases: ['GUNGNIR'] }
  ],
  ssg08: [
    { slug: 'dragonfire', label: 'DRAGONFIRE', theme: 'howl', aliases: ['DRAGONFIRE'] },
    { slug: 'blood_in_the_water', label: 'BLOOD IN THE WATER', theme: 'crimson_web', aliases: ['BLOOD IN THE WATER'] }
  ],
  galil: [
    { slug: 'chatterbox', label: 'CHATTERBOX', theme: 'chatterbox', aliases: ['CHATTERBOX'] },
    { slug: 'phoenix_blacklight', label: 'PHOENIX BLACKLIGHT', theme: 'neo_noir', aliases: ['PHOENIX BLACKLIGHT'] }
  ],
  famas: [
    { slug: 'commemoration', label: 'COMMEMORATION', theme: 'commemoration', aliases: ['COMMEMORATION'] },
    { slug: 'roll_cage', label: 'ROLL CAGE', theme: 'redline', aliases: ['ROLL CAGE'] }
  ],
  aug: [
    { slug: 'akihabara_accept', label: 'AKIHABARA ACCEPT', theme: 'starlight_protector', aliases: ['AKIHABARA ACCEPT'] },
    { slug: 'momentum', label: 'MOMENTUM', theme: 'redline', aliases: ['MOMENTUM'] }
  ],
  sg553: [
    { slug: 'integrale', label: 'INTEGRALE', theme: 'vulcan', aliases: ['INTEGRALE'] },
    { slug: 'cyrex', label: 'CYREX', theme: 'cyrex', aliases: ['CYREX'] }
  ],
  mp9: [
    { slug: 'starlight_protector', label: 'STARLIGHT PROTECTOR', theme: 'starlight_protector', aliases: ['STARLIGHT PROTECTOR'] },
    { slug: 'hot_rod', label: 'HOT ROD', theme: 'hot_rod', aliases: ['HOT ROD'] },
    { slug: 'wild_lily', label: 'WILD LILY', theme: 'wild_lotus', aliases: ['WILD LILY'] }
  ],
  mac10: [
    { slug: 'neon_rider', label: 'NEON RIDER', theme: 'neon_rider', aliases: ['NEON RIDER'] },
    { slug: 'fade', label: 'FADE', theme: 'fade', aliases: ['FADE'] }
  ],
  mp7: [
    { slug: 'bloodsport', label: 'BLOODSPORT', theme: 'bloodsport', aliases: ['BLOODSPORT'] },
    { slug: 'fade', label: 'FADE', theme: 'fade', aliases: ['FADE'] }
  ],
  ump45: [
    { slug: 'blaze', label: 'BLAZE', theme: 'blaze', aliases: ['BLAZE', 'FLAMES'] },
    { slug: 'fade', label: 'FADE', theme: 'fade', aliases: ['FADE'] }
  ],
  p90: [
    { slug: 'asiimov', label: 'ASIIMOV', theme: 'asiimov', aliases: ['ASIIMOV', 'ASIMOV'] },
    { slug: 'emerald_dragon', label: 'EMERALD DRAGON', theme: 'emerald_dragon', aliases: ['EMERALD DRAGON'] }
  ],
  xm1014: [
    { slug: 'tranquility', label: 'TRANQUILITY', theme: 'vogue', aliases: ['TRANQUILITY'] },
    { slug: 'seasons', label: 'SEASONS', theme: 'emerald_dragon', aliases: ['SEASONS'] }
  ],
  nova: [
    { slug: 'hyper_beast', label: 'HYPER BEAST', theme: 'hyper_beast', aliases: ['HYPER BEAST'] },
    { slug: 'bloomstick', label: 'BLOOMSTICK', theme: 'crimson_web', aliases: ['BLOOMSTICK'] }
  ],
  deagle: [
    { slug: 'blaze', label: 'BLAZE', theme: 'blaze', aliases: ['BLAZE', 'AA FLAMES'] },
    { slug: 'printstream', label: 'PRINTSTREAM', theme: 'printstream', aliases: ['PRINTSTREAM'] },
    { slug: 'code_red', label: 'CODE RED', theme: 'code_red', aliases: ['CODE RED'] },
    { slug: 'kumicho_dragon', label: 'KUMICHO DRAGON', theme: 'kumicho_dragon', aliases: ['KUMICHO DRAGON'] }
  ],
  usps: [
    { slug: 'kill_confirmed', label: 'KILL CONFIRMED', theme: 'kill_confirmed', aliases: ['KILL CONFIRMED'] },
    { slug: 'neo_noir', label: 'NEO-NOIR', theme: 'neo_noir', aliases: ['NEO NOIR', 'NEO-NOIR'] },
    { slug: 'printstream', label: 'PRINTSTREAM', theme: 'printstream', aliases: ['PRINTSTREAM'] },
    { slug: 'cyrex', label: 'CYREX', theme: 'cyrex', aliases: ['CYREX'] }
  ],
  glock: [
    { slug: 'fade', label: 'FADE', theme: 'fade', aliases: ['FADE'] },
    { slug: 'vogue', label: 'VOGUE', theme: 'vogue', aliases: ['VOGUE'] },
    { slug: 'gamma_doppler', label: 'GAMMA DOPPLER', theme: 'emerald_dragon', aliases: ['GAMMA DOPPLER'] }
  ],
  p2000: [
    { slug: 'fire_elemental', label: 'FIRE ELEMENTAL', theme: 'howl', aliases: ['FIRE ELEMENTAL'] }
  ],
  p250: [
    { slug: 'asiimov', label: 'ASIIMOV', theme: 'asiimov', aliases: ['ASIIMOV', 'ASIMOV'] },
    { slug: 'see_ya_later', label: 'SEE YA LATER', theme: 'emerald_dragon', aliases: ['SEE YA LATER'] }
  ],
  fiveseven: [
    { slug: 'hyper_beast', label: 'HYPER BEAST', theme: 'hyper_beast', aliases: ['HYPER BEAST'] },
    { slug: 'case_hardened', label: 'CASE HARDENED', theme: 'case_hardened', aliases: ['CASE HARDENED'] }
  ],
  tec9: [
    { slug: 'fuel_injector', label: 'FUEL INJECTOR', theme: 'fuel_injector', aliases: ['FUEL INJECTOR'] }
  ],
  cz75: [
    { slug: 'victoria', label: 'VICTORIA', theme: 'gold_arabesque', aliases: ['VICTORIA'] }
  ],
  revolver: [
    { slug: 'fade', label: 'FADE', theme: 'fade', aliases: ['FADE'] },
    { slug: 'blaze', label: 'BLAZE', theme: 'blaze', aliases: ['BLAZE', 'FLAMES'] }
  ],
  zeus: [
    { slug: 'olympus', label: 'OLYMPUS', theme: 'olympus', aliases: ['OLYMPUS'] }
  ],
  knife: [
    { slug: 'doppler', label: 'DOPPLER', theme: 'doppler', aliases: ['DOPPLER', 'SAPPHIRE', 'RUBY', 'BLACK PEARL'] },
    { slug: 'fade', label: 'FADE', theme: 'fade', aliases: ['FADE'] },
    { slug: 'crimson_web', label: 'CRIMSON WEB', theme: 'crimson_web', aliases: ['CRIMSON WEB'] },
    { slug: 'marble_fade', label: 'MARBLE FADE', theme: 'marble_fade', aliases: ['MARBLE FADE'] },
    { slug: 'tiger_tooth', label: 'TIGER TOOTH', theme: 'tiger_tooth', aliases: ['TIGER TOOTH'] },
    { slug: 'case_hardened', label: 'CASE HARDENED', theme: 'case_hardened', aliases: ['CASE HARDENED'] },
    { slug: 'lore', label: 'LORE', theme: 'gold_arabesque', aliases: ['LORE'] },
    { slug: 'gamma_doppler', label: 'GAMMA DOPPLER', theme: 'emerald_dragon', aliases: ['GAMMA DOPPLER', 'EMERALD'] }
  ]
};

function buildSkinnedSvg(weaponId, skinSlug, themeKey) {
  const shape = WEAPON_SHAPES[weaponId];
  const theme = SKIN_THEMES[themeKey] || SKIN_THEMES.slate;
  const stopsHtml = theme.stops
    .map(([offset, color]) => `<stop offset="${offset}" stop-color="${color}"/>`)
    .join('');

  return `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skin-grad" x1="0%" y1="0%" x2="100%" y2="25%">
      ${stopsHtml}
    </linearGradient>
    <linearGradient id="sheen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.35"/>
    </linearGradient>
    <clipPath id="gun-clip">
      <path d="${shape.body}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#gun-clip)">
    <rect x="0" y="0" width="320" height="90" fill="url(#skin-grad)"/>
    ${theme.overlay || ''}
    <rect x="0" y="0" width="320" height="90" fill="url(#sheen)" opacity="0.35"/>
  </g>
  <path d="${shape.body}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="0.9"/>
  ${shape.cutouts}
</svg>\n`;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifest = {};
  let totalGenerated = 0;

  for (const [weaponId, skins] of Object.entries(POPULAR_WEAPON_SKINS)) {
    if (!WEAPON_SHAPES[weaponId]) continue;
    manifest[weaponId] = {};
    for (const skin of skins) {
      const fileName = `${weaponId}-${skin.slug}.svg`;
      const outPath = path.join(OUT_DIR, fileName);
      const svgContent = buildSkinnedSvg(weaponId, skin.slug, skin.theme);
      fs.writeFileSync(outPath, svgContent, 'utf8');
      manifest[weaponId][skin.slug] = {
        path: `/assets/weapons/skins/${fileName}`,
        label: skin.label,
        aliases: skin.aliases
      };
      totalGenerated++;
    }
  }

  const manifestJs = `/* Auto-generated by scripts/generate-weapon-skins.js */\nwindow.WEAPON_SKIN_SILHOUETTES = ${JSON.stringify(manifest, null, 2)};\n`;
  fs.writeFileSync(MANIFEST_PATH, manifestJs, 'utf8');
  console.log(`Generated ${totalGenerated} skinned weapon silhouette SVGs in ${OUT_DIR}`);
  console.log(`Wrote manifest to ${MANIFEST_PATH}`);
}

main();
