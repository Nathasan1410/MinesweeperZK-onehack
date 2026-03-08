/**
 * Contract Service
 *
 * Handles interaction with the MinesweeperBet Move contract on OneChain.
 * Uses Wallet Standard API for transaction signing.
 */

import { CONTRACT_CONFIG } from '@/types/contract';
import type {
  CreateGameParams,
  SubmitScoreParams,
  ContractResult,
  GameCreatedEvent,
  PlayerJoinedEvent,
  GameStartedEvent,
  PrizesDistributedEvent,
} from '@/types/contract';
import { findOneWallet } from '@/lib/wallet/utils';

// Contract address - UPDATE AFTER DEPLOYMENT
export const CONTRACT_ADDRESS = '0xf5030dcda2245c24382f615533eb38ae7f25116b4d6bf9b2c5e9d4bbe7512d6f';
export const IS_DEMO_MODE = false; // Set to false after deployment

// OneChain testnet RPC endpoint
// Official docs: https://docs.onelabs.cc/DevelopmentDocument
const RPC_URL = 'https://rpc-testnet.onelabs.cc:443';
const FAUCET_URL = 'https://faucet-testnet.onelabs.cc:443';

/**
 * Submit a transaction to OneChain RPC
 */
async function submitTransaction(txBytes: string): Promise<{ hash: string }> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_sendRawTransaction',
      params: [txBytes],
      id: Date.now(),
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || 'Transaction failed');
  }
  return { hash: data.result };
}

/**
 * Create a new game (locks bet in escrow)
 */
export async function createGame(params: CreateGameParams): Promise<ContractResult<GameCreatedEvent>> {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        gameId: params.roomId,
        host: '0x...',
        betAmount: params.betAmount,
        timestamp: Date.now(),
      },
    };
  }

  try {
    const wallet = findOneWallet();
    if (!wallet) {
      return { success: false, error: 'Wallet not connected' };
    }

    // Get signTransaction feature
    const signFeature = wallet.features['standard:signTransaction'] as {
      signTransaction: (tx: any) => Promise<{ bytes: Uint8Array; signature: Uint8Array }>;
    };

    if (!signFeature) {
      return { success: false, error: 'Wallet does not support transaction signing' };
    }

    // TODO: Serialize transaction for minesweeper_bet::create_game
    // This requires proper Move transaction serialization
    // For now, return demo response
    return {
      success: false,
      error: 'Transaction serialization not yet implemented',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create game',
    };
  }
}

/**
 * Join a game (transfer bet to escrow)
 */
export async function joinGame(
  roomId: string,
  player: string,
  betAmount: number
): Promise<ContractResult<PlayerJoinedEvent>> {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        gameId: roomId,
        player,
        betAmount,
        timestamp: Date.now(),
      },
    };
  }

  try {
    const wallet = findOneWallet();
    if (!wallet) {
      return { success: false, error: 'Wallet not connected' };
    }

    // TODO: Implement transaction signing
    return {
      success: false,
      error: 'Transaction serialization not yet implemented',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to join game',
    };
  }
}

/**
 * Start the game (when room is full)
 */
export async function startGame(roomId: string): Promise<ContractResult<GameStartedEvent>> {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        gameId: roomId,
        playerCount: 30,
        totalPool: 300,
        timestamp: Date.now(),
      },
    };
  }

  try {
    const wallet = findOneWallet();
    if (!wallet) {
      return { success: false, error: 'Wallet not connected' };
    }

    // TODO: Implement transaction signing
    return {
      success: false,
      error: 'Transaction serialization not yet implemented',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start game',
    };
  }
}

/**
 * Submit score after game ends
 */
export async function submitScore(params: SubmitScoreParams): Promise<ContractResult<{ success: boolean }>> {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, data: { success: true } };
  }

  try {
    const wallet = findOneWallet();
    if (!wallet) {
      return { success: false, error: 'Wallet not connected' };
    }

    // TODO: Implement transaction signing
    return {
      success: false,
      error: 'Transaction serialization not yet implemented',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit score',
    };
  }
}

/**
 * Distribute prizes to winners
 */
export async function distributePrizes(
  roomId: string
): Promise<ContractResult<PrizesDistributedEvent>> {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        gameId: roomId,
        winners: ['0xwinner1', '0xwinner2', '0xwinner3'],
        amounts: [120, 75, 45],
        houseFee: 15,
        timestamp: Date.now(),
      },
    };
  }

  try {
    const wallet = findOneWallet();
    if (!wallet) {
      return { success: false, error: 'Wallet not connected' };
    }

    // TODO: Implement transaction signing for distribute_prizes
    return {
      success: false,
      error: 'Transaction serialization not yet implemented',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to distribute prizes',
    };
  }
}

/**
 * Get contract address
 */
export function getContractAddress(): string {
  return IS_DEMO_MODE ? 'DEMO_MODE' : CONTRACT_ADDRESS;
}

/**
 * Check if running in demo mode
 */
export function getIsDemoMode(): boolean {
  return IS_DEMO_MODE;
}

// Export singleton instance for backward compatibility
export const contractService = {
  createGame,
  joinGame,
  startGame,
  submitScore,
  distributePrizes,
  getIsDemoMode,
};
