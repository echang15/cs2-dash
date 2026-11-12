# Deploying CS2 Stadium Dashboard to a Synology NAS

This app runs as a lightweight `node:20-alpine` container (amd64 & arm64 compatible) with persistent storage at `/app/data` for your match history and performance trends over time.

## Option 1: Synology Container Manager (Docker Compose Project)

1. Copy this repository folder (for example to `/volume1/docker/cs2-dash`) on your Synology NAS.
2. Create an empty `data` subfolder inside `/volume1/docker/cs2-dash/data` so Container Manager can mount it cleanly.
3. Edit `docker-compose.yml` if you want to set your NAS LAN IP (`HOST_IP=192.168.x.x`) and timezone (`TZ`).
4. Open **Container Manager** in DSM -> **Project** -> **Create**:
   - **Project name**: `cs2-dash`
   - **Path**: `/volume1/docker/cs2-dash`
   - **Source**: Use existing `docker-compose.yml`
5. Start the project. The dashboard will be live at `http://<SYNOLOGY_IP>:3000`.

## Option 2: Build & Export Image from Your PC

If you prefer building locally and importing the `.tar` image into Synology Container Manager:

```bash
# Multi-arch or x86_64 NAS (most Plus-series Synology models use linux/amd64)
docker build --platform linux/amd64 -t cs2-dash:latest .
docker save -o cs2-dash.tar cs2-dash:latest
```

Then in Synology **Container Manager -> Image -> Add -> Add from file**, import `cs2-dash.tar`, launch it on port `3000:3000`, and mount a NAS folder (e.g., `/docker/cs2-dash/data`) to `/app/data`.

## Pointing CS2 to Your Synology NAS

Open `http://<SYNOLOGY_IP>:3000` on your gaming PC, open **GSI SETUP & CONFIG**, and download `gamestate_integration_cs2dash.cfg` into:

`.../Counter-Strike Global Offensive/game/csgo/cfg/gamestate_integration_cs2dash.cfg`

When you download the `.cfg` from the NAS URL, it automatically points CS2 GSI packets to `http://<SYNOLOGY_IP>:3000/gsi`.
