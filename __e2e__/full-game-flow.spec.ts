import { test, expect } from './setup';

test.describe('Full Game Flow - Demo Mode', () => {
  test('should load home page and show wallet connection state', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Test 1: Landing page loads with correct title
    await expect(page).toHaveTitle(/MinesweeperZK/);

    // Test 2: Main heading is visible
    await expect(page.getByText('MinesweeperZK')).toBeVisible();

    // Test 3: Description text is visible
    await expect(page.getByText('Provably fair competitive Minesweeper on OneChain')).toBeVisible();

    // Test 4: Create Room button exists (may be disabled until wallet connected)
    const createRoomButton = page.getByRole('button', { name: 'Create Room' });
    await expect(createRoomButton).toBeVisible();

    console.log('✓ Home page loaded successfully');
  });
});

test.describe('Wallet Connection', () => {
  test('should show connect wallet prompt', async ({ page }) => {
    await page.goto('/');

    // Initial state: should show "Connect Your Wallet" message
    await expect(page.getByText('Connect Your Wallet')).toBeVisible();
    await expect(page.getByText('Connect your OneWallet to create or join game rooms')).toBeVisible();

    // Find and click connect button in header
    const connectButton = page.getByRole('button', { name: 'Connect OneWallet' });
    await expect(connectButton).toBeVisible();
    await connectButton.click();

    // Wait for wallet connection response (demo mode)
    await page.waitForTimeout(2000);

    // After connection, should show address or balance
    // In demo mode, we might see a demo address
    const addressOrBalance = page.getByText(/0x|OCT|Balance|Demo/i);
    await expect(addressOrBalance).toBeVisible();

    console.log('✓ Wallet connection flow works');
  });
});

test.describe('Room System', () => {
  test('should display room list UI', async ({ page }) => {
    await page.goto('/');

    // Room list should be visible after wallet connection
    // For now, verify the room list component renders
    const createRoomButton = page.getByRole('button', { name: 'Create Room' });
    await expect(createRoomButton).toBeVisible();

    // Room list container should exist
    const roomListContainer = page.locator('[class*="room"], [class*="list"]').first();
    await expect(roomListContainer).toBeVisible();

    console.log('✓ Room system UI renders correctly');
  });
});
