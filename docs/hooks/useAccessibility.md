# useAccessibility Hook

A custom React hook that provides accessibility utilities for keyboard navigation, screen reader support, and focus management. This hook helps make your application more accessible to users with disabilities.

## Features

- Skip link creation for keyboard navigation
- Screen reader announcements
- Focus management and trapping
- Keyboard event handling
- ARIA attribute management
- Configurable accessibility options

## Installation

The hook is available in the project's hooks directory:

```javascript
import useAccessibility from 'src/hooks/useAccessibility';
```

## Usage

### Basic Usage

```javascript
import useAccessibility from 'src/hooks/useAccessibility';

function MyComponent() {
  const {
    announceToScreenReader,
    handleKeyPress,
    trapFocus,
  } = useAccessibility({
    componentName: 'MyComponent'
  });

  return (
    <div>
      <button onClick={() => announceToScreenReader('Button clicked')}>
        Click Me
      </button>
    </div>
  );
}
```

### Advanced Usage

```javascript
function MyComponent() {
  const {
    announceToScreenReader,
    handleKeyPress,
    trapFocus,
    createSkipLink,
  } = useAccessibility({
    componentName: 'MyComponent',
    enableAnnouncements: true,
    enableKeyboardNav: true,
    skipLinkText: 'Skip to main content',
    onFocusChange: (focusedElement) => {
      console.log('Focus changed to:', focusedElement);
    }
  });

  useEffect(() => {
    createSkipLink('#main-content');
  }, [createSkipLink]);

  return (
    <div>
      <div id="main-content">
        <button
          onKeyDown={(e) => handleKeyPress(e, {
            Enter: () => console.log('Enter pressed'),
            Escape: () => console.log('Escape pressed')
          })}
        >
          Interactive Button
        </button>
      </div>
    </div>
  );
}
```

## API Reference

### Parameters

The hook accepts a configuration object with the following properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| componentName | string | required | Name of the component using the hook |
| enableAnnouncements | boolean | true | Whether to enable screen reader announcements |
| enableKeyboardNav | boolean | true | Whether to enable keyboard navigation |
| skipLinkText | string | 'Skip to content' | Text for the skip link |
| onFocusChange | function | undefined | Callback when focus changes |

### Return Value

The hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| announceToScreenReader | function | Function to announce messages to screen readers |
| handleKeyPress | function | Function to handle keyboard events |
| trapFocus | function | Function to trap focus within a container |
| createSkipLink | function | Function to create a skip link |

## Best Practices

1. **Screen Reader Announcements**: Use `announceToScreenReader` for important state changes and user actions.

2. **Keyboard Navigation**: Implement `handleKeyPress` for all interactive elements.

3. **Focus Management**: Use `trapFocus` for modal dialogs and other focus-trapping scenarios.

4. **Skip Links**: Add skip links for main content areas to improve keyboard navigation.

5. **ARIA Attributes**: Use appropriate ARIA attributes in conjunction with the hook's features.

## Examples

### Modal Dialog with Focus Trapping

```javascript
function ModalDialog() {
  const modalRef = useRef(null);
  const { trapFocus, handleKeyPress } = useAccessibility({
    componentName: 'ModalDialog'
  });

  useEffect(() => {
    if (modalRef.current) {
      trapFocus(modalRef.current);
    }
  }, [trapFocus]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => handleKeyPress(e, {
        Escape: () => onClose()
      })}
    >
      <h2>Modal Dialog</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### Screen Reader Announcements

```javascript
function NotificationComponent() {
  const { announceToScreenReader } = useAccessibility({
    componentName: 'NotificationComponent'
  });

  const handleNotification = (message) => {
    announceToScreenReader(message, 'assertive');
  };

  return (
    <div>
      <button onClick={() => handleNotification('New message received')}>
        Check Messages
      </button>
    </div>
  );
}
```

### Keyboard Navigation

```javascript
function NavigationMenu() {
  const { handleKeyPress } = useAccessibility({
    componentName: 'NavigationMenu'
  });

  return (
    <nav>
      <ul>
        <li>
          <a
            href="#home"
            onKeyDown={(e) => handleKeyPress(e, {
              ArrowRight: () => focusNextItem(),
              ArrowLeft: () => focusPreviousItem(),
              Home: () => focusFirstItem(),
              End: () => focusLastItem()
            })}
          >
            Home
          </a>
        </li>
        {/* More menu items */}
      </ul>
    </nav>
  );
}
```

## Testing

The hook includes a comprehensive test suite that covers:

- Skip link creation and functionality
- Screen reader announcements
- Keyboard event handling
- Focus trapping
- ARIA attribute management
- Configuration options

## Contributing

When contributing to this hook, please ensure:

1. All new features are properly documented
2. Tests are added for new functionality
3. Accessibility standards are followed
4. Code follows the project's style guide

## License

This hook is part of the job-connect project and is subject to its license terms. 