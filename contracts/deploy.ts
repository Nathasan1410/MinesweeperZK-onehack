/**
 * Contract Deployment Script
 *
 * Deploys the MinesweeperBet Move contract to OneChain testnet.
 *
 * Usage:
 *   npx ts-node contracts/deploy.ts
 *
 * Prerequisites:
 *   - OneChain CLI installed (`one` command)
 *   - Install: cargo install --locked --git https://github.com/one-chain-labs/onechain.git one
 *   - ONECHAIN_PRIVATE_KEY environment variable set
 *   - Move.toml configured with OneChain testnet RPC
 *
 * IMPORTANT: This script requires the OneChain CLI (`one` command), not the
 * generic Move CLI. The OneChain CLI is installed via Rust cargo.
 *
 * If `one` command is not found, install it from GitHub:
 *   cargo install --locked --git https://github.com/one-chain-labs/onechain.git one
 *
 * Or deploy manually using the OneChain dashboard at https://onescan.cc/testnet
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface DeployResult {
  success: boolean;
  address?: string;
  txHash?: string;
  error?: string;
}

export async function deployContract(): Promise<DeployResult> {
  const contractsDir = __dirname;
  const tomlPath = path.join(contractsDir, 'Move.toml');

  // Check if OneChain CLI is available
  try {
    execSync('one --version', { stdio: 'pipe' });
  } catch {
    console.error('='.repeat(60));
    console.error('ERROR: OneChain CLI (`one` command) not found');
    console.error('='.repeat(60));
    console.error('');
    console.error('The OneChain CLI is required for contract deployment.');
    console.error('');
    console.error('Installation options:');
    console.error('');
    console.error('  Option 1: Install via cargo (recommended)');
    console.error('  ----------------------------------------');
    console.error('  1. Install Rust: curl --proto \'=https\' --tlsv1.2 -sSf https://sh.rustup.rs | sh');
    console.error('  2. Install OneChain CLI:');
    console.error('     cargo install --locked --git https://github.com/one-chain-labs/onechain.git one');
    console.error('');
    console.error('  Option 2: Manual deployment (no CLI required)');
    console.error('  ----------------------------------------');
    console.error('  1. Visit https://onescan.cc/testnet');
    console.error('  2. Connect OneWallet browser extension');
    console.error('  3. Upload contract source: contracts/sources/minesweeper_bet.move');
    console.error('  4. Deploy and copy the contract address');
    console.error('');
    console.error('After installing CLI, run:');
    console.error('  npx ts-node contracts/deploy.ts');
    console.error('='.repeat(60));
    return {
      success: false,
      error: 'OneChain CLI not installed. Run: cargo install --locked --git https://github.com/one-chain-labs/onechain.git one',
    };
  }

  try {
    // Step 1: Compile Move package
    console.log('=== Step 1: Compiling Move package ===');
    try {
      execSync('one move compile', { cwd: contractsDir, stdio: 'inherit' });
      console.log('✓ Compilation successful\n');
    } catch (compileError) {
      console.error('✗ Compilation failed');
      console.error(compileError);
      return {
        success: false,
        error: 'Compilation failed. Check Move syntax and dependencies.',
      };
    }

    // Step 2: Deploy to testnet
    console.log('=== Step 2: Deploying to OneChain testnet ===');
    let output: string;
    try {
      output = execSync('one move publish --network testnet', {
        cwd: contractsDir,
        encoding: 'utf-8',
      });
      console.log(output);
    } catch (deployError) {
      console.error('✗ Deployment failed');
      console.error(deployError);
      return {
        success: false,
        error: 'Deployment failed. Check network connection and private key.',
      };
    }

    // Step 3: Parse deployed address from output
    console.log('=== Step 3: Parsing deployed address ===');
    const addressMatch = output.match(/(0x[a-fA-F0-9]+)/);
    const deployedAddress = addressMatch ? addressMatch[1] : null;

    if (!deployedAddress) {
      console.error('✗ Could not parse deployed address from output');
      return {
        success: false,
        error: 'Could not parse deployed address. Check deployment output.',
      };
    }

    console.log(`Deployed address: ${deployedAddress}\n`);

    // Step 4: Update Move.toml with deployed address
    console.log('=== Step 4: Updating Move.toml ===');
    let tomlContent = fs.readFileSync(tomlPath, 'utf-8');

    // Update placeholder address
    const placeholderPattern = /minesweeper_bet = "0x[a-fA-F0-9]+"/;
    const newTomlContent = tomlContent.replace(
      placeholderPattern,
      `minesweeper_bet = "${deployedAddress}"`
    );

    if (newTomlContent !== tomlContent) {
      fs.writeFileSync(tomlPath, newTomlContent);
      console.log('✓ Move.toml updated with deployed address\n');
    } else {
      console.log('! Move.toml already has correct address or pattern not found\n');
    }

    // Step 5: OneScan verification URL
    console.log('=== Deployment Complete ===');
    console.log(`Contract Address: ${deployedAddress}`);
    console.log(`Verify on OneScan: https://testnet.onescan.gg/account/${deployedAddress}`);
    console.log(`Transaction: https://testnet.onescan.gg/tx/... (check deployment output)\n`);

    return {
      success: true,
      address: deployedAddress,
    };
  } catch (error) {
    console.error('Unexpected error during deployment:');
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Run deployment if executed directly
if (require.main === module) {
  (async () => {
    console.log('Starting MinesweeperBet contract deployment...\n');
    const result = await deployContract();

    if (result.success) {
      console.log('Deployment successful!');
      process.exit(0);
    } else {
      console.error('Deployment failed:', result.error);
      process.exit(1);
    }
  })();
}
