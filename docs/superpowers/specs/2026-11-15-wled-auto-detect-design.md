# WLED Auto-Detect (Device Discovery) — Design

## Intent
Adding WLED lights currently means typing each IP by hand. Add a network scan that finds WLED lights so they can be added with one click. Target: the dashboard running on a Windows/Mac PC on the same LAN as the lights (Docker/Synology is out of scope for now).

## Goals / non-goals
- Goal: SCAN NETWORK button in the WLED modal lists every WLED device found (name, IP, LED count, firmware), marks ones already configured, and offers ADD and IDENTIFY per device.
- Non-goal: auto-adding devices (neighbors' or test strips could sneak in), reading effects/presets/segments from devices, Docker-network discovery.
- Anti-goal: adding npm dependencies (project is zero-dependency).

## Approaches considered
1. mDNS only — fast, real names; misses devices with mDNS disabled or networks that block multicast.
2. Subnet sweep only — finds every powered device on the /24; slower, LAN-range only.
3. **Both in parallel, merged (picked)** — ~5s scan, still works when one method fails.

## Design
- `wled-discovery.js` (server): 
  - mDNS: raw `dgram` PTR query for `_wled._tcp.local` on 224.0.0.251:5353, collect A records / source IPs for ~2.5s.
  - Sweep: for each non-internal IPv4 interface (/24 of its address, capped at 254 hosts per interface), `GET http://ip/json/info` with ~900ms timeout and bounded concurrency (~48).
  - Every candidate (from either source) is confirmed via `/json/info` and must look like WLED (`brand === 'WLED'` or has `leds` + `ver`). Results deduped by IP; include `name, host, ver, ledCount, mac, source`.
  - Concurrent scan requests share one in-flight scan.
- `GET /api/wled/discover` returns `{ ok, devices, durationMs, subnets }`.
- UI: SCAN NETWORK button + results list in the WLED devices section. ADD reuses the existing add-device path (name prefilled from device); IDENTIFY reuses `/api/wled/test-device`. Already-configured hosts show ADDED.

## Left to the builder
Exact styling (match existing WLED modal), timeouts within the ~5s budget.
