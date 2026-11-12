/* ==========================================================================
   CS2 STADIUM BROADCAST HUD // 1080p Real-Time Telemetry & 5v10 Engine
   ========================================================================== */

const WEAPON_SVGS = {
  // AK-47: Wooden stock, stamped receiver, curved 30-rd banana mag, handguard vents, gas tube, cleaning rod & slant brake
  ak47: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 43L14 38L66 34L72 25H158L166 28H222L236 29L244 35H280L285 20H291L293 35H302L308 32V40L292 40V43H242L236 45H222L218 47H170L166 46H156L164 60L178 78L161 83L145 63L136 46H114L108 55H94L91 46H87L75 70H58L68 45L56 46L20 62L10 57V43Z" fill="currentColor" opacity="0.95"/>
    <path d="M78 29H150V34H78V29ZM172 32H216V36H172V32ZM172 39H214V43H172V39ZM95 46H106L103 52H95V46Z" fill="#080c13"/>
    <rect x="242" y="41" width="46" height="2" fill="currentColor" opacity="0.75"/>
  </svg>`,
  // M4A1-S: Crane collapsible stock, carry handle receiver, straight 20-rd STANAG mag, carbine handguard, A2 sight & long suppressor
  m4a1s: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 33L14 29H54L60 33H74L80 26L92 18H146L154 26H206L213 17H220L223 32H234V28H312V40H234V37H222V42H206L202 45H154L148 46L152 75L133 77L127 46H112L106 55H92L89 46H85L74 69H58L67 45H56L46 58L12 52L8 46V33Z" fill="currentColor" opacity="0.95"/>
    <path d="M22 36H46L42 46H22V36ZM96 22H140V27H96V22ZM160 31H198V35H160V31ZM160 38H198V41H160V38ZM93 46H104L101 52H93V46Z" fill="#080c13"/>
    <path d="M244 28V40M262 28V40M296 28V40" stroke="#080c13" stroke-width="1.5"/>
  </svg>`,
  // M4A4: Crane stock, flat-top receiver with rear sight, curved 30-rd STANAG mag, quad-rail RIS handguard, A2 front sight & flash hider
  m4a4: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 33L20 29H62L68 33H82L86 22H98L102 26H160L164 24H226L234 17H241L244 32H284V30H300V39H284V37H244V42H228L224 46H162L156 47L166 77L147 80L135 47H118L112 56H98L95 47H91L80 70H64L73 46H62L52 59L18 53L14 46V33Z" fill="currentColor" opacity="0.95"/>
    <path d="M28 36H52L48 46H28V36ZM90 30H154V35H90V30ZM170 30H218V34H170V30ZM170 38H218V42H170V38ZM99 47H110L107 53H99V47Z" fill="#080c13"/>
  </svg>`,
  // AWP: Arctic Warfare thumbhole chassis stock, dual-turret sniper scope on rings, box mag, folded bipod, fluted barrel & muzzle brake
  awp: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 34L14 31H48L56 28H86L92 31H104V24H82V14H132L136 11H146L150 14H206V25H168V31H224V33H298V30H314V41H298V38H224V43H212L216 49H186L182 45H158L154 65H128L130 46H112L106 55H92L88 46H82L74 62H44L38 52H18L12 58H6V34Z" fill="currentColor" opacity="0.96"/>
    <path d="M48 39H74L68 53H50L44 45L48 39ZM114 24H156V31H114V24ZM94 46H104L101 52H94V46Z" fill="#080c13"/>
  </svg>`,
  // SSG 08: Steyr tactical scout stock, medium optic scope, slim forend & long free-float barrel
  ssg08: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 36L20 31H64L74 34H94V25H84V16H126L130 13H140L144 16H186V25H160V33H226V34H308V39H226V43H164L154 58H132L134 45H112L106 54H92L88 45L78 64H64L72 45H54L46 54H16L12 48V36Z" fill="currentColor" opacity="0.95"/>
    <path d="M104 25H148V33H104V25ZM94 45H104L101 51H94V45Z" fill="#080c13"/>
  </svg>`,
  // Galil AR: Tubular dual-strut folding stock, curved 35-rd magazine, handguard, hooded front sight & flash hider
  galil: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 34H74L80 26H164L170 29H228L238 20H244L246 33H284V31H298V39H284V38H244L238 43H226L222 46H166L158 46L170 78L152 82L138 46H116L110 55H96L93 46H88L76 70H60L70 45H18L12 52V34Z" fill="currentColor" opacity="0.94"/>
    <path d="M22 38H68V42H22V38ZM86 30H156V35H86V30ZM174 33H218V39H174V33Z" fill="#080c13"/>
  </svg>`,
  // FAMAS: French bullpup with iconic full-length carry handle arch, rear magazine behind grip & rifle grenade barrel ring
  famas: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 30L34 28H54L64 16H198L208 28H222V32H264V30H278V39H264V37H222V45H204L198 48H136L130 58H114L112 48H106L96 70H80L88 48H72L66 78H48L52 48H30L22 54V30Z" fill="currentColor" opacity="0.94"/>
    <path d="M72 22H188L192 29H68L72 22ZM116 48H126L124 54H116V48Z" fill="#080c13"/>
  </svg>`,
  // AUG: Steyr bullpup stock, rear magazine, integrated angled optic scope, forward vertical grip & tulip flash hider
  aug: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 32H88L98 16H184L180 24H166L172 30H218V33H276V39H218V44H182L178 72H164L166 45H132L126 56H110L106 46L96 70H80L88 48H68L60 80H42L48 48H24L20 54V32Z" fill="currentColor" opacity="0.94"/>
    <path d="M106 21H158L162 29H102L106 21Z" fill="#080c13"/>
  </svg>`,
  // SG 553: SIG rifle with ACOG combat optic, curved 30-rd magazine, ribbed handguard & skeleton stock
  sg553: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 34H76L82 26H104V16H158V26H168L174 29H232L238 22H244L246 33H282V31H296V39H282V38H244L238 43H166L158 46L168 78L150 81L138 46H116L110 55H96L92 46L80 69H64L74 45H22L14 52V34Z" fill="currentColor" opacity="0.94"/>
    <path d="M26 38H68L64 42H26V38ZM174 33H224V38H174V33Z" fill="#080c13"/>
  </svg>`,
  // MP9: B&T machine pistol with side-folding skeleton stock, integrated vertical foregrip & long protruding 30-rd stick mag
  mp9: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M44 33H106L112 24H212L218 29H248V38H218V44H206L204 68H190L190 44H164L158 84H140L144 52H128L124 44H106L48 49L44 44V33Z" fill="currentColor" opacity="0.94"/>
    <path d="M54 37H102L100 43L54 45V37ZM120 29H198V34H120V29ZM130 44H142V49H130V44Z" fill="#080c13"/>
  </svg>`,
  // MAC-10: Boxy stamped steel receiver, rear wire stock, grip-fed long vertical stick magazine & front strap
  mac10: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M62 34H94V22H102V25H194V21H202V31H234V40H222V56H214V40H202V46H158L152 55H142L138 84H118L122 46H94V39H68V46H62V34Z" fill="currentColor" opacity="0.94"/>
    <path d="M106 30H186V36H106V30ZM142 46H152L149 52H142V46Z" fill="#080c13"/>
  </svg>`,
  // MP7: H&K PDW with collapsible stock rods, flip-up sights, grip magazine & folding foregrip
  mp7: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M46 34H94L98 22H214L218 31H242V39H218V44H204L202 68H188V44H160L152 80H132L138 46H94V39H54V46H46V34Z" fill="currentColor" opacity="0.94"/>
    <path d="M108 28H202V34H108V28Z" fill="#080c13"/>
  </svg>`,
  // UMP-45: H&K SMG with skeleton stock, boxy receiver & forward-angled straight 25-rd magazine
  ump45: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 33H88L94 24H214L222 30H258V38H222V44H170L180 82L162 84L150 45H124L118 54H104L94 70H78L88 45H28L24 52V33Z" fill="currentColor" opacity="0.94"/>
    <path d="M34 37H82L78 42H34V37ZM104 29H204V35H104V29Z" fill="#080c13"/>
  </svg>`,
  // P90: FN ergonomic bullpup monobody with dual thumbholes, top 50-rd horizontal mag & elevated ring sight
  p90: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38 30H64V22H172L178 14H220L224 26H236V32H254V39H236V58L222 64H194L188 52H164L156 68H132L136 50H94L88 66H38V30Z" fill="currentColor" opacity="0.95"/>
    <path d="M56 40H84L80 54H56V40ZM102 38H132L128 50H102V38ZM168 38H190L186 48H168V38Z" fill="#080c13"/>
  </svg>`,
  // XM1014 / Nova: Tactical combat shotgun with full stock, long barrel + under-barrel mag tube & ribbed pump forend
  xm1014: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 42L56 36L74 26H162L168 28H304V33H286V36H298V41H236L230 46H166L160 42H112L106 52H92L80 70H64L74 46L56 48L18 62L10 56L12 42Z" fill="currentColor" opacity="0.94"/>
    <path d="M84 30H154V35H84V30ZM172 36H226V42H172V36Z" fill="#080c13"/>
  </svg>`,
  nova: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 42L58 36L76 27H158L164 29H306V34H284V37H296V41H234L228 47H168L162 41H110L104 50H90L72 50L20 62L10 56L12 42Z" fill="currentColor" opacity="0.94"/>
    <path d="M174 37H224V43H174V37Z" fill="#080c13"/>
  </svg>`,
  // Desert Eagle: Heavy triangular .50 AE barrel/slide with flutes, beaver-tail frame, hammer & thick grip
  deagle: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M84 26L92 20H98L102 22H232L238 26V41H222L216 45H158L150 56H126L114 78H84L80 74L96 46L82 43L90 36L84 26Z" fill="currentColor" opacity="0.95"/>
    <path d="M138 27H216V33H138V27ZM126 45H146L142 52H124L126 45Z" fill="#080c13"/>
  </svg>`,
  // USP-S: Squared H&K tactical slide, rail frame, flared mag base & attached cylindrical suppressor
  usps: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M66 26L74 22H176V27H268V39H176V44H138L132 54H112L102 76H74L70 72L84 44L72 41V26H66Z" fill="currentColor" opacity="0.95"/>
    <path d="M84 27H164V32H84V27ZM112 44H130L126 50H110L112 44Z" fill="#080c13"/>
    <path d="M192 27V39M252 27V39" stroke="#080c13" stroke-width="1.5"/>
  </svg>`,
  // Glock-18: Blocky flat-top Austrian slide with rear serrations, squared trigger guard & angled polymer grip
  glock: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M88 23H212V40H204L200 44H152L148 55H124L112 78H84L98 45L86 42V23H88Z" fill="currentColor" opacity="0.95"/>
    <path d="M96 27H116V35H96V27ZM126 44H144V51H124L126 44Z" fill="#080c13"/>
  </svg>`,
  // P250 / P2000 / Five-SeveN / Tec-9 / CZ75 / R8 Revolver / Zeus
  p250: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M90 24L98 21H204L208 26V41H198L192 45H148L142 55H122L110 76H84L96 45L84 41L90 24Z" fill="currentColor" opacity="0.95"/>
    <path d="M104 27H192V32H104V27ZM122 45H140L136 51H120L122 45Z" fill="#080c13"/>
  </svg>`,
  p2000: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M88 24L96 21H206V40H196L190 45H148L142 55H122L110 76H84L96 45L84 41L88 24Z" fill="currentColor" opacity="0.95"/>
    <path d="M102 27H192V32H102V27ZM122 45H140L136 51H120L122 45Z" fill="#080c13"/>
  </svg>`,
  fiveseven: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M86 25L96 21H214L218 27V41H206L200 45H152L146 56H124L112 78H84L96 46L82 42L86 25Z" fill="currentColor" opacity="0.95"/>
    <path d="M104 27H202V31H104V27ZM124 45H142L138 52H122L124 45Z" fill="#080c13"/>
  </svg>`,
  tec9: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M76 24H224V38H202V44H178L174 82H154L158 44H136L130 54H112L102 76H78L90 44H76V24Z" fill="currentColor" opacity="0.95"/>
    <path d="M140 28H214V33H140V28ZM114 44H130L126 50H112L114 44Z" fill="#080c13"/>
  </svg>`,
  cz75: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M82 25L92 21H212V38H196L184 74H166L176 44H146L140 54H120L108 76H82L94 45L80 41L82 25Z" fill="currentColor" opacity="0.95"/>
    <path d="M100 27H196V32H100V27ZM120 44H138L134 50H118L120 44Z" fill="#080c13"/>
  </svg>`,
  revolver: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M78 28L92 20H238L242 25V40H168L162 46H146L140 56H118L104 78H78L92 48L76 42L78 28Z" fill="currentColor" opacity="0.95"/>
    <path d="M118 27H156V41H118V27ZM170 26H228V31H170V26ZM120 46H138L134 52H118L120 46Z" fill="#080c13"/>
  </svg>`,
  zeus: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M92 24H206L214 28V44H198L192 48H146L140 56H122L110 76H84L96 48L86 42L92 24Z" fill="currentColor" opacity="0.95"/>
    <path d="M136 30L158 26L150 35H168L142 42L148 34H136V30Z" fill="#080c13"/>
  </svg>`,
  // M9 Bayonet / Tactical Combat Knife: Pommel ring, contoured grip, crossguard, fuller blood groove, clip-point blade & spine serrations
  knife: `<svg viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 45C36 38.9 40.9 34 47 34C51.2 34 54.8 36.4 56.6 39.8H122V26H132V34H146L150 30L154 34L158 30L162 34L166 30L170 34H244L284 44L254 55C236 58 210 58 184 56H132V64H122V51H56.6C54.8 54.6 51.2 57 47 57C40.9 57 36 52.1 36 45Z" fill="currentColor" opacity="0.95"/>
    <circle cx="47" cy="45.5" r="5.5" fill="#080c13"/>
    <path d="M142 41H234V45H142V41ZM68 42H114V48H68V42Z" fill="#080c13"/>
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
  rescueKit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="6" width="18" height="14" rx="2" fill="currentColor" fill-opacity="0.22"/>
    <path d="M9 6V4h6v2M12 10v6M9 13h6"/>
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
  </svg>`,
  // CS2 In-Game Style Headshot Silhouette Icon (Cranium + Crosshair Impact Burst)
  headshot: `<svg viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2C9.3 2 5.8 5.4 5.8 9.8C5.8 12.2 6.8 14.3 8.4 15.6L8.9 19.5C9 20.3 9.7 21 10.5 21H16.8C17.6 21 18.3 20.3 18.4 19.5L18.9 15.6C20.5 14.3 21.5 12.2 21.5 9.8C21.5 5.4 18.7 2 14 2Z" fill="currentColor" fill-opacity="0.92"/>
    <circle cx="13.7" cy="9.6" r="4.2" stroke="#070a10" stroke-width="1.6"/>
    <circle cx="13.7" cy="9.6" r="1.5" fill="#070a10"/>
    <path d="M1 9.6H9.2M18.2 9.6H27M13.7 3.6V6.2M13.7 13V15.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M21.5 5.2L26.5 3M22.2 9.6L27 9.6M21.5 14L26.5 16.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`
};

function resolveWeaponId(weaponNameOrId) {
  const raw = String(weaponNameOrId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!raw) return 'ak47';
  if (WEAPON_SVGS[raw]) return raw;
  if (raw.includes('m4a1s') || raw.includes('silencer')) return 'm4a1s';
  if (raw.includes('m4a4') || raw.includes('m4')) return 'm4a4';
  if (raw.includes('ssg') || raw.includes('scout')) return 'ssg08';
  if (raw.includes('awp') || raw.includes('sniper') || raw.includes('g3sg1') || raw.includes('scar')) return 'awp';
  if (raw.includes('aug')) return 'aug';
  if (raw.includes('sg55') || raw.includes('krieg')) return 'sg553';
  if (raw.includes('galil')) return 'galil';
  if (raw.includes('famas')) return 'famas';
  if (raw.includes('p90')) return 'p90';
  if (raw.includes('ump')) return 'ump45';
  if (raw.includes('mp7') || raw.includes('mp5')) return 'mp7';
  if (raw.includes('mp9')) return 'mp9';
  if (raw.includes('mac10') || raw.includes('bizon')) return 'mac10';
  if (raw.includes('xm1014') || raw.includes('mag7') || raw.includes('sawed')) return 'xm1014';
  if (raw.includes('nova')) return 'nova';
  if (raw.includes('revolver') || raw.includes('r8')) return 'revolver';
  if (raw.includes('deagle') || raw.includes('deserteagle')) return 'deagle';
  if (raw.includes('usp')) return 'usps';
  if (raw.includes('p2000')) return 'p2000';
  if (raw.includes('p250')) return 'p250';
  if (raw.includes('fiveseven')) return 'fiveseven';
  if (raw.includes('tec9')) return 'tec9';
  if (raw.includes('cz75') || raw.includes('cz')) return 'cz75';
  if (raw.includes('glock') || raw.includes('dual')) return 'glock';
  if (raw.includes('zeus') || raw.includes('taser')) return 'zeus';
  if (raw.includes('knife') || raw.includes('bayonet') || raw.includes('karambit')) return 'knife';
  return 'ak47';
}

