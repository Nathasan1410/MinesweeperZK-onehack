'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/game/store';
import type { GameScore } from '@/lib/game/minesweeper';
import GameBoard from './board';
import GameHUD from './hud';
import GameSummary from './summary';

interface GameContainerProps {
  roomId?: string;
  mineCount?: number;
  seed?: string;
  onScoreSubmit?: (scoreData: { totalScore: number; minesHit: number }) => void;
}

export default function GameContainer({
  roomId,
  mineCount,
  seed,
  onScoreSubmit,
}: GameContainerProps) {
  const { board, status, score, startGame, isGameOver } = useGameStore();
  const [currentRank, setCurrentRank] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(30);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Start game when mounted
  useEffect(() => {
    if (mounted && status === 'idle') {
      startGame(mineCount, seed);
    }
  }, [mounted, status, startGame, mineCount, seed]);

  // Submit score when game ends
  useEffect(() => {
    if (isGameOver && score && onScoreSubmit) {
      onScoreSubmit({
        totalScore: score.totalScore,
        minesHit: score.minesHit,
      });
    }
  }, [isGameOver, score, onScoreSubmit]);

  const handlePlayAgain = () => {
    startGame(mineCount, seed);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Game Title */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">MinesweeperZK</h2>
        {roomId && (
          <p className="text-sm text-gray-500">Room: {roomId}</p>
        )}
      </div>

      {/* HUD */}
      <GameHUD currentRank={currentRank} totalPlayers={totalPlayers} />

      {/* Game Board or Summary */}
      {status === 'finished' && isGameOver ? (
        <GameSummary
          onPlayAgain={handlePlayAgain}
          rank={currentRank}
          prize={0}
        />
      ) : (
        <div className="flex justify-center">
          <GameBoard />
        </div>
      )}

      {/* Instructions */}
      {status === 'playing' && (
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Left-click to reveal • Right-click to flag</p>
        </div>
      )}
    </div>
  );
}