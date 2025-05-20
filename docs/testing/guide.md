# Testing Guide

A comprehensive guide for testing the Job Connect application. This guide covers testing strategies, best practices, and common patterns used throughout the project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Testing Types](#testing-types)
3. [Testing Utilities](#testing-utilities)
4. [Component Testing](#component-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [Performance Testing](#performance-testing)
8. [Accessibility Testing](#accessibility-testing)
9. [Best Practices](#best-practices)
10. [Common Patterns](#common-patterns)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Jest
- React Testing Library
- Cypress (for E2E testing)

### Installation

```bash
# Install dependencies
npm install

# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest cypress
```

### Configuration

The project uses the following testing configuration files:

- `jest.config.js`: Jest configuration
- `cypress.config.js`: Cypress configuration
- `.eslintrc.js`: ESLint configuration for tests
- `src/setupTests.js`: Global test setup

## Testing Types

### Unit Testing

Unit tests focus on testing individual components and functions in isolation.

```javascript
// Example unit test
describe('formatSalary', () => {
  it('formats salary range correctly', () => {
    expect(formatSalary(50000, 70000)).toBe('$50,000 - $70,000');
  });
});
```

### Integration Testing

Integration tests verify that different parts of the application work together correctly.

```javascript
// Example integration test
describe('JobApplication', () => {
  it('submits application successfully', async () => {
    render(<JobApplication />);
    
    await userEvent.type(screen.getByLabelText('Cover Letter'), 'My cover letter');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(await screen.findByText('Application Submitted')).toBeInTheDocument();
  });
});
```

### End-to-End Testing

E2E tests verify the entire application flow from a user's perspective.

```javascript
// Example E2E test
describe('Job Search Flow', () => {
  it('allows users to search and apply for jobs', () => {
    cy.visit('/jobs');
    cy.get('[data-testid="search-input"]').type('React Developer');
    cy.get('[data-testid="search-button"]').click();
    cy.get('[data-testid="job-card"]').first().click();
    cy.get('[data-testid="apply-button"]').click();
    cy.get('[data-testid="application-form"]').should('be.visible');
  });
});
```

## Testing Utilities

### Mock Data

Use the mock data generators for consistent test data:

```javascript
import { mockJob, mockUser } from 'src/testing/mocks';

const job = mockJob();
const user = mockUser();
```

### Custom Render Functions

Use enhanced render functions with providers:

```javascript
import { render, renderWithRouter, renderWithAuth } from 'src/testing/utils';

// Basic render
render(<Component />);

// Render with router
renderWithRouter(<Component />);

// Render with auth
renderWithAuth(<Component />);
```

### Custom Matchers

Use custom matchers for common assertions:

```javascript
expect(element).toBeAccessible();
expect(element).toHavePerformanceMetrics();
expect(element).toHaveNoViolations();
```

## Component Testing

### Basic Component Test

```javascript
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Testing Hooks

```javascript
describe('useJobSearch', () => {
  it('fetches jobs successfully', async () => {
    const { result } = renderHook(() => useJobSearch());
    
    await act(async () => {
      await result.current.searchJobs('React');
    });
    
    expect(result.current.jobs).toHaveLength(2);
    expect(result.current.loading).toBe(false);
  });
});
```

## Integration Testing

### API Integration

```javascript
describe('JobAPI', () => {
  const server = setupMockServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('fetches jobs successfully', async () => {
    server.use(
      rest.get('/api/jobs', (req, res, ctx) => {
        return res(ctx.json([mockJob(), mockJob()]));
      })
    );

    const { result } = renderHook(() => useJobs());
    await waitFor(() => {
      expect(result.current.jobs).toHaveLength(2);
    });
  });
});
```

## Performance Testing

### Component Performance

```javascript
describe('JobList', () => {
  it('renders efficiently', async () => {
    const jobs = Array(100).fill(null).map(() => mockJob());
    
    const { container } = render(<JobList jobs={jobs} />);
    
    await testPerformance();
    
    expect(container).toHavePerformanceMetrics({
      firstContentfulPaint: { max: 1000 },
      timeToInteractive: { max: 2000 }
    });
  });
});
```

## Accessibility Testing

### Component Accessibility

```javascript
describe('Navigation', () => {
  it('meets accessibility standards', async () => {
    render(<Navigation />);
    
    await testAccessibility();
    
    expect(screen.getByRole('navigation')).toBeAccessible();
  });
});
```

## Best Practices

1. **Test Organization**
   - Group related tests
   - Use descriptive test names
   - Follow the Arrange-Act-Assert pattern

2. **Test Coverage**
   - Aim for high coverage of critical paths
   - Focus on user interactions
   - Test edge cases and error states

3. **Performance**
   - Monitor test execution time
   - Use appropriate test types
   - Optimize test setup and teardown

4. **Maintenance**
   - Keep tests up to date
   - Remove obsolete tests
   - Document complex test scenarios

## Common Patterns

### Testing Forms

```javascript
describe('JobApplicationForm', () => {
  it('submits form data correctly', async () => {
    render(<JobApplicationForm />);
    
    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(await screen.findByText('Application Submitted')).toBeInTheDocument();
  });
});
```

### Testing Authentication

```javascript
describe('Login', () => {
  it('handles authentication flow', async () => {
    renderWithAuth(<Login />);
    
    await userEvent.type(screen.getByLabelText('Email'), 'user@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText('Welcome')).toBeInTheDocument();
  });
});
```

### Testing Error States

```javascript
describe('ErrorBoundary', () => {
  it('handles component errors', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

## Contributing

When contributing to the test suite, please ensure:

1. Tests are properly documented
2. New tests follow the project's patterns
3. Tests are maintainable and readable
4. Performance impact is considered

## License

This testing guide is part of the job-connect project and is subject to its license terms. 