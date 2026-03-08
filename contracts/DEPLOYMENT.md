# Contract Deployment Guide

## Quick Deployment (Recommended for Hackathon)

### Option 1: OneChain Dashboard (Fastest - No CLI Setup)

**Steps:**

1. **Open OneChain Dashboard:**
   - Visit: https://onechain.gg/dashboard
   - Or: https://ide.onechain.gg/

2. **Connect OneWallet:**
   - Click "Connect Wallet"
   - Approve connection in OneWallet popup

3. **Deploy Contract:**
   - Click "Publish" or "Deploy"
   - Paste contents of `contracts/sources/minesweeper_bet.move`
   - Select "Testnet" network
   - Click "Deploy" / "Publish"
   - Approve transaction in OneWallet

4. **Copy Contract Address:**
   - After deployment, copy the contract address
   - Format: `0x...` (hexadecimal)

5. **Update Configuration:**
   - Update files as shown in "Post-Deployment" section below

**Estimated Time:** 5-10 minutes

---

### Option 2: OneChain CLI (Advanced)

The OneChain CLI (`one` command) requires wallet setup and gas tokens.

**Installation:**
```bash
# Already installed via cargo
# one 1.1.1-c7bdbfd526f1
```

**Wallet Setup:**
```bash
# Create new address (interactive)
one client new-address ed25519

# Get testnet tokens from faucet
one client faucet

# Check balance
one client balance
```

**Deploy:**
```bash
cd contracts
one move build
one client publish --network testnet
```

---

## Environment Setup

### 1. Set Private Key

```bash
# Windows PowerShell
$env:ONECHAIN_PRIVATE_KEY="your_private_key_here"

# Linux/Mac
export ONECHAIN_PRIVATE_KEY="your_private_key_here"
```

**IMPORTANT:** Never commit your private key to version control!

### 2. Configure Move.toml

The `Move.toml` is already configured for OneChain testnet:

```toml
[networks.testnet]
rpc = "https://testnet-rpc.onechain.gg"
```

---

## Deployment Steps

### Using CLI

```bash
cd contracts
npx ts-node deploy.ts
```

Or manually:

```bash
cd contracts

# Step 1: Compile
one move compile

# Step 2: Deploy
one move publish --network testnet
```

### Expected Output

```
=== Step 1: Compiling Move package ===
✓ Compilation successful

=== Step 2: Deploying to OneChain testnet ===
Transaction hash: 0x...
Deployed address: 0x...

=== Deployment Complete ===
Contract Address: 0x...
Verify on OneScan: https://testnet.onescan.gg/account/0x...
```

---

## Post-Deployment

### 1. Update Contract Address

After deployment, update the following files with your deployed contract address:

**`lib/contract/service.ts`:**
```typescript
export const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_ADDRESS';
export const IS_DEMO_MODE = false; // Set to false for production
```

**`types/contract.ts`:**
```typescript
export const contractAddress = '0xYOUR_DEPLOYED_ADDRESS';
```

**`.env.local`:**
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
IS_DEMO_MODE=false
```

### 2. Verify on OneScan

Visit the OneScan explorer to verify your contract:
```
https://testnet.onescan.gg/account/YOUR_CONTRACT_ADDRESS
```

### 3. Test Contract Interaction

```bash
# Test wallet connection
npm run test:unit -- __tests__/contract/minesweeperBet.test.ts --run
```

---

## Troubleshooting

### "one: command not found"

The OneChain CLI is not installed. See installation options above.

### "Compilation failed"

Check Move syntax:
```bash
one move compile
```

Review error messages for syntax issues.

### "Deployment failed: insufficient gas"

Ensure your OneWallet has testnet OCT tokens for gas fees.

### "Transaction rejected"

Check that:
1. OneWallet is connected
2. You're on testnet network
3. Private key is correctly set

---

## Manual Deployment (Dashboard)

If CLI deployment fails, use the OneChain Dashboard:

1. **Copy Contract Source:**
   - Copy `contracts/sources/minesweeper_bet.move`

2. **Visit Dashboard:**
   - Go to https://onechain.gg/dashboard

3. **Deploy:**
   - Connect OneWallet
   - Paste contract source
   - Set network to testnet
   - Click Deploy

4. **Get Address:**
   - Copy deployed contract address
   - Update configuration files as shown above

---

## Contract Addresses

| Network | Address | Status |
|---------|---------|--------|
| Testnet | `0xplaceholder` | Update after deployment |
| Mainnet | TBD | Deploy after testnet validation |

---

## Security Notes

- **Testnet First:** Always deploy to testnet before mainnet
- **Private Keys:** Never commit private keys to git
- **Contract Verification:** Verify contract source on OneScan
- **Audit:** Consider professional audit before mainnet deployment

---

## Resources

- [OneChain Documentation](https://onechain.gg/docs)
- [OneChain Dashboard](https://onechain.gg/dashboard)
- [OneScan Explorer](https://testnet.onescan.gg/)
- [Move Language Guide](https://move-language.github.io/move/)

---

*Last updated: 2026-03-07*
