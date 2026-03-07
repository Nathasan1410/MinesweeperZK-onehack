import { create } from 'zustand';
import {
  GameBoard,
  revealCell,
  toggleFlag,
  calculateScore,
  generateBoard,
  GAME_DURATION_MS,
  DEFAULT_MINE_COUNT,
  TOTAL_CELLS,
} from './minesweeper';

export type GameStatus = 'idle' | 'playing' | 'finished';

interface GameState {
  // Game state
  board: GameBoard | null;
  status: GameStatus;
  startTime: number | null;
  endTime: number | null;
  timeRemaining: number;
  score: ReturnType<typeof calculateScore> | null;
  isGameOver: boolean;

  // Actions
  startGame: (mineCount?: number, seed?: string) => void;
  reveal: (index: number) => void;
  flag: (index: number) => void;
  tick: () => void;
  endGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  board: null,
  status: 'idle',
  startTime: null,
  endTime: null,
  timeRemaining: GAME_DURATION_MS,
  score: null,
  isGameOver: false,

  // Start a new game
  startGame: (mineCount = DEFAULT_MINE_COUNT, seed = '') => {
    const board = generateBoard(mineCount, seed);
    set({
      board,
      status: 'playing',
      startTime: Date.now(),
      endTime: null,
      timeRemaining: GAME_DURATION_MS,
      score: null,
      isGameOver: false,
    });
  },

  // Reveal a cell
  reveal: (index: number) => {
    const { board, status, isGameOver } = get();
    if (!board || status !== 'playing' || isGameOver) return;

    const newBoard = revealCell(board, index);

    // Check if game over (hit mine or all safe cells revealed)
    const revealedMines = newBoard.cells.filter(
      (c) => c.state === 'exploded' || c.state === 'mine'
    ).length;
    const allSafeRevealed =
      newBoard.revealedCount === newBoard.cells.length - newBoard.mineCount;

    let isGameOverNow = false;
    let score = null;

    if (revealedMines > 0 || allSafeRevealed) {
      isGameOverNow = true;
      const minesHit = revealedMines;

      // Count correct flags
      let correctFlags = 0;
      let wrongFlags = 0;
      newBoard.cells.forEach((c) => {
        if (c.state === 'flagged') {
          if (c.isMine) {
            correctFlags++;
          } else {
            wrongFlags++;
          }
        }
      });

      score = calculateScore(
        newBoard.revealedCount,
        correctFlags,
        wrongFlags,
        minesHit
      );
    }

    set({
      board: newBoard,
      isGameOver: isGameOverNow,
      score,
      status: isGameOverNow ? 'finished' : 'playing',
      endTime: isGameOverNow ? Date.now() : null,
    });
  },

  // Toggle flag on a cell
  flag: (index: number) => {
    const { board, status, isGameOver } = get();
    if (!board || status !== 'playing' || isGameOver) return;

    const newBoard = toggleFlag(board, index);
    set({ board: newBoard });
  },

  // Timer tick - also updates live score with time decay
  tick: () => {
    const { status, timeRemaining, isGameOver, board, startTime } = get();
    if (status !== 'playing' || isGameOver || !board) return;

    if (timeRemaining <= 0) {
      // Time's up - game over
      const { board } = get();
      if (!board) return;

      // Calculate final score
      let correctFlags = 0;
      let wrongFlags = 0;
      board.cells.forEach((c) => {
        if (c.state === 'flagged') {
          if (c.isMine) {
            correctFlags++;
          } else {
            wrongFlags++;
          }
        }
      });

      const score = calculateScore(
        board.revealedCount,
        correctFlags,
        wrongFlags,
        0
      );

      set({
        timeRemaining: 0,
        isGameOver: true,
        status: 'finished',
        endTime: Date.now(),
        score,
      });
    } else {
      // Update time and calculate live score with time decay
      const newTimeRemaining = timeRemaining - 1000;

      // Calculate score with time decay
      // Base score from revealed cells
      const baseScore = Math.floor((board.revealedCount / (TOTAL_CELLS - DEFAULT_MINE_COUNT)) * 500);

      // Time decay: score decreases by 1 point per second
      // More time remaining = higher potential score
      const maxTime = GAME_DURATION_MS;
      const timeElapsed = maxTime - newTimeRemaining;
      const timeBonus = Math.max(0, Math.floor((maxTime - timeElapsed) / 1000));

      // Live score = base score + time bonus - penalties
      const liveScore = Math.max(0, baseScore + timeBonus);

      // Create a live score object for display
      const liveScoreObj = {
        revealed: board.revealedCount,
        correctFlags: board.flaggedCount,
        wrongFlags: 0,
        minesHit: 0,
        totalScore: liveScore,
      };

      set({ timeRemaining: newTimeRemaining, score: liveScoreObj });
    }
  },

  // End game manually
  endGame: () => {
    const { board } = get();
    if (!board) return;

    let correctFlags = 0;
    let wrongFlags = 0;
    board.cells.forEach((c) => {
      if (c.state === 'flagged') {
        if (c.isMine) {
          correctFlags++;
        } else {
          wrongFlags++;
        }
      }
    });

    const score = calculateScore(
      board.revealedCount,
      correctFlags,
      wrongFlags,
      0
    );

    set({
      isGameOver: true,
      status: 'finished',
      endTime: Date.now(),
      score,
    });
  },

  // Reset game
  resetGame: () => {
    set({
      board: null,
      status: 'idle',
      startTime: null,
      endTime: null,
      timeRemaining: GAME_DURATION_MS,
      score: null,
      isGameOver: false,
    });
  },
}));