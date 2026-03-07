# Roadmap: MinesweeperZK — OneHack 3.0

**Created:** 2026-03-07
**Target:** OneHack 3.0 Submission (March 27, 2026)
**Prize Goal:** $100 Participation Reward

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation & Setup | Project scaffolding, OneWallet connection | WALLET-01, WALLET-02, WALLET-03 | User can connect/disconnect OneWallet and see balance |
| 2 | Room System | Multiplayer room creation, matchmaking, Firebase sync | WALLET-04-07, FAIR-01-04, ROOM-01-07, PRIZE-07 | User can create/join rooms, see room list, quick match |
| 3 | Move Contracts | Betting escrow, prize distribution, house cut | WALLET-08-10, FAIR-06, PRIZE-06, SUBMIT-06, SUBMIT-07 | Contract deployed, bets held, prizes distributed |
| 4 | Core Gameplay | Minesweeper game UI, scoring, time pressure | GAME-01-10 | User can play Minesweeper, see score, timer works |
| 5 | Gameplay Wiring | Connect game to rooms, start game, score decay | GAME-02, GAME-04, GAME-08 | Game starts when host clicks, score decays with time |
| 6 | OneChain Integration | Real OneWallet, Move contract, OCT transfers | WALLET-01-03, WALLET-08-10, PRIZE-06 | OneWallet connects, contract deployed, real betting works |
| 7 | E2E Verification & Submission | Test full flow, deploy, submit | SUBMIT-01-05 | E2E tested, Vercel deployed, demo video, submission form |

---

## Phase Details

### Phase 1: Foundation & Setup

**Goal:** Scaffold project structure and enable OneWallet connection

**Requirements:** WALLET-01, WALLET-02, WALLET-03

**Success Criteria:**
1. Next.js 16 project running locally with Tailwind CSS v4
2. OneWallet extension connects successfully via Wallet Standard API
3. User's wallet address displays in UI header
4. OCT balance displays next to address
5. User can disconnect wallet (clears state)
6. Basic clean/minimal UI shell (Wordle-inspired design system)

**Deliverables:**
- `frontend/` — Next.js app with shadcn/ui components
- `lib/wallet/` — OneWallet connection hooks
- `components/layout/` — Header with wallet connection
- Design system: colors, typography, spacing (clean, minimal)

**Tech Decisions:**
- OneChain testnet as default network
- Wallet Standard API for OneWallet integration
- Zustand for global state management

---

### Phase 2: Room System

**Goal:** Multiplayer room creation, matchmaking, and real-time sync

**Requirements:** WALLET-04, WALLET-05, WALLET-06, WALLET-07, FAIR-01, FAIR-02, FAIR-03, FAIR-04, ROOM-01, ROOM-02, ROOM-03, ROOM-04, ROOM-05, ROOM-06, ROOM-07, PRIZE-07

**Success Criteria:**
1. User can create room with: bet amount (1-100 OCT), max players (30-50)
2. Room appears in public room list with details
3. User can join room by matching bet amount
4. Quick match auto-finds available room at user's bet level
5. Firebase syncs player count in real-time
6. Room shows status: Waiting / Full / Starting Soon
7. 30-second countdown starts when room reaches max players
8. Seed commitment: all players commit hash before game starts
9. Seeds revealed, combined seed = hash(seed1 + seed2)
10. Prize breakdown visible before joining (e.g., "50 players × 10 OCT = 475 OCT prize pool")

**Deliverables:**
- `lib/firebase/` — Firebase initialization, room hooks
- `components/lobby/` — Room list, room cards, filters
- `components/room/` — Room detail, player list, countdown
- `components/seed-commit/` — Commit/reveal flow UI
- Firebase Realtime Database rules and structure
- Move contract: room management module (Phase 3 integration)

**Tech Decisions:**
- Firebase Realtime Database for low-latency sync
- Commit-reveal protocol for fair board generation
- Room creator sets parameters; no special privileges

---

### Phase 3: Move Contracts

**Goal:** Deploy betting escrow and prize distribution contracts on OneChain

**Requirements:** WALLET-08, WALLET-09, WALLET-10, FAIR-06, PRIZE-06, SUBMIT-06, SUBMIT-07

**Success Criteria:**
1. Move package deployed to OneChain testnet
2. Contract address verified on OneScan explorer
3. `create_game(room_id, bet_amount)` locks OCT in escrow
4. `submit_score(room_id, score, firebase_signature)` verifies signature
5. `distribute_prizes(room_id)` sends OCT to top 10% winners
6. House cut (5%) goes to organizer wallet
7. Contract emits events for each state change
8. Frontend can call contract functions via OneWallet

