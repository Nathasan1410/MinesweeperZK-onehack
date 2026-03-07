# OneChain Integration Guide

Complete guide for integrating OneChain blockchain into MinesweeperZK.

---

## Table of Contents

1. [OneWallet Setup](#onewallet-setup)
2. [OneChain CLI Installation](#onechain-cli-installation)
3. [Network Configuration](#network-configuration)
4. [Contract Deployment](#contract-deployment)
5. [Testing](#testing)

---

## OneWallet Setup

### Install OneWallet Browser Extension

**Download:** https://chromewebstore.google.com/detail/onewallet/gclmcgmpkgblaglfokkaclneihpnbkli

> **Note:** The extension is verified legitimate:
> - Developer: `ONELABS PTE. LTD.` (official OneChain Labs)
> - Email: `app@onelabs.cc`
> - D-U-N-S: `599601318`
> - Same developer has verified iOS app with 5.0 rating

### Setup Steps

1. **Install Extension**
   - Click "Add to Chrome"
   - Confirm installation
   - Pin to toolbar for easy access

2. **Create/Import Wallet**
   - Open OneWallet extension
   - Create new wallet OR import existing
   - **IMPORTANT:** Back up your seed phrase securely!

3. **Get Testnet OCT Tokens**
   - Visit faucet: https://faucet-testnet.onelabs.cc
   - Or use cURL:
     ```bash
     curl --location --request POST 'https://faucet-testnet.onelabs.cc/v1/gas' \
       --header 'Content-Type: application/json' \
       --data-raw '{
         "FixedAmountRequest": {
           "recipient": "<YOUR_ADDRESS>"
         }
       }'
     ```

---

## OneChain CLI Installation

### Prerequisites

Install Rust and Cargo:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Install OneChain CLI

```bash
cargo install --locked --git https://github.com/one-chain-labs/onechain.git one --features tracing
```

The CLI binary will be installed at `$HOME/.cargo/bin/one` (Linux/Mac) or `%USERPROFILE%\.cargo\bin\one` (Windows).

### Verify Installation

```bash
one --version
```

### Configure OneChain Client

```bash
# Connect to testnet (default)
one client

# Check available environments
one client envs

# Should show:
# testnet | https://rpc-testnet.onelabs.cc:443 | (active)
```

---

## Network Configuration

### Official OneChain Testnet Endpoints

| Service | URL |
|---------|-----|
| RPC | `https://rpc-testnet.onelabs.cc:443` |
| Faucet | `https://faucet-testnet.onelabs.cc:443` |
| Explorer | `https://onescan.cc/testnet` |

### Project Configuration

Update these files with your deployed contract address:

**`lib/contract/service.ts`:**
```typescript
export const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_ADDRESS';
export const IS_DEMO_MODE = false; // Set to false after deployment
```

**`.env.local`:**
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
NEXT_PUBLIC_NETWORK=testnet
IS_DEMO_MODE=false
```

---

## Contract Deployment

### Option 1: CLI Deployment (Recommended)

```bash
# Navigate to contracts directory
cd contracts

# Compile Move package
one move compile

# Deploy to testnet
one move publish --network testnet
```

After deployment, copy the contract address and update your configuration.

### Option 2: Manual Dashboard Deployment

1. Visit https://onescan.cc/testnet
2. Connect OneWallet browser extension
3. Navigate to "Publish Module" or "Deploy Contract"
4. Upload `contracts/sources/minesweeper_bet.move`
5. Deploy and copy the contract address

---

## Testing

### Run Unit Tests

```bash
# All tests
npm run test

# Watch mode
npm run test:watch
```

### Run E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# With UI
npm run test:e2e:ui

# Show report
npm run test:e2e:report
```

### Manual Testing Checklist

- [ ] Install OneWallet extension
- [ ] Get testnet OCT from faucet
- [ ] Connect wallet to local app
- [ ] Verify balance displays correctly
- [ ] Create room with bet amount
- [ ] Join room as player
- [ ] Start game (as host)
- [ ] Play Minesweeper game
- [ ] Submit score
- [ ] View results and prize distribution

---

## Wallet Integration (Code Reference)

### Connect Wallet

```typescript
import { connectOneWallet, isOneWalletInstalled } from '@/lib/wallet/utils';

// Check if OneWallet is installed
if (!isOneWalletInstalled()) {
  alert('Please install OneWallet extension');
  return;
}

// Connect
const { address } = await connectOneWallet();
console.log('Connected:', address);
```

### Fetch Balance

```typescript
import { fetchOctBalance } from '@/lib/wallet/utils';

const balance = await fetchOctBalance(address);
console.log('OCT Balance:', balance);
```

### Request Faucet Tokens

```typescript
import { requestFaucetTokens } from '@/lib/wallet/utils';

await requestFaucetTokens(address);
console.log('Faucet tokens requested');
```

---

## Useful Links

- **Official Documentation:** https://docs.onelabs.cc
- **OneChain GitHub:** https://github.com/one-chain-labs
- **OneChain Medium:** https://onechain.medium.com
- **Telegram Community:** https://t.me/hello_onechain
- **OneScan Explorer:** https://onescan.cc/testnet

---

## Troubleshooting

### OneWallet Not Detected

1. Ensure extension is installed and enabled
2. Refresh the page
3. Check browser console for errors
4. Try reinstalling extension

### Faucet Not Working

1. Ensure you're on testnet (not mainnet)
2. Check if address is valid OneChain address (starts with `0x`)
3. Faucet may have daily limits

### Deployment Fails

1. Ensure CLI is installed: `one --version`
2. Check network connection
3. Ensure you have OCT for gas fees
4. Try manual deployment via dashboard

---

*Last updated: March 7, 2026*
*MinesweeperZK for OneHack 3.0*
