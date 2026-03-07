import { useState, useCallback, useEffect } from 'react';
import { useRoomStore } from '@/lib/room/store';
import type { CreateRoomParams, JoinRoomParams } from '@/types/room';

export function useRoom() {
  const {
    currentRoom,
    isLoading,
    error,
    waitingRooms,
    isLoadingList,
    createRoom,
    joinRoom,
    leaveRoom,
    startCountdown,
    updateRoomStatus,
    loadWaitingRooms,
    subscribeToWaitingRooms,
    subscribeToRoom,
    setCurrentRoom,
    clearError,
    submitScore,
  } = useRoomStore();

  const [isSubscribed, setIsSubscribed] = useState(false);

  // Create a new room
  const handleCreateRoom = useCallback(
    async (params: CreateRoomParams) => {
      return createRoom(
        params.hostAddress,
        params.betAmount,
        params.mineCount,
        params.maxPlayers
      );
    },
    [createRoom]
  );

  // Join an existing room
  const handleJoinRoom = useCallback(
    async (params: JoinRoomParams) => {
      return joinRoom(params.roomId, params.address, params.betAmount);
    },
    [joinRoom]
  );

  // Leave current room
  const handleLeaveRoom = useCallback(
    async (address: string) => {
      if (!currentRoom) return;
      return leaveRoom(currentRoom.id, address);
    },
    [leaveRoom, currentRoom]
  );

  // Subscribe to a specific room
  const handleSubscribeToRoom = useCallback(
    (roomId: string) => {
      const unsubscribe = subscribeToRoom(roomId);
      setIsSubscribed(true);
      return unsubscribe;
    },
    [subscribeToRoom]
  );

  // Start game countdown
  const handleStartCountdown = useCallback(async () => {
    if (!currentRoom) return;
    return startCountdown(currentRoom.id);
  }, [startCountdown, currentRoom]);

  // Update room status
  const handleUpdateStatus = useCallback(
    async (status: 'waiting' | 'countdown' | 'playing' | 'finished', seed?: string) => {
      if (!currentRoom) return;
      return updateRoomStatus(currentRoom.id, status, seed);
    },
    [updateRoomStatus, currentRoom]
  );

  // Submit player score
  const handleSubmitScore = useCallback(
    async (address: string, score: number, minesHit: number) => {
      if (!currentRoom) return;
      return submitScore(currentRoom.id, address, score, minesHit);
    },
    [submitScore, currentRoom]
  );

  // Load waiting rooms
  const handleLoadWaitingRooms = useCallback(() => {
    loadWaitingRooms();
  }, [loadWaitingRooms]);

  // Subscribe to waiting rooms
  const handleSubscribeToWaitingRooms = useCallback(() => {
    return subscribeToWaitingRooms();
  }, [subscribeToWaitingRooms]);

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (isSubscribed) {
        setIsSubscribed(false);
      }
    };
  }, [isSubscribed]);

  return {
    // State
    currentRoom,
    isLoading,
    error,
    waitingRooms,
    isLoadingList,

    // Actions
    createRoom: handleCreateRoom,
    joinRoom: handleJoinRoom,
    leaveRoom: handleLeaveRoom,
    startCountdown: handleStartCountdown,
    updateStatus: handleUpdateStatus,
    loadWaitingRooms: handleLoadWaitingRooms,
    subscribeToWaitingRooms: handleSubscribeToWaitingRooms,
    subscribeToRoom: handleSubscribeToRoom,
    setCurrentRoom,
    clearError,
    submitScore: handleSubmitScore,
  };
}