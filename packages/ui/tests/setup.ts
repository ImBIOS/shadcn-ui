import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "vitest-axe/extend-expect";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for Radix UI components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {
      // Intentionally empty - mock implementation
    },
    removeListener: () => {
      // Intentionally empty - mock implementation
    },
    addEventListener: () => {
      // Intentionally empty - mock implementation
    },
    removeEventListener: () => {
      // Intentionally empty - mock implementation
    },
    dispatchEvent: () => {
      // Intentionally empty - mock implementation
    },
  }),
});

// Mock ResizeObserver for Radix UI components
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  root = null;
  rootMargin = "";
  thresholds = [];
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});
