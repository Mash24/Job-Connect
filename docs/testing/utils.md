# Testing Utilities

A collection of testing utilities and helpers to streamline the testing process for the Job Connect application. These utilities provide common testing patterns, mock data, and custom matchers.

## Features

- Custom render functions
- Mock data generators
- Custom matchers
- Test helpers
- Mock service workers
- Accessibility testing utilities
- Performance testing utilities

## Installation

The testing utilities are available in the project's testing directory:

```javascript
import { render, screen, mockData } from 'src/testing/utils';
```

## Usage

### Basic Usage

```javascript
import { render, screen, mockJob } from 'src/testing/utils';

describe('JobCard', () => {
  it('renders job information correctly', () => {
    const job = mockJob();
    render(<JobCard job={job} />);
    
    expect(screen.getByText(job.title)).toBeInTheDocument();
    expect(screen.getByText(job.company)).toBeInTheDocument();
  });
});
```

### Advanced Usage

```javascript
import {
  render,
  screen,
  mockJob,
  mockUser,
  setupMockServer,
  testAccessibility
} from 'src/testing/utils';

describe('JobApplication', () => {
  const server = setupMockServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('handles job application process', async () => {
    const job = mockJob();
    const user = mockUser();

    server.use(
      rest.post('/api/applications', (req, res, ctx) => {
        return res(ctx.json({ success: true }));
      })
    );

    render(<JobApplication job={job} user={user} />);
    
    await testAccessibility();
    
    // Test application flow
    await userEvent.click(screen.getByRole('button', { name: /apply/i }));
    expect(screen.getByText(/application submitted/i)).toBeInTheDocument();
  });
});
```

## API Reference

### Render Utilities

| Function | Description |
|----------|-------------|
| render | Enhanced render function with providers |
| renderWithRouter | Render with router context |
| renderWithAuth | Render with authentication context |
| renderWithTheme | Render with theme provider |

### Mock Data Generators

| Function | Description |
|----------|-------------|
| mockJob | Generate mock job data |
| mockUser | Generate mock user data |
| mockCompany | Generate mock company data |
| mockApplication | Generate mock application data |

### Test Helpers

| Function | Description |
|----------|-------------|
| testAccessibility | Test component accessibility |
| testPerformance | Test component performance |
| waitForLoadingToFinish | Wait for loading states |
| mockApiResponse | Mock API responses |

### Custom Matchers

```javascript
expect(element).toBeAccessible();
expect(element).toHavePerformanceMetrics();
expect(element).toHaveNoViolations();
```

## Best Practices

1. **Mock Data**: Use mock data generators for consistent testing.

2. **Accessibility**: Test accessibility in all component tests.

3. **Performance**: Monitor performance metrics in critical components.

4. **API Mocking**: Use mock service workers for API testing.

5. **Test Organization**: Follow the Arrange-Act-Assert pattern.

## Examples

### Testing with Mock Data

```javascript
describe('JobList', () => {
  it('renders list of jobs', () => {
    const jobs = [mockJob(), mockJob(), mockJob()];
    render(<JobList jobs={jobs} />);
    
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });
});
```

### Testing API Integration

```javascript
describe('JobSearch', () => {
  const server = setupMockServer();

  it('fetches and displays search results', async () => {
    const searchResults = [mockJob(), mockJob()];
    
    server.use(
      rest.get('/api/jobs/search', (req, res, ctx) => {
        return res(ctx.json(searchResults));
      })
    );

    render(<JobSearch />);
    
    await userEvent.type(screen.getByRole('searchbox'), 'react');
    await waitForLoadingToFinish();
    
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
});
```

### Testing Accessibility

```javascript
describe('Navigation', () => {
  it('meets accessibility standards', async () => {
    render(<Navigation />);
    
    await testAccessibility();
    
    // Additional accessibility tests
    expect(screen.getByRole('navigation')).toBeAccessible();
  });
});
```

### Testing Performance

```javascript
describe('JobCard', () => {
  it('meets performance standards', async () => {
    const job = mockJob();
    render(<JobCard job={job} />);
    
    await testPerformance();
    
    // Additional performance tests
    expect(screen.getByRole('article')).toHavePerformanceMetrics();
  });
});
```

## Contributing

When contributing to the testing utilities, please ensure:

1. All new utilities are properly documented
2. Tests are added for new utilities
3. Utilities follow testing best practices
4. Code follows the project's style guide

## License

These testing utilities are part of the job-connect project and are subject to its license terms. 