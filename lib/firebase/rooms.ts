import { db } from './config';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import type { Room } from '@/types/room';

// Collection references
const roomsCollection = collection(db, 'rooms');

/**
 * Create a new room
 */
export async function createRoom(room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(roomsCollection, {
    ...room,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Get a room by ID
 */
export async function getRoom(roomId: string): Promise<Room | null> {
  const docRef = doc(db, 'rooms', roomId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
    startTime: data.startTime?.toDate?.() || null,
  } as Room;
}

/**
 * Update a room
 */
export async function updateRoom(roomId: string, updates: Partial<Room>): Promise<void> {
  const docRef = doc(db, 'rooms', roomId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a room
 */
export async function deleteRoom(roomId: string): Promise<void> {
  const docRef = doc(db, 'rooms', roomId);
  await deleteDoc(docRef);
}

/**
 * Get all waiting rooms
 */
export async function getWaitingRooms(): Promise<Room[]> {
  const q = query(roomsCollection, where('status', '==', 'waiting'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      startTime: data.startTime?.toDate?.() || null,
    } as Room;
  });
}

/**
 * Subscribe to room updates (real-time)
 */
export function subscribeToRoom(
  roomId: string,
  callback: (room: Room | null) => void
): () => void {
  const docRef = doc(db, 'rooms', roomId);

  return onSnapshot(docRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }

    const data = docSnap.data();
    callback({
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      startTime: data.startTime?.toDate?.() || null,
    } as Room);
  });
}

/**
 * Subscribe to waiting rooms list (real-time)
 */
export function subscribeToWaitingRooms(
  callback: (rooms: Room[]) => void
): () => void {
  const q = query(roomsCollection, where('status', '==', 'waiting'));

  return onSnapshot(q, (querySnapshot) => {
    const rooms = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        startTime: data.startTime?.toDate?.() || null,
      } as Room;
    });
    callback(rooms);
  });
}

/**
 * Add player to room
 */
export async function addPlayerToRoom(roomId: string, player: Room['players'][0]): Promise<void> {
  const room = await getRoom(roomId);
  if (!room) throw new Error('Room not found');

  const updatedPlayers = [...room.players, player];
  await updateRoom(roomId, { players: updatedPlayers });
}

/**
 * Remove player from room
 */
export async function removePlayerFromRoom(roomId: string, address: string): Promise<void> {
  const room = await getRoom(roomId);
  if (!room) throw new Error('Room not found');

  const updatedPlayers = room.players.filter((p) => p.address !== address);
  await updateRoom(roomId, { players: updatedPlayers });
}

/**
 * Update player in room
 */
export async function updatePlayerInRoom(
  roomId: string,
  address: string,
  updates: Partial<Room['players'][0]>
): Promise<void> {
  const room = await getRoom(roomId);
  if (!room) throw new Error('Room not found');

  const updatedPlayers = room.players.map((p) =>
    p.address === address ? { ...p, ...updates } : p
  );
  await updateRoom(roomId, { players: updatedPlayers });
}

/**
 * Update player score in room
 */
export async function updatePlayerScore(
  roomId: string,
  address: string,
  score: number,
  minesHit: number
): Promise<void> {
  await updatePlayerInRoom(roomId, address, { score, minesHit });
}