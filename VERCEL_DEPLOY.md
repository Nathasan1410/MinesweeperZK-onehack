# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account** — Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** — Push code to public repo
3. **Contract Deployed** — Have `CONTRACT_ADDRESS` from OneChain testnet

---

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "feat: MinesweeperZK MVP for OneHack 3.0"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/minesweeperzk-onehack.git
git branch -M main
git push -u origin main
```

---

## Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select `minesweeperzk-onehack` from your repositories
4. Click **Import**

---

## Step 3: Configure Environment Variables

In Vercel project settings, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0x...` (your deployed contract) |
| `NEXT_PUBLIC_NETWORK` | `testnet` |
| `IS_DEMO_MODE` | `true` (for demo) or `false` (production) |

---

## Step 4: Deploy

1. Click **Deploy**
2. Wait for build (~2-3 minutes)
3. Visit production URL (e.g., `minesweeperzk-onehack.vercel.app`)

---

## Step 5: Verify Deployment

### Checklist
- [ ] Homepage loads
- [ ] OneWallet connects
- [ ] OCT balance displays
- [ ] Room list visible
- [ ] Can create/join rooms
- [ ] Game board renders
- [ ] No console errors

---

## Update Deployment

After initial deploy, any push to `main` triggers automatic redeployment:

```bash
git add .
git commit -m "feat: add new feature"
git push
```

Vercel builds and deploys automatically.

---

## Production Mode

When contract is deployed and ready for real betting:

1. Update `IS_DEMO_MODE=false` in Vercel env vars
2. Redeploy from Vercel dashboard
3. Verify contract interactions work

---

## Troubleshooting

### Build Fails

Check build logs in Vercel dashboard. Common issues:

- **TypeScript errors**: Run `npm run build` locally first
- **Missing env vars**: Add all required variables
- **Out of memory**: Increase Vercel function memory

### Runtime Errors

Open browser console (F12) and check for:

- Wallet connection errors
- Contract call failures
- Firebase permission issues

---

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain
3. Configure DNS as instructed
4. SSL auto-provisioned

---

## Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
