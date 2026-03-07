# Phase 6: OneChain Integration - Research

**Researched:** 2026-03-07
**Domain:** OneWallet integration, Move contract deployment, OCT token betting
**Confidence:** MEDIUM

## Summary

Phase 6 replaces the mock wallet system with real OneWallet integration and deploys the Move betting contract to OneChain testnet. The phase covers three main areas: (1) OneWallet connection via Wallet Standard API, (2) Move contract deployment for escrow and prize distribution, and (3) OCT token transfers for real betting.

The existing codebase already has Wallet Standard integration scaffolding in `lib/wallet/` and a draft Move contract in `contracts/sources/`. However, the contract has critical issues that must be fixed before deployment, and the wallet connection needs balance fetching and transaction signing implementation.

**Primary recommendation:** Fix Move contract storage and resource issues first, then implement OneWallet transaction signing, and finally deploy to testnet with proper address configuration.

## User Constraints

This phase has no CONTEXT.md file constraining decisions. All decisions below are research-based recommendations.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @wallet-standard/core | ^1.1.1 | Wallet Standard API | Already installed, chain-agnostic wallet standard |
| @wallet-standard/features | ^1.0.0 | Standard feature types | Defines connect/disconnect/events features |
| Next.js | ^16.1.6 | App framework | Project already uses this |
| MoveOS Stdlib | 2024.alpha | Move standard library | OneChain uses MoveOS-compatible Move |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zustand | ^5.0.11 | State management | Already in use for wallet state |
| uuid | ^13.0.0 | Unique IDs | Room/game ID generation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Wallet Standard | OneWallet SDK (if exists) | Wallet Standard is more future-proof |
| MoveOS | Sui Move | OneChain specifically uses MoveOS |
| Manual transaction signing | @tanstack/react-query + wallet hooks | More control with manual approach |

**Installation:**
All core packages are already installed. No additional npm packages required.

## Architecture Patterns

### Current Project Structure
```
contracts/
├── Move.toml              # Move package config (needs address update)
└── sources/
    └── minesweeper_bet.move  # Betting contract (needs fixes)

lib/
├── wallet/
│   ├── store.ts           # Zustand wallet state
│   └── utils.ts           # OneWallet connection (needs balance/tx)
└── contract/
    ├── service.ts         # Contract service (demo mode currently)
    └── ...

hooks/
├── useWallet.ts           # Wallet hook (already wired)
└── useContract.ts         # Contract hook (needs real implementation)
```

### Pattern 1: Wallet Standard Connection
**What:** Use Wallet Standard API to connect OneWallet and get account access

**Example:**
```typescript
// Source: @wallet-standard/features connect.d.ts
import { getWallets } from '@wallet-standard/app';

export function findOneWallet() {
  const wallets = getWallets().get();
  return Array.from(wallets).find(
    (w) => w.name === 'OneWallet' || w.name.includes('OneChain')
  ) || null;
}

export async function connectOneWallet() {
  const wallet = findOneWallet();
  if (!wallet) throw new Error('OneWallet not installed');

  const connectFeature = wallet.features['standard:connect'];
  if (!connectFeature) throw new Error('Connect feature not supported');

  const result = await connectFeature.connect({
    name: 'MinesweeperZK',
    version: '1.0.0',
    url: window.location.origin,
  });

  return { address: result.accounts[0].address };
}
```

### Pattern 2: Transaction Signing with Wallet Standard
**What:** Sign and submit Move transactions through OneWallet

**Example:**
```typescript
// Source: Wallet Standard pattern (adapted for Move)
interface Transaction {
  type: 'move';
  function: string;      // e.g., "minesweeper_bet::minesweeper_game::create_game"
  typeArguments: string[]; // e.g., ["0x2::oct::OCT"]
  arguments: any[];       // Function arguments
  gasBudget?: number;
}

async function signAndSubmitTransaction(wallet: Wallet, tx: Transaction) {
  const signFeature = wallet.features['standard:signTransaction'];
  if (!signFeature) throw new Error('Sign feature not supported');

  const { signature } = await signFeature.signTransaction({
    transaction: serializeTransaction(tx),
    account: wallet.accounts[0],
  });

  // Submit to OneChain RPC
  const result = await fetch(ONECHAIN_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'move_executeTransaction',
      params: [tx, signature],
      id: Date.now(),
    }),
  });

  return result.json();
}
```