function getWeaponKillfeedSvg(weaponNameOrId) {
  return WEAPON_SVGS[resolveWeaponId(weaponNameOrId)] || WEAPON_SVGS.ak47;
}

function normalizeSkinToken(str) {
  return String(str || '')
    .toUpperCase()
    .replace(/^(CU|AQ|HY|AM|AA|GS|SO|SP|AN|SW|HQ)\s+/g, '')
    .replace(/[^A-Z0-9]/g, '');
}

function findSkinnedSilhouette(weaponNameOrId, skinName) {
  const manifest = window.WEAPON_SKIN_SILHOUETTES;
  if (!manifest || !skinName) return null;
  const rawSkin = normalizeSkinToken(skinName);
  if (!rawSkin || rawSkin === 'STANDARDISSUE' || rawSkin === 'FACTORYISSUE' || rawSkin === 'DEFAULT' || rawSkin === 'STANDARD') {
    return null;
  }
  const weaponId = resolveWeaponId(weaponNameOrId);
  const weaponSkins = manifest[weaponId];
  if (!weaponSkins) return null;

  for (const [slug, entry] of Object.entries(weaponSkins)) {
    const candidates = [slug, entry.label, ...(entry.aliases || [])].map(normalizeSkinToken);
    for (const token of candidates) {
      if (token && (rawSkin === token || rawSkin.includes(token) || token.includes(rawSkin))) {
        return entry;
      }
    }
  }
  return null;
}

function getWeaponSilhouetteHtml(weaponNameOrId, skinName) {
  const match = findSkinnedSilhouette(weaponNameOrId, skinName);
  if (match) {
    return `<img src="${match.path}" alt="${weaponNameOrId} ${match.label}" class="weapon-skinned-silhouette" loading="eager" decoding="async" />`;
  }
  return getWeaponKillfeedSvg(weaponNameOrId);
}

function isHostageRescueMap(mapName = appState ? appState.mapName : '') {
  const m = String(mapName || '').toLowerCase().trim();
  return (
    m.startsWith('cs_') ||
    m.includes('office') ||
    m.includes('italy') ||
    m.includes('agency') ||
    m.includes('assault') ||
    m.includes('militia') ||
    m.includes('insertion')
  );
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

// Default 10 Human Operators Roster (each with a distinct default CT and T lobby background!)
const DEFAULT_CALLSIGNS = [
  { name: 'VORTEX', ctBg: 4, tBg: 2 },
  { name: 'KAIROS', ctBg: 2, tBg: 3 },
  { name: 'NYX', ctBg: 3, tBg: 1 },
  { name: 'HEX', ctBg: 8, tBg: 8 },
  { name: 'RONIN', ctBg: 9, tBg: 10 },
  { name: 'CYPHER', ctBg: 1, tBg: 4 },
  { name: 'VALKYRIE', ctBg: 5, tBg: 5 },
  { name: 'SPECTRE', ctBg: 6, tBg: 6 },
  { name: 'BLITZ', ctBg: 7, tBg: 7 },
  { name: 'TITAN', ctBg: 10, tBg: 9 }
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
  prevGsiRoundKills: {},
  prevGsiRoundHs: {},
  prevGsiHealth: {},
  gsiPlayerTrackers: {},
  seenServerKillIds: new Set(),
  damageTrails: Array.from({ length: 10 }, () => 100),
  displayRes: '1080p', // '1080p' | '1440p' | '5120x1440'
  viewMode: 'squad', // 'squad' | 'player'
  ingestionMode: 'simulation', // 'simulation' | 'multi_client' | 'spectator_allplayers'
  soloViewDismissed: false,
  selectedPlayerIdx: 0, // 0..9
  lanIp: window.location.hostname || '127.0.0.1',
  port: window.location.port || '3000',
  sseConnected: false,
  selfClientId: null,
  notifSoundEnabled: true,
  unreadClientEvents: 0,
  clients: {
    gsiCount: 0,
    displayCount: 1,
    gsiClients: [],
    displayClients: []
  },
  connectionLogs: []
};

function triggerPlayerKillFlash(slotIdx, details = {}) {
  if (slotIdx < 0 || slotIdx > 9) return;
  if (!appState.killCelebrations) appState.killCelebrations = {};
  const now = Date.now();
  const rk = Number(details.roundKills) || 1;
  const labelMap = {
    1: 'ELIMINATION // +1 KILL',
    2: 'DOUBLE KILL // 2K',
    3: 'TRIPLE KILL // 3K',
    4: 'QUAD KILL // 4K',
    5: 'ACE // 5K WIPE!',
    6: 'RAMPAGE // 6K!',
    7: 'DOMINATION // 7K!',
    8: 'UNSTOPPABLE // 8K!',
    9: 'GODLIKE // 9K!',
    10: 'DECIMATION // 10K SWARM WIPE!'
  };
  appState.killCelebrations[slotIdx] = {
    startedAt: now,
    expiresAt: now + 1850,
    headline: labelMap[Math.min(10, Math.max(1, rk))] || 'ELIMINATION // +1 KILL',
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
    },
    {
      primary: isCT
        ? { id: 'famas', name: 'FAMAS', skin: 'COMMEMORATION', clip: 25, clipMax: 25, reserve: 90 }
        : { id: 'ak47', name: 'AK-47', skin: 'BLOODSPORT', clip: 30, clipMax: 30, reserve: 90 },
      secondary: { id: 'p250', name: 'P250', skin: 'SEE YA LATER', clip: 13, clipMax: 13, reserve: 26 },
      grenades: ['smoke', 'flash', 'he'],
      money: 4600,
      equipValue: 4750,
      kills: 21, deaths: 10, assists: 8, adr: 104, hsPercent: 57, roundKills: 1, roundDamage: 136
    },
    {
      primary: isCT
        ? { id: 'aug', name: 'AUG', skin: 'AKIHABARA ACCEPT', clip: 30, clipMax: 30, reserve: 90 }
        : { id: 'sg553', name: 'SG 553', skin: 'INTEGRALE', clip: 30, clipMax: 30, reserve: 90 },
      secondary: isCT
        ? { id: 'fiveseven', name: 'Five-SeveN', skin: 'HYPER BEAST', clip: 20, clipMax: 20, reserve: 100 }
        : { id: 'tec9', name: 'Tec-9', skin: 'FUEL INJECTOR', clip: 18, clipMax: 18, reserve: 90 },
      grenades: ['smoke', 'flash', 'molotov', 'he'],
      money: 5800,
      equipValue: 5600,
      kills: 25, deaths: 9, assists: 10, adr: 119, hsPercent: 52, roundKills: 2, roundDamage: 210
    },
    {
      primary: { id: 'ssg08', name: 'SSG 08', skin: 'DRAGONFIRE', clip: 10, clipMax: 10, reserve: 90 },
      secondary: { id: 'deagle', name: 'Desert Eagle', skin: 'EMERALD JORMUNGANDR', clip: 7, clipMax: 7, reserve: 35 },
      grenades: ['smoke', 'flash', 'he'],
      money: 6900,
      equipValue: 4300,
      kills: 20, deaths: 8, assists: 6, adr: 102, hsPercent: 70, roundKills: 1, roundDamage: 154
    },
    {
      primary: isCT
        ? { id: 'm4a4', name: 'M4A4', skin: 'THE EMPEROR', clip: 30, clipMax: 30, reserve: 90 }
        : { id: 'mac10', name: 'MAC-10', skin: 'NEON RIDER', clip: 30, clipMax: 30, reserve: 100 },
      secondary: isCT
        ? { id: 'usps', name: 'USP-S', skin: 'CORTEX', clip: 12, clipMax: 12, reserve: 24 }
        : { id: 'glock', name: 'Glock-18', skin: 'WATER ELEMENTAL', clip: 20, clipMax: 20, reserve: 120 },
      grenades: ['smoke', 'flash', 'molotov'],
      money: 5350,
      equipValue: 5150,
      kills: 18, deaths: 12, assists: 13, adr: 94, hsPercent: 49, roundKills: 1, roundDamage: 128
    },
    {
      primary: isCT
        ? { id: 'xm1014', name: 'XM1014', skin: 'TRANQUILITY', clip: 7, clipMax: 7, reserve: 32 }
        : { id: 'ak47', name: 'AK-47', skin: 'FIRE SERPENT', clip: 30, clipMax: 30, reserve: 90 },
      secondary: { id: 'deagle', name: 'Desert Eagle', skin: 'KUMICHO DRAGON', clip: 7, clipMax: 7, reserve: 35 },
      grenades: ['smoke', 'flash', 'he', 'molotov'],
      money: 8100,
      equipValue: 5300,
      kills: 23, deaths: 9, assists: 9, adr: 112, hsPercent: 55, roundKills: 1, roundDamage: 175
    }
  ];

  const safeCount = Math.max(1, Math.min(10, count || 5));
  const currRound = Math.max(1, appState.roundNumber || 18);
  return loadouts.slice(0, safeCount).map((item, idx) => {
    const hsKills = Math.round((item.kills * item.hsPercent) / 100);
    const priorRounds = Math.max(1, currRound - 1);
    const completedDamage = Math.max(0, item.adr * priorRounds);
    const roundHistory = {};
    for (let offset = -7; offset <= -1; offset++) {
      const rNum = currRound + offset;
      if (rNum >= 1) {
        const val = Math.max(24, Math.min(420, Math.round(item.adr + ((rNum * 37 + idx * 53) % 140) - 55)));
        const kills = Math.max(0, Math.min(5, Math.round(val / 105)));
        roundHistory[rNum] = { rNum, val, kills };
      }
    }
    roundHistory[currRound] = { rNum: currRound, val: item.roundDamage, kills: item.roundKills };

    const slotMeta = appState.customCallsigns[idx] || DEFAULT_CALLSIGNS[idx] || DEFAULT_CALLSIGNS[0];
    return {
      id: `sim-human-${idx + 1}`,
      slot: idx + 1,
      name: slotMeta.name,
      role: slotMeta.role,
      team: side,
      health: idx === 3 ? 68 : idx === 2 ? 84 : idx === 7 ? 76 : 100,
      armor: idx === 3 ? 82 : idx === 7 ? 91 : 100,
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
      hsKills,
      completedDamage,
      roundsObserved: currRound,
      adr: item.adr,
      hsPercent: item.hsPercent,
      roundKills: item.roundKills,
      roundDamage: item.roundDamage,
      roundHistory,
      primaryWeapon: { ...item.primary },
      secondaryWeapon: { ...item.secondary },
      activeWeapon: { ...item.primary },
      grenades: [...item.grenades]
    };
  });
}

function syncPlayerCombatMetrics(p, roundNum = appState.roundNumber) {
  if (!p) return;
  const rNum = Math.max(1, Number(roundNum) || 1);
  if (!p.roundHistory || typeof p.roundHistory !== 'object' || Array.isArray(p.roundHistory)) {
    p.roundHistory = {};
  }
  p.roundDamage = Math.max(0, Math.min(1000, Math.round(Number(p.roundDamage) || 0)));
  p.roundKills = Math.max(0, Math.round(Number(p.roundKills) || 0));
  p.roundHistory[rNum] = {
    rNum,
    val: p.roundDamage,
    kills: p.roundKills
  };

  const roundsCount = Math.max(1, Number(p.roundsObserved) || rNum);
  const completedDmg = typeof p.completedDamage === 'number'
    ? p.completedDamage
    : Math.max(0, (Number(p.adr) || 100) * Math.max(0, roundsCount - 1));
  const adrDenominator = (appState.roundPhase === 'freezetime' && roundsCount > 1 && p.roundDamage === 0)
    ? Math.max(1, roundsCount - 1)
    : roundsCount;
  p.adr = Math.max(0, Math.round((completedDmg + p.roundDamage) / adrDenominator));

  if (typeof p.hsKills === 'number' && p.kills > 0) {
    p.hsPercent = Math.max(0, Math.min(100, Math.round((p.hsKills / Math.max(1, p.kills)) * 100)));
  }
}

function createInitialBotSwarm() {
  return BOT_NAMES.map((name, idx) => ({
    id: `bot-${idx + 1}`,
    name,
    health: idx < 2 ? 0 : idx === 2 ? 42 : 100,
    armor: idx < 2 ? 0 : 100
  }));
}

