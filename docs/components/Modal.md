# Modal Component

A flexible and accessible modal dialog component that provides a consistent way to display content in an overlay. The Modal component supports various sizes, animations, and focus management.

## Features

- Responsive design
- Multiple size options
- Custom animations
- Focus trapping
- Keyboard navigation
- Backdrop click handling
- Accessibility support
- Performance optimization

## Installation

The component is available in the project's components directory:

```javascript
import Modal from 'src/components/common/Modal';
```

## Usage

### Basic Usage

```javascript
import Modal from 'src/components/common/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Basic Modal"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### Advanced Usage

```javascript
function AdvancedModal() {
  const { trapFocus } = useAccessibility({
    componentName: 'AdvancedModal'
  });

  const handleClose = () => {
    // Additional close logic
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Advanced Modal"
      size="large"
      showCloseButton={true}
      closeOnBackdropClick={true}
      closeOnEscape={true}
      className="custom-modal"
      onEntered={() => trapFocus(modalRef.current)}
    >
      <div ref={modalRef}>
        <h2>Modal Content</h2>
        <p>This is a more complex modal with additional features.</p>
        <button onClick={handleClose}>Close</button>
      </div>
    </Modal>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | required | Whether the modal is open |
| onClose | function | required | Callback when modal is closed |
| title | string | undefined | Modal title |
| size | string | 'medium' | Modal size (small, medium, large) |
| showCloseButton | boolean | true | Whether to show close button |
| closeOnBackdropClick | boolean | true | Whether to close on backdrop click |
| closeOnEscape | boolean | true | Whether to close on Escape key |
| className | string | undefined | Additional CSS class name |
| onEntered | function | undefined | Callback when modal is fully entered |
| onExited | function | undefined | Callback when modal is fully exited |

## Best Practices

1. **Accessibility**: Ensure proper focus management and keyboard navigation.

2. **Performance**: Monitor modal performance, especially with complex content.

3. **User Experience**: Provide clear visual feedback for modal states.

4. **Content**: Keep modal content focused and concise.

5. **Animations**: Use appropriate animations for smooth transitions.

## Examples

### Confirmation Modal

```javascript
function ConfirmationModal() {
  const handleConfirm = () => {
    // Handle confirmation
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Action"
      size="small"
    >
      <p>Are you sure you want to proceed?</p>
      <div className="modal-actions">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </Modal>
  );
}
```

### Form Modal

```javascript
function FormModal() {
  const { handleSubmit, register } = useForm();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Form"
      size="medium"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name')} />
        <input {...register('email')} />
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
}
```

### Custom Animation Modal

```javascript
function AnimatedModal() {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Animated Modal"
      className="animated-modal"
      onEntered={() => console.log('Modal entered')}
      onExited={() => console.log('Modal exited')}
    >
      <div className="modal-content">
        <p>This modal has custom animations</p>
      </div>
    </Modal>
  );
}
```

## Testing

The component includes a comprehensive test suite that covers:

- Opening and closing behavior
- Focus management
- Keyboard navigation
- Backdrop interactions
- Animation states
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