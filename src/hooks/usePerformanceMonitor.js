/**
 * @fileoverview usePerformanceMonitor Hook
 * @description Custom hook for monitoring component performance and collecting metrics
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * @function usePerformanceMonitor
 * @description Hook for monitoring component performance
 * @param {Object} options - Configuration options
 * @param {string} options.componentName - Name of the component being monitored
 * @param {boolean} [options.enableMetrics=true] - Whether to collect performance metrics
 * @param {boolean} [options.enableLogging=true] - Whether to log metrics to console
 * @param {Function} [options.onMetricsCollected] - Callback when metrics are collected
 * @returns {Object} Performance monitoring utilities
 */
const usePerformanceMonitor = ({
  componentName,
  enableMetrics = true,
  enableLogging = true,
  onMetricsCollected,
} = {}) => {
  const mountTime = useRef(performance.now());
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  // Increment render count on mount
  useEffect(() => {
    renderCount.current += 1;
  }, []);

  /**
   * @function collectMetrics
   * @description Collects performance metrics for the component
   * @returns {Object} Collected metrics
   */
  const collectMetrics = useCallback(() => {
    if (!enableMetrics) return null;

    const currentTime = performance.now();
    const totalTime = currentTime - mountTime.current;
    const timeSinceLastRender = currentTime - lastRenderTime.current;

    const metrics = {
      componentName,
      totalTime,
      timeSinceLastRender,
      renderCount: renderCount.current,
      timestamp: new Date().toISOString(),
    };

    if (enableLogging) {
      console.log(`Performance metrics for ${componentName}:`, metrics);
    }

    onMetricsCollected?.(metrics);
    lastRenderTime.current = currentTime;

    return metrics;
  }, [componentName, enableMetrics, enableLogging, onMetricsCollected]);

  /**
   * @function measureFunction
   * @description Measures the execution time of a function
   * @param {Function} fn - Function to measure
   * @param {string} [label] - Label for the measurement
   * @returns {*} Result of the function
   */
  const measureFunction = useCallback((fn, label) => {
    if (!enableMetrics) return fn();

    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (enableLogging) {
      console.log(`${label || 'Function'} execution time:`, duration.toFixed(2), 'ms');
    }

    return result;
  }, [enableMetrics, enableLogging]);

  useEffect(() => {
    collectMetrics();

    return () => {
      const finalMetrics = collectMetrics();
      if (enableLogging) {
        console.log(`Final metrics for ${componentName}:`, finalMetrics);
      }
    };
  }, [collectMetrics, componentName, enableLogging]);

  return {
    collectMetrics,
    measureFunction,
    renderCount: renderCount.current,
  };
};

export default usePerformanceMonitor; 