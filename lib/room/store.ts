import { create } from 'zustand';
import type { Room, RoomStatus } from '@/types/room';
import * as roomApi from '@/lib/firebase/rooms';
import { v4 as uuidv4 } from 'uuid';

interface RoomState {
  // Current room
  currentRoom: Room | null;
  isLoading: boolean;
  error: string | null;

  // Room list
  waitingRooms: Room[];
  isLoadingList: boolean;

  // Actions
  setCurrentRoom: (room: Room | null) => void;
  createRoom: (hostAddress: string, betAmount: number, mineCount: number, maxPlayers?: number) => Promise<string>;
  joinRoom: (roomId: string, address: string, betAmount: number) => Promise<void>;
  leaveRoom: (roomId: string, address: string) => Promise<void>;
  startCountdown: (roomId: string) => Promise<void>;
  updateRoomStatus: (roomId: string, status: RoomStatus, seed?: string) => Promise<void>;

  // List actions
  loadWaitingRooms: () => void;
  subscribeToWaitingRooms: () => () => void;
  subscribeToRoom: (roomId: string) => () => void;
  submitScore: (roomId: string, address: string, score: number, minesHit: number) => Promise<void>;
  submitCommit: (roomId: string, address: string, commit: string) => Promise<void>;
  submitReveal: (roomId: string, address: string, reveal: string) => Promise<void>;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const useRoomStore = create<RoomState>((set, get) => ({
  // Initial state
  currentRoom: null,
  isLoading: false,
  error: null,
  waitingRooms: [],
  isLoadingList: false,

  // Set current room
  setCurrentRoom: (room) => set({ currentRoom: room }),

  // Create a new room
  createRoom: async (hostAddress, betAmount, mineCount, maxPlayers = 30) => {
    set({ isLoading: true, error: null });

    try {
      const roomCode = generateRoomCode();
      const roomId = await roomApi.createRoom({
        code: roomCode,
        hostAddress,
        status: 'waiting',
        betAmount,
        mineCount,
        maxPlayers,
        players: [
          {
            address: hostAddress,
            betAmount,
            minesHit: 0,
            score: 0,
            cashedOut: false,
            joinedAt: new Date(),
          },
        ],
      });

      // Subscribe to the new room
      const unsubscribe = roomApi.subscribeToRoom(roomId, (room) => {
        set({ currentRoom: room });
      });

      set({ isLoading: false });
      return roomId;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create room';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  // Join an existing room
  joinRoom: async (roomId, address, betAmount) => {
    set({ isLoading: true, error: null });

    try {
      await roomApi.addPlayerToRoom(roomId, {
        address,
        betAmount,
        minesHit: 0,
        score: 0,
        cashedOut: false,
        joinedAt: new Date(),
      });

      set({ isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join room';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  // Leave a room
  leaveRoom: async (roomId, address) => {
    set({ isLoading: true, error: null });

    try {
      await roomApi.removePlayerFromRoom(roomId, address);
      set({ isLoading: false, currentRoom: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to leave room';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  // Start countdown (when room is full)
  startCountdown: async (roomId) => {
    try {
      const countdownEndTime = new Date(Date.now() + 5000); // 5 seconds
      await roomApi.updateRoom(roomId, {
        status: 'countdown',
        countdownEndTime,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start countdown';
      set({ error: message });
      throw err;
    }
  },

  // Update room status
  updateRoomStatus: async (roomId, status, seed?: string) => {
    try {
      const updates: Partial<Room> = { status };
      if (status === 'playing') {
        updates.startTime = new Date();
        if (seed) {
          updates.seed = seed;
        }
      } else if (status === 'finished') {
        updates.endTime = new Date();
      }
      await roomApi.updateRoom(roomId, updates);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update room status';
      set({ error: message });
      throw err;
    }
  },

  // Load waiting rooms once
  loadWaitingRooms: () => {
    set({ isLoadingList: true });
    roomApi
      .getWaitingRooms()
      .then((rooms) => {
        set({ waitingRooms: rooms, isLoadingList: false });
      })
      .catch((err) => {
        set({ error: err.message, isLoadingList: false });
      });
  },

  // Subscribe to waiting rooms (real-time)
  subscribeToWaitingRooms: () => {
    return roomApi.subscribeToWaitingRooms((rooms) => {
      set({ waitingRooms: rooms });
    });
  },

  // Subscribe to a specific room (real-time)
  subscribeToRoom: (roomId) => {
    return roomApi.subscribeToRoom(roomId, (room) => {
      set({ currentRoom: room });
    });
  },

  // Submit player score
  submitScore: async (roomId, address, score, minesHit) => {
    try {
      await roomApi.updatePlayerScore(roomId, address, score, minesHit);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit score';
      set({ error: message });
      throw err;
    }
  },

  // Submit commit (hash) before game starts
  submitCommit: async (roomId, address, commit) => {
    try {
      await roomApi.updatePlayerInRoom(roomId, address, { commit });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit commit';
      set({ error: message });
      throw err;
    }
  },

  // Submit reveal (seed) after game ends
  submitReveal: async (roomId, address, reveal) => {
    try {
      await roomApi.updatePlayerInRoom(roomId, address, { reveal });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit reveal';
      set({ error: message });
      throw err;
    }
  },

  // Error handling
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));