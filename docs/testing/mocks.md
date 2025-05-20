# Mock Data Utilities

A collection of mock data generators and utilities for testing the Job Connect application. These utilities provide consistent, realistic test data for various entities in the application.

## Features

- Job data generation
- User profile generation
- Company data generation
- Application data generation
- Activity feed data generation
- Customizable mock data
- Consistent data structure
- TypeScript support

## Installation

The mock data utilities are available in the project's testing directory:

```javascript
import { mockJob, mockUser, mockCompany } from 'src/testing/mocks';
```

## Usage

### Basic Usage

```javascript
import { mockJob, mockUser } from 'src/testing/mocks';

describe('JobCard', () => {
  it('renders job information', () => {
    const job = mockJob();
    const user = mockUser();
    
    render(<JobCard job={job} user={user} />);
    expect(screen.getByText(job.title)).toBeInTheDocument();
  });
});
```

### Advanced Usage

```javascript
import { mockJob, mockUser, mockCompany, mockApplication } from 'src/testing/mocks';

describe('JobApplication', () => {
  it('handles application process', () => {
    const job = mockJob({
      title: 'Senior Developer',
      company: 'Tech Corp',
      salary: { min: 100000, max: 150000 }
    });
    
    const user = mockUser({
      skills: ['React', 'Node.js', 'TypeScript'],
      experience: 5
    });
    
    const company = mockCompany({
      name: 'Tech Corp',
      industry: 'Technology'
    });
    
    const application = mockApplication({
      status: 'pending',
      job,
      user,
      company
    });
    
    render(<JobApplication application={application} />);
    // Test assertions
  });
});
```

## API Reference

### Job Data Generator

```javascript
mockJob(options?: {
  title?: string;
  company?: string;
  location?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type?: string;
  skills?: string[];
  description?: string;
}): Job
```

### User Data Generator

```javascript
mockUser(options?: {
  name?: string;
  email?: string;
  role?: string;
  skills?: string[];
  experience?: number;
  education?: Education[];
  avatar?: string;
}): User
```

### Company Data Generator

```javascript
mockCompany(options?: {
  name?: string;
  industry?: string;
  size?: string;
  location?: string;
  description?: string;
  logo?: string;
}): Company
```

### Application Data Generator

```javascript
mockApplication(options?: {
  status?: string;
  job?: Job;
  user?: User;
  company?: Company;
  appliedAt?: string;
  notes?: string;
}): Application
```

### Activity Feed Data Generator

```javascript
mockActivity(options?: {
  type?: string;
  title?: string;
  description?: string;
  user?: User;
  timestamp?: string;
  metadata?: object;
}): Activity
```

## Best Practices

1. **Consistency**: Use mock data generators for consistent test data.

2. **Realism**: Generate realistic but fictional data.

3. **Customization**: Override default values when needed.

4. **Type Safety**: Use TypeScript interfaces for mock data.

5. **Maintenance**: Keep mock data up to date with schema changes.

## Examples

### Custom Job Data

```javascript
const customJob = mockJob({
  title: 'Full Stack Developer',
  company: 'Startup Inc',
  location: 'Remote',
  salary: {
    min: 80000,
    max: 120000,
    currency: 'USD'
  },
  skills: ['React', 'Node.js', 'MongoDB'],
  type: 'full-time'
});
```

### Custom User Profile

```javascript
const customUser = mockUser({
  name: 'Jane Smith',
  email: 'jane@example.com',
  role: 'developer',
  skills: ['JavaScript', 'Python', 'AWS'],
  experience: 3,
  education: [
    {
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      institution: 'University of Technology'
    }
  ]
});
```

### Custom Company Profile

```javascript
const customCompany = mockCompany({
  name: 'Tech Solutions',
  industry: 'Software Development',
  size: '50-200',
  location: 'San Francisco, CA',
  description: 'Leading provider of enterprise software solutions',
  logo: 'https://example.com/logo.png'
});
```

### Custom Application

```javascript
const customApplication = mockApplication({
  status: 'interview',
  job: mockJob(),
  user: mockUser(),
  company: mockCompany(),
  appliedAt: '2024-03-20T10:00:00Z',
  notes: 'Scheduled for technical interview'
});
```

## Contributing

When contributing to the mock data utilities, please ensure:

1. All new generators are properly documented
2. Tests are added for new generators
3. Data structures match the application schema
4. Code follows the project's style guide

## License

These mock data utilities are part of the job-connect project and are subject to its license terms. 