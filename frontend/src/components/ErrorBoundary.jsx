import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Error Boundary Component for catching React errors
 * Provides fallback UI when child components throw errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#0b0f19]">
          <div className="max-w-md mx-auto p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-rose-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Oops! Something went wrong</h1>
              </div>
            </div>
            
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-rose-300 font-mono break-words">
                {this.state.error?.toString()}
              </p>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page or report this issue.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors"
              >
                Go Home
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6 text-xs text-gray-500">
                <summary className="cursor-pointer hover:text-gray-400">Error Details</summary>
                <pre className="mt-2 p-2 bg-black/30 rounded overflow-auto max-h-48">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
