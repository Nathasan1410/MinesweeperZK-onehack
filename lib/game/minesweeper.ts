// Minesweeper game logic

export const GRID_SIZE = 8;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE; // 64
export const DEFAULT_MINE_COUNT = 10;
export const GAME_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export type CellState = 'hidden' | 'revealed' | 'flagged' | 'mine' | 'exploded';

export interface Cell {
  index: number;
  row: number;
  col: number;
  isMine: boolean;
  state: CellState;
  neighborMines: number;
}

export interface GameBoard {
  cells: Cell[];
  revealedCount: number;
  flaggedCount: number;
  mineCount: number;
}

export interface GameScore {
  revealed: number;
  correctFlags: number;
  wrongFlags: number;
  minesHit: number;
  totalScore: number;
}

/**
 * Generate a deterministic mine positions from seed
 */
export function generateBoard(
  mineCount: number = DEFAULT_MINE_COUNT,
  playerSeed: string = ''
): GameBoard {
  const cells: Cell[] = [];
  const totalCells = TOTAL_CELLS;

  // Generate deterministic mine positions using seed
  const minePositions = generateMinePositions(mineCount, playerSeed, totalCells);
  const mineSet = new Set(minePositions);

  // Create all cells
  for (let i = 0; i < totalCells; i++) {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    const isMine = mineSet.has(i);

    cells.push({
      index: i,
      row,
      col,
      isMine,
      state: 'hidden',
      neighborMines: isMine ? -1 : countNeighborMines(i, mineSet),
    });
  }

  return {
    cells,
    revealedCount: 0,
    flaggedCount: 0,
    mineCount,
  };
}

/**
 * Generate deterministic mine positions
 */
function generateMinePositions(
  count: number,
  seed: string,
  totalCells: number
): number[] {
  const positions: number[] = [];
  const seedNum = hashString(seed || Math.random().toString());
  let rng = seededRandom(seedNum);

  while (positions.length < count) {
    const pos = Math.floor(rng() * totalCells);
    if (!positions.includes(pos)) {
      positions.push(pos);
    }
  }

  return positions.sort((a, b) => a - b);
}

/**
 * Hash string to number for seeding
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Seeded random number generator
 */
function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

/**
 * Count neighboring mines
 */
function countNeighborMines(index: number, mineSet: Set<number>): number {
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  let count = 0;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
        const neighborIndex = nr * GRID_SIZE + nc;
        if (mineSet.has(neighborIndex)) count++;
      }
    }
  }

  return count;
}

/**
 * Reveal a cell and flood-fill if empty
 */
export function revealCell(board: GameBoard, index: number): GameBoard {
  const cells = [...board.cells];
  const cell = cells[index];

  if (cell.state !== 'hidden') return board;

  if (cell.isMine) {
    // Hit a mine - reveal all mines
    cells[index] = { ...cell, state: 'exploded' };
    // Reveal all mines
    cells.forEach((c, i) => {
      if (c.isMine && c.state === 'hidden') {
        cells[i] = { ...c, state: 'mine' };
      }
    });
  } else {
    // Flood fill empty cells
    floodFill(cells, index);
  }

  const revealedCount = cells.filter((c) => c.state === 'revealed').length;
  const flaggedCount = cells.filter((c) => c.state === 'flagged').length;

  return { ...board, cells, revealedCount, flaggedCount };
}

/**
 * Flood fill algorithm for empty cells
 */
function floodFill(cells: Cell[], index: number) {
  const stack = [index];
  const visited = new Set<number>();

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const cell = cells[current];
    if (cell.state !== 'hidden') continue;

    cells[current] = { ...cell, state: 'revealed' };

    // If cell has no neighboring mines, continue flood fill
    if (cell.neighborMines === 0) {
      const row = Math.floor(current / GRID_SIZE);
      const col = current % GRID_SIZE;

      // Add all neighbors to stack
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = row + dr;
          const nc = col + dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
            stack.push(nr * GRID_SIZE + nc);
          }
        }
      }
    }
  }
}

/**
 * Toggle flag on a cell
 */
export function toggleFlag(board: GameBoard, index: number): GameBoard {
  const cells = [...board.cells];
  const cell = cells[index];

  if (cell.state !== 'hidden') return board;

  // Toggle between hidden and flagged
  const newState: CellState = 'flagged';
  cells[index] = { ...cell, state: newState };

  const flaggedCount = cells.filter((c) => c.state === 'flagged').length;

  return { ...board, cells, flaggedCount };
}

/**
 * Calculate game score
 */
export function calculateScore(
  revealed: number,
  correctFlags: number,
  wrongFlags: number,
  minesHit: number
): GameScore {
  const safeCells = TOTAL_CELLS - DEFAULT_MINE_COUNT; // 54

  // Score formula from spec
  const revealScore = Math.floor((revealed / safeCells) * 500);
  const flagScore = Math.floor((correctFlags / DEFAULT_MINE_COUNT) * 500);
  const penalty = wrongFlags * 50;
  const minePenalty = minesHit * 100;

  const totalScore = Math.max(0, revealScore + flagScore - penalty - minePenalty);

  return {
    revealed,
    correctFlags,
    wrongFlags,
    minesHit,
    totalScore,
  };
}

/**
 * Get cell color for revealed numbers
 */
export function getCellColor(neighborMines: number): string {
  const colors = [
    '',
    'text-blue-600',
    'text-green-600',
    'text-red-600',
    'text-purple-600',
    'text-maroon-600',
    'text-turquoise-600',
    'text-black-600',
    'text-gray-600',
  ];
  return colors[neighborMines] || 'text-gray-600';
}