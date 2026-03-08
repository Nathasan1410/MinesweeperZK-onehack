# Project State: MinesweeperZK — OneHack 3.0

**Current Phase:** Phase 7 — E2E Verification & Submission (IN PROGRESS)
**Current Sprint:** Phase 7 execution - Wave 1 (E2E infrastructure) complete, Test coverage achieved

---

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-03-07)

**Core Value:** Provably fair competitive gameplay with real betting — anyone can create a room, set their bet, and compete for prizes without trusting a central authority.

**Current Focus:** OneChain CLI installed, test coverage at 93.75%, ready for contract deployment

---

## Progress Dashboard

| Phase | Status | Plans | Progress |
|-------|--------|-------|----------|
| 1 — Foundation | ✓ Complete | 1/1 | 100% |
| 2 — Room System | ✓ Complete | 1/1 | 100% |
| 3 — Move Contracts | ✓ Complete | 1/1 | 100% |
| 4 — Core Gameplay | ✓ Complete | 1/1 | 100% |
| 5 — Gameplay Wiring | ✓ Complete | 3/3 | 100% |
| 6 — OneChain Integration | ✓ Complete | 7/7 | 100% |
| 7 — E2E Submission | ◐ In Progress | 2/5 | 40% |

**Overall:** Phases 1-6 complete, Phase 7 E2E infrastructure ready, test coverage 93.75%, OneChain CLI installed, repository pushed to GitHub

---

## Recent Activity

### 2026-03-08 — Phase 7 In Progress (Test Coverage + OneChain CLI Setup)

**Completed This Session:**
- ✅ OneChain CLI installed successfully (`one 1.1.1-c7bdbfd526f1`)
- ✅ LLVM/Clang installed (required for OneChain CLI)
- ✅ Test coverage increased from 62.5% to 93.75% (exceeds 85% target)
- ✅ Added 14 new tests for wallet utils (44 tests total)
- ✅ OneChain wallet configured (address: `0x143199da...`)
- ✅ Testnet environment configured
- ✅ STATE.md updated with progress

**Test Coverage Breakdown:**
- Statements: 93.75%
- Branches: 83.72%
- Functions: 100%
- Lines: 98.3%

**OneChain CLI Setup Status:**
- ✅ Wallet created and configured
- ✅ Testnet environment added
- ✅ Faucet tokens requested
- ⚠️ Contract needs OneChain-specific Move syntax adaptation

**Contract Deployment Notes:**
The Move contract was written for MoveOS stdlib patterns. OneChain uses a slightly different Move dialect (Sui-compatible). The contract needs minor adjustments:
- Replace `std::signer` → `one::signer`
- Replace `std::coin` → `one::coin`
- Replace `std::table` → `one::table`
- Add `one::object::UID` to structs with `key` ability

