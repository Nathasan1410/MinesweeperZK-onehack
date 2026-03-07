'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useRoom } from '@/hooks/useRoom';
import GameContainer from '@/components/game/GameContainer';
import GameResults from '@/components/room/GameResults';
import { formatAddress } from '@/lib/wallet/utils';
import { getTotalPrizePool, calculatePrize, PRIZE_BREAKDOWN } from '@/types/room';

interface ActiveRoomProps {
  roomId: string;
  onLeave: () => void;
}

export default function ActiveRoom({ roomId, onLeave }: ActiveRoomProps) {
  const { address, isConnected } = useWallet();
  const { currentRoom, subscribeToRoom, leaveRoom, isLoading, error, submitScore, updateStatus } = useRoom();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !roomId) return;

    const unsubscribe = subscribeToRoom(roomId);
    return () => unsubscribe();
  }, [mounted, roomId, subscribeToRoom]);

  const handleCopyCode = async () => {
    if (!currentRoom) return;
    await navigator.clipboard.writeText(currentRoom.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = async () => {
    if (!address) return;
    try {
      await leaveRoom(address);
      onLeave();
    } catch (err) {
      // Error handled by store
    }
  };

  const handleStartGame = async () => {
    if (!currentRoom) return;
    try {
      // Generate seed from all player addresses + timestamp
      const seed = [
        ...currentRoom.players.map(p => p.address),
        Date.now().toString()
      ].join(':');

      await updateStatus('playing', seed);
    } catch (err) {
      // Error handled by store
    }
  };

  // Calculate countdown
  const getCountdown = () => {
    if (!currentRoom || currentRoom.status !== 'countdown' || !currentRoom.countdownEndTime) {
      return null;
    }
    const seconds = Math.max(0, Math.ceil((new Date(currentRoom.countdownEndTime).getTime() - Date.now()) / 1000));
    return seconds;
  };

  const countdown = getCountdown();
  const isHost = currentRoom?.hostAddress === address;
  const isInRoom = currentRoom?.players.some(p => address && p.address === address);

  if (!mounted || !currentRoom) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalPool = getTotalPrizePool(currentRoom.players);

  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold text-gray-900">
              {currentRoom.code}
            </span>
            <button
              onClick={handleCopyCode}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              currentRoom.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
              currentRoom.status === 'countdown' ? 'bg-blue-100 text-blue-700' :
              currentRoom.status === 'playing' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {currentRoom.status.charAt(0).toUpperCase() + currentRoom.status.slice(1)}
            </span>
            {isHost && <span className="text-xs text-gray-500">(You&apos;re the host)</span>}
          </div>
        </div>

        {isInRoom && (
          <button
            onClick={handleLeave}
            disabled={currentRoom.status === 'playing'}
            className="btn-secondary text-sm disabled:opacity-50"
          >
            Leave
          </button>
        )}
      </div>

      {/* Countdown */}
      {currentRoom.status === 'countdown' && countdown !== null && (
        <div className="text-center py-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Game starting in</p>
          <p className="text-4xl font-bold text-blue-700">{countdown}</p>
        </div>
      )}

      {/* Start Game Button - Host can start anytime */}
      {isHost && currentRoom.status !== 'playing' && currentRoom.status !== 'finished' && (
        <div className="text-center">
          <button
            onClick={handleStartGame}
            disabled={currentRoom.players.length < 1}
            className="btn-primary w-full py-3 text-lg disabled:opacity-50"
          >
            {currentRoom.players.length < 2
              ? 'Start Game (need at least 1 opponent)'
              : 'Start Game Now'}
          </button>
          {currentRoom.players.length < 2 && (
            <p className="text-xs text-gray-500 mt-2">
              Waiting for opponents... Share the room code to invite friends.
            </p>
          )}
        </div>
      )}

      {/* Room Settings */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Bet Amount</p>
          <p className="text-lg font-semibold text-gray-900">{currentRoom.betAmount} OCT</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Mines</p>
          <p className="text-lg font-semibold text-gray-900">{currentRoom.mineCount}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Total Pool</p>
          <p className="text-lg font-semibold text-gray-900">{totalPool} OCT</p>
        </div>
      </div>

      {/* Players List */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Players ({currentRoom.players.length}/{currentRoom.maxPlayers})
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {currentRoom.players.map((player, index) => (
            <div
              key={player.address}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">#{index + 1}</span>
                <span className="font-mono text-sm text-gray-900">
                  {formatAddress(player.address)}
                </span>
                {player.address === currentRoom.hostAddress && (
                  <span className="text-xs text-gray-500">(host)</span>
                )}
              </div>
              <span className="text-sm text-gray-600">{player.betAmount} OCT</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prize Breakdown */}
      {currentRoom.status !== 'playing' && (
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Prize Breakdown</h4>
        <div className="space-y-1">
          {PRIZE_BREAKDOWN.map((prize) => (
            <div
              key={prize.rank}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  prize.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                  prize.rank === 2 ? 'bg-gray-100 text-gray-700' :
                  prize.rank === 3 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {prize.rank}
                </span>
                <span className="text-sm text-gray-600">
                  {prize.percentage}%
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {calculatePrize(prize.rank, totalPool)} OCT
              </span>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Game Container - shown when game is playing or finished */}
      {(currentRoom.status === 'playing' || currentRoom.status === 'finished') && (
        <div className="mt-6">
          {currentRoom.status === 'playing' ? (
            <GameContainer
              roomId={currentRoom.code}
              mineCount={currentRoom.mineCount}
              seed={currentRoom.seed}
              onScoreSubmit={(scoreData) => {
                const totalScore = typeof scoreData === 'number' ? scoreData : scoreData.totalScore;
                const minesHit = typeof scoreData === 'number' ? 0 : (scoreData.minesHit || 0);
                if (address) {
                  submitScore(address, totalScore, minesHit);
                }
              }}
            />
          ) : (
            <GameResults room={currentRoom} currentAddress={address || undefined} onPlayAgain={handleStartGame} />
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}