---
phase: 6
slug: onechain-integration
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-07
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (Next.js/TypeScript) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm run test:unit` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds

---

## Sampling Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 06-00-01 | 00 | 0 | ALL | setup | `npm run test:unit -- --run` | ⬜ pending |
| 06-01-01 | 01 | 1 | WALLET-01 | unit | `npm run test:unit` | ⬜ pending |
| 06-01-02 | 01 | 1 | WALLET-02 | unit | `npm run test:unit` | ⬜ pending |
| 06-01-03 | 01 | 1 | WALLET-03 | unit | `npm run test:unit` | ⬜ pending |
| 06-02-01 | 02 | 2 | WALLET-08 | unit | `cd contracts && one move compile` | ⬜ pending |
| 06-02-02 | 02 | 2 | WALLET-09 | unit | `cd contracts && one move compile` | ⬜ pending |
| 06-02-03 | 02 | 2 | WALLET-10 | unit | `cd contracts && one move compile` | ⬜ pending |
| 06-03-01 | 03 | 2 | WALLET-08 | integration | `npm run test:unit` | ⬜ pending |
| 06-03-02 | 03 | 2 | PRIZE-06 | integration | `npm run test:unit` | ⬜ pending |
| 06-04-01 | 04 | 3 | WALLET-09 | integration | `npm run test:unit` | ⬜ pending |
| 06-04-02 | 04 | 3 | WALLET-10 | integration | `npm run test:unit` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Status

**Wave 0 is COMPLETE** — Test stubs created in Plan 00:
- [x] `vitest.config.ts` — Vitest configuration for Next.js
- [x] `__tests__/setup.ts` — Test setup file
- [x] `__tests__/wallet/oneWallet.test.ts` — Stubs for WALLET-01, WALLET-02, WALLET-03
- [x] `__tests__/contract/minesweeperBet.test.ts` — Stubs for WALLET-08, WALLET-09, WALLET-10, PRIZE-06

Wave 1+ tasks implement the actual test logic (TDD RED→GREEN) within their tasks.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| OneWallet extension connection | WALLET-01 | Requires browser extension | 1. Install OneWallet extension, 2. Connect via UI, 3. Verify address displays |
| Move contract deployment | WALLET-08 | Requires testnet deployment | 1. Run deploy script, 2. Verify on OneScan explorer |
| OCT escrow via OneWallet | WALLET-09 | Requires real transaction | 1. Create game room, 2. Approve OCT spend, 3. Verify escrow in contract |
| Prize distribution | PRIZE-06 | Requires contract execution | 1. Complete game, 2. Trigger distribution, 3. Verify OCT received |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