**Recommended Deployment Approach:**
Use OneChain Dashboard (https://onechain.gg/dashboard) for deployment:
1. Provides real-time error feedback
2. Auto-fixes common Move syntax issues
3. No CLI configuration required
4. Faster for hackathon timeline

**Phase 7 Completed:**
- ✅ Wave 1: E2E test infrastructure (Playwright, 3 tests)
- ✅ Wave 3: Vercel deployment configuration
- ✅ Wave 5: README.md, VERCEL_DEPLOY.md, deployment guide
- ✅ Phase 7 plan created (7-PLAN.md, 7-SUMMARY.md)
- ✅ Test coverage: 93.75% (44 unit tests passing)

**Phase 6 Manual Steps Completed:**
- ✅ Move CLI installed via cargo (`move-cli` v0.1.0)
- ✅ OneChain CLI installed via cargo (`one` v1.1.1)
- ✅ Deploy script updated with OneChain CLI detection
- ✅ DEPLOYMENT.md guide created for manual deployment
- ✅ Contract configuration ready for post-deployment update

**Test Coverage:** 44 tests total (30 original + 14 new unit tests)
**Build Status:** ✓ Passing
**Move CLI:** ✓ Installed (move-cli v0.1.0)
**OneChain CLI:** ✓ Installed (one 1.1.1-c7bdbfd526f1)
**Repository:** ✓ Pushed to https://github.com/Nathasan1410/MinesweeperZK-onehack

**Next Steps:**
1. Deploy Move contract to OneChain testnet
2. Update CONTRACT_ADDRESS in config
3. Run manual testing of full game flow
4. Deploy to Vercel production
5. Record demo video
6. Submit to OneHack 3.0

### 2026-03-07 — Session Continuation (Git Push Complete)

**Completed:**
- ✅ Repository pushed to GitHub (39 files, 9695 insertions)
- ✅ Build verified passing
- ✅ Git lock issue resolved

**Phase 7 Progress Update:**
- Wave 1: E2E infrastructure ✓ Complete
- Wave 3: Vercel config ✓ Complete
- Wave 5: Documentation ✓ Complete
- Wave 5: GitHub repo ✓ Public
- Remaining: Manual testing, demo video, submission form

### 2026-03-07 — Phase 6 Complete

**Completed:**
- ✅ Wave 0: Test infrastructure (vitest, 27 test stubs)
- ✅ Wave 1: OneWallet integration with balance fetching
- ✅ Wave 2: Move contract fixes (global storage pattern)
- ✅ Wave 3: Deploy script + 19 contract tests
- ✅ Wave 4: useContract hook implementation
- ✅ Wave 5: GameResults prize distribution wiring

**Created:**
- `vitest.config.ts` - Vitest configuration
- `__tests__/wallet/oneWallet.test.ts` - 11 wallet tests
- `__tests__/contract/minesweeperBet.test.ts` - 19 contract tests
- `contracts/deploy.ts` - Contract deployment script
- `lib/contract/service.ts` - Contract interaction service
- `.planning/phases/6-onechain-integration/*-SUMMARY.md` - 7 summaries

**Test Coverage:** 30 tests passing
**Build Status:** ✓ Passing

---

## Current Position

**Last Completed:** Phase 6 — OneChain Integration (code ready, deployment pending)

**Phase 6 Deliverables:**
- OneWallet integration: ✓ Working
- OCT balance fetching: ✓ Working
- Move contract: ✓ Fixed (global storage pattern)
- Contract tests: ✓ 19 tests passing
- Deploy script: ✓ Ready (OneChain CLI required)
- useContract hook: ✓ Implemented
- Prize distribution: ✓ UI ready
- Move CLI: ✓ Installed (move-cli v0.1.0)

**Phase 7 Progress:**
- E2E infrastructure: ✓ Complete (Playwright configured, 3 tests)
- Vercel deployment: ✓ Config ready (vercel.json, .env.production)
- Documentation: ✓ README.md, VERCEL_DEPLOY.md, DEPLOYMENT.md
- Phase plan: ✓ 7-PLAN.md, 7-SUMMARY.md created
- Pending: Manual testing, demo video, submission form

**Manual Steps Required (OneChain CLI):**
1. Install OneChain CLI from https://onechain.gg/docs/guide/cli
2. Run deployment: `npx ts-node contracts/deploy.ts`
3. Update `CONTRACT_ADDRESS` in lib/contract/service.ts
4. Set `IS_DEMO_MODE = false`
5. Implement transaction serialization (use OneChain SDK)

**Alternative Deployment (No CLI):**
1. Visit https://onechain.gg/dashboard
2. Connect OneWallet
3. Upload contract source manually
4. Copy deployed address to config

**Next Up:** Complete Phase 7 remaining waves after contract deployment

---

## Key Metrics

**Timeline:**
- Today: March 7, 2026
- Hackathon Deadline: March 27, 2026, 11:59 PM (UTC+7)
- Days Remaining: 20 days

**Budget:**
- Target: $100 participation reward
- Development Cost: $0 (free tiers: Vercel, Firebase, OneChain testnet)

---

## Open Issues / Blockers

| Issue | Priority | Status |
|-------|----------|--------|
| Contract deployment | High | Ready (OneChain CLI installed) |
| Transaction serialization | Medium | TODO in service.ts |
| Manual testing | High | Phase 7 - TODO |
| E2E testing | ◐ In Progress | Infrastructure ready, needs contract deployed |
| Demo video | Medium | Phase 7 - TODO |
| Hackathon submission | High | Phase 7 - TODO |

---

## Pending Todos

1. ✅ Install OneChain CLI - DONE
2. ✅ Achieve 85%+ test coverage - DONE (93.75%)
3. Deploy contract to testnet
4. Update CONTRACT_ADDRESS in config
5. Implement transaction serialization
6. Run manual testing of full game flow
7. E2E test full game flow (infrastructure ready)
8. Deploy to Vercel (config ready)
9. Record demo video
10. Submit to OneHack 3.0

---

## Decision Log

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| 2026-03-08 | Test coverage target 85%+ | Ensures code quality and maintainability for hackathon submission | ✓ Done (93.75%) |
| 2026-03-08 | Install OneChain CLI via cargo | Official OneChain CLI provides full features for contract deployment | ✓ Done |
| 2026-03-07 | Commit-reveal over ZK proofs | ZK adds 30+ second proof times, complex circuit design. Commit-reveal achieves provable fairness instantly. | ✓ Done |
| 2026-03-07 | Rank-weighted prize distribution | Equal split among top 10% doesn't reward skill. Weighted distribution (40/25/15/20) incentivizes competitive play. | ✓ Done |
| 2026-03-07 | 30-50 player rooms | Battle royale format differentiates from typical 1v1. Large rooms create excitement. | ✓ Done |
| 2026-03-07 | Firebase for game validation | Server-side validation via Firebase Cloud Functions simplifies client logic. | ✓ Done |
| 2026-03-07 | Clean/minimal UI | Wordle's clean design is easy to implement and looks professional. | ✓ Done |
| 2026-03-07 | Host can start game anytime | Don't require waiting for full room - host triggers start manually | ✓ Done |
| 2026-03-07 | Score decay with time | Score decreases as time passes to reward faster play | ✓ Done |

---

*Last updated: 2026-03-08 — Phase 7: 40% complete (OneChain CLI installed, test coverage 93.75%, E2E infrastructure complete, Vercel config ready, documentation complete; ready for contract deployment)*

---

## Session Notes: 2026-03-08 (Test Coverage + OneChain CLI)

**OneChain CLI Installation:**
- LLVM/Clang installed via winget (Microsoft LLVM v22.1.0)
- OneChain CLI installed via cargo: `cargo install --locked --git https://github.com/one-chain-labs/onechain.git one --features tracing`
- Verified: `one --version` returns `one 1.1.1-c7bdbfd526f1`

**Test Coverage:**
- Added @vitest/coverage-v8 dependency
- Extended `__tests__/wallet/oneWallet.test.ts` with 14 new tests:
  - getRegisteredWallets tests
  - isOneWalletInstalled tests
  - connectOneWallet error cases (no connect feature, empty accounts)
  - fetchOctBalance error handling (network errors, missing data)
  - requestFaucetTokens tests (empty address, success, error cases)
- Coverage increased from 62.5% to 93.75% statements

**Files Modified:**
- `__tests__/wallet/oneWallet.test.ts` - Added comprehensive wallet utils tests
- `.planning/STATE.md` - Updated with session progress

**Git Commit:** To be committed after session

---

## Session Notes: 2026-03-07 (Continuation)

**E2E Test Fix:**
- Playwright config updated to use `npm run build && npm start` instead of `npm run dev`
- workaround for Turbopack dev server crash
- E2E tests updated to match actual app structure
- Build verified passing

**Files Created This Session:**
- Updated `playwright.config.ts` - production server for E2E
- Updated `__e2e__/full-game-flow.spec.ts` - realistic test cases

**Git Commit:**
- `30baea5` chore(phase-7): E2E test infrastructure and deployment config
---

### 2026-03-08 — Phase 7: Contract Ready for Manual Deployment (Session 2)

**Completed:**
- ✅ Move contract adapted for OneChain's Sui-compatible Move dialect
- ✅ Contract builds successfully with `one move build`
- ✅ MANUAL_DEPLOY.md created for dashboard deployment
- ✅ Repository pushed to GitHub (commit 7a61999)
- ✅ Build verified passing locally

**Contract Build Status:**
```
BUILDING MinesweeperBet
✓ Compilation successful (warnings only, no errors)
```

**Phase 7 Remaining:**
- ⏳ Deploy Move contract to OneChain testnet (manual dashboard)
- ⏳ Update CONTRACT_ADDRESS in config
- ⏳ Run manual testing of full game flow
- ⏳ Deploy to Vercel production
- ⏳ Record demo video (3 min max)
- ⏳ Submit to OneHack 3.0

