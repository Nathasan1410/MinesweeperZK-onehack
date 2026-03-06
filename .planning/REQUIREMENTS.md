# Requirements: MinesweeperZK — OneHack 3.0

**Defined:** 2026-03-07
**Core Value:** Provably fair competitive gameplay with real betting — anyone can create a room, set their bet, and compete for prizes without trusting a central authority.

## v1 Requirements

Requirements for OneHack 3.0 submission. Each maps to roadmap phases.

### Wallet & Betting (WALLET)

- [ ] **WALLET-01**: User can connect OneWallet browser extension to the app
- [ ] **WALLET-02**: User can view connected wallet address and OCT balance
- [ ] **WALLET-03**: User can disconnect wallet from the app
- [ ] **WALLET-04**: User can create custom room with bet amount (in OCT)
- [ ] **WALLET-05**: User can set max player count for room (30-50 players)
- [ ] **WALLET-06**: User can join existing room by matching the bet amount
- [ ] **WALLET-07**: User can quick-match into available rooms at their selected bet level
- [ ] **WALLET-08**: Bet amounts are locked in Move contract escrow when game starts
- [ ] **WALLET-09**: Winners receive prize distribution automatically after game ends
- [ ] **WALLET-10**: House takes 5% cut from each prize pool (configurable 1-5%)

### Gameplay (GAME)

- [ ] **GAME-01**: All players in a room see the same deterministic 8x8 board
- [ ] **GAME-02**: Board is generated from combined seed hash(commit1 + commit2)
- [ ] **GAME-03**: UI is clean, minimal, Wordle-inspired (not AI-looking)
- [ ] **GAME-04**: Time pressure mechanic: score decreases as time passes
- [ ] **GAME-05**: Scoring: 500 points for revealing all safe cells + 500 for correct flags
- [ ] **GAME-06**: Penalty: -50 points per wrong flag
- [ ] **GAME-07**: Players can see their own progress (revealed cells, flagged mines)
- [ ] **GAME-08**: Players can see their current ranking in the room
- [ ] **GAME-09**: Game ends when timer expires (15 minutes default)
- [ ] **GAME-10**: Game UI shows countdown timer visible to all players

### Fair Play (FAIR)

- [ ] **FAIR-01**: Player commits hash of their seed before game starts
- [ ] **FAIR-02**: Both seeds revealed after all players commit
- [ ] **FAIR-03**: Combined seed = hash(seed1 + seed2) generates deterministic board
- [ ] **FAIR-04**: Neither player can predict board before both commit
- [ ] **FAIR-05**: Firebase validates moves server-side (no clicking mines, no double-clicks)
- [ ] **FAIR-06**: Move contract verifies Firebase signature before distributing prizes

### Multiplayer Rooms (ROOM)

- [ ] **ROOM-01**: Room list shows: bet amount, current/max players, status
- [ ] **ROOM-02**: Room status: Waiting (open), Full (starting soon), Playing, Completed
- [ ] **ROOM-03**: Quick match filters rooms by player's bet amount
- [ ] **ROOM-04**: Firebase syncs room state in real-time (player join/leave)
- [ ] **ROOM-05**: Players see countdown (30 seconds) when room reaches max players
- [ ] **ROOM-06**: Room creator can set custom bet amount (within min/max limits)
- [ ] **ROOM-07**: Min bet: 1 OCT, Max bet: 100 OCT (configurable)

### Prize Distribution (PRIZE)

- [ ] **PRIZE-01**: Top 10% of players win (rounded up, e.g., 5 winners for 50 players)
- [ ] **PRIZE-02**: 1st place receives 40% of prize pool
- [ ] **PRIZE-03**: 2nd place receives 25% of prize pool
- [ ] **PRIZE-04**: 3rd place receives 15% of prize pool
- [ ] **PRIZE-05**: 4th through 10th percentile: remaining 20% split equally
- [ ] **PRIZE-06**: Distribution happens automatically via Move contract call
- [ ] **PRIZE-07**: Players can view prize breakdown before joining room

### Hackathon Submission (SUBMIT)

- [ ] **SUBMIT-01**: Working MVP deployed and accessible via URL
- [ ] **SUBMIT-02**: OneWallet integration functional (connect, bet, receive winnings)
- [ ] **SUBMIT-03**: Demo video recorded (max 3 minutes)
- [ ] **SUBMIT-04**: GitHub repo public with complete code
- [ ] **SUBMIT-05**: Google Drive compilation: project description, GitHub link, demo video, website URL
- [ ] **SUBMIT-06**: Move contract deployed to OneChain testnet
- [ ] **SUBMIT-07**: Contract verified on OneScan explorer