**Deliverables:**
- `contracts/sources/minesweeper_bet.move` — Main contract
- `contracts/sources/distribution.move` — Prize logic
- `contracts/Move.toml` — Move package config
- Deploy scripts (`one` CLI)
- Contract verification on OneScan
- Frontend hooks for contract interaction

**Tech Decisions:**
- OneChain Move (Sui-compatible patterns)
- OCT token (`0x2::oct::OCT`) for all betting
- Firebase signs results; contract verifies signature

---

### Phase 4: Core Gameplay

**Goal:** Implement Minesweeper game UI and scoring system

**Requirements:** GAME-01, GAME-02, GAME-03, GAME-04, GAME-05, GAME-06, GAME-07, GAME-08, GAME-09, GAME-10

**Success Criteria:**
1. 8x8 board renders (64 cells) with clean, minimal design
2. 10 mines placed deterministically from combined seed
3. Players can click to reveal cells, right-click to flag
4. Score updates in real-time: reveals + flags - penalties
5. Timer counts down from 15 minutes (visible to all players)
6. Players see their own progress: revealed/54 safe cells, flagged/10 mines
7. Players see current ranking in room (e.g., "You're #12 of 50")
8. Game ends when timer reaches 0 or all players finish
9. End-game summary shows: final score, rank, prize won
10. UI feels polished, not AI-generated (Wordle-inspired)

**Deliverables:**
- `components/game/board.tsx` — 8x8 grid
- `components/game/cell.tsx` — Individual cell (revealed/flagged/hidden)
- `components/game/hud.tsx` — Score, timer, progress
- `components/game/summary.tsx` — End-game results
- `lib/game/minesweeper.ts` — Board generation, scoring logic
- `lib/game/store.ts` — Zustand store for game state

**Tech Decisions:**
- Deterministic PRNG from combined seed
- Client-side board generation (never sent to server)
- Score formula: (revealed/54 × 500) + (correct_flags/10 × 500) - (wrong_flags × 50)

---

### Phase 6: OneChain Integration

**Goal:** Replace mock wallet with real OneWallet, deploy Move contract, enable real OCT betting

**Requirements:** WALLET-01, WALLET-02, WALLET-03, WALLET-08, WALLET-09, WALLET-10, PRIZE-06

**Plans:** 3 plans

**Success Criteria:**
1. OneWallet connects via Wallet Standard API (replaces mock wallet)
2. Real OCT balance displays (not mock 100 OCT)
3. Move contract deployed to OneChain testnet
4. Contract address verified on OneScan explorer
5. Bet placement locks OCT in escrow via contract
6. Prize distribution sends OCT to winners automatically
7. House cut (5%) transferred to organizer wallet
8. All contract calls work through OneWallet

**Plans:**
- [ ] 06-01-PLAN.md — OneWallet integration with balance fetching (Wave 1)
- [ ] 06-02-PLAN.md — Move contract fixes and deployment (Wave 2)
- [ ] 06-03-PLAN.md — Contract integration for betting/prizes (Wave 2)

**Deliverables:**
- `lib/wallet/` — OneWallet connection via Wallet Standard with balance fetching
- `contracts/sources/minesweeper_bet.move` — Fixed betting escrow contract
- `contracts/Move.toml` — Move package config with deployed address
- `lib/contract/` — Contract interaction hooks
- `__tests__/wallet/` — Wallet unit tests
- `__tests__/contract/` — Contract unit tests
- Deploy scripts (`one` CLI)
- OneScan verification

**Tech Decisions:**
- OneChain testnet as default network
- Wallet Standard API for OneWallet integration
- OCT token (`0x2::oct::OCT`) for all betting
- Contract handles escrow + distribution atomically

---

### Phase 7: E2E Verification & Submission

**Goal:** Test complete game flow, deploy to production, submit to OneHack 3.0

**Requirements:** SUBMIT-01, SUBMIT-02, SUBMIT-03, SUBMIT-04, SUBMIT-05

**Success Criteria:**
1. Full game played end-to-end (create room → join → play → prizes)
2. MVP deployed to Vercel (production URL)
3. OneWallet integration works in production
4. Demo video recorded (max 3 minutes) covering:
   - Wallet connection
   - Room creation/joining
   - Gameplay demo
   - Prize distribution
