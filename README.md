# Nkozi — World Build 2 (nkozi-wb2)

Status: MVP / hackathon demo  
A human-verified music discovery mini-app combining World Wallet auth and World ID verification so verified listeners can discover and tip artists with wallet-native payouts.

Developer guide: [nkozi-wb2-starter/README.md](nkozi-wb2-starter/README.md) — contains full quickstart, env examples, deploy & demo steps.

Quick overview
- Project: Nkozi — World Build II (nkozi-wb2)
- Goal: Enable fair music discovery and micro-payouts to creators by combining proof-of-human with wallet-native payments.
- Languages: TypeScript (frontend/backend), Solidity (contracts)

Why it matters
- Anti-sybil verification via World ID improves signal quality for discovery and reduces bot manipulation.
- Wallet-native payouts (World Wallet / simulated WLD) enable low-friction tipping and creator monetization.
- Use cases: creator tipping, verified listening rewards, artist discovery, demo for Web3 music primitives.

What’s inside
- web/ — Next.js frontend (App Router) with JSON-backed APIs and minimal pages
- contracts/ — Solidity payment & royalty splitter contracts
- nkozi-wb2-starter/ — detailed developer README, demo steps, env examples, and scripts
- docs/ — architecture diagram and evaluation artifacts (add docs/architecture.png)
- demo/ — screenshots or short GIFs for the README and LinkedIn links

Quickstart (high level)
1) Clone
```bash
git clone git@github.com:sleeplesselitist/nkozi-wb2.git
cd nkozi-wb2
```

2) Install deps (root and workspace-specific)
```bash
# From repo root
npm install           # or pnpm install / yarn
# For contracts
cd contracts && npm install
# For web
cd ../web && npm install
```

3) Environment
- Copy example env files and set keys (World API keys, RPC URL, PRIVATE_KEY if needed)
```bash
cp .env.example .env
cp contracts/.env.example contracts/.env
cp web/.env.example web/.env
# Edit values in .env files
```

4) Run locally
```bash
# Example: run frontend dev server
cd web
npm run dev
# If you use Hardhat for contracts
cd ../contracts
npx hardhat node
npx hardhat test
```

Demo / Definition of Done (high-level)
- /upload: Mock Login + Verify -> sets `verified=true` (MVP)
- /feed: play a track (>=30s) -> simulated `+0.3 WLD` toast; users can tip and comment
- /dashboard: view accrued simulated WLD and remaining daily cap
- Notes: demo rewards are simulated and persisted to JSON in `web/data/*.json`; caps controlled by `REWARD_PER_LISTEN_WLD` and `DAILY_CAP_WLD`

Architecture (summary)
- Flow: Browser -> World Wallet sign-in -> World ID verify (Orb) -> Frontend -> Backend/API -> Smart Contracts (Payment / RoyaltySplitter)
- Suggested diagram: `docs/architecture.png`
- Key modules (examples)
  - `web/src/auth.ts` — wallet auth + verify flows
  - `web/src/payouts.ts` — payout orchestration (simulate or call contract)
  - `contracts/Payment.sol`, `contracts/RoyaltySplitter.sol`

Roadmap / next milestones
- ◻ Integrate Cloud Verifier for production World ID verification
- ◻ Persist rewards to an on-chain or secure backend store (beyond demo JSON)
- ◻ Add on-chain receipts and gas optimization for Payment.sol
- Good-first issue: add a seed script to pre-populate demo tracks and sample users

Topics (add to GitHub About → Topics)
web3, world-wallet, world-id, music, payments, hardhat, typescript

License
License: MIT — include a LICENSE file at the repo root
