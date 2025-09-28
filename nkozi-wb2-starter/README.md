# Nkozi — World Build II (MVP)

A human‑verified music discovery mini‑app MVP: mock World ID, upload, feed+player,
simulated WLD rewards, and a tiny royalty‑split contract (60/40 ETH) on testnet.

## Workspaces
- `contracts/` — Hardhat + RoyaltySplitter (ETH, 60/40)
- `web/` — Next.js (App Router) with JSON‑backed APIs and minimal pages

## Quickstart

### Prereqs
- Node 18+
- pnpm or npm

### Contracts
1. Copy `.env.example` to `.env` in `contracts/` and set:
   - `ARTIST=0xYourArtistAddr`
   - `PLATFORM=0xYourTreasuryAddr`
2. Install deps and compile:
   - `pnpm i` (or `npm i`) in `contracts/`
   - `pnpm hardhat compile`
3. Deploy RoyaltySplitter (World Chain Sepolia, chainId 4801):
   - `pnpm hardhat run script/deploy.ts --network worldchain_sepolia`
   - Save the deployed address for tips.

### Web
1. Install deps in `web/`:
   - `pnpm i` (or `npm i`)
2. Run dev server:
   - `pnpm dev`
3. Data is stored in `web/data/*.json` automatically on first run.

## Demo Steps (Definition of Done)
1. Open `http://localhost:3000/upload`.
   - Enter your address in the input.
   - Click "Mock Login + Verify" (sets `verified=true`).
   - Fill Title + Audio URL (mp3) and Submit.
2. Open `http://localhost:3000/feed`.
   - Press Play. On full listen (or >=30s), you should see a toast `+0.3 WLD`.
   - You can Like and Comment on a track.
   - To demo tips, paste your deployed `RoyaltySplitter` address in the Splitter field,
     then click "Tip 0.0001 ETH" to see the prebuilt tx object for `split()` on chainId `4801`.
3. Open `http://localhost:3000/dashboard`.
   - Enter your address to view total WLD accrued and daily remaining cap.

Notes:
- Product copy references a default 60/20/20 split (artist/fans/treasury) for discovery.
- The royalty contract demo uses a 60/40 ETH splitter (artist/treasury) for tips only.
- Rewards are simulated and persisted to JSON; caps are controlled by env:
  - `REWARD_PER_LISTEN_WLD` (default 0.3)
  - `DAILY_CAP_WLD` (default 5)

## Helpful Links (WORLD / FWB / TFH LINKS)
- Worldcoin / World ID: …
- FWB: …
- TFH / World Chain: …

