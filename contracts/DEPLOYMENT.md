# Contract Deployment Guide

## Prerequisites

### Option 1: OneChain CLI (Recommended)

The OneChain CLI (`one` command) is required for contract deployment.

**Installation:**

1. **From Official Documentation:**
   ```bash
   # Visit https://onechain.gg/docs/guide/cli for latest installation instructions
   ```

2. **Check Installation:**
   ```bash
   one --version
   ```

### Option 2: OneChain Dashboard (No CLI Required)

1. Visit [OneChain Dashboard](https://onechain.gg/dashboard)
2. Connect your OneWallet
3. Upload Move contract source
4. Deploy via web interface

### Option 3: OneChain IDE (Browser-based)

1. Visit [OneChain IDE](https://ide.onechain.gg/)
2. Connect OneWallet
3. Import contract from GitHub or paste source
4. Deploy to testnet

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
