import { describe, it, expect, beforeEach, vi } from 'vitest';
import { findOneWallet, connectOneWallet, formatAddress, fetchOctBalance, disconnectOneWallet, getRegisteredWallets, isOneWalletInstalled, requestFaucetTokens } from '../../lib/wallet/utils';

// Mock window.navigator for Wallet Standard API
const mockConnect = vi.fn();
const mockDisconnect = vi.fn();

const mockWallet = {
  name: 'OneWallet',
  features: {
    'standard:connect': {
      connect: mockConnect,
    },
    'standard:disconnect': {
      disconnect: mockDisconnect,
    },
  },
  accounts: [{ address: '0xtest1234567890abcdef' }],
};

describe('WALLET-01: Wallet Connection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findOneWallet', () => {
    it('returns null when no wallets registered', () => {
      // Mock navigator with no wallets
      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([]) } },
        writable: true,
      });

      const result = findOneWallet();
      expect(result).toBeNull();

      // Restore
      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('finds OneWallet when registered', () => {
      // Mock navigator with OneWallet
      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([mockWallet]) } },
        writable: true,
      });

      const result = findOneWallet();
      expect(result).toBe(mockWallet);

      // Restore
      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });
  });

  describe('connectOneWallet', () => {
    it('throws when wallet not installed', async () => {
      // Mock no wallets
      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([]) } },
        writable: true,
      });

      await expect(connectOneWallet()).rejects.toThrow('OneWallet not installed');

      // Restore
      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('connects via standard:connect feature', async () => {
      mockConnect.mockResolvedValue({ accounts: mockWallet.accounts });

      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([mockWallet]) } },
        writable: true,
      });

      const result = await connectOneWallet();
      expect(mockConnect).toHaveBeenCalledWith({
        name: 'MinesweeperZK',
        version: '1.0.0',
        url: expect.any(String),
        icon: undefined,
      });
      expect(result.address).toBe('0xtest1234567890abcdef');

      // Restore
      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });
  });
});

describe('WALLET-02: Balance Display', () => {
  describe('fetchOctBalance', () => {
    it('fetches OCT balance for connected address', async () => {
      const mockBalance = {
        result: {
          coin: {
            value: '1000000000', // 10 OCT with 8 decimals
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockBalance),
      });

      const result = await fetchOctBalance('0xtest123');
      expect(result).toBe('10');
    });

    it('returns zero when RPC fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ error: { message: 'Not found' } }),
      });

      const result = await fetchOctBalance('0xtest123');
      expect(result).toBe('0');
    });

    it('returns zero for empty address', async () => {
      const result = await fetchOctBalance('');
      expect(result).toBe('0');
    });
  });

  describe('formatAddress', () => {
    it('formats address with ellipsis (0x1234...5678)', () => {
      const result = formatAddress('0x1234567890abcdef');
      expect(result).toBe('0x1234...cdef');
    });

    it('handles empty address', () => {
      const result = formatAddress('');
      expect(result).toBe('');
    });
  });
});

describe('WALLET-03: Disconnect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('disconnectOneWallet', () => {
    it('calls standard:disconnect feature', async () => {
      mockDisconnect.mockResolvedValue(undefined);

      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([mockWallet]) } },
        writable: true,
      });

      await disconnectOneWallet();
      expect(mockDisconnect).toHaveBeenCalled();

      // Restore
      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('throws when wallet not installed', async () => {
      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([]) } },
        writable: true,
      });

      await expect(disconnectOneWallet()).rejects.toThrow('OneWallet not installed');

      // Restore
      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });
  });
});

describe('Wallet Utils - Additional Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRegisteredWallets', () => {
    it('returns empty array when no wallets', () => {
      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([]) } },
        writable: true,
      });

      const result = getRegisteredWallets();
      expect(result).toEqual([]);

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('returns all registered wallets', () => {
      const mockWallets = [{ name: 'Wallet1' }, { name: 'Wallet2' }];
      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue(mockWallets) } },
        writable: true,
      });

      const result = getRegisteredWallets();
      expect(result).toHaveLength(2);

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });
  });

  describe('isOneWalletInstalled', () => {
    it('returns false when OneWallet not found', () => {
      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([{ name: 'OtherWallet' }]) } },
        writable: true,
      });

      expect(isOneWalletInstalled()).toBe(false);

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('returns true when OneWallet found', () => {
      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([{ name: 'OneWallet' }]) } },
        writable: true,
      });

      expect(isOneWalletInstalled()).toBe(true);

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('returns true when OneChain wallet found', () => {
      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([{ name: 'OneChain Wallet' }]) } },
        writable: true,
      });

      expect(isOneWalletInstalled()).toBe(true);

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });
  });

  describe('connectOneWallet - error cases', () => {
    it('throws when connect feature not available', async () => {
      const mockWalletNoConnect = {
        name: 'OneWallet',
        features: {}, // No connect feature
      };

      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([mockWalletNoConnect]) } },
        writable: true,
      });

      await expect(connectOneWallet()).rejects.toThrow(
        'Wallet does not support connect feature'
      );

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('throws when no accounts returned', async () => {
      const mockWalletEmpty = {
        name: 'OneWallet',
        features: {
          'standard:connect': {
            connect: vi.fn().mockResolvedValue({ accounts: [] }),
          },
        },
      };

      const originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { '@wallet-standard/api': { get: vi.fn().mockReturnValue([mockWalletEmpty]) } },
        writable: true,
      });

      await expect(connectOneWallet()).rejects.toThrow(
        'No accounts returned from OneWallet'
      );

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });
  });

  describe('fetchOctBalance - error handling', () => {
    it('returns zero when fetch throws error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await fetchOctBalance('0xtest123');
      expect(result).toBe('0');
    });

    it('returns zero when response has no resource data', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ result: {} }),
      });

      const result = await fetchOctBalance('0xtest123');
      expect(result).toBe('0');
    });

    it('returns zero when result.coin is missing', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ result: { other: 'data' } }),
      });

      const result = await fetchOctBalance('0xtest123');
      expect(result).toBe('0');
    });
  });

  describe('requestFaucetTokens', () => {
    it('throws when address is empty', async () => {
      await expect(requestFaucetTokens('')).rejects.toThrow(
        'Address required to request faucet tokens'
      );
    });

    it('successfully requests faucet tokens', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue(''),
      });

      await expect(requestFaucetTokens('0xtest123')).resolves.toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith(
        'https://faucet-testnet.onelabs.cc/v1/gas',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('throws when faucet request fails with error status', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        text: vi.fn().mockResolvedValue('Rate limited'),
      });

      await expect(requestFaucetTokens('0xtest123')).rejects.toThrow(
        'Faucet request failed: 429 Rate limited'
      );
    });

    it('throws and logs error when fetch fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(requestFaucetTokens('0xtest123')).rejects.toThrow('Network error');
    });
  });
});
