# Manual Deployment Instructions

## Contract Build Status: ✓ READY

The Move contract has been updated and builds successfully for OneChain testnet.

## Quick Deploy (5 minutes)

### Step 1: Open OneChain Dashboard
Visit: **https://onechain.gg/dashboard**

### Step 2: Connect OneWallet
1. Click "Connect Wallet" button
2. OneWallet popup will appear
3. Click "Connect" to approve

### Step 3: Deploy Contract
1. Click "Publish" or "Deploy Contract"
2. Copy the ENTIRE contents of: `contracts/sources/minesweeper_bet.move`
3. Paste into the code editor
4. Select **Testnet** network
5. Click "Deploy" or "Publish"
6. Approve the transaction in OneWallet
7. Wait for confirmation (10-30 seconds)

### Step 4: Copy Contract Address
After deployment, you'll see:
- **Contract Address:** `0x...` (copy this!)
- **Transaction Hash:** `0x...`

### Step 5: Update Configuration

Update the following files with your deployed contract address:

#### 1. `lib/contract/service.ts`
Find and replace:
```typescript
const CONTRACT_ADDRESS = '0xYOUR_CONTRACT_ADDRESS';
const IS_DEMO_MODE = false;
```

#### 2. `.env.local`
Add or update:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
IS_DEMO_MODE=false
```

#### 3. `contracts/Move.toml`
Update the address line:
```toml
[addresses]
minesweeper_bet = "0xYOUR_CONTRACT_ADDRESS"
```

### Step 6: Verify Deployment

1. Visit OneScan Explorer: https://testnet.onescan.gg/
2. Paste your contract address
3. Verify contract appears with source code

---

## Contract Functions

The deployed contract exposes these public functions:

| Function | Description |
|----------|-------------|
| `create_game(game_id, bet_amount, max_players, ctx)` | Create a new game room |
| `join_game(game, ctx)` | Join an existing game |
| `start_game(game, ctx)` | Host starts the game |
| `submit_score(game, score, mines_hit, ctx)` | Submit player score |
| `distribute_prizes(game, scores)` | Distribute prizes to winners |
| `get_status(game)` | Get game status |
| `get_total_pool(game)` | Get total prize pool |
| `get_player_count(game)` | Get number of players |
| `get_game_id(game)` | Get game ID |
| `get_host(game)` | Get host address |
| `is_player(game, player)` | Check if address is in game |

---

## Troubleshooting

### "Insufficient Gas"
- Visit faucet: https://faucet-testnet.onelabs.cc
- Request testnet OCT tokens
- Wait 1-2 minutes for tokens to arrive

### "Transaction Failed"
- Ensure you're on Testnet (not Mainnet)
- Check OneWallet is connected
- Try refreshing the dashboard

### "Invalid Contract Source"
- Ensure the entire `minesweeper_bet.move` file is copied
- The contract is pre-configured for OneChain's Move dialect

---

## Contract Source Location
File: `contracts/sources/minesweeper_bet.move`

The contract includes:
- Game room management
- Bet escrow
- Prize distribution with rank-weighted payouts (40/25/15/10/10%)
- House fee (5%) collection

---

## Need Help?

- [OneChain Docs](https://onechain.gg/docs)
- [OneScan Testnet](https://testnet.onescan.gg/)
- [Faucet](https://faucet-testnet.onelabs.cc)
