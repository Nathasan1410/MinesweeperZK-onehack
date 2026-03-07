'use client';

import { useState, useEffect } from 'react';
import type { Room, Player } from '@/types/room';

interface CommitRevealProps {
  room: Room;
  playerAddress: string;
  onCommit: (commitHash: string) => void;
  onReveal: (seed: string) => void;
  gameStatus: 'waiting' | 'countdown' | 'playing' | 'finished' | string;
}

export default function CommitReveal({
  room,
  playerAddress,
  onCommit,
  onReveal,
  gameStatus
}: CommitRevealProps) {
  const [localCommit, setLocalCommit] = useState('');
  const [revealSeed, setRevealSeed] = useState('');
  const [commitHash, setCommitHash] = useState('');
  const [step, setStep] = useState<'none' | 'commit' | 'revealed'>('none');

  const currentPlayer = room.players.find(p => p.address === playerAddress);

  // Check current state
  useEffect(() => {
    if (currentPlayer?.commit && !currentPlayer?.reveal) {
      setCommitHash(currentPlayer.commit);
      setStep('commit');
    } else if (currentPlayer?.reveal) {
      setStep('revealed');
    }
  }, [currentPlayer]);

  // Generate a random seed and hash it for commit
  const handleGenerateCommit = () => {
    const seed = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const hash = simpleHash(seed);
    setLocalCommit(seed);
    setCommitHash(hash);
    onCommit(hash);
  };

  // Reveal the seed
  const handleReveal = () => {
    if (localCommit) {
      onReveal(localCommit);
      setStep('revealed');
    }
  };

  // If game is playing or finished, don't show commit-reveal
  if (gameStatus === 'playing' || gameStatus === 'finished') {
    return null;
  }

  // Already committed and revealed
  if (step === 'revealed') {
    return (
      <div className="bg-green-50 rounded-lg p-4">
        <p className="text-sm text-green-700 text-center">
          ✓ Seed committed and verified
        </p>
      </div>
    );
  }

  // Committed but not revealed
  if (step === 'commit') {
    return (
      <div className="bg-blue-50 rounded-lg p-4 space-y-3">
        <div className="text-center">
          <p className="text-sm text-blue-700 mb-2">
            You've committed. Waiting for game to end...
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Commit: {commitHash.substring(0, 8)}...
          </p>
        </div>

        {gameStatus === 'finished' && (
          <button
            onClick={handleReveal}
            className="btn-primary w-full"
          >
            Reveal My Seed
          </button>
        )}
      </div>
    );
  }

  // Not yet committed - show commit button
  return (
    <div className="bg-yellow-50 rounded-lg p-4 space-y-3">
      <div className="text-center">
        <p className="text-sm text-yellow-700">
          Commit-reveal ensures fair gameplay
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Generate a secret seed before the game starts
        </p>
      </div>
      <button
        onClick={handleGenerateCommit}
        className="btn-primary w-full"
      >
        Commit Secret Seed
      </button>
    </div>
  );
}

// Simple hash function for demo
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}