5. GitHub repo public with complete code
6. Google Drive submission folder complete
7. OneHack 3.0 submission form submitted before deadline

**Deliverables:**
- Vercel deployment (production URL)
- YouTube demo video (unlisted or public)
- Public GitHub repository
- Google Drive submission folder
- Completed submission form

**Timeline:**
- E2E Testing: March 15-20, 2026
- Vercel Deploy: March 21-24, 2026
- Demo Video: March 25, 2026
- Submit Form: March 27, 2026 (before 11:59 PM UTC+7)

---

### Phase 6 (Original): Game Validation

**Goal:** Server-side validation to prevent cheating

**Requirements:** FAIR-05

**Success Criteria:**
1. Firebase Cloud Function receives player moves
2. Function validates: cell not already revealed, no mine clicked
3. Invalid moves rejected with error message
4. Function signs final score with house private key
5. Signature format compatible with Move contract verification
6. Score submission includes: player address, score, signature, timestamp

**Deliverables:**
- `firebase/functions/validateMove.ts` — Move validation
- `firebase/functions/signResult.ts` — Result signing
- House key management (Firebase secrets)
- Signature verification in Move contract

**Tech Decisions:**
- Firebase Cloud Functions for server-side logic
- Ed25519 signatures (compatible with Move)
- House key stored in Firebase secrets, rotated periodically

---

### Phase 7 (Original): Hackathon Submission

**Goal:** Complete submission package for OneHack 3.0

**Requirements:** SUBMIT-01, SUBMIT-02, SUBMIT-03, SUBMIT-04, SUBMIT-05

**Success Criteria:**
1. MVP deployed to production (Vercel)
2. OneWallet integration fully functional in production
3. Demo video recorded (max 3 minutes) covering:
   - Wallet connection
   - Room creation/joining
   - Gameplay demo
   - Prize distribution
4. GitHub repo public with:
   - Complete frontend code
   - Move contracts
   - Firebase configuration
   - Setup instructions
5. Google Drive folder contains:
   - Project description/backstory
   - GitHub repo link
   - YouTube demo link
   - Website URL
   - Team info (Nathanael Santoso, solo)
6. OneHack 3.0 submission form completed
7. Contract verified on OneScan with public source code

**Deliverables:**
- Vercel deployment (production URL)
- YouTube demo video (unlisted or public)
- Public GitHub repository
- Google Drive submission folder
- Completed submission form

**Timeline:**
- Deploy MVP: March 25, 2026 (buffer for issues)
- Record demo: March 26, 2026
- Submit form: March 27, 2026 (before 11:59 PM UTC+7)

---

## Dependency Graph

```
Phase 1 (Foundation)
    ↓
Phase 2 (Room System) ← → Phase 3 (Move Contracts)
    ↓                           ↓
Phase 4 (Core Gameplay) ← → Phase 5 (Validation)
    ↓
Phase 6 (Submission)
```

**Critical Path:**
1. Phase 1 must complete before Phase 2 (need wallet for room creation)
2. Phase 2 must complete before Phase 4 (need rooms before gameplay)
3. Phase 3 must complete before Phase 5 (need contract for validation)
4. Phase 4 + Phase 5 must complete before Phase 6 (need working game for submission)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| OneWallet integration issues | Medium | High | Start early; use Wallet Standard API; have backup demo wallet |
| Move contract deployment fails | Medium | High | Use Sui-compatible patterns; test on testnet; leverage OneChain docs |
| Firebase scaling for 50 players | Low | Medium | Test load; optimize database rules; use batching |
| Prize distribution math errors | Low | High | Unit tests; simulate with mock data before deployment |
| UI still looks "AI-generated" | Medium | Low | Use Wordle as direct reference; minimal color palette; clean typography |
| Deadline missed | Medium | Critical | Buffer days built in; prioritize SUBMIT requirements over nice-to-haves |

---

## Success Metrics

**Hackathon Submission (Must Have):**
- ✓ Working MVP with OneWallet integration
- ✓ Demo video submitted
- ✓ GitHub repo public
- ✓ Move contract deployed and verified

**Participation Prize Criteria (Target):**
- ✓ Creativity: Battle royale Minesweeper (30-50 players)
- ✓ Quality: Clean UI, working gameplay, no major bugs
- ✓ Relevance: GameFi track, OneChain ecosystem
- ✓ Potential: 可扩展 to tournaments, NFTs, leaderboards

---

*Last updated: 2026-03-07 after roadmap update*
