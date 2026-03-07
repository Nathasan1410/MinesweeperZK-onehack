# Phase 7: E2E Verification & Submission - PLAN

**Phase Goal:** Test complete game flow end-to-end, deploy to Vercel, record demo video, and submit to OneHack 3.0

**Timeline:** March 7-27, 2026 (20 days remaining)

---

## Requirements (from ROADMAP.md)

| ID | Description |
|----|-------------|
| SUBMIT-01 | Full game played end-to-end (create room → join → play → prizes) |
| SUBMIT-02 | MVP deployed to Vercel (production URL) |
| SUBMIT-03 | OneWallet integration works in production |
| SUBMIT-04 | Demo video recorded (max 3 minutes) |
| SUBMIT-05 | GitHub repo public with complete code |
| SUBMIT-06 | Google Drive submission folder complete |
| SUBMIT-07 | OneHack 3.0 submission form submitted |

---

## Success Criteria

1. **E2E Flow Verified:**
   - Create room with bet amount (demo or real OCT)
   - Join room as player
   - Start game (host action)
   - Play Minesweeper game
   - Submit score
   - Distribute prizes
   - View results with prize breakdown

2. **Production Deployment:**
   - Vercel deployment successful
   - Environment variables configured
   - OneWallet connects in production
   - No console errors

3. **Demo Video (3 min max):**
   - Wallet connection demo
   - Room creation/joining
   - Gameplay snippet
   - Prize distribution

4. **Submission Package:**
   - GitHub repo: public, clean history
   - README.md with setup instructions
   - Google Drive: project description, demo link, repo link
   - OneHack form: submitted before deadline

---

## Implementation Plan

### Wave 1: E2E Test Infrastructure
**Goal:** Set up Playwright for E2E testing

**Tasks:**
1. Install Playwright
2. Configure for Next.js
3. Write E2E test: Full game flow (demo mode)
4. Add E2E scripts to package.json

**Files:**
- `playwright.config.ts` - New
- `__e2e__/full-game-flow.spec.ts` - New
- `.env.e2e` - New

**UAT Criteria:**
- [ ] `npm run test:e2e` runs without errors
- [ ] E2E test covers: create room, join, play, submit score, view results
- [ ] Test passes in demo mode

---

### Wave 2: Manual Testing & Bug Fixes
**Goal:** Run full game flow manually, fix any issues

**Tasks:**
1. Start local dev server
2. Open 2 browser windows (host + player)
3. Run through full game flow
4. Document any bugs
5. Fix issues found

**UAT Criteria:**
- [ ] No console errors during gameplay
- [ ] Score submission works
- [ ] Prize distribution works (demo mode)
- [ ] GameResults shows correct rankings

---

### Wave 3: Vercel Deployment
**Goal:** Deploy MVP to production

**Prerequisites:**
- Phase 6: Contract deployed (CONTRACT_ADDRESS set)
- IS_DEMO_MODE = false (or keep true for demo)