### Pattern 3: Move Contract Storage Pattern
**What:** Use global resources to store game state on-chain

**The current contract has a critical bug:** It creates `GameRoom` structs but never stores them in a global resource. This means game state is lost after function returns.

**Fixed Pattern:**
```move
// Source: MoveOS/Aptos storage pattern
module minesweeper_bet::minesweeper_game {
    use std::signer;
    use std::option;

    /// Global resource to store all games
    public struct GameRegistry has key {
        games: std::table::Table<String, GameRoom>,
    }

    /// Initialize the registry (call once at deployment)
    public fun init_registry(admin: &signer) {
        move_to(admin, GameRegistry {
            games: std::table::new(),
        });
    }

    /// Create game and store in registry
    public fun create_game(...) {
        // ... create game struct
        let registry = borrow_global_mut<GameRegistry>(@minesweeper_bet);
        std::table::add(&mut registry.games, game_id, game);
    }

    /// Get game from registry
    public fun get_game(game_id: String): &GameRoom {
        let registry = borrow_global<GameRegistry>(@minesweeper_bet);
        std::table::borrow(&registry.games, &game_id)
    }
}
```

### Anti-Patterns to Avoid
- **No global storage:** Current contract creates GameRoom but never stores it (loses state)
- **Using coin::transfer_from without CoinStore:** Requires proper Coin resource handling
- **Hardcoded contract address:** Move.toml has placeholder `0x1234567890abcdef`
- **Missing timestamp:** `created_at: 0` should use `std::timestamp::now()`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Wallet connection | Custom wallet detection | Wallet Standard API | Standard, works with multiple wallets |
| Transaction signing | Manual RPC calls | Wallet signTransaction feature | Handles serialization, signing |
| Coin transfers | Balance tracking manually | std::coin module | Handles escrow, transfers atomically |
| Global state | In-memory storage | Move global resources | On-chain persistence |
| Random number generation | Custom PRNG | Combine player seeds | Provably fair, verifiable |

**Key insight:** The current Move contract attempts to use `coin::transfer_from` but doesn't properly set up CoinStore resources. Move's coin module requires specific resource setup that can't be hand-rolled.

## Common Pitfalls

### Pitfall 1: Missing Global Resource Storage
**What goes wrong:** GameRoom structs are created but not stored in global resources
**Why it happens:** Move requires `has key` ability and `move_to`/`borrow_global` for persistence
**How to avoid:** Use table-based storage pattern (see Architecture Patterns)
**Warning signs:** Contract compiles but game state not persisted between calls

### Pitfall 2: coin::transfer_from Without CoinStore
**What goes wrong:** Calling `coin::transfer_from<OCT>()` fails because user doesn't have CoinStore
**Why it happens:** OneChain's OCT token requires CoinStore resource at user account
**How to avoid:** Check CoinStore exists, or use `coin::transfer` with proper capability
**Warning signs:** Transaction fails with "Resource not found" error

### Pitfall 3: Contract Address Not Updated
**What goes wrong:** Move.toml has placeholder address, contract calls fail
**Why it happens:** Address must be updated after deployment
**How to avoid:** Deploy first, then update Move.toml with deployed address
**Warning signs:** Module not found at expected address

### Pitfall 4: Wallet Not Registered
**What goes wrong:** `getWallets().get()` returns empty array
**Why it happens:** Wallet Standard requires event listener registration
**How to avoid:** Use `@wallet-standard/app` register pattern on mount
**Warning signs:** OneWallet extension installed but not detected

### Pitfall 5: Testnet vs Mainnet Confusion
**What goes wrong:** Contract deployed to wrong network
**Why it happens:** OneChain has testnet and mainnet with different RPCs
**How to avoid:** Explicitly configure RPC URL and verify before deploy
**Warning signs:** Transaction submitted but not found on explorer

## Code Examples

