// jest.config.ts (Jest 29/30 + Next.js)
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',

  // Only run unit tests; ignore Playwright e2e
  testMatch: ['<rootDir>/tests/unit/**/*.test.(ts|tsx)'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/tests/e2e/'],

  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],

  // Handle path aliases like "@/..."
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // CSS modules / styles
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Static assets stub (svgs, images, etc.)
    '\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': '<rootDir>/tests/mocks/fileMock.js',
  },

  // Let Jest transform some ESM deps (AntD & rc-* are ESM)
  transformIgnorePatterns: ['/node_modules/(?!(antd|@ant-design|rc-.*)/)'],
};

export default createJestConfig(config);
