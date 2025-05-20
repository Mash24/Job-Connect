# Navigation Component

A responsive and accessible navigation component that provides the main navigation structure for the Job Connect application. The Navigation component supports mobile and desktop layouts, user authentication states, and dynamic menu items.

## Features

- Responsive navigation menu
- Mobile hamburger menu
- User authentication integration
- Dynamic menu items
- Active route highlighting
- Dropdown menus
- Accessibility support
- Performance optimization

## Installation

The component is available in the project's components directory:

```javascript
import Navigation from 'src/components/common/Navigation';
```

## Usage

### Basic Usage

```javascript
import Navigation from 'src/components/common/Navigation';

function App() {
  return (
    <Navigation
      items={[
        { label: 'Home', path: '/' },
        { label: 'Jobs', path: '/jobs' },
        { label: 'Companies', path: '/companies' }
      ]}
    />
  );
}
```

### Advanced Usage

```javascript
function App() {
  const { isAuthenticated, user } = useAuth();
  const { announceToScreenReader } = useAccessibility({
    componentName: 'Navigation'
  });

  const handleMenuToggle = (isOpen) => {
    announceToScreenReader(`Navigation menu ${isOpen ? 'opened' : 'closed'}`);
  };

  return (
    <Navigation
      items={[
        { label: 'Home', path: '/' },
        { label: 'Jobs', path: '/jobs' },
        { label: 'Companies', path: '/companies' },
        {
          label: 'Account',
          path: '/account',
          showWhen: isAuthenticated,
          children: [
            { label: 'Profile', path: '/account/profile' },
            { label: 'Settings', path: '/account/settings' }
          ]
        }
      ]}
      onMenuToggle={handleMenuToggle}
      user={user}
      isAuthenticated={isAuthenticated}
      className="main-navigation"
    />
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | array | required | Array of navigation items |
| onMenuToggle | function | undefined | Callback when mobile menu is toggled |
| user | object | undefined | Current user information |
| isAuthenticated | boolean | false | Whether user is authenticated |
| className | string | undefined | Additional CSS class name |

### Navigation Item Structure

```javascript
{
  label: string,           // Menu item label
  path: string,            // Route path
  showWhen: boolean,       // Condition to show item
  children: array,         // Submenu items
  icon: component,         // Icon component
  onClick: function        // Click handler
}
```

## Best Practices

1. **Accessibility**: Ensure keyboard navigation and screen reader support.

2. **Responsive Design**: Test navigation on all screen sizes.

3. **Performance**: Monitor navigation performance.

4. **User Experience**: Provide clear visual feedback for active states.

5. **Security**: Handle authentication states properly.

## Examples

### Mobile Navigation

```javascript
function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navigation
      items={navigationItems}
      onMenuToggle={setIsMenuOpen}
      className="mobile-nav"
      isMobile={true}
    />
  );
}
```

### Navigation with Dropdowns

```javascript
function NavigationWithDropdowns() {
  const dropdownItems = [
    {
      label: 'Resources',
      children: [
        { label: 'Blog', path: '/blog' },
        { label: 'Help Center', path: '/help' },
        { label: 'Documentation', path: '/docs' }
      ]
    }
  ];

  return (
    <Navigation
      items={dropdownItems}
      className="nav-with-dropdowns"
    />
  );
}
```

### Authenticated Navigation

```javascript
function AuthenticatedNavigation() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Additional logout logic
  };

  return (
    <Navigation
      items={[
        { label: 'Dashboard', path: '/dashboard', showWhen: isAuthenticated },
        { label: 'Profile', path: '/profile', showWhen: isAuthenticated },
        { label: 'Logout', onClick: handleLogout, showWhen: isAuthenticated }
      ]}
      user={user}
      isAuthenticated={isAuthenticated}
    />
  );
}
```

## Testing

The component includes a comprehensive test suite that covers:

- Rendering of navigation items
- Mobile menu functionality
- Dropdown menu behavior
- Authentication state handling
- Keyboard navigation
- Accessibility features
- Responsive design
- Performance metrics

## Contributing

When contributing to this component, please ensure:

1. All new features are properly documented
2. Tests are added for new functionality
3. Accessibility standards are maintained
4. Code follows the project's style guide

## License

This component is part of the job-connect project and is subject to its license terms. 