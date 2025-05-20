/**
 * @fileoverview usePerformanceMonitor Hook Tests
 * @description Test suite for the usePerformanceMonitor custom hook
 */

import { renderHook, act } from '@testing-library/react-hooks';
import usePerformanceMonitor from '../usePerformanceMonitor';

describe('usePerformanceMonitor', () => {
  let timeValue = 1000;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(performance, 'now').mockImplementation(() => timeValue);
  });

  afterEach(() => {
    jest.useRealTimers();
    console.log.mockRestore();
    performance.now.mockRestore();
    timeValue = 1000;
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePerformanceMonitor({ componentName: 'TestComponent' }));

    expect(result.current.renderCount).toBe(1);
    expect(typeof result.current.collectMetrics).toBe('function');
    expect(typeof result.current.measureFunction).toBe('function');
  });

  it('should collect metrics on mount and unmount', () => {
    const onMetricsCollected = jest.fn();
    const { unmount } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        onMetricsCollected,
      })
    );

    expect(onMetricsCollected).toHaveBeenCalledTimes(1);
    expect(onMetricsCollected).toHaveBeenCalledWith(expect.objectContaining({
      componentName: 'TestComponent',
      totalTime: 0,
      renderCount: 1,
    }));

    unmount();

    expect(onMetricsCollected).toHaveBeenCalledTimes(2);
  });

  it('should measure function execution time', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enableLogging: true,
      })
    );

    const testFunction = () => {
      timeValue += 100;
      return 'test result';
    };

    act(() => {
      const measuredResult = result.current.measureFunction(testFunction, 'Test Function');
      expect(measuredResult).toBe('test result');
    });

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Test Function execution time:'),
      expect.any(String),
      'ms'
    );
  });

  it('should not collect metrics when disabled', () => {
    const onMetricsCollected = jest.fn();
    renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enableMetrics: false,
        onMetricsCollected,
      })
    );

    expect(onMetricsCollected).not.toHaveBeenCalled();
  });

  it('should not log metrics when logging is disabled', () => {
    renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enableLogging: false,
      })
    );

    expect(console.log).not.toHaveBeenCalled();
  });

  it('should track render count correctly', () => {
    const { result, rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
      })
    );

    expect(result.current.renderCount).toBe(1);

    timeValue += 500;
    rerender();
    expect(result.current.renderCount).toBe(2);

    timeValue += 500;
    rerender();
    expect(result.current.renderCount).toBe(3);
  });

  it('should measure time between renders', () => {
    const { result, rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
      })
    );

    timeValue = 1500;
    rerender();

    expect(result.current.collectMetrics()).toEqual(
      expect.objectContaining({
        totalTime: 500,
        timeSinceLastRender: 500,
      })
    );
  });

  it('should handle function measurement without label', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
      })
    );

    act(() => {
      result.current.measureFunction(() => 'test');
    });

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Function execution time:'),
      expect.any(String),
      'ms'
    );
  });
}); 