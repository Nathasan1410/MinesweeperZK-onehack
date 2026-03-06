# MinesweeperZK — OneHack 3.0

## What This Is

MinesweeperZK is a competitive multiplayer Minesweeper game built on OneChain's Move-based infrastructure. Players wager OCT tokens in skill-based matches where the top 10% of performers win from the prize pool. Built for OneHack 3.0 AI-GameFi hackathon, targeting the $100 participation reward.

## Core Value

Provably fair competitive gameplay with real betting — anyone can create a room, set their bet, and compete for prizes without trusting a central authority.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Wallet & Betting**
- [ ] User can connect OneWallet browser extension
- [ ] User can view OCT balance in connected wallet
- [ ] User can create custom room with bet amount and player count (30-50 players)
- [ ] User can join existing room by matching bet amount
- [ ] User can quick-match into available rooms at their bet level
- [ ] Bet amounts are held in escrow smart contract during gameplay
- [ ] Winners receive prize distribution automatically after game ends
- [ ] House takes 1-5% cut from each prize pool (configurable)

**Gameplay**
- [ ] All players in a room play the same deterministic board
- [ ] Board is generated from combined seed (both players commit + reveal)
- [ ] Game UI is clean, minimal, Wordle-inspired (not AI-generated looking)
- [ ] Time pressure mechanic exists (faster = better score)
- [ ] Score system: 500 points for reveals + 500 points for correct flags - 50 per wrong flag
- [ ] Players can see their own progress and ranking during game
- [ ] Game ends when time expires or all players finish

**Fair Play**
- [ ] Seed commitment protocol: hash(s1 + s2) generates deterministic board
- [ ] Neither player can predict or manipulate the board before commit
- [ ] Firebase validates moves server-side to prevent cheating
- [ ] Move contract verifies Firebase signature before distributing prizes

**Multiplayer Rooms**
- [ ] Room creator can customize: bet amount, max players (30-50)
- [ ] Room list shows: bet amount, player count, room status (waiting/full/playing)
- [ ] Quick match finds rooms matching player's bet amount
- [ ] Firebase syncs room state in real-time
- [ ] Players see countdown timer until game starts (when room is full)

**Prize Distribution**
- [ ] Top 10% of players win (rank-weighted distribution)
- [ ] 1st place: 40% of prize pool
- [ ] 2nd place: 25% of prize pool
- [ ] 3rd place: 15% of prize pool
- [ ] 4th-10th percentile: remaining 20% split equally
- [ ] Distribution happens automatically via Move contract

**Hackathon Submission**
- [ ] Working MVP deployed to OneChain testnet
- [ ] OneWallet integration functional (connect, bet, receive)
- [ ] Demo video (max 3 minutes) recorded
- [ ] GitHub repo public with code
- [ ] Google Drive compilation: description, GitHub, demo, website

### Out of Scope

- **ZK proofs (o1js)** — Too complex for $100 target; commit-reveal achieves fairness without heavy crypto
- **4-player mini mode** — Defer to v2; focus on large-room battle royale
- **100-player tournament bracket** — Too ambitious; single-room MVP first
- **NFT history rewards** — Defer to v2; adds unnecessary complexity
- **Power-ups** — Contradicts "clean skill-based gameplay" vision
- **Leaderboards** — Not required for hackathon submission
- **Cross-chain support** — OneChain only for this hackathon

## Context

**Hackathon Constraints:**
- Deadline: March 27, 2026, 11:59 PM (UTC+7)
- Must integrate OneWallet (basic functionality required)
- Must be built on OneChain's Move-based infrastructure
- Must have working MVP + demo video + GitHub repo
- Target: $100 participation reward (not top 3 prizes)

**Tech Stack (from old repo + new requirements):**
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- Blockchain: OneChain (Move-based, Sui-compatible)
- Wallet: OneWallet browser extension
- Smart Contract: Move (Rust-like language for OneChain)
- Realtime: Firebase Realtime Database (working in old repo)
- State Management: Zustand
- Deployment: Vercel (frontend), OneChain testnet (contracts)

**What Worked in Old Repo:**
- Firebase room management and real-time sync
- Seed commitment protocol design
- Scoring system (500 reveal + 500 flags - penalties)
- 8x8 board with 10 mines (54 safe cells)
- Component structure (game board, cell, HUD, summary)

**What Didn't Work in Old Repo:**
- UI looked "AI-generated" — needs clean, minimal redesign
- Gameplay not engaging — needs time pressure, better feedback
- Only 1v1 support — needs 30-50 player rooms
- No quick match or customizable bets
- Minimal features — needs room customization, prize distribution

**OneChain Ecosystem (from research):**
- CLI: `one` (not `sui`)
- Coin: OCT (`0x2::oct::OCT`)
- OneWallet integration required for submissions
- Move contracts similar to Sui patterns
- Testnet faucet available: https://faucet-testnet.onelabs.cc
- Explorer: https://onescan.cc/testnet/

## Constraints

- **Timeline**: ~20 days until deadline (March 27, 2026)
- **Budget**: $0 — using free tiers (Vercel, Firebase, OneChain testnet)
- **Team**: Solo developer (Nathanael Santoso)
- **Tech Stack**: Must use OneChain Move infrastructure (hackathon requirement)
- **OneWallet**: Must integrate OneWallet for betting (hackathon requirement)
- **Scope**: Targeting $100 participation prize, not top 3 ($3000/$2000/$1000)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Commit-reveal instead of ZK proofs | ZK (o1js) adds 30+ second proof times, complex circuit design, and porting work from Stellar to Move. Commit-reveal achieves provable fairness with instant verification. | — Pending |
| Rank-weighted prize distribution | Equal split among top 10% doesn't reward skill. Weighted distribution (40/25/15/20) incentivizes competitive play. | — Pending |
| 30-50 player rooms | Battle royale format differentiates from typical 1v1. Large rooms create excitement and larger prize pools. | — Pending |
| Firebase for game validation | Server-side validation via Firebase Cloud Functions simplifies client logic and prevents cheating without complex ZK circuits. | — Pending |
| Clean/minimal UI (Wordle-inspired) | Old UI looked "AI-generated". Wordle's clean design is easy to implement and looks professional. | — Pending |
| Fine granularity + parallel execution | Hackathon deadline requires detailed tracking. Parallel plans speed up execution. | ✓ Good |

## OneChain Integration Notes

**OneWallet Flow:**
1. User installs OneWallet browser extension
2. User connects to OneChain testnet
3. User gets test OCT from faucet: https://faucet-testnet.onelabs.cc
4. Frontend uses Wallet Standard API to connect
5. Transactions signed via OneWallet
6. Contract calls through OneChain RPC

**Move Contract Structure:**
```
minesweeper_bet/
├── sources/
│   ├── core.move        # Main betting logic
│   ├── room.move        # Room management
│   └── distribution.move # Prize distribution
```

**Key Contract Functions:**
- `create_room(bet_amount, max_players) → room_id`
- `join_room(room_id) → success`
- `submit_score(room_id, score, signature) → verified`
- `distribute_prizes(room_id) → transfers`

---
*Last updated: 2026-03-07 after project initialization*
