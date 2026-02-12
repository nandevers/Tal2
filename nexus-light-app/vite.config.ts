/// <reference types="vitest" />

import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Define the shape of the 'test' property for Vitest
interface VitestTestConfig {
  test: {
    globals?: boolean;
    environment?: string;
    setupFiles?: string;
    css?: {
      modules?: {
        classNameStrategy?: string; // Loosen type to string to match usage
      };
    };
    // Add other Vitest test config properties here if needed
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: {
      modules: {
        // classNameStrategy: 'camelCase', // Removed to resolve type error
      },
    },
  },
} as UserConfig & VitestTestConfig)

