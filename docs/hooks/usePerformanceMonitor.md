# usePerformanceMonitor Hook

A custom React hook for monitoring component performance and collecting metrics. This hook provides utilities for tracking render counts, measuring execution times, and collecting performance metrics throughout a component's lifecycle.

## Features

- Track component mount time and total lifetime
- Count component renders
- Measure function execution times
- Collect performance metrics
- Configurable logging and metrics collection
- Callback support for metrics collection

## Installation

The hook is available in the project's hooks directory:

```javascript
import usePerformanceMonitor from 'src/hooks/usePerformanceMonitor';
```

## Usage

### Basic Usage

```javascript
import usePerformanceMonitor from 'src/hooks/usePerformanceMonitor';

function MyComponent() {
  const { collectMetrics, measureFunction, renderCount } = usePerformanceMonitor({
    componentName: 'MyComponent'
  });

  // Use the hook's utilities
  const handleClick = () => {
    measureFunction(() => {
      // Your expensive operation here
    }, 'Expensive Operation');
  };

  return (
    <div>
      <p>Renders: {renderCount}</p>
      <button onClick={handleClick}>Perform Operation</button>
    </div>
  );
}
```

### Advanced Usage

```javascript
function MyComponent() {
  const { collectMetrics, measureFunction } = usePerformanceMonitor({
    componentName: 'MyComponent',
    enableMetrics: true,
    enableLogging: true,
    onMetricsCollected: (metrics) => {
      // Send metrics to your analytics service
      analyticsService.trackPerformance(metrics);
    }
  });

  // Measure multiple operations
  const handleComplexOperation = () => {
    measureFunction(() => {
      // First operation
    }, 'First Operation');

    measureFunction(() => {
      // Second operation
    }, 'Second Operation');
  };
}
```

## API Reference

### Parameters

The hook accepts a configuration object with the following properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| componentName | string | required | Name of the component being monitored |
| enableMetrics | boolean | true | Whether to collect performance metrics |
| enableLogging | boolean | true | Whether to log metrics to console |
| onMetricsCollected | function | undefined | Callback function when metrics are collected |

### Return Value

The hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| collectMetrics | function | Function to manually collect metrics |
| measureFunction | function | Function to measure execution time of any function |
| renderCount | number | Current number of renders |

### Metrics Object

The metrics object returned by `collectMetrics` contains:

```javascript
{
  componentName: string,
  totalTime: number,        // Time since mount in milliseconds
  timeSinceLastRender: number, // Time since last render in milliseconds
  renderCount: number,      // Total number of renders
  timestamp: string        // ISO timestamp of the measurement
}
```

## Best Practices

1. **Naming Components**: Always provide a meaningful `componentName` for better debugging and logging.

2. **Selective Monitoring**: Use `enableMetrics: false` for components that don't need performance monitoring.

3. **Production Logging**: Consider disabling logging in production by setting `enableLogging: false`.

4. **Metrics Collection**: Use the `onMetricsCollected` callback to send metrics to your analytics service.

5. **Function Measurement**: Use `measureFunction` for expensive operations to track their performance.

## Examples

### Monitoring Component Lifecycle

```javascript
function LifecycleComponent() {
  const { collectMetrics } = usePerformanceMonitor({
    componentName: 'LifecycleComponent',
    onMetricsCollected: (metrics) => {
      console.log('Component metrics:', metrics);
    }
  });

  useEffect(() => {
    // Component mounted
    collectMetrics();
    
    return () => {
      // Component will unmount
      collectMetrics();
    };
  }, [collectMetrics]);

  return <div>Lifecycle Component</div>;
}
```

### Measuring API Calls

```javascript
function DataFetchingComponent() {
  const { measureFunction } = usePerformanceMonitor({
    componentName: 'DataFetchingComponent'
  });

  const fetchData = async () => {
    await measureFunction(async () => {
      const response = await fetch('/api/data');
      return response.json();
    }, 'API Call');
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

## Testing

The hook includes a comprehensive test suite that covers:

- Initialization and default values
- Metrics collection on mount and unmount
- Function execution time measurement
- Disabled metrics collection
- Disabled logging
- Render count tracking
- Time measurement between renders
- Function measurement without labels

## Contributing

When contributing to this hook, please ensure:

1. All new features are properly documented
2. Tests are added for new functionality
3. Performance impact is considered
4. Code follows the project's style guide

## License

This hook is part of the job-connect project and is subject to its license terms. 