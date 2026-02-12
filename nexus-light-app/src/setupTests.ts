import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { beforeEach, afterEach, expect, vi } from 'vitest';

// Extend Vitest's expect with methods from jest-dom
expect.extend(matchers);

// Mock the global 'fetch' API for tests
beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })));
});

afterEach(() => {
    vi.unstubAllGlobals();
});
