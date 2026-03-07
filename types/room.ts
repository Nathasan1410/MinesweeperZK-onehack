export type RoomStatus = 'waiting' | 'countdown' | 'playing' | 'finished';

export interface Player {
  address: string;
  betAmount: number;
  commit?: string; // Hash submitted before game
  reveal?: string; // Seed revealed after game
  minesHit: number;
  score: number;
  cashedOut: boolean;
  profit?: number;
  joinedAt: Date;
}

export interface Room {
  id: string;
  code: string; // Short 6-char code for sharing
  hostAddress: string;
  status: RoomStatus;
  betAmount: number;
  mineCount: number;
  maxPlayers: number;
  players: Player[];
  seed?: string; // Combined seed for board generation
  countdownEndTime?: Date | null;
  startTime?: Date | null;
  endTime?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomParams {
  hostAddress: string;
  betAmount: number;
  mineCount: number;
  maxPlayers?: number;
}

export interface JoinRoomParams {
  roomId: string;
  address: string;
  betAmount: number;
}

// Prize breakdown percentages for top 10%
export const PRIZE_BREAKDOWN = [
  { rank: 1, percentage: 40 },
  { rank: 2, percentage: 25 },
  { rank: 3, percentage: 15 },
  { rank: 4, percentage: 10 },
  { rank: 5, percentage: 10 },
];

/**
 * Calculate prize for a given rank
 */
export function calculatePrize(rank: number, totalPool: number): number {
  const breakdown = PRIZE_BREAKDOWN.find((p) => p.rank === rank);
  if (!breakdown) return 0;
  return Math.floor((totalPool * breakdown.percentage) / 100);
}

/**
 * Get total prize pool from all players
 */
export function getTotalPrizePool(players: Player[]): number {
  return players.reduce((sum, p) => sum + p.betAmount, 0);
}