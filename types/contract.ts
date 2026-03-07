// Contract-related types

export interface ContractConfig {
  // Contract address on OneChain
  contractAddress: string;
  // Whether to use demo mode (no real contract)
  isDemoMode: boolean;
}

// Game status enum
export type GameStatus = 'waiting' | 'playing' | 'finished';

// Event types
export interface GameCreatedEvent {
  gameId: string;
  host: string;
  betAmount: number;
  timestamp: number;
}

export interface PlayerJoinedEvent {
  gameId: string;
  player: string;
  betAmount: number;
  timestamp: number;
}

export interface GameStartedEvent {
  gameId: string;
  playerCount: number;
  totalPool: number;
  timestamp: number;
}

export interface PrizesDistributedEvent {
  gameId: string;
  winners: string[];
  amounts: number[];
  houseFee: number;
  timestamp: number;
}

// Contract function params
export interface CreateGameParams {
  roomId: string;
  betAmount: number;
  maxPlayers: number;
}

export interface SubmitScoreParams {
  roomId: string;
  player: string;
  score: number;
  minesHit: number;
  firebaseSignature?: string;
}

// Contract call result
export interface ContractResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Demo mode configuration
export const CONTRACT_CONFIG: ContractConfig = {
  contractAddress: '0xYOUR_DEPLOYED_ADDRESS_HERE', // UPDATE AFTER DEPLOYMENT
  isDemoMode: true, // Set to false when contract is deployed to testnet
};

// Prize calculation constants
export const HOUSE_FEE_PERCENT = 5;
export const PRIZE_PERCENTAGES = [40, 25, 15, 10, 10];

// Calculate prize distribution
export function calculateDistribution(totalPool: number): {
  prizes: number[];
  houseFee: number;
} {
  const houseFee = Math.floor((totalPool * HOUSE_FEE_PERCENT) / 100);
  const prizePool = totalPool - houseFee;

  const prizes = PRIZE_PERCENTAGES.map(
    (pct) => Math.floor((prizePool * pct) / 100)
  );

  return { prizes, houseFee };
}