'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useRoom } from '@/hooks/useRoom';
import type { Room } from '@/types/room';

interface RoomListProps {
  onJoinRoom: (room: Room) => void;
}

export default function RoomList({ onJoinRoom }: RoomListProps) {
  const { address, isConnected, balance } = useWallet();
  const {
    waitingRooms,
    isLoadingList,
    subscribeToWaitingRooms,
    loadWaitingRooms,
  } = useRoom();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadWaitingRooms();
  }, [loadWaitingRooms]);

  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = subscribeToWaitingRooms();
    return () => unsubscribe();
  }, [mounted, subscribeToWaitingRooms]);

  if (!mounted) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingList) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (waitingRooms.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Rooms</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No rooms available</p>
          <p className="text-sm mt-2">Create a room to start playing!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Available Rooms ({waitingRooms.length})
      </h3>

      <div className="space-y-3">
        {waitingRooms.map((room) => (
          <div
            key={room.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium text-gray-900">
                  {room.code}
                </span>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  Waiting
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span>{room.players.length}/{room.maxPlayers} players</span>
                <span>•</span>
                <span>{room.mineCount} mines</span>
                <span>•</span>
                <span>{room.betAmount} OCT</span>
              </div>
            </div>

            <button
              onClick={() => onJoinRoom(room)}
              disabled={!isConnected || !!(address && room.players.some(p => p.address === address))}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {room.players.some(p => address !== null && p.address === address) ? 'Joined' : 'Join'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}