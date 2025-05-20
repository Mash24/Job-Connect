# Recent Activity Feed Component

A dynamic and interactive component that displays recent activities and updates in the Job Connect application. The RecentActivityFeed component supports real-time updates, filtering, and various activity types.

## Features

- Real-time activity updates
- Multiple activity types support
- Filtering and sorting options
- Infinite scrolling
- Activity grouping
- Interactive elements
- Accessibility support
- Performance optimization

## Installation

The component is available in the project's components directory:

```javascript
import RecentActivityFeed from 'src/components/common/RecentActivityFeed';
```

## Usage

### Basic Usage

```javascript
import RecentActivityFeed from 'src/components/common/RecentActivityFeed';

function Dashboard() {
  return (
    <RecentActivityFeed
      activities={[
        {
          id: 1,
          type: 'job_application',
          title: 'Application Submitted',
          description: 'Applied for Senior Developer position',
          timestamp: '2024-03-20T10:00:00Z',
          user: { name: 'John Doe' }
        }
      ]}
    />
  );
}
```

### Advanced Usage

```javascript
function AdvancedActivityFeed() {
  const { announceToScreenReader } = useAccessibility({
    componentName: 'RecentActivityFeed'
  });

  const handleActivityClick = (activity) => {
    announceToScreenReader(`Viewing details for ${activity.title}`);
    // Handle activity click
  };

  return (
    <RecentActivityFeed
      activities={activities}
      onActivityClick={handleActivityClick}
      filters={{
        types: ['job_application', 'profile_update', 'message'],
        dateRange: 'last7days'
      }}
      groupBy="date"
      showUserAvatars={true}
      enableInfiniteScroll={true}
      className="custom-activity-feed"
    />
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| activities | array | required | Array of activity objects |
| onActivityClick | function | undefined | Callback when activity is clicked |
| filters | object | undefined | Filter configuration |
| groupBy | string | 'date' | Grouping strategy (date, type, user) |
| showUserAvatars | boolean | true | Whether to show user avatars |
| enableInfiniteScroll | boolean | true | Whether to enable infinite scrolling |
| className | string | undefined | Additional CSS class name |

### Activity Object Structure

```javascript
{
  id: string | number,      // Unique identifier
  type: string,            // Activity type
  title: string,           // Activity title
  description: string,     // Activity description
  timestamp: string,       // ISO timestamp
  user: {                  // User information
    id: string | number,
    name: string,
    avatar: string
  },
  metadata: object         // Additional activity data
}
```

## Best Practices

1. **Performance**: Implement virtualization for large activity lists.

2. **Accessibility**: Ensure proper ARIA labels and keyboard navigation.

3. **Real-time Updates**: Use WebSocket or polling for live updates.

4. **Error Handling**: Gracefully handle failed activity loads.

5. **User Experience**: Provide clear loading and empty states.

## Examples

### Filtered Activity Feed

```javascript
function FilteredActivityFeed() {
  const [filters, setFilters] = useState({
    types: ['job_application'],
    dateRange: 'last30days'
  });

  return (
    <RecentActivityFeed
      activities={activities}
      filters={filters}
      onFilterChange={setFilters}
    />
  );
}
```

### Grouped Activity Feed

```javascript
function GroupedActivityFeed() {
  return (
    <RecentActivityFeed
      activities={activities}
      groupBy="type"
      renderGroupHeader={(group) => (
        <h3 className="activity-group-header">
          {group.type.toUpperCase()}
        </h3>
      )}
    />
  );
}
```

### Real-time Activity Feed

```javascript
function RealTimeActivityFeed() {
  const [activities, setActivities] = useState([]);
  const socket = useWebSocket('/activities');

  useEffect(() => {
    socket.on('new_activity', (activity) => {
      setActivities(prev => [activity, ...prev]);
    });
  }, []);

  return (
    <RecentActivityFeed
      activities={activities}
      enableRealTime={true}
    />
  );
}
```

## Testing

The component includes a comprehensive test suite that covers:

- Activity rendering
- Filtering functionality
- Grouping behavior
- Infinite scrolling
- Real-time updates
- Accessibility features
- Performance metrics
- Error states

## Contributing

When contributing to this component, please ensure:

1. All new features are properly documented
2. Tests are added for new functionality
3. Accessibility standards are maintained
4. Code follows the project's style guide

## License

This component is part of the job-connect project and is subject to its license terms. 