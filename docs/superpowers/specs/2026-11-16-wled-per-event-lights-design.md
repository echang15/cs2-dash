# WLED Per-Event Light Targeting — Design

## Intent
Route each lighting event to the lights the user picks (e.g. kills flash the desk lamp, bomb plant lights the stairs) instead of every event hitting every light.

## Goals / non-goals
- Goal: each event row in the WLED modal gets a LIGHTS picker: ALL (default) or any set of configured lights.
- Goal: overlapping events on different lights each finish and restore correctly.
- Non-goal: per-light effect overrides (same effect settings go to every targeted light).
- Anti-goal: breaking existing configs. No `deviceIds` (or empty) = all lights, as today.

## Approaches
1. Picker only, keep the shared timer/snapshot/bomb state. Rejected: a kill on light A during a bomb on light B leaves A stuck on the kill effect, and one restore wipes every light's saved look.
2. **Picker + per-light state (picked).** Each light has its own restore timer and snapshot; the bomb layer is the set of lights the active continuous bomb event targets.

## Design
- Config: `events[key].deviceIds: string[]`, filtered to existing device ids on load/save; empty = ALL. Disabled devices are always skipped.
- wled-manager: `restoreTimers` per device id; snapshot captured per device if missing; restore deletes only that device's snapshot. `bombDeviceIds` set alongside `activeBombState`.
  - Transient effect ends on a light → bomb payload if the light is in the bomb layer, else restore that light.
  - Bomb event retargets (planted → critical with different lights) or ends → lights leaving the bomb layer are restored unless a transient effect is still running on them (its timer restores them).
- UI: chip row under each event's controls; ALL chip clears the selection; clicking a light chip toggles it.

## Left to the builder
Chip styling (match the WLED modal).
