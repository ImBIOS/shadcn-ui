/**
 * Performance monitoring utilities using web-vitals
 * @module @imbios/ui/performance
 */

import type { Metric, ReportOpts } from "web-vitals";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

/**
 * Performance metric report handler
 */
export type PerformanceReportHandler = (metric: Metric) => void;

/**
 * Configuration options for performance tracking
 */
export type PerformanceTrackingOptions = {
  /** Handler called when a metric is reported */
  onReport?: PerformanceReportHandler;
  /** Enable console logging in development */
  debug?: boolean;
  /** Report options passed to web-vitals */
  reportOpts?: ReportOpts;
};

/**
 * Default handler that logs metrics to console in development
 */
const defaultHandler: PerformanceReportHandler = (metric) => {
  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }
};

/**
 * Initialize performance tracking with web-vitals
 *
 * Tracks the following Core Web Vitals:
 * - LCP (Largest Contentful Paint) - Loading performance
 * - INP (Interaction to Next Paint) - Interactivity
 * - CLS (Cumulative Layout Shift) - Visual stability
 *
 * And additional metrics:
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 *
 * @example
 * ```tsx
 * import { initPerformanceTracking } from '@imbios/ui'
 *
 * // Basic usage
 * initPerformanceTracking()
 *
 * // With custom handler
 * initPerformanceTracking({
 *   onReport: (metric) => {
 *     analytics.track('web-vital', {
 *       name: metric.name,
 *       value: metric.value,
 *       rating: metric.rating,
 *     })
 *   }
 * })
 * ```
 */
export function initPerformanceTracking(
  options: PerformanceTrackingOptions = {}
): void {
  const { onReport = defaultHandler, debug = false, reportOpts } = options;

  const handler: PerformanceReportHandler = (metric) => {
    if (debug) {
      console.log(`[web-vitals] ${metric.name}:`, metric.value, metric.rating);
    }
    onReport(metric);
  };

  // Core Web Vitals
  onLCP(handler, reportOpts);
  onINP(handler, reportOpts);
  onCLS(handler, reportOpts);

  // Additional metrics
  onFCP(handler, reportOpts);
  onTTFB(handler, reportOpts);
}

/**
 * Track a custom performance metric
 *
 * @example
 * ```tsx
 * import { trackCustomMetric } from '@imbios/ui'
 *
 * // Track form submission time
 * const startTime = performance.now()
 * await authClient.signIn.email({ email, password })
 * trackCustomMetric('auth-signin', performance.now() - startTime)
 * ```
 */
export function trackCustomMetric(
  name: string,
  value: number,
  handler?: PerformanceReportHandler
): void {
  let rating: Metric["rating"];
  if (value < 100) {
    rating = "good";
  } else if (value < 300) {
    rating = "needs-improvement";
  } else {
    rating = "poor";
  }

  const metric: Metric = {
    name: name as Metric["name"],
    value,
    rating,
    delta: value,
    id: `custom-${name}-${Date.now()}`,
    navigationType: "navigate",
    entries: [],
  };

  if (handler) {
    handler(metric);
  } else if (process.env.NODE_ENV === "development") {
    console.log(`[Custom Metric] ${name}:`, value);
  }
}

/**
 * Performance thresholds based on Core Web Vitals recommendations
 */
export const PERFORMANCE_THRESHOLDS = {
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  INP: {
    good: 200,
    needsImprovement: 500,
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
} as const;

/**
 * Check if a metric value is within acceptable thresholds
 */
export function isMetricGood(
  name: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): boolean {
  return value <= PERFORMANCE_THRESHOLDS[name].good;
}
