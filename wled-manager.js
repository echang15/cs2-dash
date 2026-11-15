const fs = require('node:fs');
const path = require('node:path');

const WLED_EFFECTS_CATALOG = [
  { id: 0, name: 'Solid' },
  { id: 1, name: 'Blink' },
  { id: 2, name: 'Breathe' },
  { id: 3, name: 'Wipe' },
  { id: 8, name: 'Colorloop' },
  { id: 9, name: 'Rainbow' },
  { id: 12, name: 'Fade' },
  { id: 13, name: 'Theater' },
  { id: 17, name: 'Twinkle' },
  { id: 20, name: 'Sparkle' },
  { id: 23, name: 'Strobe' },
  { id: 25, name: 'Strobe Mega' },
  { id: 28, name: 'Chase' },
  { id: 38, name: 'Aurora' },
  { id: 42, name: 'Fireworks' },
  { id: 57, name: 'Lightning' },
  { id: 66, name: 'Fire 2012' },
  { id: 87, name: 'Glitter' },
  { id: 90, name: 'Fireworks 1D' }
];

const EVENT_METADATA = {
  kill_human: { label: 'HUMAN KILL', category: 'combat', description: 'Triggered when a human squad operator scores a kill' },
  kill_headshot: { label: 'HEADSHOT KILL', category: 'combat', description: 'Triggered when a human squad operator scores a headshot kill' },
  human_death: { label: 'OPERATOR DOWN', category: 'combat', description: 'Triggered when a human squad operator is eliminated' },
  bomb_planted: { label: 'BOMB PLANTED (40s–10s)', category: 'bomb', description: 'Continuous effect while C4 is planted (>10s remaining)' },
  bomb_critical: { label: 'BOMB CRITICAL (<10s)', category: 'bomb', description: 'Continuous urgent effect during final 10s of C4 countdown' },
  bomb_defused: { label: 'BOMB DEFUSED', category: 'bomb', description: 'Celebration effect when C4 is defused' },
  bomb_exploded: { label: 'BOMB EXPLODED', category: 'bomb', description: 'Blast effect when C4 detonates' },
  round_win: { label: 'ROUND WIN', category: 'round', description: 'Triggered when the human squad wins a round' },
  round_loss: { label: 'ROUND LOSS', category: 'round', description: 'Triggered when the human squad loses a round' },
  round_start: { label: 'NEW ROUND / FREEZETIME', category: 'round', description: 'Triggered at the start of a new round' },
  gameover: { label: 'MATCH OVER', category: 'round', description: 'Triggered when the match concludes' }
};

function createDefaultConfig() {
  return {
    enabled: true,
    triggerInSim: false,
    restoreMode: 'snapshot', // 'snapshot' | 'preset' | 'none'
    idlePresetId: 1,
    devices: [],
    events: {
      kill_human: { enabled: true, mode: 'effect', presetId: 1, fx: 1, color: '#ffc828', color2: '#000000', sx: 225, ix: 220, bri: 255, durationMs: 1800 },
      kill_headshot: { enabled: true, mode: 'effect', presetId: 2, fx: 25, color: '#ff3220', color2: '#ffc828', sx: 250, ix: 255, bri: 255, durationMs: 2200 },
      human_death: { enabled: false, mode: 'effect', presetId: 3, fx: 2, color: '#dc1420', color2: '#000000', sx: 180, ix: 200, bri: 200, durationMs: 2000 },
      bomb_planted: { enabled: true, mode: 'effect', presetId: 4, fx: 2, color: '#ff5500', color2: '#000000', sx: 170, ix: 210, bri: 235, durationMs: 0 },
      bomb_critical: { enabled: true, mode: 'effect', presetId: 5, fx: 1, color: '#ff0a0a', color2: '#000000', sx: 245, ix: 255, bri: 255, durationMs: 0 },
      bomb_defused: { enabled: true, mode: 'effect', presetId: 6, fx: 28, color: '#00c8ff', color2: '#ffffff', sx: 210, ix: 230, bri: 255, durationMs: 4000 },
      bomb_exploded: { enabled: true, mode: 'effect', presetId: 7, fx: 66, color: '#ff3c00', color2: '#ffaa00', sx: 240, ix: 255, bri: 255, durationMs: 4500 },
      round_win: { enabled: true, mode: 'effect', presetId: 8, fx: 28, color: '#00e682', color2: '#00c8ff', sx: 200, ix: 220, bri: 255, durationMs: 4000 },
      round_loss: { enabled: true, mode: 'effect', presetId: 9, fx: 2, color: '#ff1e32', color2: '#000000', sx: 150, ix: 180, bri: 220, durationMs: 3500 },
      round_start: { enabled: false, mode: 'effect', presetId: 10, fx: 0, color: '#38bdf8', color2: '#000000', sx: 128, ix: 128, bri: 180, durationMs: 1500 },
      gameover: { enabled: true, mode: 'effect', presetId: 11, fx: 42, color: '#ffc828', color2: '#00c8ff', sx: 200, ix: 230, bri: 255, durationMs: 7000 }
    }
  };
}

