# JobCard Component

A reusable React component for displaying job listings in a consistent and accessible format. The JobCard component provides a standardized way to present job information with support for various job types and statuses.

## Features

- Responsive job listing display
- Support for different job types (Full-time, Part-time, Contract)
- Status indicators (Active, Closed, Featured)
- Company information display
- Salary and location information
- Action buttons (Apply, Save, Share)
- Accessibility support
- Performance monitoring integration

## Installation

The component is available in the project's components directory:

```javascript
import JobCard from 'src/components/common/JobCard';
```

## Usage

### Basic Usage

```javascript
import JobCard from 'src/components/common/JobCard';

function JobList() {
  return (
    <div className="job-list">
      <JobCard
        job={{
          id: '123',
          title: 'Senior React Developer',
          company: 'Tech Corp',
          location: 'Remote',
          type: 'Full-time',
          salary: '$120k - $150k',
          status: 'active'
        }}
        onApply={() => console.log('Apply clicked')}
      />
    </div>
  );
}
```

### Advanced Usage

```javascript
function JobList() {
  const handleApply = (jobId) => {
    // Handle job application
  };

  const handleSave = (jobId) => {
    // Save job to favorites
  };

  return (
    <div className="job-list">
      <JobCard
        job={{
          id: '123',
          title: 'Senior React Developer',
          company: 'Tech Corp',
          location: 'Remote',
          type: 'Full-time',
          salary: '$120k - $150k',
          status: 'active',
          description: 'We are looking for...',
          requirements: ['5+ years experience', 'React expertise'],
          benefits: ['Health insurance', '401k'],
          postedDate: '2024-03-15'
        }}
        onApply={handleApply}
        onSave={handleSave}
        onShare={() => window.open(`/jobs/123/share`)}
        isSaved={true}
        showFullDetails={true}
        className="featured-job"
      />
    </div>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| job | object | required | Job information object |
| onApply | function | required | Callback when apply button is clicked |
| onSave | function | undefined | Callback when save button is clicked |
| onShare | function | undefined | Callback when share button is clicked |
| isSaved | boolean | false | Whether the job is saved by the user |
| showFullDetails | boolean | false | Whether to show full job details |
| className | string | undefined | Additional CSS class name |

### Job Object Structure

```javascript
{
  id: string,              // Unique job identifier
  title: string,           // Job title
  company: string,         // Company name
  location: string,        // Job location
  type: string,            // Job type (Full-time, Part-time, Contract)
  salary: string,          // Salary range
  status: string,          // Job status (active, closed, featured)
  description: string,     // Job description
  requirements: string[],  // Job requirements
  benefits: string[],      // Job benefits
  postedDate: string      // Date when job was posted
}
```

## Best Practices

1. **Job Data**: Always provide complete and accurate job information.

2. **Action Handlers**: Implement all necessary action handlers (apply, save, share).

3. **Accessibility**: Use the component's built-in accessibility features.

4. **Performance**: Monitor performance using the integrated performance monitoring.

5. **Styling**: Use the provided className prop for custom styling.

## Examples

### Featured Job Card

```javascript
function FeaturedJobCard() {
  return (
    <JobCard
      job={{
        id: '456',
        title: 'Lead Frontend Developer',
        company: 'Innovation Labs',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$150k - $180k',
        status: 'featured'
      }}
      onApply={() => handleApply('456')}
      className="featured-job-card"
      showFullDetails={true}
    />
  );
}
```

### Compact Job Card

```javascript
function CompactJobCard() {
  return (
    <JobCard
      job={{
        id: '789',
        title: 'React Developer',
        company: 'Startup Co',
        location: 'Remote',
        type: 'Contract',
        salary: '$80/hr',
        status: 'active'
      }}
      onApply={() => handleApply('789')}
      showFullDetails={false}
    />
  );
}
```

### Job Card with Custom Actions

```javascript
function CustomJobCard() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (jobId) => {
    setIsSaved(!isSaved);
    // Additional save logic
  };

  return (
    <JobCard
      job={jobData}
      onApply={() => handleApply(jobData.id)}
      onSave={() => handleSave(jobData.id)}
      onShare={() => handleShare(jobData.id)}
      isSaved={isSaved}
    />
  );
}
```

## Testing

The component includes a comprehensive test suite that covers:

- Rendering with different job data
- Action button functionality
- Accessibility features
- Responsive design
- Status indicators
- Save functionality
- Share functionality

## Contributing

When contributing to this component, please ensure:

1. All new features are properly documented
2. Tests are added for new functionality
3. Accessibility standards are maintained
4. Code follows the project's style guide

## License

This component is part of the job-connect project and is subject to its license terms. 