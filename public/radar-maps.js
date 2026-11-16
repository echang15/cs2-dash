/* ==========================================================================
   CS2 LIVE TACTICAL RADAR / MINIMAP CALIBRATION & VECTOR BLUEPRINTS
   ========================================================================== */
(function () {
  // Calibration + images are generated from the CS2 nav meshes (see public/radar-calibration.js, public/radar/*.svg).
  const CALIBRATION = window.CS2_RADAR_CALIBRATION || {};
  const ALIASES = window.CS2_RADAR_ALIASES || {};

  // Fallback anchors for simulated patrols when no real positions arrive (percent of the radar frame)
  const SIM_ANCHORS = {
    A: { x: 70, y: 32 },
    B: { x: 30, y: 32 },
    MID: { x: 50, y: 50 },
    CT: { x: 50, y: 22 },
    T: { x: 50, y: 80 }
  };

  // Resolves "de_mirage", "workshop/123/de_mirage", "de_ancient_night", "Mirage" to a calibrated map key
  function resolveMapKey(mapName) {
    let key = String(mapName || '').toLowerCase().trim();
    key = key.split('/').pop();
    if (ALIASES[key]) key = ALIASES[key];
    if (CALIBRATION[key]) return key;
    const bare = key.replace(/^(de|cs|ar)_/, '');
    if (!bare) return null;
    const match = Object.keys(CALIBRATION).find(k => k.replace(/^(de|cs|ar)_/, '') === bare)
      || Object.keys(CALIBRATION).find(k => bare.includes(k.replace(/^(de|cs|ar)_/, '')));
    return match || null;
  }

  function getRadarMapMeta(mapName) {
    const key = resolveMapKey(mapName);
    if (key) {
      const cal = CALIBRATION[key];
      return {
        key,
        label: key.toUpperCase(),
        pos_x: cal.pos_x,
        pos_y: cal.pos_y,
        scale: cal.scale,
        lowerMaxZ: typeof cal.lowerMaxZ === 'number' ? cal.lowerMaxZ : null,
        image: `/radar/${key}.svg`
      };
    }
    return {
      key: null,
      label: String(mapName || 'TACTICAL SECTOR').toUpperCase(),
      pos_x: -2800,
      pos_y: 2600,
      scale: 5.0,
      lowerMaxZ: null,
      image: null
    };
  }

  function projectGsiToRadarPct(mapName, pos) {
    if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') return null;
    const meta = getRadarMapMeta(mapName);
    const u = ((pos.x - meta.pos_x) / meta.scale) / 1024 * 100;
    const v = ((meta.pos_y - pos.y) / meta.scale) / 1024 * 100;
    return {
      x: Math.max(1, Math.min(99, u)),
      y: Math.max(1, Math.min(99, v)),
      // Stacked maps (Nuke, Vertigo): below the overview's split height = lower level
      lower: meta.lowerMaxZ !== null && typeof pos.z === 'number' && pos.z < meta.lowerMaxZ
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


    // Render Bots (from real GSI positions or smooth simulation patrol)
    const botsHtml = (bots || []).slice(0, 10).map((b, idx) => {
      const alive = (b.health || 0) > 0;
      let pt = projectGsiToRadarPct(mapName, b.position);
      let angle = getForwardAngleDeg(b.forward);

      if (!pt) {
        // Fallback tactical patrol positions for simulation or non-allplayers GSI
        const anchors = [SIM_ANCHORS.A, SIM_ANCHORS.B, SIM_ANCHORS.MID];
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

      return `<g ${pt.lower ? 'opacity="0.55"' : ''}>
        ${cone}
        <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="2.1" fill="${pt.lower ? 'none' : botColor}" stroke="${pt.lower ? botColor : '#070a10'}" stroke-width="${pt.lower ? 0.9 : 0.7}"/>
      </g>`;
    }).join('');

    // Render Human Players
    let c4CarrierPt = null;
    const playersHtml = (players || []).slice(0, 10).map((p, idx) => {
      const alive = (p.health || 0) > 0;
      let pt = projectGsiToRadarPct(mapName, p.position);
      let angle = getForwardAngleDeg(p.forward);

      if (!pt) {
        const spawn = SIM_ANCHORS[humanSide] || SIM_ANCHORS.CT;
        const mid = SIM_ANCHORS.MID;
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

      const lowerRing = pt.lower
        ? `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="4" fill="none" stroke="${humanColor}" stroke-width="0.6" stroke-dasharray="1 0.8"/>`
        : '';
      return `<g ${pt.lower ? 'opacity="0.7"' : ''}>
        ${cone}
        ${lowerRing}
        ${isFocused ? `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="4.6" fill="none" stroke="#ffffff" stroke-width="0.7" stroke-opacity="0.75"/>` : ''}
        <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.1" fill="${humanColor}" stroke="#070a10" stroke-width="0.8"/>
        <text x="${pt.x.toFixed(1)}" y="${pt.y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" fill="#04070d" font-family="JetBrains Mono, monospace" font-weight="900" font-size="3.2">${idx + 1}</text>
      </g>`;
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
        ${meta.image
          ? `<image href="${meta.image}" x="0" y="0" width="100" height="100" preserveAspectRatio="none"/>`
          : `<text x="50" y="50" text-anchor="middle" dominant-baseline="central" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="3.4">NO RADAR FOR ${meta.label}</text>`}
        ${botsHtml}
        ${playersHtml}
        ${bombHtml}
      </svg>
    `;
  }

  window.CS2_RADAR = {
    resolveMapKey,
    getRadarMapMeta,
    projectGsiToRadarPct,
    buildLiveRadarSvg
  };
})();
