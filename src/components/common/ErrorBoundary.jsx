/**
 * @fileoverview ErrorBoundary Component
 * @description A reusable error boundary component that catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 * 
 * @component
 * @requires React
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * @class ErrorBoundary
 * @extends {React.Component}
 * @description Error boundary component that catches JavaScript errors in child components
 */
class ErrorBoundary extends React.Component {
  /**
   * @constructor
   * @param {Object} props - Component props
   */
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * @static
   * @param {Error} error - The error that was thrown
   * @returns {Object} New state object
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Additional error information
   */
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  /**
   * @returns {JSX.Element} Rendered component
   */
  render() {
    if (this.state.hasError) {
      return (
        <div 
          role="alert"
          aria-live="assertive"
          className="min-h-[200px] flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Reload page"
          >
            Reload Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-sm text-red-600">
              <summary className="cursor-pointer">Error Details</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto">
                {this.state.error?.toString()}
                {'\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 