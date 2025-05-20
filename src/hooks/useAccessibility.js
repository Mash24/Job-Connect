/**
 * @fileoverview useAccessibility Hook
 * @description Custom hook for managing accessibility features and keyboard navigation
 */

import { useEffect, useCallback } from 'react';

/**
 * @function useAccessibility
 * @description Custom hook for managing accessibility features
 * @param {Object} options - Configuration options
 * @param {boolean} [options.enableKeyboardNav=true] - Enable keyboard navigation
 * @param {boolean} [options.enableFocusTrap=false] - Enable focus trapping
 * @param {boolean} [options.enableAnnouncements=true] - Enable screen reader announcements
 * @returns {Object} Accessibility utilities
 */
const useAccessibility = ({
  enableKeyboardNav = true,
  enableFocusTrap = false,
  enableAnnouncements = true,
} = {}) => {
  /**
   * @function announceToScreenReader
   * @description Announces a message to screen readers
   * @param {string} message - Message to announce
   * @param {string} [politeness='polite'] - Politeness level ('polite' or 'assertive')
   */
  const announceToScreenReader = useCallback((message, politeness = 'polite') => {
    if (!enableAnnouncements) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', politeness);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [enableAnnouncements]);

  /**
   * @function handleKeyPress
   * @description Handles keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   * @param {Object} options - Navigation options
   */
  const handleKeyPress = useCallback((event, options) => {
    if (!enableKeyboardNav) return;

    const { onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight } = options;

    switch (event.key) {
      case 'Enter':
        onEnter?.(event);
        break;
      case 'Escape':
        onEscape?.(event);
        break;
      case 'ArrowUp':
        onArrowUp?.(event);
        break;
      case 'ArrowDown':
        onArrowDown?.(event);
        break;
      case 'ArrowLeft':
        onArrowLeft?.(event);
        break;
      case 'ArrowRight':
        onArrowRight?.(event);
        break;
      default:
        break;
    }
  }, [enableKeyboardNav]);

  /**
   * @function trapFocus
   * @description Traps focus within a container element
   * @param {HTMLElement} container - Container element
   */
  const trapFocus = useCallback((container) => {
    if (!enableFocusTrap || !container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [enableFocusTrap]);

  useEffect(() => {
    // Add skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    return () => {
      document.body.removeChild(skipLink);
    };
  }, []);

  return {
    announceToScreenReader,
    handleKeyPress,
    trapFocus,
  };
};

export default useAccessibility; 