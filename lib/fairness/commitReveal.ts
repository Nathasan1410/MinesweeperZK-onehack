/**
 * Commit-Reveal Protocol for provably fair mine placement
 *
 * How it works:
 * 1. Before game starts, each player generates a random seed
 * 2. Player commits: hash = keccak256(seed + address + roomId)
 * 3. Commit is stored in room data (hidden)
 * 4. After game ends, player reveals: seed
 * 5. Server verifies: keccak256(seed + address + roomId) == stored_commit
 * 6. If valid, use seed to determine mine positions deterministically
 */

/**
 * Generate a random seed (32 bytes as hex string)
 */
export function generateSeed(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Create a commit hash from seed, player address, and room ID
 * Uses SHA-256 (web crypto) - in production, Move contract would use keccak256
 */
export async function createCommit(
  seed: string,
  playerAddress: string,
  roomId: string
): Promise<string> {
  const message = `${seed}:${playerAddress}:${roomId}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify that a revealed seed matches the stored commit
 */
export async function verifyCommit(
  seed: string,
  playerAddress: string,
  roomId: string,
  storedCommit: string
): Promise<boolean> {
  const computedCommit = await createCommit(seed, playerAddress, roomId);
  return computedCommit === storedCommit;
}

/**
 * Generate mine positions using the revealed seed
 * Deterministic: same seed always produces same mine layout
 */
export function generateMines(
  seed: string,
  mineCount: number,
  gridSize: number = 5 // 5x5 grid = 25 cells
): number[] {
  // Use seed to generate deterministic random sequence
  const seedNum = parseInt(seed.substring(0, 8), 16);
  const random = seededRandom(seedNum);

  const mines: number[] = [];
  const totalCells = gridSize * gridSize;

  while (mines.length < mineCount) {
    const pos = Math.floor(random() * totalCells);
    if (!mines.includes(pos)) {
      mines.push(pos);
    }
  }

  return mines.sort((a, b) => a - b);
}

/**
 * Simple seeded random number generator (Linear Congruential Generator)
 */
function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

/**
 * Calculate score based on mines avoided and cash-out timing
 */
export function calculateScore(
  minesHit: number,
  cellsRevealed: number,
  gridSize: number = 5
): number {
  const totalCells = gridSize * gridSize;
  const safeCells = totalCells - mineCountFromHits(minesHit);

  // Base score: safe cells revealed
  let score = safeCells * 100;

  // Bonus for not hitting any mines
  if (minesHit === 0) {
    score += 500;
  }

  // Multiplier for more cells revealed
  const progress = cellsRevealed / safeCells;
  score = Math.floor(score * (1 + progress));

  return score;
}

// Helper to get mine count from hit count (for scoring)
function mineCountFromHits(hits: number): number {
  // Assume 3 mines default, scale with hits
  return Math.max(3, hits * 3);
}