function normalizeHost(rawHost) {
  let host = String(rawHost || '').trim();
  host = host.replace(/^https?:\/\//i, '');
  host = host.split('/')[0].trim();
  return host;
}

function hexToRgb(hex, fallback = [255, 255, 255]) {
  const clean = String(hex || '').trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16)
    ];
  }
  return fallback;
}

function clampInt(val, min, max, fallback) {
  const n = Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

class WledManager {
  constructor({ dataDir, onLog }) {
    this.dataDir = dataDir;
    this.configFile = path.join(dataDir, 'wled-config.json');
    this.onLog = typeof onLog === 'function' ? onLog : () => {};
    this.config = createDefaultConfig();
    this.deviceStatuses = new Map();
    this.snapshotByDevice = new Map();
    this.restoreTimer = null;
    this.activeBombState = null;
    this.bombPlantedAt = null;
    this.bombWatcherTimer = null;
    this.lastEventAt = {};
    this.loadConfig();
  }

  loadConfig() {
    try {
      fs.mkdirSync(this.dataDir, { recursive: true });
      if (fs.existsSync(this.configFile)) {
        const raw = fs.readFileSync(this.configFile, 'utf8');
        const parsed = JSON.parse(raw);
        this.config = this.mergeWithDefaults(parsed);
      }
    } catch (err) {
      console.warn('[WLED] Could not load wled-config.json:', err.message);
      this.config = createDefaultConfig();
    }
  }

  saveConfig() {
    try {
      fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2), 'utf8');
    } catch (err) {
      console.warn('[WLED] Could not save wled-config.json:', err.message);
    }
  }

  mergeWithDefaults(input = {}) {
    const defaults = createDefaultConfig();
    const devices = Array.isArray(input.devices)
      ? input.devices
          .map((d, idx) => ({
            id: String(d.id || `wled-${Date.now()}-${idx}`),
            name: String(d.name || `WLED Device ${idx + 1}`).slice(0, 40),
            host: normalizeHost(d.host),
            enabled: d.enabled !== false,
            segmentId: clampInt(d.segmentId, -1, 31, 0)
          }))
          .filter(d => d.host.length > 0)
      : [];

    const events = {};
    for (const [key, defEvt] of Object.entries(defaults.events)) {
      const inc = (input.events && input.events[key]) || {};
      events[key] = {
        enabled: typeof inc.enabled === 'boolean' ? inc.enabled : defEvt.enabled,
        mode: ['effect', 'preset', 'restore'].includes(inc.mode) ? inc.mode : defEvt.mode,
        presetId: clampInt(inc.presetId, 1, 250, defEvt.presetId),
        fx: clampInt(inc.fx, 0, 200, defEvt.fx),
        color: /^#[0-9a-fA-F]{6}$/.test(String(inc.color || '')) ? String(inc.color) : defEvt.color,
        color2: /^#[0-9a-fA-F]{6}$/.test(String(inc.color2 || '')) ? String(inc.color2) : defEvt.color2,
        sx: clampInt(inc.sx, 0, 255, defEvt.sx),
        ix: clampInt(inc.ix, 0, 255, defEvt.ix),
        bri: clampInt(inc.bri, 1, 255, defEvt.bri),
        durationMs: clampInt(inc.durationMs, 0, 60000, defEvt.durationMs)
      };
    }

    return {
      enabled: typeof input.enabled === 'boolean' ? input.enabled : defaults.enabled,
      triggerInSim: typeof input.triggerInSim === 'boolean' ? input.triggerInSim : defaults.triggerInSim,
      restoreMode: ['snapshot', 'preset', 'none'].includes(input.restoreMode) ? input.restoreMode : defaults.restoreMode,
      idlePresetId: clampInt(input.idlePresetId, 1, 250, defaults.idlePresetId),
      devices,
      events
    };
  }

  updateConfig(nextConfig) {
    this.config = this.mergeWithDefaults(nextConfig);
    this.saveConfig();
    return this.getPublicState();
  }

  getPublicState() {
    const statuses = {};
    for (const dev of this.config.devices) {
      statuses[dev.id] = this.deviceStatuses.get(dev.id) || {
        online: null,
        name: dev.name,
        ver: null,
        ledCount: null,
        lastLatencyMs: null,
        lastCheckedAt: null,
        error: null
      };
    }
    return {
      config: this.config,
      statuses,
      effectsCatalog: WLED_EFFECTS_CATALOG,
      eventMetadata: EVENT_METADATA,
      activeBombState: this.activeBombState
    };
  }

  async fetchJson(host, endpoint, options = {}, timeoutMs = 1500) {
    const cleanHost = normalizeHost(host);
    if (!cleanHost) throw new Error('Invalid host');
    const url = `http://${cleanHost}${endpoint}`;
    const started = Date.now();
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return { data, latencyMs: Date.now() - started };
  }

  async testDevice(host, deviceId = null, identify = true) {
    const cleanHost = normalizeHost(host);
    if (!cleanHost) {
      return { ok: false, error: 'Host/IP is required' };
    }
    try {
      const { data, latencyMs } = await this.fetchJson(cleanHost, '/json/info', { method: 'GET' }, 2000);
      const status = {
        online: true,
        name: data.name || cleanHost,
        ver: data.ver || null,
        ledCount: data.leds && typeof data.leds.count === 'number' ? data.leds.count : null,
        lastLatencyMs: latencyMs,
        lastCheckedAt: Date.now(),
        error: null
      };
      if (deviceId) {
        this.deviceStatuses.set(deviceId, status);
      }

      if (identify) {
        // Brief cyan/white blink identify without blocking response
        this.sendStateToHost(cleanHost, {
          on: true,
          bri: 220,
          seg: [{ fx: 1, sx: 240, ix: 200, col: [[56, 189, 248], [255, 255, 255]] }]
        }).catch(() => {});
        setTimeout(() => {
          this.sendStateToHost(cleanHost, {
            on: true,
            seg: [{ fx: 0, col: [[56, 189, 248], [0, 0, 0]] }]
          }).catch(() => {});
        }, 900);
      }

      return { ok: true, status };
    } catch (err) {
      const status = {
        online: false,
        name: cleanHost,
        ver: null,
        ledCount: null,
        lastLatencyMs: null,
        lastCheckedAt: Date.now(),
        error: err.message || 'Unreachable'
      };
      if (deviceId) {
        this.deviceStatuses.set(deviceId, status);
      }
      return { ok: false, error: status.error, status };
    }
  }

  async sendStateToHost(host, payload, deviceId = null) {
    const cleanHost = normalizeHost(host);
    if (!cleanHost) return false;
    try {
      const { latencyMs } = await this.fetchJson(
        cleanHost,
        '/json/state',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        1500
      );
      if (deviceId) {
        const prev = this.deviceStatuses.get(deviceId) || {};
        this.deviceStatuses.set(deviceId, {
          ...prev,
          online: true,
          lastLatencyMs: latencyMs,
          lastCheckedAt: Date.now(),
          error: null
        });
      }
      return true;
    } catch (err) {
      if (deviceId) {
        const prev = this.deviceStatuses.get(deviceId) || {};
        this.deviceStatuses.set(deviceId, {
          ...prev,
          online: false,
          lastCheckedAt: Date.now(),
          error: err.message || 'Request failed'
        });
      }
      return false;
    }
  }

  async captureSnapshot(devices) {
    await Promise.allSettled(
      devices.map(async (dev) => {
        if (this.snapshotByDevice.has(dev.id)) return;
        try {
          const { data } = await this.fetchJson(dev.host, '/json/state', { method: 'GET' }, 1000);
          const seg0 = Array.isArray(data.seg) ? (data.seg.find(s => s.id === (dev.segmentId >= 0 ? dev.segmentId : 0)) || data.seg[0]) : null;
          this.snapshotByDevice.set(dev.id, {
            on: Boolean(data.on),
            bri: typeof data.bri === 'number' ? data.bri : 128,
            ps: typeof data.ps === 'number' && data.ps > 0 ? data.ps : -1,
            seg: seg0
              ? {
                  id: typeof seg0.id === 'number' ? seg0.id : 0,
                  fx: typeof seg0.fx === 'number' ? seg0.fx : 0,
                  sx: typeof seg0.sx === 'number' ? seg0.sx : 128,
                  ix: typeof seg0.ix === 'number' ? seg0.ix : 128,
                  col: Array.isArray(seg0.col) ? seg0.col : [[255, 255, 255], [0, 0, 0], [0, 0, 0]]
                }
              : null
          });
        } catch (_) {
          // Ignore snapshot failure for offline devices
        }
      })
    );
  }

  buildEventPayload(evtCfg, device) {
    if (evtCfg.mode === 'preset') {
      return {
        on: true,
        bri: evtCfg.bri,
        ps: evtCfg.presetId
      };
    }

    const segObj = {
      fx: evtCfg.fx,
      sx: evtCfg.sx,
      ix: evtCfg.ix,
      col: [hexToRgb(evtCfg.color, [255, 255, 255]), hexToRgb(evtCfg.color2, [0, 0, 0])]
    };
    if (typeof device.segmentId === 'number' && device.segmentId >= 0) {
      segObj.id = device.segmentId;
    }

    return {
      on: true,
      bri: evtCfg.bri,
      seg: [segObj]
    };
  }

  async restoreIdle(devices = null) {
    if (this.restoreTimer) {
      clearTimeout(this.restoreTimer);
      this.restoreTimer = null;
    }

    const targetDevices = devices || this.config.devices.filter(d => d.enabled);
    if (targetDevices.length === 0) {
      this.snapshotByDevice.clear();
      return;
    }

    if (this.config.restoreMode === 'none') {
      this.snapshotByDevice.clear();
      return;
    }

    if (this.config.restoreMode === 'preset') {
      await Promise.allSettled(
        targetDevices.map(dev =>
          this.sendStateToHost(dev.host, { on: true, ps: this.config.idlePresetId }, dev.id)
        )
      );
      this.snapshotByDevice.clear();
      return;
    }

    // Default: 'snapshot'
    await Promise.allSettled(
      targetDevices.map(async (dev) => {
        const snap = this.snapshotByDevice.get(dev.id);
        if (!snap) return;
        const restorePayload = snap.ps > 0
          ? { on: snap.on, bri: snap.bri, ps: snap.ps }
          : { on: snap.on, bri: snap.bri, ...(snap.seg ? { seg: [snap.seg] } : {}) };
        await this.sendStateToHost(dev.host, restorePayload, dev.id);
      })
    );
    this.snapshotByDevice.clear();
  }

  async triggerEvent(eventKey, { force = false, deviceId = null } = {}) {
    if (!force && !this.config.enabled) return { ok: false, reason: 'disabled' };
    const evtCfg = this.config.events[eventKey];
    if (!evtCfg) return { ok: false, reason: 'unknown_event' };
    if (!force && !evtCfg.enabled) return { ok: false, reason: 'event_disabled' };

    const targetDevices = deviceId
      ? this.config.devices.filter(d => d.id === deviceId)
      : this.config.devices.filter(d => d.enabled);

    if (targetDevices.length === 0) {
      return { ok: false, reason: 'no_devices' };
    }

    // Prevent rapid duplicate triggers of the same event within 250ms (unless forced)
    const now = Date.now();
    if (!force && this.lastEventAt[eventKey] && now - this.lastEventAt[eventKey] < 250) {
      return { ok: false, reason: 'debounced' };
    }
    this.lastEventAt[eventKey] = now;

    if (evtCfg.mode === 'restore') {
      this.activeBombState = null;
      await this.restoreIdle(targetDevices);
      return { ok: true, eventKey, devicesTriggered: targetDevices.length };
    }

    if (this.restoreTimer) {
      clearTimeout(this.restoreTimer);
      this.restoreTimer = null;
    }

    if (this.config.restoreMode === 'snapshot' && this.snapshotByDevice.size === 0) {
      await this.captureSnapshot(targetDevices);
    }

    const isBombContinuous = (eventKey === 'bomb_planted' || eventKey === 'bomb_critical') && evtCfg.durationMs === 0;
    if (isBombContinuous) {
      this.activeBombState = eventKey;
    } else if (eventKey === 'bomb_defused' || eventKey === 'bomb_exploded' || eventKey === 'round_win' || eventKey === 'round_loss' || eventKey === 'round_start' || eventKey === 'gameover') {
      this.activeBombState = null;
    }

    const results = await Promise.allSettled(
      targetDevices.map(dev => this.sendStateToHost(dev.host, this.buildEventPayload(evtCfg, dev), dev.id))
    );

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value === true).length;

    if (evtCfg.durationMs > 0) {
      this.restoreTimer = setTimeout(() => {
        this.restoreTimer = null;
        if (this.activeBombState && this.config.events[this.activeBombState]?.enabled) {
          this.triggerEvent(this.activeBombState, { force: true }).catch(() => {});
        } else {
          this.restoreIdle(targetDevices).catch(() => {});
        }
      }, evtCfg.durationMs);
    }

    return { ok: true, eventKey, devicesTriggered: successCount, totalTargets: targetDevices.length };
  }

  onBombPlanted(plantedAtMs = Date.now()) {
    this.bombPlantedAt = plantedAtMs;
    this.stopBombWatcher();
    this.triggerEvent('bomb_planted').catch(() => {});

    this.bombWatcherTimer = setInterval(() => {
      if (!this.bombPlantedAt) {
        this.stopBombWatcher();
        return;
      }
      const elapsedMs = Date.now() - this.bombPlantedAt;
      if (elapsedMs >= 30000 && this.activeBombState !== 'bomb_critical') {
        this.triggerEvent('bomb_critical').catch(() => {});
        this.stopBombWatcher();
      }
    }, 500);
  }

  onBombCleared(outcome = null) {
    this.bombPlantedAt = null;
    this.stopBombWatcher();
    if (outcome === 'defused') {
      if (this.config.events.bomb_defused?.enabled) {
        this.triggerEvent('bomb_defused').catch(() => {});
      } else if (this.activeBombState) {
        this.activeBombState = null;
        this.restoreIdle().catch(() => {});
      }
    } else if (outcome === 'exploded') {
      if (this.config.events.bomb_exploded?.enabled) {
        this.triggerEvent('bomb_exploded').catch(() => {});
      } else if (this.activeBombState) {
        this.activeBombState = null;
        this.restoreIdle().catch(() => {});
      }
    } else if (this.activeBombState) {
      this.activeBombState = null;
      this.restoreIdle().catch(() => {});
    }
  }

  stopBombWatcher() {
    if (this.bombWatcherTimer) {
      clearInterval(this.bombWatcherTimer);
      this.bombWatcherTimer = null;
    }
  }
}

module.exports = {
  WledManager,
  WLED_EFFECTS_CATALOG,
  EVENT_METADATA
};
