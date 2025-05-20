/**
 * @fileoverview useAccessibility Hook Tests
 * @description Test suite for the useAccessibility custom hook
 */

import { renderHook, act } from '@testing-library/react-hooks';
import useAccessibility from '../useAccessibility';

describe('useAccessibility', () => {
  beforeEach(() => {
    // Clear document body
    document.body.innerHTML = '';
  });

  it('should create skip link on mount', () => {
    renderHook(() => useAccessibility());
    
    const skipLink = document.querySelector('a[href="#main-content"]');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveTextContent('Skip to main content');
  });

  it('should announce messages to screen readers', () => {
    const { result } = renderHook(() => useAccessibility());
    
    act(() => {
      result.current.announceToScreenReader('Test announcement');
    });

    const announcement = document.querySelector('[role="status"]');
    expect(announcement).toBeInTheDocument();
    expect(announcement).toHaveTextContent('Test announcement');
    expect(announcement).toHaveAttribute('aria-live', 'polite');
  });

  it('should handle assertive announcements', () => {
    const { result } = renderHook(() => useAccessibility());
    
    act(() => {
      result.current.announceToScreenReader('Urgent message', 'assertive');
    });

    const announcement = document.querySelector('[role="status"]');
    expect(announcement).toHaveAttribute('aria-live', 'assertive');
  });

  it('should handle keyboard navigation', () => {
    const { result } = renderHook(() => useAccessibility());
    const mockOptions = {
      onEnter: jest.fn(),
      onEscape: jest.fn(),
      onArrowUp: jest.fn(),
      onArrowDown: jest.fn(),
    };

    act(() => {
      result.current.handleKeyPress({ key: 'Enter' }, mockOptions);
      result.current.handleKeyPress({ key: 'Escape' }, mockOptions);
      result.current.handleKeyPress({ key: 'ArrowUp' }, mockOptions);
      result.current.handleKeyPress({ key: 'ArrowDown' }, mockOptions);
    });

    expect(mockOptions.onEnter).toHaveBeenCalled();
    expect(mockOptions.onEscape).toHaveBeenCalled();
    expect(mockOptions.onArrowUp).toHaveBeenCalled();
    expect(mockOptions.onArrowDown).toHaveBeenCalled();
  });

  it('should trap focus within container', () => {
    const { result } = renderHook(() => useAccessibility({ enableFocusTrap: true }));
    
    // Create a container with focusable elements
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);

    act(() => {
      result.current.trapFocus(container);
    });

    // Simulate tab key press
    act(() => {
      button1.focus();
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(tabEvent);
    });

    expect(document.activeElement).toBe(button2);

    // Cleanup
    document.body.removeChild(container);
  });

  it('should not trap focus when disabled', () => {
    const { result } = renderHook(() => useAccessibility({ enableFocusTrap: false }));
    
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);

    act(() => {
      result.current.trapFocus(container);
    });

    // Simulate tab key press
    act(() => {
      button1.focus();
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(tabEvent);
    });

    expect(document.activeElement).not.toBe(button2);

    // Cleanup
    document.body.removeChild(container);
  });

  it('should not announce messages when announcements are disabled', () => {
    const { result } = renderHook(() => useAccessibility({ enableAnnouncements: false }));
    
    act(() => {
      result.current.announceToScreenReader('Test announcement');
    });

    const announcement = document.querySelector('[role="status"]');
    expect(announcement).not.toBeInTheDocument();
  });

  it('should not handle keyboard navigation when disabled', () => {
    const { result } = renderHook(() => useAccessibility({ enableKeyboardNav: false }));
    const mockOptions = {
      onEnter: jest.fn(),
      onEscape: jest.fn(),
    };

    act(() => {
      result.current.handleKeyPress({ key: 'Enter' }, mockOptions);
      result.current.handleKeyPress({ key: 'Escape' }, mockOptions);
    });

    expect(mockOptions.onEnter).not.toHaveBeenCalled();
    expect(mockOptions.onEscape).not.toHaveBeenCalled();
  });
}); 