### Complete OneWallet Hook
```typescript
// Source: Adapted from Wallet Standard + existing lib/wallet/utils.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { getWallets } from '@wallet-standard/app';
import type { Wallet, WalletAccount } from '@wallet-standard/base';

const ONECHAIN_RPC_URL = 'https://testnet-rpc.onechain.gg'; // Verify actual URL

export function useOneWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  // Find OneWallet on mount
  useEffect(() => {
    const walletsApi = getWallets();

    const findWallet = () => {
      const all = walletsApi.get();
      return Array.from(all).find(
        (w) => w.name === 'OneWallet' || w.name.includes('OneChain')
      ) || null;
    };

    const registered = findWallet();
    if (registered) {
      setWallet(registered);
    }

    // Listen for wallet registration
    const unsubscribe = walletsApi.on('register', (w) => {
      const oneWallet = findWallet();
      if (oneWallet) setWallet(oneWallet);
    });

    return () => unsubscribe();
  }, []);

  const connect = useCallback(async () => {
    if (!wallet) throw new Error('OneWallet not found');

    const connectFeature = wallet.features['standard:connect'];
    if (!connectFeature?.connect) {
      throw new Error('Connect feature not supported');
    }

    const result = await connectFeature.connect();
    if (result.accounts.length === 0) {
      throw new Error('No accounts returned');
    }

    setAccount(result.accounts[0]);

    // Fetch OCT balance
    const balance = await fetchOctBalance(result.accounts[0].address);
    setBalance(balance);

    return result.accounts[0];
  }, [wallet]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setBalance(null);

    const disconnectFeature = wallet?.features['standard:disconnect'];
    if (disconnectFeature?.disconnect) {
      disconnectFeature.disconnect();
    }
  }, [wallet]);

  const signTransaction = useCallback(async (tx: any) => {
    if (!wallet || !account) throw new Error('Wallet not connected');

    const signFeature = wallet.features['standard:signTransaction'];
    if (!signFeature?.signTransaction) {
      throw new Error('Sign feature not supported');
    }

    const { signature } = await signFeature.signTransaction({
      transaction: tx,
      account,
    });

    // Submit to RPC
    const response = await fetch(ONECHAIN_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'move_executeTransaction',
        params: [tx, signature],
        id: Date.now(),
      }),
    });

    return response.json();
  }, [wallet, account]);

  return {
    isConnected: !!account,
    address: account?.address || null,
    balance,
    wallet,
    connect,
    disconnect,
    signTransaction,
  };
}

async function fetchOctBalance(address: string): Promise<string> {
  // RPC call to get OCT balance
  // Implementation depends on OneChain RPC API
  return '0'; // Placeholder
}
```

