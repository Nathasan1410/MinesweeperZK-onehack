# MinesweeperZK — Provably Fair Competitive Minesweeper

**OneHack 3.0 Submission** | [OneChain](https://onechain.gg/) | GameFi Track

> Battle royale Minesweeper where 30-50 players compete for real OCT prizes. Provably fair gameplay powered by OneChain blockchain.

---

## 🎮 Features

### Core Gameplay
- **8x8 Minesweeper Board** — Classic gameplay with competitive scoring
- **30-50 Player Rooms** — Battle royale format, not typical 1v1
- **Real-Time Leaderboard** — See your ranking as you play
- **Score Decay** — Faster completion = higher score

### Blockchain Integration
- **OneWallet Connection** — Secure wallet via Wallet Standard API
- **OCT Betting** — Real betting on OneChain testnet
- **Escrow Contract** — Bets held securely in Move contract
- **Auto Prize Distribution** — Top players paid automatically

### Prize System
| Rank | Prize % | Example (100 OCT pool) |
|------|---------|------------------------|
| 1st | 40% | 40 OCT |
| 2nd | 25% | 25 OCT |
| 3rd | 15% | 15 OCT |
| 4th | 10% | 10 OCT |
| 5th | 10% | 10 OCT |
| **House Fee** | 5% | 5 OCT |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OneWallet browser extension
- npm or bun

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/minesweeperzk-onehack.git
cd minesweeperzk-onehack

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
minesweeperzk-onehack/
├── app/                    # Next.js 16 app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── game/              # Game pages
├── components/
│   ├── game/              # Minesweeper board, cells, HUD
│   ├── room/              # Room creation, lobby, results
│   └── layout/            # Header, navigation
├── contracts/
│   ├── sources/           # Move contract source code
│   ├── Move.toml          # Move package config
│   └── deploy.ts          # Deployment script
├── hooks/
│   ├── useWallet.ts       # OneWallet integration
│   ├── useContract.ts     # Contract interaction
│   └── useRoom.ts         # Room management
├── lib/
│   ├── contract/          # Contract service layer
│   ├── wallet/            # Wallet utilities
│   ├── firebase/          # Firebase configuration
│   └── game/              # Minesweeper logic
├── __tests__/             # Unit tests (Vitest)
├── __e2e__/               # E2E tests (Playwright)
└── types/                 # TypeScript types
```

---

## 🧪 Testing

### Unit Tests
```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
```

### E2E Tests
```bash
npm run test:e2e       # Run Playwright tests
npm run test:e2e:ui    # Playwright UI mode
npm run test:e2e:report # Show HTML report
```

**Test Coverage:** 30 tests passing
- Wallet tests: 11 (connection, balance, disconnect)
- Contract tests: 19 (prize distribution, house fee, deployment)

---

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xplaceholder
NEXT_PUBLIC_NETWORK=testnet
IS_DEMO_MODE=true
```

### Vercel Deployment

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

Production build:
```bash
npm run build
npm start
```

---

## 🎯 OneHack 3.0 Submission

### Submission Checklist
- [x] Working MVP with OneWallet integration
- [x] Move contract deployed (testnet)
- [x] E2E tests passing
- [x] GitHub repository public
- [ ] Demo video (YouTube)
- [ ] OneHack submission form

### Demo Video Script
1. **Wallet Connection** — Connect OneWallet, show balance
2. **Room Creation** — Create room with bet amount
3. **Gameplay** — Play Minesweeper, see score update
4. **Results** — View rankings and prize distribution

---

## 📋 Game Rules

### Objective
Reveal all safe cells (non-mines) faster than opponents.

### Scoring Formula
```
Score = (revealed/54 × 500) + (correct_flags/10 × 500) - (wrong_flags × 50)
```

### Game Flow
1. **Create Room** — Set bet amount (1-100 OCT), max players (30-50)
2. **Join Room** — Match bet amount to enter
3. **Commit Seeds** — All players commit hash for fair board generation
4. **Game Starts** — Host triggers start (no waiting for full room)
5. **Play** — 15 minutes to complete
6. **Submit Score** — Signed result submitted to contract
7. **Distribute Prizes** — Top 5 players receive OCT

---

## 🔐 Security

### Provably Fair
- **Commit-Reveal Protocol** — All players commit seeds before game
- **Combined Seed** — Final board generated from all seeds
- **Client-Side Board** — Each player generates board locally
- **Server Validation** — Firebase validates moves before scoring

### Smart Contract
- **Escrow Pattern** — Bets locked until distribution
- **Atomic Distribution** — All prizes paid in single transaction
- **5% House Fee** — Automatically collected

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19 |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Blockchain | OneChain (Move) |
| Wallet | OneWallet (Wallet Standard) |
| Backend | Firebase Realtime Database |
| Testing | Vitest (unit), Playwright (E2E) |
| Deployment | Vercel |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Nathanael Santoso** — Solo Developer

- GitHub: [@yourusername](https://github.com/yourusername)
- OneHack 3.0 — GameFi Track

---

## 🔗 Links

- [OneChain Documentation](https://onechain.gg/)
- [Wallet Standard API](https://wallet-standard.com/)
- [Next.js Documentation](https://nextjs.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)

---

*Built for OneHack 3.0 — March 2026*
