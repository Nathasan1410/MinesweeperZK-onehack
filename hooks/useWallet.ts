'use client';

import { useCallback, useEffect } from 'react';
import { useWalletStore } from '@/lib/wallet/store';
import { connectOneWallet, isOneWalletInstalled, fetchOctBalance, disconnectOneWallet } from '@/lib/wallet/utils';

export function useWallet() {
  const {
    isConnected,
    address,
    balance,
    isConnecting,
    error,
    setConnected,
    setDisconnected,
    setConnecting,
    setError,
    clearError,
  } = useWalletStore();

  const connect = useCallback(async () => {
    if (!isOneWalletInstalled()) {
      setError('OneWallet not installed. Please install the browser extension.');
      return;
    }

    setConnecting();

    try {
      const { address } = await connectOneWallet();
      // Fetch OCT balance after successful connection
      const octBalance = await fetchOctBalance(address);
      setConnected(address, octBalance);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('User rejected')) {
          setError('Connection rejected by user');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to connect to OneWallet');
      }
    }
  }, [setError, setConnecting, setConnected]);

  const disconnect = useCallback(async () => {
    try {
      await disconnectOneWallet();
    } catch (err) {
      console.warn('Disconnect feature not available or failed:', err);
    } finally {
      setDisconnected();
      clearError();
    }
  }, [setDisconnected, clearError]);

  // Auto-reconnect on mount (optional)
  useEffect(() => {
    // Could check for persisted connection here
    return () => {
      clearError();
    };
  }, [clearError]);

  return {
    isConnected,
    address,
    balance,
    isConnecting,
    error,
    connect,
    disconnect,
  };
}
