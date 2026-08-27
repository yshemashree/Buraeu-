# Bureau Fraud Arena - GFF 2026

This application houses both the interactive games (Experience 1) and the AI Demo Area (Experience 2) for the Bureau booth at GFF 2026.

## Fully Offline Deployment

This application is configured for a **fully offline** air-gapped LAN environment. It does not require internet access, with the *sole exception* of Game 2 ("Beat the Deepfake System"), which is a redirect to a live client URL.

### 1. Build & Self-Host
- The event must run on a physical host machine (e.g. a local laptop/server) at the booth.
- Install dependencies: `npm install`
- Build the app: `npm run build`
- Start the server: `npm start`

### 2. Local Network Setup
- Connect the host machine, all iPads, the LED wall controller, and the 4 AI Demo screens to a single local router (LAN).
- Give the host machine a **static IP** (e.g., `192.168.1.10`) or set a DHCP reservation on the router.

### 3. Point Devices at the Local Host
Set each kiosk device to auto-launch the local URLs in kiosk mode:
- **Registration & Games (iPads):** `http://192.168.1.10:3000/join`
- **LED Wall (Live Gameplay):** `http://192.168.1.10:3000/` (or whatever the live view URL is)
- **AI Demo Screen 1 (Vertical - Identity):** `http://192.168.1.10:3000/ai-demo/1`
- **AI Demo Screen 2 (Vertical - Security):** `http://192.168.1.10:3000/ai-demo/2`
- **AI Demo Screen 3 (Vertical - Fraud):** `http://192.168.1.10:3000/ai-demo/3`
- **AI Demo Screen 4 (Horizontal - Monitor):** `http://192.168.1.10:3000/ai-demo/4`

## Admin Panel
Access the host panel at `http://192.168.1.10:3000/admin` to:
- Update the Game 2 redirect link ("Beat the Deepfake System").
- Toggle Global Leaderboard or Waitlist features on/off.
- View live event metrics, leaderboard, and user registration data.
- Download CSV/Excel reports.

## Testing Protocol (Verify Offline Readiness)
Code review is not sufficient proof. Before the event, physically test the air-gap:

1. **Disconnect the internet** (unplug WAN or disable Wi-Fi on the router).
2. Open network devtools on a device and confirm **zero failed/pending requests** to external domains (fonts, images, analytics).
3. E2E Test:
   - Register a new user on a tablet.
   - Play Spot the Fraud and Crack the Fraud Network; verify scores post to the leaderboard correctly without internet.
   - Verify the LED Wall mirrors gameplay.
   - Test Beat the Deepfake System. (This is the *only* piece that should fail or timeout if there's no internet).
   - Attempt a duplicate registration; verify the 409 conflict error displays.
   - Tap through the 4 AI Demo screens and wait for the 45-second inactivity timeout to return them to the video loops.
   - Open the `/admin` panel and ensure settings load successfully.
