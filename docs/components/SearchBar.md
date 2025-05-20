# SearchBar Component

A powerful and accessible search component that provides advanced filtering and search capabilities for job listings. The SearchBar component supports real-time search, filters, and keyboard navigation.

## Features

- Real-time search with debouncing
- Advanced filtering options
- Keyboard navigation support
- Search suggestions
- Recent searches
- Search history
- Accessibility features
- Performance optimization

## Installation

The component is available in the project's components directory:

```javascript
import SearchBar from 'src/components/common/SearchBar';
```

## Usage

### Basic Usage

```javascript
import SearchBar from 'src/components/common/SearchBar';

function JobSearch() {
  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      placeholder="Search jobs..."
    />
  );
}
```

### Advanced Usage

```javascript
function AdvancedJobSearch() {
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    experience: '',
    salary: ''
  });

  const handleSearch = (searchTerm, activeFilters) => {
    // Handle search with filters
    console.log('Search:', searchTerm, 'Filters:', activeFilters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      filters={filters}
      showSuggestions={true}
      showRecentSearches={true}
      debounceTime={300}
      className="advanced-search"
    />
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onSearch | function | required | Callback when search is performed |
| onFilterChange | function | undefined | Callback when filters change |
| filters | object | {} | Current filter values |
| placeholder | string | 'Search...' | Placeholder text |
| showSuggestions | boolean | false | Whether to show search suggestions |
| showRecentSearches | boolean | false | Whether to show recent searches |
| debounceTime | number | 300 | Debounce time in milliseconds |
| className | string | undefined | Additional CSS class name |

### Filter Object Structure

```javascript
{
  location: string,    // Location filter
  jobType: string,     // Job type filter
  experience: string,  // Experience level filter
  salary: string,      // Salary range filter
  // Additional custom filters
}
```

## Best Practices

1. **Debouncing**: Always use debouncing for real-time search to prevent excessive API calls.

2. **Accessibility**: Ensure keyboard navigation and screen reader support.

3. **Performance**: Monitor search performance and optimize as needed.

4. **Error Handling**: Implement proper error handling for search operations.

5. **User Experience**: Provide clear feedback during search operations.

## Examples

### Basic Search with Suggestions

```javascript
function SearchWithSuggestions() {
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (searchTerm) => {
    // Fetch suggestions
    const results = await fetchSuggestions(searchTerm);
    setSuggestions(results);
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showSuggestions={true}
      suggestions={suggestions}
    />
  );
}
```

### Search with Filters

```javascript
function SearchWithFilters() {
  const [filters, setFilters] = useState({
    location: 'Remote',
    jobType: 'Full-time',
    experience: 'Senior',
    salary: '100k+'
  });

  return (
    <SearchBar
      onSearch={handleSearch}
      onFilterChange={setFilters}
      filters={filters}
      showSuggestions={true}
    />
  );
}
```

### Custom Search Implementation

```javascript
function CustomSearch() {
  const searchRef = useRef(null);
  const { measureFunction } = usePerformanceMonitor({
    componentName: 'CustomSearch'
  });

  const handleSearch = (searchTerm) => {
    measureFunction(() => {
      // Perform search
      performSearch(searchTerm);
    }, 'Search Operation');
  };

  return (
    <SearchBar
      ref={searchRef}
      onSearch={handleSearch}
      className="custom-search"
      debounceTime={500}
    />
  );
}
```

## Testing

The component includes a comprehensive test suite that covers:

- Search functionality
- Filter handling
- Suggestion display
- Recent searches
- Keyboard navigation
- Accessibility features
- Performance metrics

## Contributing

When contributing to this component, please ensure:

1. All new features are properly documented
2. Tests are added for new functionality
3. Accessibility standards are maintained
4. Code follows the project's style guide

## License

This component is part of the job-connect project and is subject to its license terms. 