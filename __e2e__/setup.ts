// E2E Test Setup
// This file can be used for global setup/teardown hooks if needed

import { test as base } from '@playwright/test';

// Export test fixture with default options
export const test = base.extend({
  // Add custom fixtures here if needed
});

export { expect } from '@playwright/test';