## v2 Requirements

Deferred to future releases. Tracked but not in current roadmap.

### Enhanced Features

- **NFT-01**: Non-tradeable NFT badges for gameplay history ("Participated in 50-player room", "Top 3 finish")
- **NFT-02**: NFT rewards distributed automatically to winners
- **PVP-01**: 4-player mini rooms (faster games, smaller pools)
- **PVP-02**: 1v1 duel mode (direct head-to-head matches)
- **TOUR-01**: 100-player tournament bracket mode
- **TOUR-02**: Multi-round elimination tournaments
- **POWER-01**: Power-up items (time freeze, mine reveal, score multiplier)

### Platform Features

- **LEADER-01**: Global leaderboards (all-time highest scores)
- **LEADER-02**: Weekly/monthly leaderboard resets
- **SOCIAL-01**: Share results on social media
- **SOCIAL-02**: Invite friends to private rooms
- **PROFILE-01**: Player profile with stats (games played, win rate, total winnings)

## Out of Scope

Explicitly excluded from MinesweeperZK for OneHack 3.0.

| Feature | Reason |
|---------|--------|
| ZK proofs (o1js, zk circuits) | Too complex for $100 target; commit-reveal achieves fairness without heavy crypto |
| 4-player mini mode | Defer to v2; focus on large-room battle royale differentiation |
| 100-player tournament bracket | Too ambitious for hackathon timeline; single-room MVP first |
| NFT history rewards | Adds unnecessary complexity; not required for submission |
| Power-ups | Contradicts "clean skill-based gameplay" vision |
| Global leaderboards | Not required for hackathon; nice-to-have |
| Cross-chain support | OneChain only for this hackathon |
| Mobile app | Web-first; mobile responsiveness sufficient |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| WALLET-01 | Phase 1 | Pending |
| WALLET-02 | Phase 1 | Pending |
| WALLET-03 | Phase 1 | Pending |
| WALLET-04 | Phase 2 | Pending |
| WALLET-05 | Phase 2 | Pending |
| WALLET-06 | Phase 2 | Pending |
| WALLET-07 | Phase 2 | Pending |
| WALLET-08 | Phase 3 | Pending |
| WALLET-09 | Phase 3 | Pending |
| WALLET-10 | Phase 3 | Pending |
| GAME-01 | Phase 4 | Pending |
| GAME-02 | Phase 4 | Pending |
| GAME-03 | Phase 4 | Pending |
| GAME-04 | Phase 4 | Pending |
| GAME-05 | Phase 4 | Pending |
| GAME-06 | Phase 4 | Pending |
| GAME-07 | Phase 4 | Pending |
| GAME-08 | Phase 4 | Pending |
| GAME-09 | Phase 4 | Pending |
| GAME-10 | Phase 4 | Pending |
| FAIR-01 | Phase 2 | Pending |
| FAIR-02 | Phase 2 | Pending |
| FAIR-03 | Phase 2 | Pending |
| FAIR-04 | Phase 2 | Pending |
| FAIR-05 | Phase 5 | Pending |
| FAIR-06 | Phase 3 | Pending |
| ROOM-01 | Phase 2 | Pending |
| ROOM-02 | Phase 2 | Pending |
| ROOM-03 | Phase 2 | Pending |
| ROOM-04 | Phase 2 | Pending |
| ROOM-05 | Phase 2 | Pending |
| ROOM-06 | Phase 2 | Pending |
| ROOM-07 | Phase 2 | Pending |
| PRIZE-01 | Phase 3 | Pending |
| PRIZE-02 | Phase 3 | Pending |
| PRIZE-03 | Phase 3 | Pending |
| PRIZE-04 | Phase 3 | Pending |
| PRIZE-05 | Phase 3 | Pending |
| PRIZE-06 | Phase 3 | Pending |
| PRIZE-07 | Phase 2 | Pending |
| SUBMIT-01 | Phase 6 | Pending |
| SUBMIT-02 | Phase 6 | Pending |
| SUBMIT-03 | Phase 6 | Pending |
| SUBMIT-04 | Phase 6 | Pending |
| SUBMIT-05 | Phase 6 | Pending |
| SUBMIT-06 | Phase 3 | Pending |
| SUBMIT-07 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 47 total
- Mapped to phases: 47
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-07*
*Last updated: 2026-03-07 after initial definition*