function pushKillfeedEvent(attacker, attackerType, weaponName, victim, victimType, isHs = false, extraTag = '', meta = {}) {
  appState.killfeed.unshift({
    id: `${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
    round: appState.roundNumber || 1,
    attacker,
    attackerType,
    attackerSlot: meta.attackerSlot || null,
    attackerId: meta.attackerId || null,
    weaponName,
    victim,
    victimType,
    victimSlot: meta.victimSlot || null,
    victimId: meta.victimId || null,
    isHs,
    extraTag
  });
  if (appState.killfeed.length > 12) {
    appState.killfeed.length = 12;
  }
}

function initSimulationState() {
  appState.players = createInitialSimSquad(appState.humanSide, appState.targetSquadSize);
  appState.bots = createInitialBotSwarm();
  appState.damageTrails = appState.players.map(p => p.health);
  appState.killfeed = [
    {
      id: 'kf-1',
      round: appState.roundNumber,
      attacker: appState.customCallsigns[Math.min(1, appState.players.length - 1)].name,
      attackerType: 'human',
      attackerSlot: Math.min(2, appState.players.length),
      weaponName: 'AWP',
      victim: 'BOT VLADIMIR',
      victimType: 'bot',
      isHs: true,
      extraTag: ''
    },
    {
      id: 'kf-2',
      round: appState.roundNumber,
      attacker: appState.customCallsigns[0].name,
      attackerType: 'human',
      attackerSlot: 1,
      weaponName: appState.humanSide === 'CT' ? 'M4A1-S' : 'AK-47',
      victim: 'BOT IGOR',
      victimType: 'bot',
      isHs: true,
      extraTag: ''
    },
    {
      id: 'kf-3',
      round: appState.roundNumber,
      attacker: appState.customCallsigns[Math.min(2, appState.players.length - 1)].name,
      attackerType: 'human',
      attackerSlot: Math.min(3, appState.players.length),
      weaponName: appState.humanSide === 'CT' ? 'M4A4' : 'AK-47',
      victim: 'BOT DMITRI',
      victimType: 'bot',
      isHs: false,
      extraTag: ''
    },
    {
      id: 'kf-4',
      round: appState.roundNumber,
      attacker: appState.customCallsigns[Math.min(4, appState.players.length - 1)].name,
      attackerType: 'human',
      attackerSlot: Math.min(5, appState.players.length),
      weaponName: 'Desert Eagle',
      victim: 'BOT BORIS',
      victimType: 'bot',
      isHs: true,
      extraTag: ''
    }
  ];
}

/* ==========================================================================
   1080P / 1440P / 5120x1440 STAGE SCALING & URL ROUTING ENGINE
   ========================================================================== */
function initRouteAndResolutionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const path = window.location.pathname || '';
  const pathMatch = path.match(/\/player\/(10|[1-9])/i);

  const squadParam = Number(params.get('squad') || params.get('players'));
  if (squadParam >= 1 && squadParam <= 10) {
    appState.targetSquadSize = squadParam;
  }

  const slotParam = params.get('slot') || params.get('player') || (pathMatch ? pathMatch[1] : null);
  const isPlayerRoute =
    document.body.dataset.defaultView === 'player' ||
    path.includes('/player') ||
    params.get('view') === 'player' ||
    Boolean(slotParam);

  if (isPlayerRoute) {
    appState.viewMode = 'player';
  }
  if (slotParam) {
    const parsed = Math.max(1, Math.min(10, Number(slotParam) || 1));
    appState.selectedPlayerIdx = parsed - 1;
    if (parsed > appState.targetSquadSize) {
      appState.targetSquadSize = parsed;
    }
  }

  const resParam = params.get('res');
  if (resParam === '1080p' || resParam === '1440p' || resParam === '5120x1440') {
    appState.displayRes = resParam;
  } else if (window.innerWidth >= 3400 && window.innerWidth / Math.max(1, window.innerHeight) >= 2.9) {
    appState.displayRes = '5120x1440';
  }
}

function updateStageScale() {
  const isSuperUltrawide = appState.displayRes === '5120x1440';
  const targetW = isSuperUltrawide ? 3840 : 1920;
  const targetH = 1080;
  document.documentElement.style.setProperty('--stage-w', `${targetW}px`);
  document.documentElement.style.setProperty('--stage-h', `${targetH}px`);
  const scaleX = window.innerWidth / targetW;
  const scaleY = window.innerHeight / targetH;
  const scale = Math.min(scaleX, scaleY);
  document.documentElement.style.setProperty('--stage-scale', scale.toFixed(4));
}

function setDisplayResolution(resMode, triggerFullscreen = true) {
  if (!['1080p', '1440p', '5120x1440'].includes(resMode)) resMode = '1080p';
  const wasSameRes = appState.displayRes === resMode;
  appState.displayRes = resMode;
  updateStageScale();

  const labelMap = {
    '1080p': '1920x1080 (16:9 FULL HD)',
    '1440p': '2560x1440 (16:9 QHD 1440P)',
    '5120x1440': '5120x1440 (32:9 SUPER ULTRAWIDE)'
  };
  appState.calloutText = `DISPLAY MODE LOCKED // ${labelMap[resMode]}`;
  appState.calloutHighlight = true;

  if (triggerFullscreen) {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (wasSameRes) {
      document.exitFullscreen().catch(() => {});
    }
  }
  renderAll();
}

function isSoloClientActive() {
  if (appState.soloViewDismissed) return false;
  if (appState.players.length !== 1) return false;
  if (appState.ingestionMode === 'spectator_allplayers') return false;
  return true;
}

function getEffectiveViewMode() {
  if (appState.viewMode === 'player' || isSoloClientActive()) {
    return 'player';
  }
  return 'squad';
}

function openPlayerDetailView(slotIdx = 0, pushUrl = true) {
  appState.soloViewDismissed = false;
  const maxIdx = Math.max(0, appState.players.length - 1);
  appState.selectedPlayerIdx = Math.max(0, Math.min(maxIdx, Number(slotIdx) || 0));
  appState.viewMode = 'player';
  if (pushUrl && window.history && window.history.replaceState) {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'player');
    url.searchParams.set('slot', String(appState.selectedPlayerIdx + 1));
    window.history.replaceState({}, '', url.toString());
  }
  const p = appState.players[appState.selectedPlayerIdx];
  if (p) {
    const slotStr = String(appState.selectedPlayerIdx + 1).padStart(2, '0');
    appState.calloutText = `INSPECTING OPERATOR ${slotStr} // ${p.name} DEEP-DIVE TELEMETRY`;
    appState.calloutHighlight = false;
  }
  renderAll();
}

function setSquadView(pushUrl = true) {
  if (appState.players.length === 1 && appState.ingestionMode !== 'spectator_allplayers') {
    appState.soloViewDismissed = true;
  }
  appState.viewMode = 'squad';
  if (pushUrl && window.history && window.history.replaceState) {
    const url = new URL(window.location.href);
    if (url.pathname.includes('player')) {
      window.location.href = '/';
      return;
    }
    url.searchParams.delete('view');
    url.searchParams.delete('slot');
    url.searchParams.delete('player');
    window.history.replaceState({}, '', url.toString());
  }
  appState.calloutText = `SQUAD OVERVIEW // ${appState.players.length} HUMANS VS ${appState.bots.length || 10} BOTS`;
  appState.calloutHighlight = false;
  renderAll();
}

initRouteAndResolutionFromUrl();
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
  const effectiveViewMode = getEffectiveViewMode();
  const soloActive = isSoloClientActive();
  const classes = [
    isCT ? 'human-side-ct' : 'human-side-t',
    `res-${appState.displayRes}`
  ];
  if (effectiveViewMode === 'player') {
    classes.push('view-mode-player');
  }
  if (soloActive) {
    classes.push('solo-client-mode');
  }
  document.body.className = classes.join(' ');

  document.querySelectorAll('.res-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-res') === appState.displayRes);
  });

  const playerViewBtn = document.getElementById('btn-toggle-player-view');
  if (playerViewBtn) {
    playerViewBtn.classList.toggle('active', effectiveViewMode === 'player');
    playerViewBtn.textContent = effectiveViewMode === 'player' ? 'SQUAD VIEW' : (appState.players.length === 1 && appState.ingestionMode !== 'spectator_allplayers' ? 'SOLO VIEW' : 'PLAYER VIEW');
  }

  const squadCount = Math.max(1, appState.players.length);
  const botCount = appState.bots.length || 10;
  document.documentElement.style.setProperty('--active-player-count', String(squadCount));
  document.body.dataset.squadSize = String(squadCount);
  document.body.dataset.squadDensity = squadCount >= 8 ? 'ultra-compact' : squadCount >= 6 ? 'compact' : 'standard';

  document.querySelectorAll('#modal-squad-size-btns button, #quick-squad-size-btns button').forEach(btn => {
    btn.classList.toggle('active', Number(btn.getAttribute('data-size')) === squadCount);
  });

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
  const humanPipsSig = appState.players.map(p => `${p.name}:${p.health}`).join('|');
  if (humanPipsEl.dataset.sig !== humanPipsSig) {
    humanPipsEl.dataset.sig = humanPipsSig;
    humanPipsEl.innerHTML = appState.players.map(p => {
      const aliveClass = p.health <= 0 ? 'dead' : p.health <= 25 ? 'alive low-hp' : 'alive';
      return `<div class="unit-pip ${aliveClass}" title="${p.name}: ${p.health} HP">
        <div class="unit-pip-fill" style="height:${Math.max(0, p.health)}%"></div>
      </div>`;
    }).join('');
  }

  // Bot 10-unit swarm matrix
  const botsAlive = appState.bots.filter(b => b.health > 0).length;
  const botTotalHp = appState.bots.reduce((acc, b) => acc + Math.max(0, b.health), 0);
  document.getElementById('bot-alive-text').textContent = `${botsAlive} / ${botCount}`;
  document.getElementById('bot-total-hp').textContent = `${botTotalHp} HP`;
  document.getElementById('bot-threat-level').textContent =
    botsAlive >= 7 ? 'SWARM SURGE' : botsAlive >= 4 ? 'CONTESTED' : botsAlive > 0 ? 'DEPLETED' : 'WIPED';

  const botPipsEl = document.getElementById('bot-alive-pips');
  const botPipsSig = appState.bots.map(b => `${b.name}:${b.health}`).join('|');
  if (botPipsEl.dataset.sig !== botPipsSig) {
    botPipsEl.dataset.sig = botPipsSig;
    botPipsEl.innerHTML = appState.bots.map(b => {
      const aliveClass = b.health <= 0 ? 'dead' : b.health <= 30 ? 'alive low-hp' : 'alive';
      return `<div class="unit-pip ${aliveClass}" title="${b.name}: ${b.health} HP">
        <div class="unit-pip-fill" style="height:${Math.max(0, b.health)}%"></div>
      </div>`;
    }).join('');
  }

  // Center Clock & Bomb State
  const clockModule = document.getElementById('center-clock-module');
  const phaseBadge = document.getElementById('round-phase-badge');
  const timerDigits = document.getElementById('round-timer-digits');
  const trackFill = document.getElementById('timer-track-fill');
  const defuseHint = document.getElementById('defuse-hint-label');
  const hostageMap = isHostageRescueMap(appState.mapName);

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
      : hostageMap ? 'HOSTAGE RESCUE // MR12 FEED' : 'MR12 STADIUM FEED';
  }

  const calloutEl = document.getElementById('callout-alert-text');
  calloutEl.textContent = appState.calloutText;
  calloutEl.className = `callout-alert-text ${appState.calloutHighlight ? 'highlight' : ''}`;
}

function renderKillfeed() {
  const sig = appState.killfeed.map(k => `${k.id}:${k.attacker}:${k.victim}:${k.weaponName}:${k.isHs}`).join('|');
  if (sig === appState.lastKillfeedSig) return;
  appState.lastKillfeedSig = sig;

  const container = document.getElementById('killfeed-items');
  if (!container) return;

  if (appState.killfeed.length === 0) {
    container.innerHTML = `
      <div class="kill-pill kill-pill-empty">
        <span style="color:var(--text-muted); font-family:var(--font-mono); font-size:11px;">AWAITING FIRST ENGAGEMENT...</span>
      </div>
    `;
    return;
  }

  container.innerHTML = appState.killfeed.map((item, idx) => `
    <div class="kill-pill ${idx === 0 ? 'kill-pill-latest' : ''}">
      <span class="kill-attacker ${item.attackerType}">${item.attacker}</span>
      <span class="kill-weapon-icon" title="${item.weaponName}">${getWeaponKillfeedSvg(item.weaponName)}</span>
      ${item.isHs ? `<span class="kill-hs-icon" title="Headshot">${UTILITY_SVGS.headshot}</span>` : ''}
      <span class="kill-victim ${item.victimType}">${item.victim}</span>
    </div>
  `).join('');
}

function renderPlayersStage() {
  const stageEl = document.getElementById('players-stage-grid');
  if (!stageEl) return;
  const totalRoundBotKills = appState.players.reduce((sum, pl) => sum + Math.max(0, Number(pl.roundKills) || 0), 0);
  const hostageMap = isHostageRescueMap(appState.mapName);

  // Ensure exact number of persistent <article> card elements so animations & transitions never restart or pixel-shift
  while (stageEl.children.length > appState.players.length) {
    stageEl.removeChild(stageEl.lastElementChild);
  }
  while (stageEl.children.length < appState.players.length) {
    const article = document.createElement('article');
    article.className = 'player-stadium-card';
    stageEl.appendChild(article);
  }

  appState.players.forEach((p, idx) => {
    const cardEl = stageEl.children[idx];
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
    const weaponSvg = getWeaponSilhouetteHtml(weapon.id || weapon.name, weapon.skin);
    const clipPct = weapon.clipMax > 0 ? Math.max(0, Math.min(100, (weapon.clip / weapon.clipMax) * 100)) : 100;
    const isLowAmmo = weapon.clipMax > 0 && weapon.clip <= Math.ceil(weapon.clipMax * 0.28);

    const sidearm = p.secondaryWeapon || { name: 'USP-S', clip: 12, reserve: 24 };
    const currentSide = (p.team || appState.humanSide) === 'T' ? 'T' : 'CT';
    const isCtOnHostage = currentSide === 'CT' && hostageMap;
    const kitPillLabel = isCtOnHostage ? 'RESCUE KIT' : 'DEFUSE KIT';
    const kitSlotLabel = isCtOnHostage ? 'RESCUE KIT' : 'DEF KIT';
    const kitIconSvg = isCtOnHostage ? UTILITY_SVGS.rescueKit : UTILITY_SVGS.defuseKit;

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
        ${kitIconSvg}
        <span class="grenade-slot-label">${kitSlotLabel}</span>
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
      else if (p.defuseKit) statusPills.push(`<span class="status-pill defuse-kit">${kitPillLabel}</span>`);
      if (statusPills.length === 0) statusPills.push(`<span class="status-pill alive-ready">COMBAT READY</span>`);
    }

    const kdRatio = (p.kills / Math.max(1, p.deaths)).toFixed(2);
    const playerRoundKills = Math.max(0, Number(p.roundKills) || 0);
    const playerRoundDmg = Math.max(0, Math.round(Number(p.roundDamage) || 0));
    const roundKillSharePct = totalRoundBotKills > 0
      ? Math.min(100, Math.round((playerRoundKills / totalRoundBotKills) * 100))
      : 0;
    const roundDmgProgressPct = Math.max(
      roundKillSharePct,
      Math.min(100, Math.round((playerRoundDmg / 400) * 100))
    );
    const sideClass = currentSide === 'T' ? 'side-t' : 'side-ct';
    const slotCfg = appState.customCallsigns[idx] || DEFAULT_CALLSIGNS[idx] || DEFAULT_CALLSIGNS[0];
    const activeBgId = currentSide === 'T' ? (slotCfg.tBg || 1) : (slotCfg.ctBg || 1);
    const bgUrl = getCardBackgroundUrl(currentSide, activeBgId);

    const now = Date.now();
    const celeb = appState.killCelebrations[idx];
    const isKillFlash = Boolean(celeb && isAlive && now < celeb.expiresAt);
    const celebId = isKillFlash ? String(celeb.startedAt) : '';

    const killBannerHtml = isKillFlash ? `
      <div class="kill-flash-banner" aria-live="polite">
        <div class="kill-flash-top-line">
          <span class="kill-flash-icon">&#9760;</span>
          <span class="kill-flash-headline">${celeb.headline}</span>
          ${celeb.isHs ? `<span class="kill-hs-icon" title="Headshot">${UTILITY_SVGS.headshot}</span>` : ''}
        </div>
        <div class="kill-flash-sub-line">
          <span class="kill-weapon-icon" title="${celeb.weaponName}">${getWeaponKillfeedSvg(celeb.weaponName)}</span>
          <span>&bull;</span>
          <span>FRAGGED ${celeb.victim}</span>
        </div>
      </div>
    ` : '';

    const desiredClassName = `player-stadium-card ${sideClass} ${!isAlive ? 'is-dead' : ''} ${isLowHp ? 'low-health' : ''} ${isFlashed ? 'is-flashed' : ''} ${isBurning ? 'is-burning' : ''} ${isKillFlash ? 'is-kill-flash' : ''}`.replace(/\s+/g, ' ').trim();
    if (cardEl.className !== desiredClassName) {
      cardEl.className = desiredClassName;
    }
    cardEl.id = `player-card-${idx + 1}`;
    if (cardEl.dataset.bgUrl !== bgUrl) {
      cardEl.dataset.bgUrl = bgUrl;
      cardEl.style.setProperty('--card-model-bg', `url('${bgUrl}')`);
    }

    const innerHtml = `
      ${killBannerHtml}
      
      <!-- ZONE 1: OPERATOR IDENTITY & STATUS -->
      <div class="card-zone-identity" data-cycle-bg="${idx}" title="Click portrait background to cycle ${currentSide} Lobby Skin (${activeBgId}/11)">
        <div class="operator-hero-row">
          <div class="operator-name-block">
            <h2 class="operator-callsign" data-edit-callsign="${idx}" title="Click to edit callsign">${p.name}</h2>
            <div class="operator-sub-status">
              ${statusPills.join('')}
              <a href="/player.html?slot=${idx + 1}" class="player-inspect-pill" data-open-player="${idx}" title="Open Individual Player Deep-Dive View (/player.html?slot=${idx + 1})">INSPECT &#8599;</a>
            </div>
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
            <span>RND DMG <strong>${playerRoundDmg}</strong> &bull; KILLS <strong>${playerRoundKills}/${totalRoundBotKills}</strong></span>
          </div>
          <div class="round-dmg-track" title="Round Output: ${playerRoundDmg} DMG | ${playerRoundKills} of ${totalRoundBotKills} Bot Kills (${roundKillSharePct}%)">
            <div class="round-dmg-fill" style="width:${roundDmgProgressPct}%"></div>
          </div>
        </div>
      </div>
    `;

    // Only update card innerHTML when content actually changes; if kill flash is active with the same celebId, preserve the banner animation
    const contentSig = `${celebId}|${p.name}|${p.health}|${trailHp}|${p.armor}|${p.helmet}|${p.flashed}|${p.burning}|${p.hasC4}|${p.defuseKit}|${isCtOnHostage}|${weapon.id}|${weapon.name}|${weapon.skin}|${weapon.clip}|${weapon.reserve}|${p.reloading}|${sidearm.name}|${sidearm.clip}|${sidearm.reserve}|${(p.grenades || []).join(',')}|${p.money}|${p.equipValue}|${p.kills}|${p.deaths}|${p.assists}|${p.adr}|${p.hsPercent}|${playerRoundDmg}|${playerRoundKills}|${totalRoundBotKills}|${activeBgId}`;
    if (cardEl.dataset.contentSig !== contentSig) {
      const hadSameCeleb = isKillFlash && cardEl.dataset.celebId === celebId;
      if (hadSameCeleb) {
        const animDelayMs = Math.max(0, now - celeb.startedAt);
        cardEl.style.setProperty('--kill-anim-delay', `-${animDelayMs}ms`);
      } else {
        cardEl.style.setProperty('--kill-anim-delay', '0ms');
      }
      cardEl.dataset.celebId = celebId;
      cardEl.dataset.contentSig = contentSig;
      cardEl.innerHTML = innerHtml;
    }
  });
}

