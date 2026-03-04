'use client';

import React from 'react';

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-4 p-8 text-center">
          <p className="text-2xl">✦</p>
          <p className="text-[#F5F0E8] font-semibold" style={{ fontFamily: 'Fraunces, serif' }}>
            Something went wrong
          </p>
          <p className="text-[#A09A90] text-sm max-w-xs">{this.state.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="bg-[#E8A838] text-[#0F0F0F] font-semibold rounded-xl px-4 py-2 text-sm hover:bg-[#d4972e] transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
