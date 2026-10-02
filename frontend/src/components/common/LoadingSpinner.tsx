import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  eeg?: boolean;
}

export function LoadingSpinner({ size = 'md', message, eeg }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: { spinner: 'w-5 h-5', border: 2 },
    md: { spinner: 'w-8 h-8', border: 2 },
    lg: { spinner: 'w-12 h-12', border: 3 },
  }[size];

  if (eeg) {
    return (
      <div className="flex flex-col items-center gap-3" role="status">
        <div className="eeg-loader" style={{ color: '#22d3ee' }}>
          <span /><span /><span /><span /><span /><span />
        </div>
        {message && <p className="text-sm text-[color:var(--text-muted)]">{message}</p>}
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3" role="status">
      <div
        className={`${sizeMap.spinner} rounded-full animate-spin`}
        style={{
          border: `${sizeMap.border}px solid rgba(6,182,212,0.15)`,
          borderTopColor: '#22d3ee',
          boxShadow: '0 0 10px rgba(6,182,212,0.2)',
        }}
      />
      {message && <p className="text-sm text-[color:var(--text-muted)]">{message}</p>}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function PageLoader({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" message={message} eeg />
    </div>
  );
}