function renderUltrawideWing() {
  const wingEl = document.getElementById('ultrawide-tactical-wing');
  if (!wingEl) return;
  if (appState.displayRes !== '5120x1440' || getEffectiveViewMode() === 'player') return;

  const botsHtml = appState.bots.map((b, i) => {
    const alive = b.health > 0;
    return `
      <div class="uw-bot-card ${alive ? '' : 'dead'}">
        <div class="uw-bot-top">
          <span class="uw-bot-name">${b.name.replace('BOT ', '')}</span>
          <span class="uw-bot-hp">${alive ? `${b.health} HP` : 'KIA'}</span>
        </div>
        <div class="uw-bot-bar">
          <div class="uw-bot-bar-fill" style="width:${Math.max(0, b.health)}%"></div>
        </div>
        <div style="font-family:var(--font-mono); font-size:9px; color:var(--text-muted); display:flex; justify-content:space-between;">
          <span>UNIT #${String(i + 1).padStart(2, '0')}</span>
          <span>${alive ? `ARMOR ${b.armor}` : 'ELIMINATED'}</span>
        </div>
      </div>
    `;
  }).join('');

  const sortedPlayers = [...appState.players].map((p, idx) => ({ ...p, origIdx: idx }))
    .sort((a, b) => (b.kills * 100 + b.adr) - (a.kills * 100 + a.adr));
  const mvp = sortedPlayers[0] || appState.players[0];
  const mvpIdx = mvp ? mvp.origIdx : 0;
  const currentSide = appState.humanSide === 'T' ? 'T' : 'CT';
  const slotCfg = appState.customCallsigns[mvpIdx] || DEFAULT_CALLSIGNS[0];
  const mvpBgUrl = getCardBackgroundUrl(currentSide, currentSide === 'T' ? slotCfg.tBg : slotCfg.ctBg);
  const mvpKd = mvp ? (mvp.kills / Math.max(1, mvp.deaths)).toFixed(2) : '0.00';

  const lbRowsHtml = sortedPlayers.map((p, rank) => {
    const kd = (p.kills / Math.max(1, p.deaths)).toFixed(2);
    return `
      <div class="uw-lb-row" data-open-player="${p.origIdx}" title="Click to inspect ${p.name}">
        <span class="uw-lb-rank">#${String(rank + 1).padStart(2, '0')}</span>
        <span class="uw-lb-name">${p.name}</span>
        <span class="uw-lb-stat">K/D <strong>${kd}</strong></span>
        <span class="uw-lb-stat">ADR <strong>${p.adr}</strong> &bull; <strong>${p.kills}K</strong></span>
      </div>
    `;
  }).join('');

  wingEl.innerHTML = `
    <div class="uw-panel span-2">
      <div class="uw-panel-header">
        <span class="uw-panel-title">BOT SWARM LIVE TELEMETRY MATRIX (10 UNITS)</span>
        <span class="uw-panel-sub">5120x1440 SUPER ULTRAWIDE COMMAND WING</span>
      </div>
      <div class="uw-bot-grid">${botsHtml}</div>
    </div>

    <div class="uw-panel">
      <div class="uw-panel-header">
        <span class="uw-panel-title">MATCH MVP SPOTLIGHT</span>
        <a href="/player.html?slot=${mvpIdx + 1}" class="player-inspect-pill" data-open-player="${mvpIdx}">DEEP DIVE &#8599;</a>
      </div>
      ${mvp ? `
        <div class="uw-mvp-card">
          <div class="uw-mvp-portrait" style="--mvp-bg: url('${mvpBgUrl}');">
            <span class="uw-mvp-tag">TOP FRAGGER</span>
          </div>
          <div class="uw-mvp-stats">
            <div>
              <div class="uw-panel-sub">SLOT ${String(mvpIdx + 1).padStart(2, '0')} // ${currentSide} OPERATOR</div>
              <div class="uw-mvp-name">${mvp.name}</div>
            </div>
            <div class="stats-grid-4">
              <div class="stat-cell highlight">
                <span class="stat-cell-label">KILLS</span>
                <span class="stat-cell-val">${mvp.kills}</span>
              </div>
              <div class="stat-cell">
                <span class="stat-cell-label">K/D</span>
                <span class="stat-cell-val">${mvpKd}</span>
              </div>
              <div class="stat-cell">
                <span class="stat-cell-label">ADR</span>
                <span class="stat-cell-val">${mvp.adr}</span>
              </div>
              <div class="stat-cell">
                <span class="stat-cell-label">HS%</span>
                <span class="stat-cell-val">${mvp.hsPercent}%</span>
              </div>
            </div>
            <div class="round-dmg-meta">
              <span>ACTIVE WEAPON: <strong>${(mvp.activeWeapon && mvp.activeWeapon.name) || 'RIFLE'}</strong></span>
              <span>ROUND DMG: <strong>${mvp.roundDamage}</strong></span>
            </div>
          </div>
        </div>
      ` : ''}
    </div>

    <div class="uw-panel">
      <div class="uw-panel-header">
        <span class="uw-panel-title">SQUAD IMPACT LEADERBOARD</span>
        <span class="uw-panel-sub">CLICK OPERATOR FOR FULL VIEW</span>
      </div>
      <div class="uw-leaderboard-list">${lbRowsHtml}</div>
    </div>
  `;
}

