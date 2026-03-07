import { useState, useCallback } from 'react';
import { contractService } from '@/lib/contract/service';
import type { CreateGameParams, SubmitScoreParams } from '@/types/contract';

interface ContractState {
  isLoading: boolean;
  error: string | null;
  isDemoMode: boolean;
}

export function useContract() {
  const [state, setState] = useState<ContractState>({
    isLoading: false,
    error: null,
    isDemoMode: contractService.getIsDemoMode(),
  });

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const createGame = useCallback(async (params: CreateGameParams) => {
    setLoading(true);
    setError(null);

    try {
      const result = await contractService.createGame(params);
      if (!result.success) {
        setError(result.error || 'Failed to create game');
      }
      setLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setError(error);
      setLoading(false);
      return { success: false, error };
    }
  }, []);

  const joinGame = useCallback(
    async (roomId: string, player: string, betAmount: number) => {
      setLoading(true);
      setError(null);

      try {
        const result = await contractService.joinGame(roomId, player, betAmount);
        if (!result.success) {
          setError(result.error || 'Failed to join game');
        }
        setLoading(false);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Unknown error';
        setError(error);
        setLoading(false);
        return { success: false, error };
      }
    },
    []
  );

  const startGame = useCallback(async (roomId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await contractService.startGame(roomId);
      if (!result.success) {
        setError(result.error || 'Failed to start game');
      }
      setLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setError(error);
      setLoading(false);
      return { success: false, error };
    }
  }, []);

  const submitScore = useCallback(async (params: SubmitScoreParams) => {
    setLoading(true);
    setError(null);

    try {
      const result = await contractService.submitScore(params);
      if (!result.success) {
        setError(result.error || 'Failed to submit score');
      }
      setLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setError(error);
      setLoading(false);
      return { success: false, error };
    }
  }, []);

  const distributePrizes = useCallback(async (roomId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await contractService.distributePrizes(roomId);
      if (!result.success) {
        setError(result.error || 'Failed to distribute prizes');
      }
      setLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setError(error);
      setLoading(false);
      return { success: false, error };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    isDemoMode: state.isDemoMode,

    // Actions
    createGame,
    joinGame,
    startGame,
    submitScore,
    distributePrizes,
    clearError,
  };
}