**Tasks:**
1. Create Vercel account (if needed)
2. Link GitHub repository
3. Configure environment variables:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_NETWORK=testnet`
   - `IS_DEMO_MODE=true` (for demo)
4. Deploy to production
5. Verify OneWallet connection in production

**Files:**
- `vercel.json` - New (Vercel config)
- `.env.production` - New

**UAT Criteria:**
- [ ] Production URL loads without errors
- [ ] OneWallet connects in production
- [ ] No console errors

---

### Wave 4: Demo Video Recording
**Goal:** Record 3-minute demo video

**Script:**
1. **Intro (15 sec):**
   - "MinesweeperZK - Provably fair competitive Minesweeper"
   - Show landing page

2. **Wallet Connection (30 sec):**
   - Click "Connect OneWallet"
   - Show address + balance

3. **Room Creation (45 sec):**
   - Create room: 10 OCT bet, 50 players
   - Show room list with new room
   - Join as player 2

4. **Gameplay (60 sec):**
   - Host starts game
   - Show Minesweeper board
   - Reveal cells, flag mines
   - Show score updating

5. **Results & Prizes (30 sec):**
   - Game ends
   - Show rankings
   - Show prize distribution

**Tools:**
- OBS Studio (screen recording)
- Basic editing (optional)

**UAT Criteria:**
- [ ] Video length: 2:30-3:00
- [ ] All key features shown
- [ ] Clear audio (if narrated)
- [ ] Uploaded to YouTube (unlisted or public)

---

### Wave 5: Submission Package
**Goal:** Complete all submission requirements

**Tasks:**
1. **GitHub Repository:**
   - [ ] Public visibility
   - [ ] README.md with:
     - Project description
     - Features
     - Setup instructions
     - Tech stack
   - [ ] Clean commit history
   - [ ] LICENSE file

2. **Google Drive Folder:**
   - [ ] Project description/backstory
   - [ ] GitHub repo link
   - [ ] YouTube demo link
   - [ ] Website URL (Vercel)
   - [ ] Team info (Nathanael Santoso)

3. **OneHack 3.0 Form:**
   - [ ] Submission form completed
   - [ ] All links verified
   - [ ] Submitted before deadline

**Files:**
- `README.md` - Update with full documentation
- `VERCEL_DEPLOY.md` - Deployment guide
- `CONTRIBUTING.md` - Optional

**UAT Criteria:**
- [ ] All submission items complete
- [ ] Links verified working
- [ ] Form submitted successfully

---

## Files to Create

| File | Purpose | Wave |
|------|---------|------|
| `playwright.config.ts` | Playwright E2E config | Wave 1 |
| `__e2e__/full-game-flow.spec.ts` | E2E test: full game | Wave 1 |
| `__e2e__/setup.ts` | E2E test setup | Wave 1 |
| `.env.e2e` | E2E environment | Wave 1 |
| `vercel.json` | Vercel deployment config | Wave 3 |
| `.env.production` | Production env vars | Wave 3 |
| `README.md` | Project documentation | Wave 5 |
| `VERCEL_DEPLOY.md` | Deployment guide | Wave 5 |

---

## Phase 7 Timeline

| Date | Milestone |
|------|-----------|
| Mar 7-10 | Wave 1: E2E test infrastructure |
| Mar 11-15 | Wave 2: Manual testing & bug fixes |
| Mar 16-20 | Wave 3: Vercel deployment |
| Mar 21-24 | Wave 4: Demo video recording |
| Mar 25-27 | Wave 5: Submission package |
| Mar 27, 11:59 PM | **DEADLINE: Submit form** |

---

## Dependencies

| Phase | Status | Dependency |
|-------|--------|------------|
| Phase 6 | ✓ Complete | Contract deployment required |
| OneChain CLI | ⏸️ Manual | Need to deploy contract |
| OneWallet | ✓ Ready | Integration complete |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Contract not deployed | Keep IS_DEMO_MODE=true for submission |
| E2E tests flaky | Focus on critical path only |
| Vercel build fails | Test build locally first |
| Video too long | Script timing, edit ruthlessly |
| Deadline missed | Submit by Mar 26 (1 day buffer) |

---

## Verification Commands

### Wave 1: E2E Tests
```bash
npm run test:e2e
```

### Wave 3: Production Build
```bash
npm run build
```

### Wave 5: Final Check
- [ ] All 30 unit tests pass
- [ ] E2E test passes
- [ ] Build passes
- [ ] Vercel deployment successful
- [ ] Demo video uploaded
- [ ] GitHub repo public
- [ ] Submission form complete

---

## Next Steps

1. **Wave 1:** Set up Playwright E2E testing
2. **Wave 2:** Manual testing flow
3. **Wave 3:** Vercel deployment
4. **Wave 4:** Demo video
5. **Wave 5:** Submission
