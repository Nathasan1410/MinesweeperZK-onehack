'use client';

import type { Room } from '@/types/room';
import { formatAddress } from '@/lib/wallet/utils';
import { calculatePrize } from '@/types/room';

interface GameResultsProps {
  room: Room;
  currentAddress?: string;
  onPlayAgain: () => void;
}

export default function GameResults({ room, currentAddress, onPlayAgain }: GameResultsProps) {
  // Sort players by score (highest first)
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  // Get total prize pool
  const totalPool = room.players.reduce((sum, p) => sum + p.betAmount, 0);

  // Find current player's rank
  const currentPlayerRank = sortedPlayers.findIndex(p => p.address === currentAddress) + 1;
  const currentPlayer = room.players.find(p => p.address === currentAddress);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Over!</h2>
        <p className="text-gray-600">Final Rankings</p>
      </div>

      {/* Rankings */}
      <div className="space-y-3 mb-6">
        {sortedPlayers.slice(0, 5).map((player, index) => (
          <div
            key={player.address}
            className={`flex items-center justify-between p-3 rounded-lg ${
              player.address === currentAddress ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                index === 1 ? 'bg-gray-100 text-gray-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-200 text-gray-500'
              }`}>
                #{index + 1}
              </span>
              <span className="font-mono text-sm">
                {formatAddress(player.address)}
              </span>
              {player.address === room.hostAddress && (
                <span className="text-xs text-gray-500">(host)</span>
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{player.score} pts</div>
              {player.minesHit > 0 && (
                <div className="text-xs text-red-500">{player.minesHit} mines hit</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Current Player Result */}
      {currentPlayer && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-blue-600">Your Result</div>
            <div className="text-3xl font-bold text-blue-700">#{currentPlayerRank}</div>
            <div className="text-lg text-gray-700">{currentPlayer.score} points</div>
            {totalPool > 0 && (
              <div className="text-green-600 font-medium mt-2">
                Prize: {calculatePrize(currentPlayerRank, totalPool)} OCT
              </div>
            )}
          </div>
        </div>
      )}

      {/* Play Again - Only for host */}
      {currentAddress === room.hostAddress && (
        <button onClick={onPlayAgain} className="btn-primary w-full py-3">
          Start New Game
        </button>
      )}
    </div>
  );
}