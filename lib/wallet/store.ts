import { create } from 'zustand';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  isConnecting: boolean;
  error: string | null;
}

interface WalletActions {
  setConnected: (address: string, balance?: string) => void;
  setDisconnected: () => void;
  setConnecting: () => void;
  setError: (error: string) => void;
  clearError: () => void;
}

type WalletStore = WalletState & WalletActions;

export const useWalletStore = create<WalletStore>((set) => ({
  // State
  isConnected: false,
  address: null,
  balance: null,
  isConnecting: false,
  error: null,

  // Actions
  setConnected: (address, balance) =>
    set({ isConnected: true, address, balance: balance ?? null, isConnecting: false, error: null }),

  setDisconnected: () =>
    set({ isConnected: false, address: null, balance: null, isConnecting: false, error: null }),

  setConnecting: () =>
    set({ isConnecting: true, error: null }),

  setError: (error) =>
    set({ isConnecting: false, error }),

  clearError: () =>
    set({ error: null }),
}));
