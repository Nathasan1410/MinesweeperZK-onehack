/**
 * Contract Service
 *
 * Handles interaction with the MinesweeperBet Move contract on OneChain.
 * Uses Wallet Standard API for transaction signing.
 *
 * NOTE: Currently in demo mode for hackathon submission.
 * Full on-chain interaction requires shared object pattern implementation.
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

// Contract address from deployment
export const CONTRACT_ADDRESS = '0xf5030dcda2245c24382f615533eb38ae7f25116b4d6bf9b2c5e9d4bbe7512d6f';
export const IS_DEMO_MODE = true; // Demo mode for hackathon submission

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
        host: '0x143199da526d324155945adec2f53a5128e63006d2bdcd610e2114754dd71420',
        betAmount: params.betAmount,
        timestamp: Date.now(),
      },
    };
  }

  try {
    // TODO: Implement on-chain transaction signing
    return {
      success: false,
      error: 'On-chain interaction not yet implemented',
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
    // TODO: Implement on-chain transaction signing
    return {
      success: false,
      error: 'On-chain interaction not yet implemented',
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
    // TODO: Implement on-chain transaction signing
    return {
      success: false,
      error: 'On-chain interaction not yet implemented',
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
    // TODO: Implement on-chain transaction signing
    return {
      success: false,
      error: 'On-chain interaction not yet implemented',
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
    // TODO: Implement on-chain transaction signing for distribute_prizes
    return {
      success: false,
      error: 'On-chain interaction not yet implemented',
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
