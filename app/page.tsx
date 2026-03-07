'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import CreateRoomModal from '@/components/room/CreateRoomModal';
import RoomList from '@/components/room/RoomList';
import ActiveRoom from '@/components/room/ActiveRoom';
import { useWallet } from '@/hooks/useWallet';
import { useRoom } from '@/hooks/useRoom';
import type { Room } from '@/types/room';

export default function Home() {
  const { isConnected, address, balance } = useWallet();
  const { joinRoom, subscribeToRoom, isLoading } = useRoom();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const handleJoinRoom = async (room: Room) => {
    if (!address || !isConnected) return;

    try {
      await joinRoom({
        roomId: room.id,
        address,
        betAmount: room.betAmount,
      });
      setActiveRoomId(room.id);

      // Subscribe to the room for real-time updates
      subscribeToRoom(room.id);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleLeaveRoom = () => {
    setActiveRoomId(null);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          /* Not Connected State */
          <div className="max-w-md mx-auto text-center py-12">
            <div className="card">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600">
                Connect your OneWallet to create or join game rooms
              </p>
            </div>
          </div>
        ) : activeRoomId ? (
          /* Active Room State */
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setActiveRoomId(null)}
              className="mb-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              ← Back to rooms
            </button>
            <ActiveRoom roomId={activeRoomId} onLeave={handleLeaveRoom} />
          </div>
        ) : (
          /* Room List State */
          <div className="max-w-2xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                MinesweeperZK
              </h1>
              <p className="text-gray-600">
                Provably fair competitive Minesweeper on OneChain
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create Room
              </button>
            </div>

            {/* Room List */}
            <RoomList onJoinRoom={handleJoinRoom} />
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </main>
  );
}