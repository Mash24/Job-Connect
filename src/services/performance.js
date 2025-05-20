import { getAnalytics, logEvent } from 'firebase/analytics';
import { getApp } from 'firebase/app';

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.analytics = getAnalytics(getApp());
  }

  // Start measuring performance
  startMeasure(metricName) {
    if (this.metrics.has(metricName)) {
      console.warn(`Metric ${metricName} already exists`);
      return;
    }

    this.metrics.set(metricName, {
      startTime: performance.now(),
      measurements: []
    });
  }

  // End measuring performance
  endMeasure(metricName) {
    const metric = this.metrics.get(metricName);
    if (!metric) {
      console.warn(`Metric ${metricName} not found`);
      return;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    metric.measurements.push({
      duration,
      timestamp: new Date().toISOString()
    });

    // Log to Firebase Analytics
    logEvent(this.analytics, 'performance_metric', {
      metric_name: metricName,
      duration,
      timestamp: new Date().toISOString()
    });

    return duration;
  }

  // Observe element visibility
  observeElement(elementId, callback) {
    if (this.observers.has(elementId)) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    });

    const element = document.getElementById(elementId);
    if (element) {
      observer.observe(element);
      this.observers.set(elementId, observer);
    }
  }

  // Stop observing element
  unobserveElement(elementId) {
    const observer = this.observers.get(elementId);
    if (observer) {
      observer.disconnect();
      this.observers.delete(elementId);
    }
  }

  // Get performance metrics
  getMetrics() {
    const result = {};
    this.metrics.forEach((value, key) => {
      result[key] = {
        average: this.calculateAverage(value.measurements),
        min: this.calculateMin(value.measurements),
        max: this.calculateMax(value.measurements),
        measurements: value.measurements
      };
    });
    return result;
  }

  // Calculate average duration
  calculateAverage(measurements) {
    if (!measurements.length) return 0;
    const sum = measurements.reduce((acc, curr) => acc + curr.duration, 0);
    return sum / measurements.length;
  }

  // Calculate minimum duration
  calculateMin(measurements) {
    if (!measurements.length) return 0;
    return Math.min(...measurements.map(m => m.duration));
  }

  // Calculate maximum duration
  calculateMax(measurements) {
    if (!measurements.length) return 0;
    return Math.max(...measurements.map(m => m.duration));
  }

  // Clear all metrics
  clearMetrics() {
    this.metrics.clear();
  }

  // Clear all observers
  clearObservers() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor; 