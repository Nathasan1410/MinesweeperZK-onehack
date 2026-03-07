'use client';

import { useWallet } from '@/hooks/useWallet';
import { formatAddress } from '@/lib/wallet/utils';

export default function Header() {
  const { isConnected, address, balance, isConnecting, error, connect, disconnect } = useWallet();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MinesweeperZK</h1>
              <p className="text-xs text-gray-500">OneHack 3.0</p>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {address ? formatAddress(address) : ''}
                  </div>
                  <div className="text-xs text-gray-500">
                    {balance ? `${balance} OCT` : 'OneChain Testnet'}
                  </div>
                </div>
                <button
                  onClick={disconnect}
                  className="btn-secondary text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary"
              >
                {isConnecting ? 'Connecting...' : 'Connect OneWallet'}
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </header>
  );
}
