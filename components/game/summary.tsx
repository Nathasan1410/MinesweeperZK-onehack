'use client';

import { useGameStore } from '@/lib/game/store';
import { formatAddress } from '@/lib/wallet/utils';

interface GameSummaryProps {
  onPlayAgain: () => void;
  rank?: number;
  prize?: number;
}

export default function GameSummary({ onPlayAgain, rank = 0, prize = 0 }: GameSummaryProps) {
  const { score, status, resetGame } = useGameStore();

  if (status !== 'finished' || !score) {
    return null;
  }

  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-md mx-auto">
      <div className="text-center">
        {/* Game Over Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Over!</h2>
          <p className="text-gray-600">
            {score.minesHit > 0
              ? `You hit ${score.minesHit} mine${score.minesHit > 1 ? 's' : ''}`
              : 'You cleared the board!'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase">Final Score</div>
            <div className="text-2xl font-bold text-gray-900">{score.totalScore}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase">Cells Revealed</div>
            <div className="text-2xl font-bold text-gray-900">{score.revealed}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase">Correct Flags</div>
            <div className="text-2xl font-bold text-gray-900">{score.correctFlags}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase">Wrong Flags</div>
            <div className="text-2xl font-bold text-gray-900">{score.wrongFlags}</div>
          </div>
        </div>

        {/* Rank & Prize */}
        {rank > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-8">
              <div>
                <div className="text-xs text-blue-600 uppercase">Your Rank</div>
                <div className="text-3xl font-bold text-blue-700">#{rank}</div>
              </div>
              {prize > 0 && (
                <div>
                  <div className="text-xs text-green-600 uppercase">Prize</div>
                  <div className="text-3xl font-bold text-green-700">{prize} OCT</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Play Again Button */}
        <button onClick={handlePlayAgain} className="btn-primary w-full py-3 text-lg">
          Play Again
        </button>
      </div>
    </div>
  );
}