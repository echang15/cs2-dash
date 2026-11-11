# CS2 Stadium Broadcast Dashboard (`1920x1080` // 5 Humans vs 10 Bots)

A real-time, stadium-grade 1080p presenter dashboard for **Counter-Strike 2** designed specifically for **5 Human Players vs 10 Bots** matches.

## Key Features

- **5 Full-Height Stadium Operator Cards**:
  - **Operator Identity & Status**: Callsign, role badge, round multi-kill diamonds (`1K`–`5K`), reactive status pills (`FLASHED %`, `BURNING`, `C4 CARRIER`, `DEFUSE KIT`, `ELIMINATED // KIA`).
  - **Giant Vitals Readout**: `56px` tabular Health readout, Kevlar + Helmet armor indicator, and a dual-layer 10-segment Health Bar with animated red damage-trail decay.
  - **Primary & Secondary Weapon Showcase**: Custom vector silhouettes (`AK-47`, `M4A1-S`, `M4A4`, `AWP`, `MP9`, `MAC-10`, `Galil AR`, `FAMAS`, `Desert Eagle`, `USP-S`, `Glock-18`, `Knife`), skin finish subtitle, giant clip/reserve ammo counter, segmented magazine depletion bar, and holstered sidearm strip.
  - **Utility Belt & Economy**: 4-slot grenade rack (`SMOKE`, `FLASH`, `HE GREN`, `MOLOTOV`) + `DEFUSE KIT` / `C4 BOMB` slot, live player Bank (`$`) and Loadout Value (`$`).
  - **Presenter Analytics Footer**: `KILLS`, `DEATHS`, `ASSISTS`, `ADR`, `K/D Ratio`, `HS%`, and a live `ROUND DMG` meter.
- **Top Stadium Scoreboard (5 vs 10)**:
  - **Left Wing (Human Squad)**: Faction badge (`CT` / `T`), Squad Name, Team Bank & Loadout Value totals, 5-operator alive pips, and team score.
  - **Center Match & C4 Clock**: Map & Round badge, giant countdown clock, animated **40.0s C4 Bomb Countdown** with **10s No-Kit** and **5s Defuse Kit** cutoff markers, and dynamic Stadium Callout Banner.
  - **Right Wing (10-Bot Swarm)**: 10-pip Bot Swarm Alive Matrix (`10 / 10`) showing individual bot health levels, aggregate swarm HP, and threat status.
- **Live Killfeed & Presenter Controls**:
  - Real-time scrolling killfeed ticker with weapon tags and `[HS]` badges.
  - Built-in **Simulation Engine** + one-click scenario triggers (`FIREFIGHT`, `PLANT C4`, `FLASH SQUAD`, `1v4 CLUTCH`, `NEW ROUND`, `SWAP CT/T`).
- **Dual CS2 Game State Integration (GSI)**:
  1. **Single Spectator / Observer PC (`allplayers` mode)**: Streams all 5 human players + all 10 bots automatically.
  2. **5 Individual Player PCs (`multi_client` aggregation mode)**: Each human player drops `gamestate_integration_cs2dash.cfg` on their gaming PC pointing to the dashboard server IP, and the server merges all 5 live player states into the 5 stadium cards.

## Quick Start

```bash
npm start
```

Open `http://localhost:3000` on your 1080p display. Click **GSI .CFG / ROSTER** in the top-right presenter bar to download `gamestate_integration_cs2dash.cfg` pre-filled with your server's LAN IP address.
