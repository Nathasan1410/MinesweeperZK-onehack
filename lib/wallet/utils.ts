import type { Wallet } from '@wallet-standard/core';

/**
 * Get all registered wallets
 */
export function getRegisteredWallets() {
  if (typeof window === 'undefined') return [];

  // Wallet Standard stores wallets globally
  const nav = window.navigator as any;
  if (nav['@wallet-standard/api']) {
    return nav['@wallet-standard/api'].get();
  }
  return [];
}

/**
 * Find and return the OneWallet standard wallet
 */
export function findOneWallet(): Wallet | null {
  if (typeof window === 'undefined') return null;

  const nav = window.navigator as any;
  const walletApi = nav['@wallet-standard/api'];

  if (!walletApi) return null;

  const allWallets = walletApi.get();

  // Look for OneWallet specifically
  const oneWallet = Array.from(allWallets as Wallet[]).find(
    (w) => w.name === 'OneWallet' || w.name.includes('OneChain')
  );

  return oneWallet || null;
}

/**
 * Check if OneWallet extension is installed
 */
export function isOneWalletInstalled(): boolean {
  return findOneWallet() !== null;
}

/**
 * Connect to OneWallet and request account access
 */
export async function connectOneWallet(): Promise<{ address: string }> {
  const wallet = findOneWallet();

  if (!wallet) {
    throw new Error('OneWallet not installed. Please install the browser extension.');
  }

  // Get the Connect feature - Wallet Standard uses 'standard:connect' namespace
  const connectFeature = wallet.features['standard:connect'] as {
    connect: (input: { name: string; version: string; url: string; icon?: string }) => Promise<{ accounts: any[] }>;
  };

  if (!connectFeature) {
    throw new Error('Wallet does not support connect feature. Make sure OneWallet extension is installed and up to date.');
  }

  // Request account connection
  const result = await connectFeature.connect({
    name: 'MinesweeperZK',
    version: '1.0.0',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icon: undefined,
  });

  // Get accounts from the connection result
  const accounts = result.accounts;

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts returned from OneWallet');
  }

  // Get the first account address (as string)
  const address = accounts[0].address;

  return { address: typeof address === 'string' ? address : String(address) };
}

/**
 * Disconnect from OneWallet
 */
export async function disconnectOneWallet(): Promise<void> {
  const wallet = findOneWallet();

  if (!wallet) {
    throw new Error('OneWallet not installed');
  }

  // Get the Disconnect feature
  const disconnectFeature = wallet.features['standard:disconnect'] as {
    disconnect: () => Promise<void>;
  };

  if (disconnectFeature) {
    await disconnectFeature.disconnect();
  }
}

/**
 * Fetch OCT token balance for an address from OneChain testnet
 */
export async function fetchOctBalance(address: string): Promise<string> {
  if (!address) return '0';

  try {
    // Official OneChain testnet RPC endpoint
    // Docs: https://docs.onelabs.cc/DevelopmentDocument
    const response = await fetch('https://rpc-testnet.onelabs.cc:443', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'suix_getBalance',
        params: [address, '0x2::oct::OCT'],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('RPC error fetching balance:', data.error);
      return '0';
    }

    // Extract balance from resource data
    const resource = data.result;
    if (resource && resource.coin && resource.coin.value) {
      // OCT has 8 decimal places, convert to human-readable format
      const rawBalance = resource.coin.value;
      const balance = BigInt(rawBalance) / BigInt(1e8);
      return balance.toString();
    }

    return '0';
  } catch (err) {
    console.error('Failed to fetch OCT balance:', err);
    return '0';
  }
}

/**
 * Format address for display (truncate middle)
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Request testnet OCT tokens from the faucet
 * Docs: https://docs.onelabs.cc/DevelopmentDocument
 */
export async function requestFaucetTokens(address: string): Promise<void> {
  if (!address) {
    throw new Error('Address required to request faucet tokens');
  }

  try {
    const response = await fetch('https://faucet-testnet.onelabs.cc/v1/gas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        FixedAmountRequest: {
          recipient: address,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Faucet request failed: ${response.status} ${errorText}`);
    }

    console.log('Faucet tokens requested successfully');
  } catch (err) {
    console.error('Failed to request faucet tokens:', err);
    throw err;
  }
}
