'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/game/store';
import { DEFAULT_MINE_COUNT, TOTAL_CELLS, GRID_SIZE } from '@/lib/game/minesweeper';

interface HUDProps {
  currentRank?: number;
  totalPlayers?: number;
}

export default function GameHUD({ currentRank = 0, totalPlayers = 0 }: HUDProps) {
  const { board, timeRemaining, status, score, tick } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer interval
  useEffect(() => {
    if (status !== 'playing') return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, tick]);

  if (!mounted || !board || status === 'idle') {
    return null;
  }

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const safeCells = TOTAL_CELLS - DEFAULT_MINE_COUNT;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between gap-4">
        {/* Timer */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Time</span>
          <span
            className={`text-2xl font-mono font-bold ${
              timeRemaining < 60000 ? 'text-red-600' : 'text-gray-900'
            }`}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Score</span>
          <span className="text-2xl font-mono font-bold text-gray-900">
            {score?.totalScore ?? 0}
          </span>
        </div>

        {/* Progress */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Revealed</span>
          <span className="text-lg font-mono font-medium text-gray-900">
            {board.revealedCount}/{safeCells}
          </span>
        </div>

        {/* Flags */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Flagged</span>
          <span className="text-lg font-mono font-medium text-gray-900">
            {board.flaggedCount}/{DEFAULT_MINE_COUNT}
          </span>
        </div>

        {/* Rank */}
        {totalPlayers > 0 && (
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Rank</span>
            <span className="text-lg font-mono font-medium text-gray-900">
              #{currentRank} / {totalPlayers}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}