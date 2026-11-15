/* ==========================================================================
   CS2 LIVE TACTICAL RADAR / MINIMAP CALIBRATION & VECTOR BLUEPRINTS
   ========================================================================== */
(function () {
  const CS2_RADAR_MAPS = {
    de_mirage: {
      label: 'DE_MIRAGE',
      pos_x: -3230,
      pos_y: 1713,
      scale: 5.0,
      sites: [
        { label: 'A', x: 58, y: 74, kind: 'site' },
        { label: 'B', x: 24, y: 27, kind: 'site' },
        { label: 'MID', x: 52, y: 48, kind: 'callout' },
        { label: 'CT', x: 28, y: 76, kind: 'spawn' },
        { label: 'T', x: 84, y: 36, kind: 'spawn' }
      ],
      geometry: `
        <path d="M18 16H42V38H32V68H68V86H18V64H26V38H18V16Z" fill="rgba(56,189,248,0.06)" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>
        <path d="M42 26H78V48H62V68H48V50H36V38H42V26Z" fill="rgba(255,255,255,0.04)" stroke="rgba(148,163,184,0.3)" stroke-width="1.1"/>
        <rect x="52" y="66" width="16" height="16" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
        <rect x="18" y="20" width="15" height="15" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
      `
    },
    de_dust2: {
      label: 'DE_DUST2',
      pos_x: -2476,
      pos_y: 3239,
      scale: 4.4,
      sites: [
        { label: 'A', x: 75, y: 24, kind: 'site' },
        { label: 'B', x: 20, y: 24, kind: 'site' },
        { label: 'MID', x: 47, y: 48, kind: 'callout' },
        { label: 'CT', x: 52, y: 20, kind: 'spawn' },
        { label: 'T', x: 46, y: 84, kind: 'spawn' }
      ],
      geometry: `
        <path d="M14 16H30V58H42V86H58V58H70V16H86V68H66V88H34V68H14V16Z" fill="rgba(56,189,248,0.06)" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>
        <path d="M36 16H64V44H54V62H42V44H36V16Z" fill="rgba(255,255,255,0.04)" stroke="rgba(148,163,184,0.3)" stroke-width="1.1"/>
        <rect x="68" y="16" width="16" height="15" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
        <rect x="14" y="16" width="15" height="15" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
      `
    },
    de_inferno: {
      label: 'DE_INFERNO',
      pos_x: -2087,
      pos_y: 3870,
      scale: 4.9,
      sites: [
        { label: 'A', x: 74, y: 66, kind: 'site' },
        { label: 'B', x: 44, y: 26, kind: 'site' },
        { label: 'MID', x: 48, y: 58, kind: 'callout' },
        { label: 'CT', x: 78, y: 30, kind: 'spawn' },
        { label: 'T', x: 16, y: 66, kind: 'spawn' }
      ],
      geometry: `
        <path d="M14 54H48V38H34V18H56V36H86V76H58V64H14V54Z" fill="rgba(56,189,248,0.06)" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>
        <path d="M38 58H62V82H46V70H38V58Z" fill="rgba(255,255,255,0.04)" stroke="rgba(148,163,184,0.3)" stroke-width="1.1"/>
        <rect x="66" y="58" width="16" height="16" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
        <rect x="36" y="18" width="16" height="15" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
      `
    },
    de_nuke: {
      label: 'DE_NUKE',
      pos_x: -3453,
      pos_y: 2887,
      scale: 7.0,
      sites: [
        { label: 'A', x: 56, y: 50, kind: 'site' },
        { label: 'B', x: 56, y: 62, kind: 'site' },
        { label: 'OUT', x: 52, y: 78, kind: 'callout' },
        { label: 'CT', x: 78, y: 50, kind: 'spawn' },
        { label: 'T', x: 20, y: 52, kind: 'spawn' }
      ],
      geometry: `
        <rect x="34" y="26" width="38" height="44" rx="4" fill="rgba(56,189,248,0.06)" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>
        <path d="M16 44H34V58H16V44ZM72 42H86V58H72V42ZM34 70H70V84H34V70Z" fill="rgba(255,255,255,0.04)" stroke="rgba(148,163,184,0.3)" stroke-width="1.1"/>
        <rect x="48" y="42" width="16" height="14" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
      `
    },
    de_overpass: {
      label: 'DE_OVERPASS',
      pos_x: -4831,
      pos_y: 1781,
      scale: 5.2,
      sites: [
        { label: 'A', x: 50, y: 24, kind: 'site' },
        { label: 'B', x: 64, y: 42, kind: 'site' },
        { label: 'MID', x: 42, y: 54, kind: 'callout' },
        { label: 'CT', x: 52, y: 16, kind: 'spawn' },
        { label: 'T', x: 46, y: 84, kind: 'spawn' }
      ],
      geometry: `
        <path d="M32 14H66V48H74V62H56V86H38V62H26V36H32V14Z" fill="rgba(56,189,248,0.06)" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>
        <rect x="42" y="16" width="16" height="14" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
        <rect x="56" y="34" width="15" height="15" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
      `
    },
    de_vertigo: {
      label: 'DE_VERTIGO',
      pos_x: -3168,
      pos_y: 1762,
      scale: 4.0,
      sites: [
        { label: 'A', x: 74, y: 56, kind: 'site' },
        { label: 'B', x: 26, y: 28, kind: 'site' },
        { label: 'MID', x: 48, y: 44, kind: 'callout' },
        { label: 'CT', x: 50, y: 22, kind: 'spawn' },
        { label: 'T', x: 44, y: 82, kind: 'spawn' }
      ],
      geometry: `
        <path d="M18 20H62V44H82V72H58V84H34V62H18V20Z" fill="rgba(56,189,248,0.06)" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>
        <rect x="66" y="48" width="15" height="15" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
        <rect x="20" y="22" width="15" height="14" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
      `
    },
    de_ancient: {
      label: 'DE_ANCIENT',
      pos_x: -2953,
      pos_y: 2164,
      scale: 5.0,
      sites: [
        { label: 'A', x: 26, y: 32, kind: 'site' },
        { label: 'B', x: 74, y: 36, kind: 'site' },
        { label: 'MID', x: 50, y: 50, kind: 'callout' },
        { label: 'CT', x: 50, y: 18, kind: 'spawn' },
        { label: 'T', x: 50, y: 84, kind: 'spawn' }
      ],
      geometry: `
        <path d="M18 24H82V60H64V84H36V60H18V24Z" fill="rgba(56,189,248,0.06)" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>
        <rect x="18" y="24" width="16" height="16" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
        <rect x="66" y="28" width="16" height="16" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
      `
    },
    de_anubis: {
      label: 'DE_ANUBIS',
      pos_x: -2796,
      pos_y: 3328,
      scale: 5.22,
      sites: [
        { label: 'A', x: 72, y: 30, kind: 'site' },
        { label: 'B', x: 28, y: 36, kind: 'site' },
        { label: 'MID', x: 50, y: 52, kind: 'callout' },
        { label: 'CT', x: 50, y: 18, kind: 'spawn' },
        { label: 'T', x: 50, y: 84, kind: 'spawn' }
      ],
      geometry: `
        <path d="M20 20H80V58H64V84H36V58H20V20Z" fill="rgba(56,189,248,0.06)" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>
        <rect x="64" y="22" width="16" height="15" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
        <rect x="20" y="28" width="16" height="15" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
      `
    },
    de_train: {
      label: 'DE_TRAIN',
      pos_x: -2477,
      pos_y: 2392,
      scale: 4.7,
      sites: [
        { label: 'A', x: 58, y: 42, kind: 'site' },
        { label: 'B', x: 52, y: 74, kind: 'site' },
        { label: 'CT', x: 80, y: 66, kind: 'spawn' },
        { label: 'T', x: 18, y: 34, kind: 'spawn' }
      ],
      geometry: `
        <path d="M14 26H76V56H86V78H36V62H14V26Z" fill="rgba(56,189,248,0.06)" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>
        <rect x="50" y="34" width="16" height="15" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
        <rect x="44" y="66" width="16" height="14" rx="2" fill="rgba(250,204,21,0.09)" stroke="rgba(250,204,21,0.45)" stroke-dasharray="2 2"/>
      `
    },
    cs_office: {
      label: 'CS_OFFICE',
      pos_x: -1838,
      pos_y: 1858,
      scale: 4.1,
      sites: [
        { label: 'HOSTAGES', x: 74, y: 30, kind: 'site' },
        { label: 'HALL', x: 48, y: 48, kind: 'callout' },
        { label: 'CT', x: 20, y: 72, kind: 'spawn' },
        { label: 'T', x: 78, y: 26, kind: 'spawn' }
      ],
      geometry: `
        <path d="M16 56H42V22H84V56H60V78H16V56Z" fill="rgba(56,189,248,0.06)" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>
        <rect x="64" y="22" width="18" height="16" rx="2" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.5)" stroke-dasharray="2 2"/>
      `
    },
    cs_italy: {
      label: 'CS_ITALY',
      pos_x: -2647,
      pos_y: 2592,
      scale: 4.6,
      sites: [
        { label: 'HOSTAGES', x: 52, y: 26, kind: 'site' },
        { label: 'MARKET', x: 48, y: 52, kind: 'callout' },
        { label: 'CT', x: 48, y: 82, kind: 'spawn' },
        { label: 'T', x: 52, y: 20, kind: 'spawn' }
      ],
      geometry: `
        <path d="M26 16H74V60H62V84H38V60H26V16Z" fill="rgba(56,189,248,0.06)" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>
        <rect x="42" y="18" width="18" height="16" rx="2" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.5)" stroke-dasharray="2 2"/>
      `
    }
  };

  function getRadarMapMeta(mapName) {
    const key = String(mapName || 'de_mirage').toLowerCase().trim();
    if (CS2_RADAR_MAPS[key]) return CS2_RADAR_MAPS[key];
    for (const [k, meta] of Object.entries(CS2_RADAR_MAPS)) {
      if (key.includes(k.replace('de_', '').replace('cs_', ''))) {
        return meta;
      }
    }
    return {
      label: String(mapName || 'TACTICAL SECTOR').toUpperCase(),
      pos_x: -2800,
      pos_y: 2600,
      scale: 5.0,
      sites: [
        { label: 'A', x: 72, y: 30, kind: 'site' },
        { label: 'B', x: 28, y: 30, kind: 'site' },
        { label: 'MID', x: 50, y: 52, kind: 'callout' },
        { label: 'CT', x: 30, y: 78, kind: 'spawn' },
        { label: 'T', x: 70, y: 78, kind: 'spawn' }
      ],
      geometry: `
        <rect x="14" y="16" width="72" height="68" rx="4" fill="rgba(56,189,248,0.05)" stroke="rgba(148,163,184,0.3)" stroke-width="1.2"/>
        <line x1="50" y1="16" x2="50" y2="84" stroke="rgba(148,163,184,0.2)" stroke-dasharray="2 2"/>
        <line x1="14" y1="50" x2="86" y2="50" stroke="rgba(148,163,184,0.2)" stroke-dasharray="2 2"/>
      `
    };
  }

  function projectGsiToRadarPct(mapName, pos) {
    if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') return null;
    const meta = getRadarMapMeta(mapName);
    const u = ((pos.x - meta.pos_x) / meta.scale) / 1024 * 100;
    const v = ((meta.pos_y - pos.y) / meta.scale) / 1024 * 100;
    return {
      x: Math.max(5, Math.min(95, u)),
      y: Math.max(5, Math.min(95, v))
    };
  }

  function getForwardAngleDeg(forward) {
    if (!forward || typeof forward.x !== 'number' || typeof forward.y !== 'number') return null;
    // In Source 2 radar space, +x is right, +y is up (screen -y)
    return (Math.atan2(-forward.y, forward.x) * 180) / Math.PI;
  }

  function buildLiveRadarSvg({
    mapName,
    players = [],
    bots = [],
    bomb = null,
    humanSide = 'CT',
    focusedIdx = -1,
    simTick = 0
  }) {
    const meta = getRadarMapMeta(mapName);
    const isHumanCT = humanSide === 'CT';
    const humanColor = isHumanCT ? '#38bdf8' : '#f59e0b';
    const botColor = isHumanCT ? '#ef4444' : '#38bdf8';

    const sitesHtml = (meta.sites || []).map(s => {
      const cls = s.kind === 'site' ? '#facc15' : s.kind === 'spawn' ? '#94a3b8' : '#cbd5e1';
      const size = s.kind === 'site' ? 6.2 : 4.2;
      return `<text x="${s.x}" y="${s.y}" text-anchor="middle" dominant-baseline="central" fill="${cls}" fill-opacity="${s.kind === 'site' ? 0.9 : 0.5}" font-family="JetBrains Mono, monospace" font-weight="800" font-size="${size}">${s.label}</text>`;
    }).join('');

    // Render Bots (from real GSI positions or smooth simulation patrol)
    const botsHtml = (bots || []).slice(0, 10).map((b, idx) => {
      const alive = (b.health || 0) > 0;
      let pt = projectGsiToRadarPct(mapName, b.position);
      let angle = getForwardAngleDeg(b.forward);

      if (!pt) {
        // Fallback tactical patrol positions for simulation or non-allplayers GSI
        const siteA = meta.sites.find(s => s.label === 'A') || { x: 68, y: 30 };
        const siteB = meta.sites.find(s => s.label === 'B') || { x: 26, y: 30 };
        const mid = meta.sites.find(s => s.label === 'MID') || { x: 50, y: 50 };
        const anchors = [siteA, siteB, mid];
        const anchor = anchors[idx % anchors.length];
        const phase = simTick * 0.04 + idx * 1.15;
        pt = {
          x: Math.max(8, Math.min(92, anchor.x + Math.cos(phase) * (7 + (idx % 3) * 2.5))),
          y: Math.max(8, Math.min(92, anchor.y + Math.sin(phase * 0.85) * (6 + (idx % 2) * 3)))
        };
        angle = (phase * 57.3 + 90) % 360;
      }

      if (!alive) {
        return `<g opacity="0.35">
          <line x1="${pt.x - 1.4}" y1="${pt.y - 1.4}" x2="${pt.x + 1.4}" y2="${pt.y + 1.4}" stroke="${botColor}" stroke-width="0.9"/>
          <line x1="${pt.x + 1.4}" y1="${pt.y - 1.4}" x2="${pt.x - 1.4}" y2="${pt.y + 1.4}" stroke="${botColor}" stroke-width="0.9"/>
        </g>`;
      }

      const cone = angle !== null
        ? `<path d="M0,0 L7,-3.5 L7,3.5 Z" fill="${botColor}" fill-opacity="0.24" transform="translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})"/>`
        : '';

      return `
        ${cone}
        <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="2.1" fill="${botColor}" stroke="#070a10" stroke-width="0.7"/>
      `;
    }).join('');

    // Render Human Players
    let c4CarrierPt = null;
    const playersHtml = (players || []).slice(0, 10).map((p, idx) => {
      const alive = (p.health || 0) > 0;
      let pt = projectGsiToRadarPct(mapName, p.position);
      let angle = getForwardAngleDeg(p.forward);

      if (!pt) {
        const spawn = meta.sites.find(s => s.label === humanSide) || { x: 45, y: 74 };
        const mid = meta.sites.find(s => s.label === 'MID') || { x: 50, y: 50 };
        const progress = Math.min(0.85, 0.25 + ((simTick % 60) / 60) * 0.55);
        const phase = simTick * 0.05 + idx * 0.9;
        pt = {
          x: Math.max(8, Math.min(92, spawn.x + (mid.x - spawn.x) * progress + Math.cos(phase) * (5 + idx * 1.6))),
          y: Math.max(8, Math.min(92, spawn.y + (mid.y - spawn.y) * progress + Math.sin(phase) * (4 + idx * 1.4)))
        };
        angle = (Math.atan2(mid.y - pt.y, mid.x - pt.x) * 180) / Math.PI;
      }

      if (p.hasC4 && alive) {
        c4CarrierPt = pt;
      }

      if (!alive) {
        return `<g opacity="0.45">
          <line x1="${pt.x - 1.8}" y1="${pt.y - 1.8}" x2="${pt.x + 1.8}" y2="${pt.y + 1.8}" stroke="${humanColor}" stroke-width="1.1"/>
          <line x1="${pt.x + 1.8}" y1="${pt.y - 1.8}" x2="${pt.x - 1.8}" y2="${pt.y + 1.8}" stroke="${humanColor}" stroke-width="1.1"/>
        </g>`;
      }

      const isFocused = focusedIdx === idx || players.length === 1;
      const cone = angle !== null
        ? `<path d="M0,0 L10,-5 L10,5 Z" fill="${humanColor}" fill-opacity="${isFocused ? '0.38' : '0.25'}" transform="translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})"/>`
        : '';

      return `
        ${cone}
        ${isFocused ? `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="4.6" fill="none" stroke="#ffffff" stroke-width="0.7" stroke-opacity="0.75"/>` : ''}
        <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.1" fill="${humanColor}" stroke="#070a10" stroke-width="0.8"/>
        <text x="${pt.x.toFixed(1)}" y="${pt.y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" fill="#04070d" font-family="JetBrains Mono, monospace" font-weight="900" font-size="3.2">${idx + 1}</text>
      `;
    }).join('');

    // Render Bomb (planted / dropped / carried)
    let bombHtml = '';
    const bombPt = (bomb && bomb.position) ? projectGsiToRadarPct(mapName, bomb.position) : c4CarrierPt;
    if (bombPt) {
      const isPlanted = bomb && bomb.state === 'planted';
      bombHtml = `
        <g transform="translate(${bombPt.x.toFixed(1)}, ${bombPt.y.toFixed(1)})">
          ${isPlanted ? `<circle cx="0" cy="0" r="5.5" fill="rgba(239,68,68,0.28)" stroke="#ef4444" stroke-width="0.8"/>` : ''}
          <rect x="-2.2" y="-1.6" width="4.4" height="3.2" rx="0.6" fill="#ef4444" stroke="#ffffff" stroke-width="0.5"/>
        </g>
      `;
    }

    return `
      <svg viewBox="0 0 100 100" class="radar-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="radar-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(148,163,184,0.08)" stroke-width="0.35"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="#070c14"/>
        <rect width="100" height="100" fill="url(#radar-grid)"/>
        ${meta.geometry}
        ${sitesHtml}
        ${botsHtml}
        ${playersHtml}
        ${bombHtml}
      </svg>
    `;
  }

  window.CS2_RADAR = {
    CS2_RADAR_MAPS,
    getRadarMapMeta,
    projectGsiToRadarPct,
    buildLiveRadarSvg
  };
})();
