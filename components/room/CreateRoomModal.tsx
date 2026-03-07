'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useRoom } from '@/hooks/useRoom';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const { address, isConnected } = useWallet();
  const { createRoom, isLoading, error, clearError } = useRoom();

  const [betAmount, setBetAmount] = useState(10);
  const [mineCount, setMineCount] = useState(3);
  const [maxPlayers, setMaxPlayers] = useState(30);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!address || !isConnected) {
      return;
    }

    try {
      const roomId = await createRoom({
        hostAddress: address,
        betAmount,
        mineCount,
        maxPlayers,
      });
      setCreatedRoomId(roomId);
      onClose();
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleClose = () => {
    setCreatedRoomId(null);
    clearError();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Create Room</h2>

        {!isConnected ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Connect your wallet first</p>
            <button onClick={handleClose} className="btn-secondary">
              Close
            </button>
          </div>
        ) : createdRoomId ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <p className="text-gray-900 font-medium mb-2">Room Created!</p>
            <p className="text-sm text-gray-500 mb-4">Room ID: {createdRoomId}</p>
            <button onClick={handleClose} className="btn-primary">
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bet Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bet Amount (OCT)
              </label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min={1}
                max={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Mine Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Mines
              </label>
              <div className="flex gap-2">
                {[3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                  <button
                    key={count}
                    onClick={() => setMineCount(count)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      mineCount === count
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Players */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Players
              </label>
              <select
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10 players</option>
                <option value={20}>20 players</option>
                <option value={30}>30 players</option>
                <option value={50}>50 players</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button onClick={handleClose} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isLoading || betAmount < 1}
                className="btn-primary flex-1"
              >
                {isLoading ? 'Creating...' : 'Create Room'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}