function renderPlayerDetailView() {
  const detailEl = document.getElementById('player-detail-view');
  if (!detailEl) return;
  if (getEffectiveViewMode() !== 'player') return;

  const soloActive = isSoloClientActive();
  const safeIdx = Math.max(0, Math.min(appState.players.length - 1, appState.selectedPlayerIdx || 0));
  const p = appState.players[safeIdx] || appState.players[0];
  if (!p) return;

  const isAlive = p.health > 0;
  const currentSide = (p.team || appState.humanSide) === 'T' ? 'T' : 'CT';
  const slotCfg = appState.customCallsigns[safeIdx] || DEFAULT_CALLSIGNS[safeIdx] || DEFAULT_CALLSIGNS[0];
  const activeBgId = currentSide === 'T' ? (slotCfg.tBg || 1) : (slotCfg.ctBg || 1);
  const bgList = currentSide === 'T' ? T_CARD_BACKGROUNDS : CT_CARD_BACKGROUNDS;
  const bgItem = bgList.find(b => b.id === Number(activeBgId)) || bgList[0];
  const bgUrl = bgItem.url;

  const weapon = p.activeWeapon || p.primaryWeapon || {
    id: 'ak47',
    name: 'AK-47',
    skin: 'STANDARD ISSUE',
    clip: 30,
    clipMax: 30,
    reserve: 90
  };
  const weaponSvg = getWeaponSilhouetteHtml(weapon.id || weapon.name, weapon.skin);
  const sidearm = p.secondaryWeapon || { id: 'deagle', name: 'Desert Eagle', skin: 'STANDARD', clip: 7, clipMax: 7, reserve: 35 };
  const sidearmSvg = getWeaponSilhouetteHtml(sidearm.id || sidearm.name, sidearm.skin);
  const knife = p.knifeWeapon || { id: 'knife', name: currentSide === 'CT' ? 'CT Tactical Knife' : 'Tactical Knife', skin: 'STANDARD ISSUE', state: 'holstered' };
  const knifeSvg = getWeaponSilhouetteHtml(knife.id || knife.name, knife.skin);
  const hasZeus = Boolean(p.hasZeus);

  const flashedPct = Math.min(100, Math.round(((Number(p.flashed) || 0) / 255) * 100));
  const smokedPct = Math.min(100, Math.round(((Number(p.smoked) || 0) / 255) * 100));
  const burningPct = Math.min(100, Math.round(((Number(p.burning) || 0) / 255) * 100));

  const kdRatio = (p.kills / Math.max(1, p.deaths)).toFixed(2);
  const kpr = (p.kills / Math.max(1, appState.roundNumber)).toFixed(2);
  const survivalPct = Math.max(18, Math.min(96, Math.round(((appState.roundNumber - p.deaths) / Math.max(1, appState.roundNumber)) * 100)));
  const rating2 = (Number(kdRatio) * 0.48 + (p.adr / 100) * 0.44 + (p.hsPercent / 100) * 0.25).toFixed(2);
  const totalDamage = typeof p.totalDamage === 'number' ? p.totalDamage : Math.round((p.adr || 0) * Math.max(1, appState.roundNumber));
  const dmgPerKill = p.kills > 0 ? Math.round(totalDamage / p.kills) : totalDamage;
  const mvps = typeof p.mvps === 'number' ? p.mvps : 0;
  const matchScore = typeof p.score === 'number' ? p.score : (p.kills * 2 + p.assists);
  const activityState = (p.activity || 'playing').toUpperCase();
  const buyTier = p.equipValue >= 3800
    ? 'FULL BUY'
    : p.equipValue >= 2100
      ? 'FORCE / HALF BUY'
      : p.equipValue >= 900
        ? 'LIGHT / PISTOL+'
        : 'ECO / SAVE';

  const gsiClients = (appState.clients && Array.isArray(appState.clients.gsiClients)) ? appState.clients.gsiClients : [];
  const matchedClient = gsiClients.find(c => (p.id && c.steamId === p.id) || c.name === p.name) || gsiClients[0] || null;
  const clientIpLabel = matchedClient ? matchedClient.ip : (appState.mode === 'gsi' ? 'LAN GSI' : 'LOCAL SIM');
  const clientSteamLabel = matchedClient ? matchedClient.steamId : (p.id || 'SIM-OPERATOR-01');
  const clientPackets = matchedClient ? (matchedClient.packetsReceived || 1) : 0;

  // Operator switcher tabs
  const tabsHtml = appState.players.map((op, idx) => `
    <button type="button" class="pd-tab-btn ${idx === safeIdx ? 'active' : ''}" data-select-player="${idx}">
      <span class="pd-tab-hp-dot ${op.health > 0 ? '' : 'dead'}"></span>
      <span>${String(idx + 1).padStart(2, '0')} // ${op.name}</span>
      <span style="font-family:var(--font-mono); font-size:11px; opacity:0.8;">${op.health}HP</span>
    </button>
  `).join('');

  // Grenade belt slots
  const grenadeBeltHtml = [0, 1, 2, 3].map(slotIdx => {
    const gType = p.grenades && p.grenades[slotIdx];
    const labelMap = { smoke: 'SMOKE', flash: 'FLASHBANG', he: 'HE GRENADE', molotov: 'MOLOTOV', decoy: 'DECOY' };
    if (!gType) {
      return `<div class="grenade-slot"><span class="grenade-slot-label">EMPTY</span></div>`;
    }
    return `<div class="grenade-slot occupied">
      ${UTILITY_SVGS[gType] || UTILITY_SVGS.he}
      <span class="grenade-slot-label">${labelMap[gType] || 'UTIL'}</span>
    </div>`;
  }).join('');

  const hostageMap = isHostageRescueMap(appState.mapName);
  const isCtOnHostage = currentSide === 'CT' && hostageMap;
  const kitPillLabel = isCtOnHostage ? 'RESCUE KIT' : 'DEFUSE KIT';
  const kitSlotLabel = isCtOnHostage ? 'RESCUE KIT' : 'DEF KIT';
  const kitIconSvg = isCtOnHostage ? UTILITY_SVGS.rescueKit : UTILITY_SVGS.defuseKit;

  const gearSlotHtml = p.hasC4
    ? `<div class="gear-kit-slot has-c4">${UTILITY_SVGS.c4}<span class="grenade-slot-label">C4 BOMB</span></div>`
    : p.defuseKit
      ? `<div class="gear-kit-slot has-kit">${kitIconSvg}<span class="grenade-slot-label">${kitSlotLabel}</span></div>`
      : `<div class="gear-kit-slot"><span class="grenade-slot-label">NO KIT</span></div>`;

  // Real-time 8-round damage history bars for this operator
  const currRound = Math.max(1, Number(appState.roundNumber) || 1);
  const startRound = currRound <= 8 ? 1 : currRound - 7;
  const roundHistory = Array.from({ length: 8 }, (_, i) => {
    const rNum = startRound + i;
    const isCurrent = rNum === currRound;
    const isFuture = rNum > currRound;
    const histEntry = p.roundHistory && p.roundHistory[rNum];
    let val = 0;
    let kills = 0;
    if (isCurrent) {
      val = Math.max(0, Math.round(Number(p.roundDamage) || 0));
      kills = Math.max(0, Math.round(Number(p.roundKills) || 0));
    } else if (!isFuture && histEntry && typeof histEntry.val === 'number') {
      val = Math.max(0, Math.round(histEntry.val));
      kills = Math.max(0, Math.round(histEntry.kills || 0));
    } else if (!isFuture && appState.mode === 'simulation') {
      const baseDmg = p.adr || 110;
      val = Math.max(24, Math.min(420, Math.round(baseDmg + ((rNum * 37 + safeIdx * 53) % 140) - 55)));
      kills = Math.max(0, Math.min(5, Math.round(val / 105)));
    }
    const pct = isFuture ? 0 : (val === 0 ? 4 : Math.max(10, Math.min(100, Math.round((val / 380) * 100))));
    return { rNum, val, kills, pct, isCurrent, isFuture };
  });

  const roundBarsHtml = roundHistory.map(item => `
    <div class="pd-round-bar-col ${item.isCurrent ? 'current' : ''} ${item.isFuture ? 'future' : ''}" title="${item.isFuture ? `Round ${item.rNum} (Upcoming)` : `Round ${item.rNum}: ${item.val} DMG (${item.kills} Kills)`}">
      <span style="font-family:var(--font-mono); font-size:10px; font-weight:700; color:${item.isCurrent ? 'var(--squad-accent)' : item.isFuture ? 'var(--text-muted)' : 'var(--text-primary)'};">${item.isFuture ? '--' : item.val}</span>
      <div class="pd-round-bar-track">
        <div class="pd-round-bar-fill" style="height:${item.pct}%; ${item.isCurrent ? 'filter: brightness(1.25); box-shadow: 0 0 12px var(--squad-glow);' : item.isFuture ? 'opacity: 0.15;' : ''}"></div>
      </div>
      <span class="pd-round-bar-label" style="${item.isCurrent ? 'color:var(--squad-accent); font-weight:800;' : ''}">R${item.rNum}${!item.isFuture && item.kills > 0 ? ` &bull; ${item.kills}K` : ''}</span>
    </div>
  `).join('');

  const isPersonalEngagement = (k) => {
    if (!k) return false;
    if (k.attacker === p.name || k.victim === p.name) return true;
    if (k.attackerSlot && k.attackerSlot === safeIdx + 1) return true;
    if (k.victimSlot && k.victimSlot === safeIdx + 1) return true;
    if (p.id && (k.attackerId === p.id || k.victimId === p.id)) return true;
    return false;
  };

  // Combine latest squad killfeed with operator's personal engagements so the log updates live on every kill
  const personalFeed = appState.killfeed.filter(isPersonalEngagement);
  const combinedFeed = [];
  const seenLogIds = new Set();
  for (const k of [...appState.killfeed.slice(0, 2), ...personalFeed.slice(0, 3), ...appState.killfeed.slice(0, 4)]) {
    if (k && !seenLogIds.has(k.id)) {
      seenLogIds.add(k.id);
      combinedFeed.push(k);
    }
  }
  // Keep chronological order matching appState.killfeed
  const maxLogItems = soloActive ? 7 : 4;
  const orderedFeed = appState.killfeed.filter(k => seenLogIds.has(k.id)).slice(0, maxLogItems);

  const killLogHtml = orderedFeed.length === 0
    ? `<div class="pd-kill-log-item" style="justify-content:center; color:var(--text-muted);">AWAITING LIVE COMBAT ENGAGEMENTS...</div>`
    : orderedFeed.map(k => {
      const isPersonal = isPersonalEngagement(k);
      const isAttackerHuman = k.attackerType !== 'bot';
      const isVictimHuman = k.victimType === 'human';
      const attackerColor = isAttackerHuman ? 'var(--squad-accent)' : 'var(--bot-accent)';
      const victimColor = isVictimHuman ? 'var(--squad-accent)' : 'var(--bot-accent)';
      const actionVerb = isAttackerHuman ? 'FRAGGED' : 'ELIMINATED';
      return `
        <div class="pd-kill-log-item ${isPersonal ? 'personal-engagement' : ''}" style="${isPersonal ? 'border-color: var(--squad-border); background: rgba(56, 189, 248, 0.08);' : ''}">
          <span style="display:inline-flex; align-items:center; gap:8px;">
            ${isPersonal ? `<span style="font-size:9px; padding:1px 5px; border-radius:3px; background:rgba(56, 189, 248, 0.2); color:var(--squad-accent); font-weight:800;">OP ${String(safeIdx + 1).padStart(2, '0')}</span>` : ''}
            <strong style="color:${attackerColor};">${k.attacker}</strong>
            <span class="kill-weapon-icon" title="${k.weaponName}">${getWeaponKillfeedSvg(k.weaponName)}</span>
            ${k.isHs ? `<span class="kill-hs-icon" title="Headshot">${UTILITY_SVGS.headshot}</span>` : ''}
          </span>
          <span style="color:${victimColor};">${actionVerb} <strong>${k.victim}</strong></span>
        </div>
      `;
    }).join('');

  const botsList = (appState.bots || []).slice(0, 10);
  const aliveBotsCount = botsList.filter(b => b.health > 0).length;
  const botSwarmHtml = botsList.map(b => {
    const botAlive = b.health > 0;
    return `
      <div class="pd-solo-bot-row ${botAlive ? 'alive' : 'dead'}">
        <div class="pd-solo-bot-head">
          <span class="pd-solo-bot-name">${(b.name || 'BOT').replace('BOT ', '')}</span>
          <span class="pd-solo-bot-hp">${botAlive ? `${b.health} HP` : 'KIA'}</span>
        </div>
        <div class="pd-solo-bot-bar">
          <div class="pd-solo-bot-fill" style="width:${Math.max(0, Math.min(100, b.health || 0))}%"></div>
        </div>
      </div>
    `;
  }).join('');

  const standaloneUrl = `/player.html?slot=${safeIdx + 1}`;
  const detailSig = `${soloActive}|${safeIdx}|${appState.roundNumber}|${appState.mapName}|${currentSide}|${activeBgId}|${p.name}|${p.health}|${p.armor}|${p.helmet}|${p.hasC4}|${p.defuseKit}|${p.reloading}|${flashedPct}|${smokedPct}|${burningPct}|${activityState}|${weapon.id}|${weapon.name}|${weapon.skin}|${weapon.clip}|${weapon.reserve}|${sidearm.id}|${sidearm.name}|${sidearm.skin}|${sidearm.clip}|${sidearm.reserve}|${knife.name}|${knife.skin}|${hasZeus}|${(p.grenades || []).join(',')}|${p.money}|${p.equipValue}|${p.kills}|${p.deaths}|${p.assists}|${mvps}|${matchScore}|${p.adr}|${totalDamage}|${p.hsPercent}|${p.roundDamage}|${p.roundKills}|${roundHistory.map(r => `${r.rNum}:${r.val}:${r.kills}`).join(',')}|${orderedFeed.map(k => k.id).join(',')}|${botsList.map(b => `${b.name}:${b.health}`).join(',')}|${clientPackets}|${appState.players.map(op => `${op.name}:${op.health}`).join(',')}`;
  if (detailEl.dataset.detailSig === detailSig) return;
  detailEl.dataset.detailSig = detailSig;

  detailEl.innerHTML = `
    <div class="pd-top-bar">
      <div class="pd-operator-tabs">
        <button type="button" class="ctrl-btn" data-back-squad="true" title="Return to Squad Card View">&larr; ${soloActive ? 'SQUAD CARD VIEW' : 'ALL SQUAD CARDS'}</button>
        ${soloActive ? `<span class="pd-solo-mode-badge">${appState.mode === 'gsi' ? 'SOLO CLIENT TELEMETRY // 1 PC LIVE' : 'SOLO OPERATOR TELEMETRY // 1v10'}</span>` : ''}
        ${tabsHtml}
      </div>
      <div class="pd-url-badge-row">
        ${soloActive ? `<span class="pd-solo-meta-pill">STEAMID: <strong>${clientSteamLabel}</strong></span><span class="pd-solo-meta-pill">LINK: <strong>${clientIpLabel}</strong></span>` : ''}
        <a href="${standaloneUrl}" target="_blank" rel="noopener" class="pd-url-pill" title="Open dedicated URL for ${p.name} in a new window/monitor">
          DEDICATED PLAYER URL: <strong>${standaloneUrl} &#8599;</strong>
        </a>
      </div>
    </div>

    <div class="pd-main-grid ${soloActive ? 'pd-solo-grid' : ''}">
      <!-- LEFT COLUMN: FULL-HEIGHT 9:16 OPERATOR PORTRAIT CARD -->
      <article class="pd-hero-card" style="--card-model-bg: url('${bgUrl}');">
        <div class="pd-hero-top">
          <span class="pd-slot-badge">OPERATOR ${String(safeIdx + 1).padStart(2, '0')} // ${currentSide} FACTION</span>
          <button type="button" class="pd-skin-cycle-btn" data-cycle-bg="${safeIdx}">CYCLE SKIN (${activeBgId}/11)</button>
        </div>

        <div class="pd-hero-bottom">
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <span class="status-pill ${isAlive ? 'alive-ready' : 'dead-tag'}">${isAlive ? 'COMBAT READY // LIVE' : 'ELIMINATED // KIA'}</span>
            ${soloActive ? `<span class="status-pill" style="background:rgba(15,23,42,0.8); border-color:var(--squad-border); color:var(--squad-accent);">${activityState}</span>` : ''}
            ${p.hasC4 ? `<span class="status-pill c4-carrier">C4 CARRIER</span>` : ''}
            ${p.defuseKit ? `<span class="status-pill defuse-kit">${kitPillLabel}</span>` : ''}
            ${hasZeus ? `<span class="status-pill" style="background:rgba(250,204,21,0.16); border-color:rgba(250,204,21,0.5); color:#fde047;">ZEUS x27</span>` : ''}
          </div>
          <h2 class="pd-hero-callsign" data-edit-callsign="${safeIdx}" title="Click to edit callsign">${p.name}</h2>
          <div class="pd-hero-skin-label">${bgItem.label}</div>
        </div>
      </article>

      <!-- CENTER COLUMN: LIVE VITALS, SENSORY STATUS, ARSENAL & ECONOMY -->
      <div class="pd-column">
        <div class="pd-module">
          <div class="pd-module-header">
            <span class="pd-module-title">BIOMETRIC &amp; SENSORY TELEMETRY</span>
            <span class="pd-module-sub">${isAlive ? 'ACTIVE HEARTBEAT LOCKED' : 'FLATLINED THIS ROUND'}</span>
          </div>
          <div class="pd-vitals-big-row">
            <div class="pd-vital-box">
              <div class="pd-vital-num-row">
                <span class="pd-vital-num">${p.health}</span>
                <span class="pd-module-sub">HEALTH POINTS</span>
              </div>
              <div class="hp-bar-outer">
                <div class="hp-bar-current" style="width:${p.health}%"></div>
                <div class="hp-bar-segments-overlay"></div>
              </div>
            </div>
            <div class="pd-vital-box">
              <div class="pd-vital-num-row">
                <span class="pd-vital-num armor">${p.armor}</span>
                <span class="pd-module-sub">${p.helmet ? 'HELMET + KEVLAR' : 'KEVLAR VEST'}</span>
              </div>
              <div class="hp-bar-outer">
                <div class="hp-bar-current" style="width:${p.armor}%; background:var(--squad-accent);"></div>
                <div class="hp-bar-segments-overlay"></div>
              </div>
            </div>
          </div>
          ${soloActive ? `
          <div class="pd-sensory-row">
            <div class="pd-sensory-chip ${flashedPct > 5 ? 'active-flash' : ''}">
              <span class="pd-sensory-label">FLASHED</span>
              <div class="pd-sensory-bar"><div class="pd-sensory-fill flash" style="width:${flashedPct}%"></div></div>
              <span class="pd-sensory-val">${flashedPct}%</span>
            </div>
            <div class="pd-sensory-chip ${smokedPct > 5 ? 'active-smoke' : ''}">
              <span class="pd-sensory-label">SMOKED</span>
              <div class="pd-sensory-bar"><div class="pd-sensory-fill smoke" style="width:${smokedPct}%"></div></div>
              <span class="pd-sensory-val">${smokedPct}%</span>
            </div>
            <div class="pd-sensory-chip ${burningPct > 5 ? 'active-burn' : ''}">
              <span class="pd-sensory-label">BURNING</span>
              <div class="pd-sensory-bar"><div class="pd-sensory-fill burn" style="width:${burningPct}%"></div></div>
              <span class="pd-sensory-val">${burningPct}%</span>
            </div>
          </div>` : ''}
        </div>

        <div class="pd-module fill-space">
          <div class="pd-module-header">
            <span class="pd-module-title">ARSENAL &amp; MAGAZINE TELEMETRY</span>
            <span class="pd-module-sub">${p.reloading ? 'RELOADING MAGAZINE' : 'WEAPON READY'}</span>
          </div>

          <div class="pd-weapon-showcase">
            <div class="weapon-header-row">
              <div class="weapon-name-group">
                <span class="weapon-title">${weapon.name}</span>
                <span class="weapon-skin-sub">SKIN // ${weapon.skin || 'FACTORY ISSUE'}</span>
              </div>
              <div class="ammo-counter-nums">
                <span class="ammo-clip-big">${weapon.clip}</span>
                <span class="ammo-reserve-sub">/ ${weapon.reserve}</span>
              </div>
            </div>
            <div class="pd-weapon-svg-wrap">${weaponSvg}</div>
            <div class="magazine-bullet-track">
              <div class="magazine-bullet-fill" style="width:${weapon.clipMax > 0 ? Math.min(100, (weapon.clip / weapon.clipMax) * 100) : 100}%"></div>
            </div>
          </div>

          <div class="pd-weapon-showcase" style="padding:10px 14px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <div style="min-width:0;">
                <div class="pd-module-sub">SECONDARY SIDEARM</div>
                <div style="font-family:var(--font-display); font-size:22px; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${sidearm.name} <span style="font-family:var(--font-mono); font-size:11px; color:var(--squad-accent);">// ${sidearm.skin || 'ISSUE'}</span></div>
              </div>
              <div style="width:110px; height:36px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${sidearmSvg}</div>
              <div style="font-family:var(--font-mono); font-size:20px; font-weight:800; flex-shrink:0;">${sidearm.clip} <span style="font-size:12px; color:var(--text-secondary);">/ ${sidearm.reserve}</span></div>
            </div>
          </div>

          ${soloActive ? `
          <div class="pd-solo-melee-row">
            <div class="pd-solo-melee-info">
              <span class="pd-module-sub">MELEE // KNIFE</span>
              <span class="pd-solo-melee-name">${knife.name}</span>
            </div>
            <div class="pd-solo-melee-svg">${knifeSvg}</div>
            <span class="pd-solo-melee-skin">${knife.skin || 'STANDARD ISSUE'}</span>
          </div>` : ''}

          <div>
            <div class="pd-module-sub" style="margin-bottom:6px;">TACTICAL UTILITY &amp; ECONOMY ${soloActive ? `// <span style="color:var(--squad-accent);">${buyTier}</span>` : ''}</div>
            <div class="utility-belt-row" style="margin-bottom:10px;">
              ${grenadeBeltHtml}
              ${gearSlotHtml}
            </div>
            <div class="economy-telemetry-row">
              <div class="player-cash-block">
                <span class="cash-label">PLAYER BANK</span>
                <span class="cash-amount">${formatMoney(p.money)}</span>
              </div>
              <div class="equip-val-block">
                EQUIPMENT VALUE <strong>${formatMoney(p.equipValue)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: PRO ANALYTICS MATRIX & ROUND DAMAGE CHART -->
      <div class="pd-column">
        <div class="pd-module">
          <div class="pd-module-header">
            <span class="pd-module-title">PRO COMBAT TELEMETRY MATRIX</span>
            <span class="pd-module-sub">HLTV-STYLE IMPACT RATING ${rating2}</span>
          </div>
          <div class="${soloActive ? 'pd-stats-grid-12' : 'pd-stats-grid-8'}">
            <div class="pd-stat-card accent">
              <span class="pd-stat-label">KILLS</span>
              <span class="pd-stat-val">${p.kills}</span>
            </div>
            <div class="pd-stat-card">
              <span class="pd-stat-label">DEATHS</span>
              <span class="pd-stat-val">${p.deaths}</span>
            </div>
            <div class="pd-stat-card">
              <span class="pd-stat-label">ASSISTS</span>
              <span class="pd-stat-val">${p.assists}</span>
            </div>
            <div class="pd-stat-card accent">
              <span class="pd-stat-label">K/D RATIO</span>
              <span class="pd-stat-val">${kdRatio}</span>
            </div>
            <div class="pd-stat-card accent">
              <span class="pd-stat-label">ADR</span>
              <span class="pd-stat-val">${p.adr}</span>
            </div>
            <div class="pd-stat-card">
              <span class="pd-stat-label">HEADSHOT %</span>
              <span class="pd-stat-val">${p.hsPercent}%</span>
            </div>
            <div class="pd-stat-card">
              <span class="pd-stat-label">KPR</span>
              <span class="pd-stat-val">${kpr}</span>
            </div>
            <div class="pd-stat-card">
              <span class="pd-stat-label">SURVIVAL</span>
              <span class="pd-stat-val">${survivalPct}%</span>
            </div>
            ${soloActive ? `
            <div class="pd-stat-card accent">
              <span class="pd-stat-label">MVPs</span>
              <span class="pd-stat-val">${mvps}</span>
            </div>
            <div class="pd-stat-card">
              <span class="pd-stat-label">SCORE</span>
              <span class="pd-stat-val">${matchScore}</span>
            </div>
            <div class="pd-stat-card">
              <span class="pd-stat-label">TOTAL DMG</span>
              <span class="pd-stat-val">${totalDamage}</span>
            </div>
            <div class="pd-stat-card">
              <span class="pd-stat-label">DMG / KILL</span>
              <span class="pd-stat-val">${dmgPerKill}</span>
            </div>` : ''}
          </div>
        </div>

        <div class="pd-module fill-space">
          <div class="pd-module-header">
            <span class="pd-module-title">ROUND-BY-ROUND DAMAGE OUTPUT</span>
            <span class="pd-module-sub">CURRENT ROUND: ${p.roundDamage} DMG (${p.roundKills}K)</span>
          </div>
          <div class="pd-round-bars">
            ${roundBarsHtml}
          </div>

          ${soloActive ? '' : `
          <div style="margin-top:8px;">
            <div class="pd-module-header" style="margin-bottom:8px;">
              <span class="pd-module-title" style="font-size:18px;">RECENT ENGAGEMENT LOG</span>
              <span class="pd-module-sub">LIVE KILLFEED STREAM</span>
            </div>
            <div class="pd-kill-log-list">
              ${killLogHtml}
            </div>
          </div>`}
        </div>
      </div>

      ${soloActive ? `
      <!-- 4TH COLUMN (SOLO MODE): OPPOSITION BOT SWARM, CLIENT LINK & EXTENDED ENGAGEMENT LOG -->
      <div class="pd-column">
        <div class="pd-module">
          <div class="pd-module-header">
            <span class="pd-module-title">OPPOSITION THREAT MATRIX</span>
            <span class="pd-module-sub">${aliveBotsCount} / ${botsList.length || 10} ALIVE</span>
          </div>
          <div class="pd-solo-bot-grid">
            ${botSwarmHtml}
          </div>
        </div>

        <div class="pd-module fill-space">
          <div class="pd-module-header">
            <span class="pd-module-title">LIVE ENGAGEMENT LOG</span>
            <span class="pd-module-sub">SOLO COMBAT FEED</span>
          </div>
          <div class="pd-kill-log-list pd-solo-kill-log">
            ${killLogHtml}
          </div>
          <div class="pd-solo-client-footer">
            <span>SOURCE: <strong>${appState.mode === 'gsi' ? 'CS2 GSI LIVE' : 'SIMULATION'}</strong></span>
            <span>PACKETS: <strong>${clientPackets}</strong></span>
          </div>
        </div>
      </div>` : ''}
    </div>
  `;
}

function renderAll() {
  renderTopHeader();
  renderKillfeed();
  renderPlayersStage();
  renderUltrawideWing();
  renderPlayerDetailView();
  renderClientsAndLogsPanel();
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

  // Random live combat micro-events (ammo firing, reloads)
  if (Math.random() < 0.35) {
    const alivePlayers = appState.players.filter(p => p.health > 0);
    if (alivePlayers.length > 0) {
      const shooter = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const w = shooter.activeWeapon;
      if (w && w.clipMax > 0 && !shooter.reloading) {
        const shots = Math.min(w.clip, Math.ceil(Math.random() * 3));
        w.clip -= shots;
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
  const prevBotHp = targetBot.health;
  const dmgToBot = announce ? 100 : (45 + Math.floor(Math.random() * 65));
  targetBot.health = Math.max(0, targetBot.health - dmgToBot);
  attacker.roundDamage += Math.min(prevBotHp, dmgToBot);

  if (attacker.activeWeapon && attacker.activeWeapon.clip > 0) {
    attacker.activeWeapon.clip = Math.max(0, attacker.activeWeapon.clip - 3);
  }

  if (targetBot.health === 0) {
    attacker.kills += 1;
    attacker.roundKills = Math.min(10, attacker.roundKills + 1);
    attacker.money = Math.min(16000, attacker.money + 300);
    const isHs = Math.random() < 0.58;
    if (typeof attacker.hsKills === 'number') {
      if (isHs) attacker.hsKills += 1;
    } else {
      attacker.hsKills = Math.round((attacker.kills * (attacker.hsPercent || 50)) / 100) + (isHs ? 1 : 0);
    }

    // Award assist if another teammate is alive and bot was previously chipped or in a crossfire
    const otherHumans = aliveHumans.filter(h => h !== attacker);
    if (otherHumans.length > 0 && (prevBotHp < 100 || Math.random() < 0.35)) {
      const assister = otherHumans[Math.floor(Math.random() * otherHumans.length)];
      assister.assists = (assister.assists || 0) + 1;
    }

    const usedWeapon = attacker.activeWeapon ? attacker.activeWeapon.name : 'AK-47';
    pushKillfeedEvent(
      attacker.name,
      'human',
      usedWeapon,
      targetBot.name,
      'bot',
      isHs,
      '',
      { attackerSlot: attackerIdx + 1, attackerId: attacker.id }
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

  syncPlayerCombatMetrics(attacker, appState.roundNumber);

  // Bot return fire on a human player
  if (Math.random() < 0.55) {
    const victimHuman = aliveHumans[Math.floor(Math.random() * aliveHumans.length)];
    const victimIdx = appState.players.indexOf(victimHuman);
    const hitDmg = 14 + Math.floor(Math.random() * 26);
    victimHuman.health = Math.max(0, victimHuman.health - hitDmg);
    victimHuman.armor = Math.max(0, victimHuman.armor - Math.ceil(hitDmg * 0.35));
    if (victimHuman.health === 0) {
      victimHuman.deaths += 1;
      const botWeapon = appState.botSide === 'T' ? 'AK-47' : 'M4A1-S';
      pushKillfeedEvent(
        targetBot.name,
        'bot',
        botWeapon,
        victimHuman.name,
        'human',
        false,
        '',
        { victimSlot: victimIdx + 1, victimId: victimHuman.id }
      );
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
      p.roundKills = Math.max(p.roundKills || 0, 3);
      p.roundDamage = Math.max(p.roundDamage || 0, 365);
      syncPlayerCombatMetrics(p, appState.roundNumber);
    } else {
      if (p.health > 0) p.deaths = (p.deaths || 0) + 1;
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
  const prevRound = appState.roundNumber;
  const nextRound = (appState.roundNumber % 24) + 1;
  appState.roundNumber = nextRound;
  appState.humanScore += 1;
  appState.roundPhase = 'live';
  appState.roundTimeLeft = 115.0;
  appState.bombTimeLeft = 40.0;
  appState.killCelebrations = {};

  const freshTemplates = createInitialSimSquad(appState.humanSide, appState.targetSquadSize);
  appState.players = freshTemplates.map((tmpl, idx) => {
    const prevP = appState.players[idx];
    if (!prevP) {
      tmpl.health = 100;
      tmpl.armor = 100;
      tmpl.roundKills = 0;
      tmpl.roundDamage = 0;
      syncPlayerCombatMetrics(tmpl, nextRound);
      return tmpl;
    }
    const prevHistory = { ...(prevP.roundHistory || {}) };
    prevHistory[prevRound] = {
      rNum: prevRound,
      val: Math.max(0, Math.round(Number(prevP.roundDamage) || 0)),
      kills: Math.max(0, Math.round(Number(prevP.roundKills) || 0))
    };
    const nextRoundsObs = Math.max(1, (Number(prevP.roundsObserved) || prevRound) + 1);
    const nextCompletedDmg = (typeof prevP.completedDamage === 'number' ? prevP.completedDamage : (prevP.adr || 100) * Math.max(1, prevRound - 1)) +
      Math.max(0, Number(prevP.roundDamage) || 0);

    const updated = {
      ...tmpl,
      name: appState.customCallsigns[idx] ? appState.customCallsigns[idx].name : prevP.name,
      health: 100,
      armor: 100,
      flashed: 0,
      burning: 0,
      reloading: false,
      money: Math.min(16000, (prevP.money || tmpl.money) + 3250),
      kills: prevP.kills,
      deaths: prevP.deaths,
      assists: prevP.assists,
      hsKills: prevP.hsKills,
      completedDamage: nextCompletedDmg,
      roundsObserved: nextRoundsObs,
      adr: prevP.adr,
      hsPercent: prevP.hsPercent,
      roundKills: 0,
      roundDamage: 0,
      roundHistory: prevHistory
    };
    syncPlayerCombatMetrics(updated, nextRound);
    return updated;
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
  const freshTemplates = createInitialSimSquad(appState.humanSide, appState.targetSquadSize);
  appState.players = freshTemplates.map((tmpl, idx) => {
    const prevP = appState.players[idx];
    if (!prevP) return tmpl;
    return {
      ...tmpl,
      name: appState.customCallsigns[idx] ? appState.customCallsigns[idx].name : prevP.name,
      kills: prevP.kills,
      deaths: prevP.deaths,
      assists: prevP.assists,
      hsKills: prevP.hsKills,
      completedDamage: prevP.completedDamage,
      roundsObserved: prevP.roundsObserved,
      adr: prevP.adr,
      hsPercent: prevP.hsPercent,
      roundKills: prevP.roundKills,
      roundDamage: prevP.roundDamage,
      roundHistory: prevP.roundHistory
    };
  });
  appState.calloutText = `FACTION SWAP // ${appState.humanTeamName} NOW ON ${appState.humanSide === 'CT' ? 'COUNTER-TERRORIST' : 'TERRORIST'} SIDE`;
  appState.calloutHighlight = false;
  renderAll();
}

function setSquadSize(newSize) {
  const count = Math.max(1, Math.min(10, Number(newSize) || 5));
  appState.targetSquadSize = count;
  appState.ingestionMode = 'simulation';
  if (count === 1) {
    appState.soloViewDismissed = false;
  }
  appState.players = createInitialSimSquad(appState.humanSide, count);
  appState.damageTrails = appState.players.map(p => p.health);
  if (appState.selectedPlayerIdx >= count) {
    appState.selectedPlayerIdx = count - 1;
  }
  appState.calloutText = `SQUAD FORMAT UPDATED // ${count} HUMAN${count === 1 ? '' : 'S'} VS 10 BOTS (${count}v10)`;
  appState.calloutHighlight = false;

  const sizeBtns = document.querySelectorAll('#modal-squad-size-btns button, #quick-squad-size-btns button');
  sizeBtns.forEach(btn => {
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

  const prevPlayerCount = appState.players.length;
  const prevMode = appState.mode;
  appState.ingestionMode = serverState.ingestionMode || 'multi_client';

  // When switching from demo simulation mode to live GSI mode, clear demo simulation killfeed items
  if (appState.mode !== 'gsi') {
    appState.mode = 'gsi';
    appState.soloViewDismissed = false;
    appState.killfeed = Array.isArray(serverState.killfeed) ? [...serverState.killfeed].slice(0, 8) : [];
    appState.killfeed.forEach(k => {
      if (k && k.id) appState.seenServerKillIds.add(k.id);
    });
  } else if (Array.isArray(serverState.killfeed) && serverState.killfeed.length > 0) {
    // Merge any new server-detected kills into the frontend killfeed ticker
    const newServerItems = [];
    for (const item of serverState.killfeed) {
      if (item && item.id && !appState.seenServerKillIds.has(item.id)) {
        appState.seenServerKillIds.add(item.id);
        newServerItems.push(item);
      }
    }
    if (newServerItems.length > 0) {
      appState.killfeed = [...newServerItems, ...appState.killfeed].slice(0, 8);
    } else if (appState.killfeed.length === 0) {
      appState.killfeed = serverState.killfeed.slice(0, 8);
    }
  }

  const detectedCount = Math.max(1, Math.min(10, serverState.humanPlayers.length));
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

  // Dynamically adapt to the exact number of detected human players (1v10 up to 10v10)
  const baseDefaults = createInitialSimSquad(appState.humanSide, 10);
  const currRound = Math.max(1, Number(appState.roundNumber) || 1);

  appState.players = serverState.humanPlayers.slice(0, 10).map((gp, idx) => {
    const pKey = gp.id || gp.name || `slot-${idx}`;
    const prevK = appState.prevGsiKills[pKey];
    const prevRK = appState.prevGsiRoundKills[pKey];
    const prevHs = appState.prevGsiRoundHs[pKey];
    const prevHp = appState.prevGsiHealth[pKey];

    const rawK = Number(gp.kills || 0);
    const rawD = Number(gp.deaths || 0);
    const rawA = Number(gp.assists || 0);
    const currRK = Number(gp.roundKills || 0);
    const currHs = Number(gp.roundKillHs || 0);
    const currHp = typeof gp.health === 'number' ? gp.health : 100;

    let tracker = appState.gsiPlayerTrackers[pKey];
    if (!tracker) {
      const initialTotalKills = Math.max(rawK, currRK);
      const priorKills = Math.max(0, initialTotalKills - currRK);
      const priorDmgEstimate = priorKills * 95 + rawA * 40;
      tracker = {
        lastRound: currRound,
        roundsObserved: 1,
        kills: initialTotalKills,
        deaths: rawD,
        assists: rawA,
        completedRoundHs: Math.max(0, priorKills > 0 ? Math.round((priorKills * (Number(gp.hsPercent) || 50)) / 100) : 0),
        unconfirmedChipDamage: 0,
        currentRoundDamage: Number(gp.roundDamage) || (currRK * 100),
        completedDamage: priorDmgEstimate,
        lastWeaponId: null,
        lastWeaponClip: null,
        roundHistory: (gp.roundHistory && typeof gp.roundHistory === 'object') ? { ...gp.roundHistory } : {}
      };
      appState.gsiPlayerTrackers[pKey] = tracker;
    }

    // Handle new round transition or match restart
    if (currRound !== tracker.lastRound) {
      if (currRound === 1 && tracker.lastRound > 1 && rawK === 0 && rawD === 0) {
        tracker.roundsObserved = 1;
        tracker.kills = currRK;
        tracker.deaths = rawD;
        tracker.assists = rawA;
        tracker.completedRoundHs = 0;
        tracker.unconfirmedChipDamage = 0;
        tracker.currentRoundDamage = Number(gp.roundDamage) || 0;
        tracker.completedDamage = 0;
        tracker.roundHistory = {};
      } else {
        const prevR = tracker.lastRound;
        const prevRKFinal = Math.max(0, Number(prevRK) || 0);
        const prevDmgFinal = Math.min(1000, Math.max(tracker.currentRoundDamage || 0, prevRKFinal * 100));
        tracker.roundHistory[prevR] = {
          rNum: prevR,
          val: Math.round(prevDmgFinal),
          kills: prevRKFinal
        };
        tracker.completedDamage += prevDmgFinal;
        tracker.completedRoundHs += Math.max(0, Number(prevHs) || 0);
        tracker.roundsObserved += 1;
        tracker.unconfirmedChipDamage = 0;
        tracker.currentRoundDamage = Number(gp.roundDamage) || 0;
        tracker.lastWeaponClip = null;
      }
      tracker.lastRound = currRound;
    }

    // Merge server roundHistory if available
    if (gp.roundHistory && typeof gp.roundHistory === 'object') {
      for (const [rKey, rEntry] of Object.entries(gp.roundHistory)) {
        const rNum = Number(rKey);
        if (rNum > 0 && rNum !== currRound && rEntry && typeof rEntry.val === 'number') {
          tracker.roundHistory[rNum] = { ...rEntry };
        }
      }
    }

    const rkGained = (prevRK !== undefined && currRK > prevRK) ? (currRK - prevRK) : 0;
    const kGained = (prevK !== undefined && rawK > prevK) ? (rawK - prevK) : 0;
    const killsGained = Math.max(rkGained, kGained);

    if (killsGained > 0) {
      tracker.kills = Math.max(rawK, tracker.kills + killsGained, currRK);
      // Confirmed kill absorbs prior chip damage (1 kill = 100 HP in CS2)
      tracker.unconfirmedChipDamage = 0;

      const latestServerKf = Array.isArray(serverState.killfeed)
        ? serverState.killfeed.find(k => k.attackerId === gp.id || k.attacker === gp.name || k.attackerSlot === idx + 1)
        : null;
      const weaponName = (latestServerKf && latestServerKf.weaponName) ||
        (gp.activeWeapon && gp.activeWeapon.name) ||
        (gp.primaryWeapon && gp.primaryWeapon.name) ||
        'RIFLE';
      const isHs = latestServerKf
        ? Boolean(latestServerKf.isHs)
        : Boolean((prevHs !== undefined && currHs > prevHs) || (currRK === 1 && currHs === 1));
      const victimName = (latestServerKf && latestServerKf.victim) ||
        BOT_NAMES[(Math.max(1, currRK) - 1 + idx * 2) % BOT_NAMES.length];

      triggerPlayerKillFlash(idx, {
        victim: victimName,
        weaponName,
        isHs,
        roundKills: Math.max(1, currRK)
      });

      // Fallback: ensure kill is in appState.killfeed even if serverState.killfeed wasn't populated
      const alreadyInFeed = appState.killfeed[0] &&
        appState.killfeed[0].attacker === gp.name &&
        appState.killfeed[0].victim === victimName;
      if (!alreadyInFeed) {
        pushKillfeedEvent(
          gp.name,
          'human',
          weaponName,
          victimName,
          'bot',
          isHs,
          '',
          { attackerSlot: idx + 1, attackerId: gp.id }
        );
      }

      const remainingBots = (serverState.bots || appState.bots).filter(b => b.health > 0).length;
      if (currRK >= 3) {
        appState.calloutText = `MULTI-KILL // ${gp.name} (${currRK}K THIS ROUND) — ${remainingBots} BOTS REMAIN`;
        appState.calloutHighlight = true;
      } else {
        appState.calloutText = `ELIMINATION // ${gp.name} TOOK DOWN ${victimName}${isHs ? ' (HEADSHOT)' : ''} (${remainingBots} BOTS LEFT)`;
        appState.calloutHighlight = false;
      }
    } else {
      tracker.kills = Math.max(rawK, tracker.kills, currRK);
    }

    // Estimate bounded chip damage from active weapon clip consumption when CS2 omits round_totaldmg
    const activeWep = gp.activeWeapon || gp.primaryWeapon;
    if (activeWep && typeof activeWep.clip === 'number') {
      const wepId = activeWep.id || activeWep.name || 'rifle';
      if (
        killsGained === 0 &&
        tracker.lastWeaponId === wepId &&
        typeof tracker.lastWeaponClip === 'number' &&
        activeWep.clip < tracker.lastWeaponClip &&
        appState.roundPhase !== 'freezetime'
      ) {
        const shotsFired = Math.min(8, tracker.lastWeaponClip - activeWep.clip);
        const chipPerBullet = wepId === 'awp' ? 42 : wepId === 'deagle' ? 18 : 8;
        tracker.unconfirmedChipDamage = Math.min(72, (tracker.unconfirmedChipDamage || 0) + shotsFired * chipPerBullet);
      }
      tracker.lastWeaponId = wepId;
      tracker.lastWeaponClip = activeWep.clip;
    }

    if (typeof gp.roundDamage === 'number' && gp.roundDamage > 0) {
      tracker.currentRoundDamage = gp.roundDamage;
    } else {
      tracker.currentRoundDamage = Math.min(1000, currRK * 100 + (tracker.unconfirmedChipDamage || 0));
    }

    if (prevHp !== undefined && prevHp > 0 && currHp <= 0) {
      tracker.deaths = Math.max(rawD, tracker.deaths + 1);
      // Player died: ensure death is reflected in killfeed if not already pushed by server
      const alreadyInFeed = appState.killfeed[0] && appState.killfeed[0].victim === gp.name;
      if (!alreadyInFeed) {
        const botKiller = BOT_NAMES[idx % BOT_NAMES.length];
        const botWeapon = appState.botSide === 'T' ? 'AK-47' : 'M4A1-S';
        pushKillfeedEvent(
          botKiller,
          'bot',
          botWeapon,
          gp.name,
          'human',
          false,
          '',
          { victimSlot: idx + 1, victimId: gp.id }
        );
      }
    } else {
      tracker.deaths = Math.max(rawD, tracker.deaths);
    }

    tracker.assists = Math.max(rawA, tracker.assists);

    appState.prevGsiKills[pKey] = tracker.kills;
    appState.prevGsiRoundKills[pKey] = currRK;
    appState.prevGsiRoundHs[pKey] = currHs;
    appState.prevGsiHealth[pKey] = currHp;

    const liveRoundDamage = Math.round(tracker.currentRoundDamage);
    tracker.roundHistory[currRound] = {
      rNum: currRound,
      val: liveRoundDamage,
      kills: currRK
    };

    const totalMatchDamage = tracker.completedDamage + liveRoundDamage;
    const adrDenominator = (appState.roundPhase === 'freezetime' && currRound > 1 && liveRoundDamage === 0)
      ? Math.max(1, currRound - 1)
      : Math.max(1, currRound);
    const computedAdr = (typeof gp.adr === 'number' && gp.adr > 0)
      ? gp.adr
      : Math.round(totalMatchDamage / adrDenominator);

    const totalHsKills = Math.min(tracker.kills, tracker.completedRoundHs + currHs);
    const computedHsPct = tracker.kills > 0
      ? Math.max(0, Math.min(100, Math.round((totalHsKills / tracker.kills) * 100)))
      : (currRK > 0 ? Math.min(100, Math.round((currHs / currRK) * 100)) : 0);

    return {
      ...baseDefaults[idx],
      ...gp,
      kills: tracker.kills,
      deaths: tracker.deaths,
      assists: tracker.assists,
      roundKills: currRK,
      roundDamage: liveRoundDamage,
      adr: computedAdr,
      hsPercent: computedHsPct,
      roundHistory: { ...tracker.roundHistory }
    };
  });
  appState.targetSquadSize = appState.players.length;
  if (prevMode === 'gsi' && prevPlayerCount > 1 && appState.players.length === 1) {
    appState.soloViewDismissed = false;
  }

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

/* ==========================================================================
   CLIENT LOGGING, AUDIO CHIME & REAL-TIME TOAST NOTIFICATION ENGINE
   ========================================================================== */
let audioCtx = null;

function playNotificationChime(kind = 'connect') {
  if (!appState.notifSoundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';

    if (kind === 'disconnect') {
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.22);
    } else {
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.09); // A5
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.11, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.27);
  } catch (_) {}
}

function formatShortTime(ts = Date.now()) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function pushLocalClientLog({ category = 'system', title, message, timestamp = Date.now() }) {
  const entry = {
    id: `local-${timestamp}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp,
    timeFormatted: formatShortTime(timestamp),
    category,
    title,
    message
  };
  appState.connectionLogs.unshift(entry);
  if (appState.connectionLogs.length > 60) {
    appState.connectionLogs.length = 60;
  }
  return entry;
}

function showToastNotification({ category = 'system', title, message, durationMs = 5500 }) {
  const stack = document.getElementById('toast-stack');
  const timeStr = formatShortTime();

  // Also log to browser developer console for debugging
  const consolePrefix = `[CS2-DASH ${timeStr}] [${category.toUpperCase()}]`;
  if (category.includes('disconnect')) {
    console.warn(`${consolePrefix} ${title} — ${message}`);
  } else {
    console.info(`${consolePrefix} ${title} — ${message}`);
  }

  if (!stack) return;

  const isConnect = category === 'gsi_connect' || category === 'display_connect';
  const isDisconnect = category === 'gsi_disconnect' || category === 'display_disconnect';
  const variantClass = isConnect ? 'toast-connect' : isDisconnect ? 'toast-disconnect' : 'toast-warn';

  const catLabelMap = {
    gsi_connect: 'CS2 GSI CLIENT ONLINE',
    gsi_disconnect: 'CS2 GSI CLIENT OFFLINE',
    display_connect: 'BROADCAST DISPLAY CONNECTED',
    display_disconnect: 'BROADCAST DISPLAY CLOSED',
    cfg_download: 'GSI CONFIG DOWNLOADED',
    system: 'SYSTEM TELEMETRY'
  };

  const toast = document.createElement('div');
  toast.className = `toast-card ${variantClass}`;
  toast.style.setProperty('--toast-duration', `${durationMs}ms`);
  toast.innerHTML = `
    <div class="toast-top-row">
      <span class="toast-category-tag">
        <span class="live-dot" style="background:currentColor;"></span>
        <span>${catLabelMap[category] || 'TELEMETRY EVENT'} &bull; ${timeStr}</span>
      </span>
      <button type="button" class="toast-close-btn" aria-label="Dismiss Notification">&times;</button>
    </div>
    <div class="toast-title">${title}</div>
    <div class="toast-message">${message}</div>
    <div class="toast-progress-bar"></div>
  `;

  const removeToast = () => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  };

  const closeBtn = toast.querySelector('.toast-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', removeToast);
  }

  stack.prepend(toast);
  while (stack.children.length > 4) {
    stack.removeChild(stack.lastElementChild);
  }

  setTimeout(removeToast, durationMs);
}

let lastClientsPanelSig = '';

function renderClientsAndLogsPanel() {
  const gsiCount = (appState.clients && appState.clients.gsiCount) || 0;
  const displayCount = Math.max(1, (appState.clients && appState.clients.displayCount) || 1);
  const gsiClients = (appState.clients && appState.clients.gsiClients) || [];
  const displayClients = (appState.clients && appState.clients.displayClients) || [];

  const dotEl = document.getElementById('client-status-dot');
  if (dotEl) {
    dotEl.className = `live-dot client-status-dot ${
      !appState.sseConnected ? 'offline' : gsiCount > 0 ? 'gsi-active' : 'standby'
    }`;
  }

  const triggerTextEl = document.getElementById('clients-trigger-text');
  if (triggerTextEl) {
    triggerTextEl.textContent = appState.sseConnected
      ? `CLIENTS: ${gsiCount} GSI \u2022 ${displayCount} DISPLAY${displayCount === 1 ? '' : 'S'}`
      : 'SERVER STREAM: RECONNECTING...';
  }

  const unreadBadge = document.getElementById('client-unread-badge');
  if (unreadBadge) {
    if (appState.unreadClientEvents > 0) {
      unreadBadge.hidden = false;
      unreadBadge.textContent = String(appState.unreadClientEvents);
    } else {
      unreadBadge.hidden = true;
    }
  }

  // Avoid unnecessary DOM rebuilds inside the modal if nothing changed
  const sig = JSON.stringify({
    sse: appState.sseConnected,
    gsiClients: gsiClients.map(c => `${c.id}:${c.packetsReceived}:${c.slot}`),
    displayClients: displayClients.map(d => `${d.id}:${d.view}`),
    topLogId: appState.connectionLogs[0] && appState.connectionLogs[0].id,
    logLen: appState.connectionLogs.length
  });
  if (sig === lastClientsPanelSig) return;
  lastClientsPanelSig = sig;

  const gsiCountLabel = document.getElementById('gsi-clients-count-label');
  if (gsiCountLabel) gsiCountLabel.textContent = `${gsiCount} ACTIVE`;

  const displayCountLabel = document.getElementById('display-clients-count-label');
  if (displayCountLabel) displayCountLabel.textContent = `${displayCount} ACTIVE`;

  const gsiListEl = document.getElementById('gsi-clients-list');
  if (gsiListEl) {
    if (gsiClients.length === 0) {
      gsiListEl.innerHTML = `<div class="client-empty-row">No CS2 GSI clients connected yet. Waiting for packets on <code>http://${appState.lanIp}:${appState.port}/gsi</code></div>`;
    } else {
      gsiListEl.innerHTML = gsiClients.map(c => {
        const modeLabel = c.mode === 'spectator_allplayers'
          ? 'SPECTATOR ALLPLAYERS'
          : c.slot ? `SLOT ${String(c.slot).padStart(2, '0')} (${c.team || 'CT'})` : 'MENU / STANDBY';
        return `
          <div class="client-row">
            <div class="client-row-main">
              <span class="client-row-title">${c.name}</span>
              <span class="client-row-sub">IP: ${c.ip} &bull; ${modeLabel}</span>
            </div>
            <div class="client-row-meta">
              <div>ONLINE</div>
              <div style="color:var(--text-secondary);">${c.packetsReceived} PKTS</div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const displayListEl = document.getElementById('display-clients-list');
  if (displayListEl) {
    if (displayClients.length === 0) {
      displayListEl.innerHTML = `<div class="client-empty-row">Connecting to SSE broadcast stream...</div>`;
    } else {
      displayListEl.innerHTML = displayClients.map(d => {
        const isSelf = d.id === appState.selfClientId;
        return `
          <div class="client-row display-row">
            <div class="client-row-main">
              <span class="client-row-title">${d.view}${isSelf ? ' (YOU)' : ''}</span>
              <span class="client-row-sub">IP: ${d.ip} &bull; ID: ${d.id}</span>
            </div>
            <div class="client-row-meta" style="color:var(--squad-accent);">
              LIVE SSE
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const logFeedEl = document.getElementById('connection-log-feed');
  if (logFeedEl) {
    if (appState.connectionLogs.length === 0) {
      logFeedEl.innerHTML = `<div class="client-empty-row">No connection events logged in this session.</div>`;
    } else {
      const badgeMap = {
        gsi_connect: 'GSI JOIN',
        gsi_disconnect: 'GSI DROP',
        display_connect: 'HUD JOIN',
        display_disconnect: 'HUD LEFT',
        cfg_download: 'CFG DL',
        system: 'SYSTEM'
      };
      logFeedEl.innerHTML = appState.connectionLogs.map(entry => {
        const tStr = entry.timeFormatted ? entry.timeFormatted.split(' ').pop() : formatShortTime(entry.timestamp);
        return `
          <div class="log-entry-row cat-${entry.category || 'system'}">
            <span class="log-time">${tStr}</span>
            <span class="log-badge">${badgeMap[entry.category] || 'EVENT'}</span>
            <span class="log-text"><strong>${entry.title}</strong> &mdash; ${entry.message}</span>
          </div>
        `;
      }).join('');
    }
  }
}

function connectSse() {
  if (typeof EventSource === 'undefined') return;
  try {
    const viewQuery = `?view=${encodeURIComponent(appState.viewMode)}&slot=${encodeURIComponent(appState.selectedPlayerIdx + 1)}`;
    const es = new EventSource(`/events${viewQuery}`);

    es.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        if (payload.lanIp) {
          appState.lanIp = payload.lanIp;
          appState.port = payload.port || 3000;
          updateGsiConfigModalText();
        }
        if (payload.clients) {
          appState.clients = payload.clients;
        }
        if (Array.isArray(payload.logs) && payload.logs.length > 0 && appState.connectionLogs.length === 0) {
          appState.connectionLogs = payload.logs;
        }

        if (payload.type === 'connected') {
          const wasDisconnected = !appState.sseConnected;
          appState.sseConnected = true;
          if (payload.clientId) {
            appState.selfClientId = payload.clientId;
          }
          if (wasDisconnected) {
            const gsiCount = (payload.clients && payload.clients.gsiCount) || 0;
            const dispCount = (payload.clients && payload.clients.displayCount) || 1;
            showToastNotification({
              category: 'display_connect',
              title: 'TELEMETRY STREAM CONNECTED',
              message: `Connected to server (${appState.lanIp}:${appState.port}) — ${gsiCount} CS2 GSI PC(s), ${dispCount} Display(s) online`,
              durationMs: 4200
            });
          }
          if (payload.state) {
            applyServerGsiState(payload.state);
          }
          renderClientsAndLogsPanel();
          return;
        }

        if (payload.type === 'client_event' && payload.event) {
          const ev = payload.event;
          if (Array.isArray(payload.logs)) {
            appState.connectionLogs = payload.logs;
          } else {
            appState.connectionLogs.unshift(ev);
          }

          // Avoid duplicate toast for our own initial SSE connect (already handled above)
          const isOwnDisplayConnect =
            ev.category === 'display_connect' &&
            ev.meta &&
            ev.meta.display &&
            ev.meta.display.id === appState.selfClientId;

          if (!isOwnDisplayConnect) {
            const clientsContainer = document.getElementById('clients-hover-container');
            if (!clientsContainer || !clientsContainer.classList.contains('pinned')) {
              appState.unreadClientEvents += 1;
            }

            appState.calloutText = `${ev.title} // ${ev.message}`;
            appState.calloutHighlight = ev.category === 'gsi_connect' || ev.category === 'gsi_disconnect';

            if (ev.category === 'gsi_connect' || ev.category === 'display_connect' || ev.category === 'cfg_download') {
              playNotificationChime('connect');
            } else if (ev.category === 'gsi_disconnect' || ev.category === 'display_disconnect') {
              playNotificationChime('disconnect');
            }

            showToastNotification({
              category: ev.category,
              title: ev.title,
              message: ev.message,
              durationMs: ev.category.startsWith('gsi_') ? 6500 : 4800
            });
          }

          renderAll();
          return;
        }

        if (payload.state) {
          applyServerGsiState(payload.state);
        }
        renderClientsAndLogsPanel();
      } catch (_) {}
    };

    es.onerror = () => {
      if (appState.sseConnected) {
        appState.sseConnected = false;
        pushLocalClientLog({
          category: 'display_disconnect',
          title: 'SERVER STREAM INTERRUPTED',
          message: 'Lost SSE connection to broadcast server — attempting automatic reconnect...'
        });
        playNotificationChime('disconnect');
        showToastNotification({
          category: 'display_disconnect',
          title: 'SERVER CONNECTION LOST',
          message: 'Attempting automatic reconnect to /events...',
          durationMs: 5000
        });
        renderClientsAndLogsPanel();
      }
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
      if (Array.isArray(parsed) && parsed.length >= 1) {
        appState.customCallsigns = DEFAULT_CALLSIGNS.map((def, i) => {
          const item = parsed[i];
          if (!item) return { ...def };
          return {
            name: item.name || def.name,
            ctBg: Number(item.ctBg) || def.ctBg,
            tBg: Number(item.tBg) || def.tBg
          };
        });
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
    const slotStr = String(idx + 1).padStart(2, '0');
    const ctBgOptions = CT_CARD_BACKGROUNDS.map(bg =>
      `<option value="${bg.id}" ${Number(c.ctBg || DEFAULT_CALLSIGNS[idx].ctBg) === bg.id ? 'selected' : ''}>${bg.label}</option>`
    ).join('');

    const tBgOptions = T_CARD_BACKGROUNDS.map(bg =>
      `<option value="${bg.id}" ${Number(c.tBg || DEFAULT_CALLSIGNS[idx].tBg) === bg.id ? 'selected' : ''}>${bg.label}</option>`
    ).join('');

    return `
      <div class="roster-slot-card">
        <div class="roster-input-group">
          <label for="callsign-input-${idx}">OPERATOR ${slotStr} CALLSIGN</label>
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
        <a href="/player.html?slot=${idx + 1}" target="_blank" rel="noopener" class="ctrl-btn" style="text-decoration:none; justify-content:center; margin-top:2px; font-size:10px;">
          OPEN /player.html?slot=${idx + 1} &#8599;
        </a>
      </div>
    `;
  }).join('');

  appState.customCallsigns.forEach((_, idx) => {
    const nameInput = document.getElementById(`callsign-input-${idx}`);
    const ctBgSelect = document.getElementById(`ct-bg-select-${idx}`);
    const tBgSelect = document.getElementById(`t-bg-select-${idx}`);

    nameInput.addEventListener('input', (e) => {
      const slotStr = String(idx + 1).padStart(2, '0');
      const val = e.target.value.trim().toUpperCase() || `OP ${slotStr}`;
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
  const slotStr = String(slotIdx + 1).padStart(2, '0');
  const isT = appState.humanSide === 'T';
  if (isT) {
    cfg.tBg = ((Number(cfg.tBg) || 1) % 11) + 1;
    const sel = document.getElementById(`t-bg-select-${slotIdx}`);
    if (sel) sel.value = String(cfg.tBg);
    const skinInfo = T_CARD_BACKGROUNDS.find(b => b.id === cfg.tBg);
    appState.calloutText = `OP ${slotStr} (${cfg.name}) T SKIN -> ${skinInfo ? skinInfo.label : cfg.tBg}`;
  } else {
    cfg.ctBg = ((Number(cfg.ctBg) || 1) % 11) + 1;
    const sel = document.getElementById(`ct-bg-select-${slotIdx}`);
    if (sel) sel.value = String(cfg.ctBg);
    const skinInfo = CT_CARD_BACKGROUNDS.find(b => b.id === cfg.ctBg);
    appState.calloutText = `OP ${slotStr} (${cfg.name}) CT SKIN -> ${skinInfo ? skinInfo.label : cfg.ctBg}`;
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

  // Delegate clicks on player card callsigns, inspect links, or skin cyclers
  const stageGrid = document.getElementById('players-stage-grid');
  if (stageGrid) {
    stageGrid.addEventListener('click', (e) => {
      const openPlayerEl = e.target.closest('[data-open-player]');
      if (openPlayerEl) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        const idx = Number(openPlayerEl.getAttribute('data-open-player')) || 0;
        openPlayerDetailView(idx);
        return;
      }
      const callsignEl = e.target.closest('[data-edit-callsign]');
      if (callsignEl) {
        const idx = Number(callsignEl.getAttribute('data-edit-callsign'));
        modal.classList.add('open');
        const inp = document.getElementById(`callsign-input-${idx}`);
        if (inp) { inp.focus(); inp.select(); }
        return;
      }
      const cycleEl = e.target.closest('[data-cycle-bg]');
      if (cycleEl) {
        const idx = Number(cycleEl.getAttribute('data-cycle-bg'));
        cyclePlayerCardSkin(idx);
      }
    });
  }

  // Delegate clicks inside 32:9 Ultrawide Tactical Wing
  const uwWing = document.getElementById('ultrawide-tactical-wing');
  if (uwWing) {
    uwWing.addEventListener('click', (e) => {
      const openPlayerEl = e.target.closest('[data-open-player]');
      if (openPlayerEl) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        const idx = Number(openPlayerEl.getAttribute('data-open-player')) || 0;
        openPlayerDetailView(idx);
      }
    });
  }

  // Delegate clicks inside Individual Player Deep-Dive View
  const detailView = document.getElementById('player-detail-view');
  if (detailView) {
    detailView.addEventListener('click', (e) => {
      const backBtn = e.target.closest('[data-back-squad]');
      if (backBtn) {
        setSquadView();
        return;
      }
      const selectBtn = e.target.closest('[data-select-player]');
      if (selectBtn) {
        const idx = Number(selectBtn.getAttribute('data-select-player')) || 0;
        openPlayerDetailView(idx);
        return;
      }
      const cycleBtn = e.target.closest('[data-cycle-bg]');
      if (cycleBtn) {
        const idx = Number(cycleBtn.getAttribute('data-cycle-bg')) || 0;
        cyclePlayerCardSkin(idx);
        return;
      }
      const editCallsign = e.target.closest('[data-edit-callsign]');
      if (editCallsign) {
        const idx = Number(editCallsign.getAttribute('data-edit-callsign')) || 0;
        modal.classList.add('open');
        const inp = document.getElementById(`callsign-input-${idx}`);
        if (inp) { inp.focus(); inp.select(); }
      }
    });
  }

  const btnPlayerView = document.getElementById('btn-toggle-player-view');
  if (btnPlayerView) {
    btnPlayerView.addEventListener('click', () => {
      if (getEffectiveViewMode() === 'player') {
        setSquadView();
      } else {
        openPlayerDetailView(appState.selectedPlayerIdx || 0);
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
      const nextSize = (appState.players.length % 10) + 1;
      setSquadSize(nextSize);
    });
  }

  document.querySelectorAll('#modal-squad-size-btns button, #quick-squad-size-btns button').forEach(btn => {
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

  // Bind 1080p, 1440p, and 5120x1440 Fullscreen buttons
  document.querySelectorAll('.res-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const resMode = btn.getAttribute('data-res') || '1080p';
      setDisplayResolution(resMode, true);
    });
  });

  const simHoverContainer = document.getElementById('sim-hover-container');
  const simHoverTrigger = document.getElementById('sim-hover-trigger');
  if (simHoverTrigger && simHoverContainer) {
    simHoverTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      simHoverContainer.classList.toggle('pinned');
    });
    document.addEventListener('click', (e) => {
      if (!simHoverContainer.contains(e.target)) {
        simHoverContainer.classList.remove('pinned');
      }
    });
  }

  const clientsHoverContainer = document.getElementById('clients-hover-container');
  const clientsHoverTrigger = document.getElementById('clients-hover-trigger');
  if (clientsHoverTrigger && clientsHoverContainer) {
    clientsHoverContainer.addEventListener('mouseenter', () => {
      if (appState.unreadClientEvents > 0) {
        appState.unreadClientEvents = 0;
        renderClientsAndLogsPanel();
      }
    });
    clientsHoverTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      appState.unreadClientEvents = 0;
      clientsHoverContainer.classList.toggle('pinned');
      renderClientsAndLogsPanel();
    });
    document.addEventListener('click', (e) => {
      if (!clientsHoverContainer.contains(e.target)) {
        clientsHoverContainer.classList.remove('pinned');
      }
    });
  }

  const btnToggleSound = document.getElementById('btn-toggle-notif-sound');
  if (btnToggleSound) {
    btnToggleSound.addEventListener('click', () => {
      appState.notifSoundEnabled = !appState.notifSoundEnabled;
      btnToggleSound.textContent = appState.notifSoundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
      btnToggleSound.classList.toggle('active', appState.notifSoundEnabled);
      if (appState.notifSoundEnabled) {
        playNotificationChime('connect');
      }
    });
  }

  const btnTestNotif = document.getElementById('btn-test-client-notif');
  if (btnTestNotif) {
    btnTestNotif.addEventListener('click', () => {
      fetch('/api/test-notification', { method: 'POST' }).catch(() => {
        showToastNotification({
          category: 'gsi_connect',
          title: 'CS2 CLIENT CONNECTED // VORTEX',
          message: 'Simulated Operator VORTEX (127.0.0.1) connected on Slot 01'
        });
      });
    });
  }

  const btnResetClients = document.getElementById('btn-reset-clients');
  if (btnResetClients) {
    btnResetClients.addEventListener('click', () => {
      fetch('/api/reset', { method: 'POST' }).catch(() => {});
    });
  }

  const btnClearLogs = document.getElementById('btn-clear-client-logs');
  if (btnClearLogs) {
    btnClearLogs.addEventListener('click', () => {
      appState.connectionLogs = [];
      appState.unreadClientEvents = 0;
      lastClientsPanelSig = '';
      renderClientsAndLogsPanel();
    });
  }

  const legacyFsBtn = document.getElementById('btn-fullscreen');
  if (legacyFsBtn) {
    legacyFsBtn.addEventListener('click', () => {
      setDisplayResolution(appState.displayRes || '1080p', true);
    });
  }

  const btnOpenTrends = document.getElementById('btn-open-trends');
  const btnCloseTrends = document.getElementById('btn-close-trends');
  const trendsModal = document.getElementById('trends-modal');
  const trendsPlayerSelect = document.getElementById('trends-player-select');
  const btnSnapshotTrends = document.getElementById('btn-snapshot-trends');
  const btnClearTrends = document.getElementById('btn-clear-trends');

  if (btnOpenTrends && trendsModal) {
    btnOpenTrends.addEventListener('click', () => {
      trendsModal.hidden = false;
      const defaultPlayer = (appState.players.length === 1 && appState.players[0])
        ? (appState.players[0].id || appState.players[0].name || 'all')
        : 'all';
      fetchAndRenderTrends(trendsPlayerSelect && trendsPlayerSelect.value ? trendsPlayerSelect.value : defaultPlayer);
    });
  }

  if (btnCloseTrends && trendsModal) {
    btnCloseTrends.addEventListener('click', () => {
      trendsModal.hidden = true;
    });
  }

  if (trendsModal) {
    trendsModal.addEventListener('click', (e) => {
      if (e.target === trendsModal) {
        trendsModal.hidden = true;
      }
    });
  }

  if (trendsPlayerSelect) {
    trendsPlayerSelect.addEventListener('change', () => {
      fetchAndRenderTrends(trendsPlayerSelect.value);
    });
  }

  if (btnSnapshotTrends) {
    btnSnapshotTrends.addEventListener('click', async () => {
      try {
        const payload = {
          map: appState.mapName,
          mode: appState.mode,
          teamSide: appState.humanSide,
          humanScore: appState.humanScore,
          botScore: appState.botScore,
          round: appState.roundNumber,
          players: appState.players.map(p => ({
            id: p.id || p.name,
            name: p.name,
            team: p.team || appState.humanSide,
            kills: p.kills,
            deaths: p.deaths,
            assists: p.assists,
            adr: p.adr,
            hsPercent: p.hsPercent,
            mvps: p.mvps || 0,
            score: p.score,
            totalDamage: p.totalDamage
          }))
        };
        const resp = await fetch('/api/trends/snapshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          showToastNotification({
            category: 'system',
            title: 'SNAPSHOT RECORDED',
            message: `Archived ${appState.mapName.toUpperCase()} (${appState.humanScore}-${appState.botScore}) to performance history`
          });
          fetchAndRenderTrends(trendsPlayerSelect ? trendsPlayerSelect.value : 'all');
        }
      } catch (_) {}
    });
  }

  if (btnClearTrends) {
    btnClearTrends.addEventListener('click', async () => {
      try {
        await fetch('/api/trends/clear', { method: 'POST' });
        fetchAndRenderTrends('all');
      } catch (_) {}
    });
  }
}

/* ==========================================================================
   PERFORMANCE TRENDS OVER TIME (SVG CHARTS & HISTORY TABLE)
   ========================================================================== */
function buildDualTrendSvg(series, seriesA, seriesB) {
  if (!series || series.length === 0) {
    return `<div class="trends-empty">No recorded sessions yet. Complete a match or click <strong>RECORD SNAPSHOT</strong> to start tracking performance over time.</div>`;
  }

  const W = 540;
  const H = 175;
  const PAD_L = 36;
  const PAD_R = 16;
  const PAD_T = 16;
  const PAD_B = 26;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const valsA = series.map(s => Number(seriesA.getValue(s)) || 0);
  const valsB = series.map(s => Number(seriesB.getValue(s)) || 0);
  const maxVal = Math.max(10, ...valsA, ...valsB) * 1.15;

  const toX = (idx) => series.length === 1 ? PAD_L + plotW / 2 : PAD_L + (idx / (series.length - 1)) * plotW;
  const toY = (val) => PAD_T + plotH - Math.min(1, Math.max(0, val / maxVal)) * plotH;

  const pointsA = valsA.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  const pointsB = valsB.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  const areaA = series.length > 1
    ? `${PAD_L},${PAD_T + plotH} ${pointsA} ${toX(series.length - 1).toFixed(1)},${PAD_T + plotH}`
    : '';

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(frac => {
    const y = (PAD_T + plotH * (1 - frac)).toFixed(1);
    const label = Math.round(maxVal * frac);
    return `
      <line x1="${PAD_L}" y1="${y}" x2="${W - PAD_R}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3 3"/>
      <text x="${PAD_L - 6}" y="${Number(y) + 3}" text-anchor="end" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="9">${label}</text>
    `;
  }).join('');

  const dotsA = valsA.map((v, i) => `
    <circle cx="${toX(i).toFixed(1)}" cy="${toY(v).toFixed(1)}" r="3.5" fill="${seriesA.color}" stroke="#070a10" stroke-width="1.5">
      <title>${series[i].map} (${series[i].timeFormatted}): ${seriesA.label} ${seriesA.format ? seriesA.format(series[i]) : v}</title>
    </circle>
  `).join('');

  const dotsB = valsB.map((v, i) => `
    <circle cx="${toX(i).toFixed(1)}" cy="${toY(v).toFixed(1)}" r="3" fill="${seriesB.color}" stroke="#070a10" stroke-width="1.2">
      <title>${series[i].map} (${series[i].timeFormatted}): ${seriesB.label} ${seriesB.format ? seriesB.format(series[i]) : v}</title>
    </circle>
  `).join('');

  const xLabels = series.map((s, i) => {
    if (series.length > 8 && i % Math.ceil(series.length / 6) !== 0 && i !== series.length - 1) return '';
    return `<text x="${toX(i).toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="9">M${i + 1}</text>`;
  }).join('');

  return `
    <svg viewBox="0 0 ${W} ${H}" class="trends-svg-chart" preserveAspectRatio="none">
      ${gridLines}
      ${areaA ? `<polygon points="${areaA}" fill="${seriesA.color}" fill-opacity="0.12"/>` : ''}
      ${series.length > 1 ? `<polyline fill="none" stroke="${seriesA.color}" stroke-width="2.4" points="${pointsA}"/>` : ''}
      ${series.length > 1 ? `<polyline fill="none" stroke="${seriesB.color}" stroke-width="2" stroke-dasharray="4 3" points="${pointsB}"/>` : ''}
      ${dotsA}
      ${dotsB}
      ${xLabels}
    </svg>
  `;
}

async function fetchAndRenderTrends(selectedPlayer = 'all') {
  const kpiEl = document.getElementById('trends-kpi-strip');
  const chart1El = document.getElementById('trends-chart-adr-rating');
  const chart2El = document.getElementById('trends-chart-kd-hs');
  const tbodyEl = document.getElementById('trends-history-tbody');
  const selectEl = document.getElementById('trends-player-select');
  if (!kpiEl || !chart1El || !chart2El || !tbodyEl) return;

  try {
    const resp = await fetch(`/api/trends?player=${encodeURIComponent(selectedPlayer)}&limit=30`);
    const data = await resp.json();

    if (selectEl) {
      const prevVal = selectedPlayer || selectEl.value || 'all';
      const opts = [`<option value="all">ALL / SQUAD AVERAGE</option>`].concat(
        (data.players || []).map(pl => `<option value="${pl.key}">${pl.name} (${pl.matches} matches)</option>`)
      );
      selectEl.innerHTML = opts.join('');
      const hasMatch = Array.from(selectEl.options).some(o => o.value === prevVal);
      selectEl.value = hasMatch ? prevVal : 'all';
    }

    const s = data.summary || {};
    const fmtDelta = (val, suffix = '') => {
      if (!val) return `<span class="trend-delta flat">--</span>`;
      const up = val > 0;
      return `<span class="trend-delta ${up ? 'up' : 'down'}">${up ? '+' : ''}${val}${suffix} ${up ? '&#9650;' : '&#9660;'}</span>`;
    };

    kpiEl.innerHTML = `
      <div class="trend-kpi-card">
        <span class="trend-kpi-label">MATCHES TRACKED</span>
        <span class="trend-kpi-val">${s.matches || 0}</span>
        <span class="trend-kpi-sub">${s.wins || 0} WINS (${s.winRate || 0}% WR)</span>
      </div>
      <div class="trend-kpi-card accent">
        <span class="trend-kpi-label">AVG ADR</span>
        <span class="trend-kpi-val">${s.avgAdr || 0}</span>
        <span class="trend-kpi-sub">RECENT DELTA ${fmtDelta(s.adrDelta)}</span>
      </div>
      <div class="trend-kpi-card accent">
        <span class="trend-kpi-label">AVG K/D RATIO</span>
        <span class="trend-kpi-val">${(s.avgKd || 0).toFixed ? Number(s.avgKd || 0).toFixed(2) : s.avgKd || '0.00'}</span>
        <span class="trend-kpi-sub">RECENT DELTA ${fmtDelta(s.kdDelta)}</span>
      </div>
      <div class="trend-kpi-card">
        <span class="trend-kpi-label">AVG HEADSHOT %</span>
        <span class="trend-kpi-val">${s.avgHs || 0}%</span>
        <span class="trend-kpi-sub">PEAK ADR: ${s.bestAdr || 0}</span>
      </div>
      <div class="trend-kpi-card accent">
        <span class="trend-kpi-label">AVG RATING</span>
        <span class="trend-kpi-val">${Number(s.avgRating || 0).toFixed(2)}</span>
        <span class="trend-kpi-sub">RECENT DELTA ${fmtDelta(s.ratingDelta)}</span>
      </div>
    `;

    const series = data.series || [];
    chart1El.innerHTML = buildDualTrendSvg(
      series,
      { label: 'ADR', color: '#38bdf8', getValue: (pt) => pt.metrics.adr, format: (pt) => pt.metrics.adr },
      { label: 'Rating', color: '#facc15', getValue: (pt) => Math.round(pt.metrics.rating * 100), format: (pt) => pt.metrics.rating }
    );
    chart2El.innerHTML = buildDualTrendSvg(
      series,
      { label: 'K/D x50', color: '#22c55e', getValue: (pt) => Math.round(pt.metrics.kd * 50), format: (pt) => pt.metrics.kd },
      { label: 'HS%', color: '#f472b6', getValue: (pt) => pt.metrics.hsPercent, format: (pt) => `${pt.metrics.hsPercent}%` }
    );

    if (series.length === 0) {
      tbodyEl.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--text-muted); padding:18px;">No match sessions archived yet.</td></tr>`;
    } else {
      tbodyEl.innerHTML = [...series].reverse().map(pt => {
        const m = pt.metrics;
        const resClass = pt.result === 'WIN' ? 'win' : pt.result === 'LOSS' ? 'loss' : 'tie';
        return `
          <tr>
            <td>${pt.timeFormatted}</td>
            <td><strong>${String(pt.map || '').toUpperCase()}</strong></td>
            <td>${pt.humanScore} - ${pt.botScore}</td>
            <td><span class="trend-res-pill ${resClass}">${pt.result}</span></td>
            <td>${m.kills} / ${m.deaths} / ${m.assists}</td>
            <td>${Number(m.kd || 0).toFixed(2)}</td>
            <td style="color:var(--squad-accent); font-weight:700;">${m.adr}</td>
            <td>${m.hsPercent}%</td>
            <td style="font-weight:700;">${Number(m.rating || 0).toFixed(2)}</td>
          </tr>
        `;
      }).join('');
    }
  } catch (err) {
    kpiEl.innerHTML = `<div class="trends-empty">Failed to load trend history.</div>`;
  }
}

// Boot Dashboard
initSimulationState();
initRosterEditor();
updateGsiConfigModalText();
bindControls();
renderAll();
connectSse();
