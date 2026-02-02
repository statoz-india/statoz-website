import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
          <div className="bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] p-8 max-w-md text-center">
            <h2 className="font-orbitron font-bold text-2xl text-white mb-4">
              Something went wrong
            </h2>
            <p className="font-jakarta text-[#cad5e2] mb-6">
              We're sorry, but something unexpected happened. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#5cdfff] hover:bg-[#4dcfef] px-6 py-3 font-orbitron text-[#0a0f1e] font-bold uppercase tracking-wider transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
