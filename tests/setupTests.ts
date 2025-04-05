import '@testing-library/jest-dom';
import { configureAxe } from 'jest-axe';

// Mock the environment variables
process.env.NODE_ENV = 'test';
process.env.CODEMINAL_ENV = 'test';

// Add custom matchers
expect.extend({
  toHaveHighConfidence(received: number) {
    const pass = received >= 0.8;
    return {
      message: () => `expected ${received} to be >= 0.8`,
      pass
    };
  }
});

// Configure global test timeouts
jest.setTimeout(10000);

// Configure accessibility testing
configureAxe({
  rules: {
    'color-contrast': { enabled: true },
    'aria-allowed-attr': { enabled: true }
  }
});

// Global test setup
beforeAll(() => {
  // Setup test environment variables
  process.env.NODE_ENV = 'test';
  process.env.CODEMINAL_TEST = 'true';
});

// Global test cleanup
afterAll(() => {
  jest.clearAllMocks();
});