### Fixed Move Contract Skeleton
```move
// Source: Adapted from MoveOS stdlib patterns
module minesweeper_bet::minesweeper_game {
    use std::signer;
    use std::string::String;
    use std::table;

    const OCT_TOKEN_ADDRESS: address = @0x2;
    const HOUSE_FEE_PERCENT: u8 = 5;

    public struct GameRoom has store {
        host: address,
        bet_amount: u64,
        max_players: u64,
        players: vector<address>,
        status: u8,
        total_pool: u64,
    }

    public struct GameRegistry has key {
        games: table::Table<String, GameRoom>,
    }

    public fun init(admin: &signer) {
        move_to(admin, GameRegistry { games: table::new() });
    }

    public fun create_game(
        admin: &signer,
        game_id: String,
        host: address,
        bet_amount: u64,
        max_players: u64
    ) {
        let registry = borrow_global_mut<GameRegistry>(signer::address_of(admin));
        table::add(&mut registry.games, game_id, GameRoom {
            host,
            bet_amount,
            max_players,
            players: std::vector::empty(),
            status: 0,
            total_pool: bet_amount,
        });
    }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom wallet detection | Wallet Standard API | 2024 | Works with all standard wallets |
| Manual key management | Extension-based signing | 2023 | Better UX, no key handling |
| Mock balance | Real OCT token transfers | Phase 6 | Real betting, actual prizes |
| Demo mode contract | Deployed Move contract | Phase 6 | On-chain escrow, trustless |

**Deprecated/outdated:**
- `connect` feature name: Use `standard:connect` (new namespace convention)
- Hardcoded addresses: Use Move.toml address configuration
- In-memory game state: Use global resource storage

## Open Questions

1. **OneChain RPC URL**
   - What we know: OneChain uses MoveOS-compatible RPC
   - What's unclear: Actual testnet RPC endpoint URL
   - Recommendation: Check OneChain documentation or Discord for testnet RPC

2. **OCT Token Contract Address**
   - What we know: Code assumes `0x2::oct::OCT` (standard address)
   - What's unclear: Actual OCT token address on testnet
   - Recommendation: Verify on OneChain explorer before deployment

3. **Wallet Standard Transaction Format**
   - What we know: Wallet Standard defines `signTransaction` feature
   - What's unclear: Exact transaction serialization format for Move
   - Recommendation: Check OneWallet SDK documentation or examples

4. **Gas Payment**
   - What we know: Move transactions require gas
   - What's unclear: Gas token (OCT?), gas estimation, gas budget
   - Recommendation: Include gas budget in transaction params

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest + React Testing Library (inferred from Next.js) |
| Config file | Not yet configured - see Wave 0 |
| Quick run command | `npm test -- --testPathPattern=wallet` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WALLET-01 | OneWallet connects | Integration | `npm test -- wallet.test.tsx` | Wave 0 |
| WALLET-02 | Display address + balance | Unit | `npm test -- useWallet.test.ts` | Wave 0 |
| WALLET-03 | Disconnect clears state | Unit | `npm test -- useWallet.test.ts` | Wave 0 |
| WALLET-08 | Bet locks OCT in escrow | Integration | `npm test -- contract.test.ts` | Wave 0 |
| WALLET-09 | Winners receive prizes | Integration | `npm test -- contract.test.ts` | Wave 0 |
| WALLET-10 | House cut transferred | Integration | `npm test -- contract.test.ts` | Wave 0 |
| PRIZE-06 | Distribution via Move contract | E2E | Manual test | Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test -- --testPathPattern=<changed-file>`
- **Per wave merge:** `npm test`
- **Phase gate:** All WALLET/PRIZE tests must pass before deployment

### Wave 0 Gaps
- [ ] `tests/wallet.test.tsx` — covers WALLET-01, WALLET-02, WALLET-03
- [ ] `tests/contract.test.ts` — covers WALLET-08, WALLET-09, WALLET-10
- [ ] `tests/e2e/betting.test.ts` — covers PRIZE-06 (manual)
- [ ] Jest config: `jest.config.js` — if none detected
- [ ] Framework install: `npm install -D jest @testing-library/react` — if none detected

## Sources

### Primary (HIGH confidence)
- `@wallet-standard/features` connect.d.ts — Wallet Standard connect feature API
- `@wallet-standard/base` wallet.d.ts — Wallet and WalletAccount interfaces
- `@wallet-standard/app` wallets.d.ts — getWallets() registration API
- Existing `lib/wallet/utils.ts` — Current OneWallet connection implementation
- Existing `contracts/sources/minesweeper_bet.move` — Current Move contract

### Secondary (MEDIUM confidence)
- WebSearch: Wallet Standard API patterns — General API usage
- WebSearch: MoveOS stdlib patterns — Global resource storage pattern
- Existing `lib/contract/service.ts` — Contract service interface

### Tertiary (LOW confidence)
- OneChain documentation URLs — Sites returned 403/ENOTFOUND, needs verification
- OCT token address `0x2::oct::OCT` — Assumed standard address, verify on testnet
- RPC endpoint format — Inferred from MoveOS pattern, not verified

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Packages verified in node_modules and package.json
- Architecture: MEDIUM — Wallet Standard API verified, OneChain specifics unverified
- Pitfalls: MEDIUM — Based on Move language patterns and code review
- Code examples: MEDIUM — Wallet Standard types verified, RPC calls inferred

**Research date:** 2026-03-07
**Valid until:** 30 days (stable Wallet Standard API) or until OneChain API changes
