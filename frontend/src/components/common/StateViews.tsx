import React from 'react';
import { AlertCircle, RefreshCw, ServerOff } from 'lucide-react';
import { getErrorMessage } from '../../utils';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({ error, onRetry, title = 'Something went wrong' }: ErrorStateProps) {
  const message = getErrorMessage(error);
  const isBackendMissing = typeof error === 'object' && error !== null && 'isBackendMissing' in error;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: isBackendMissing ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)',
          border: isBackendMissing ? '1px solid rgba(251,191,36,0.2)' : '1px solid rgba(248,113,113,0.2)',
        }}
      >
        {isBackendMissing
          ? <ServerOff className="w-6 h-6" style={{ color: '#fbbf24' }} />
          : <AlertCircle className="w-6 h-6" style={{ color: '#f87171' }} />
        }
      </div>
      <div>
        <h3 className="text-base font-semibold text-[color:var(--text-main)]">{title}</h3>
        <p className="text-sm text-[color:var(--text-muted)] mt-1 max-w-sm leading-relaxed">{message}</p>
      </div>
      {onRetry && !isBackendMissing && (
        <button onClick={onRetry} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-14 px-6 text-center">
      {icon && (
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.15)',
            color: '#22d3ee',
          }}
        >
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-base font-semibold text-[color:var(--text-main)]">{title}</h3>
        {description && (
          <p className="text-sm text-[color:var(--text-muted)] mt-1 max-w-sm leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function BackendMissingNotice({ title, description }: { title: string, description: string }) {
  return (
    <div
      className="p-4 rounded-2xl flex items-start gap-3"
      style={{
        background: 'rgba(251,191,36,0.06)',
        border: '1px solid rgba(251,191,36,0.15)',
      }}
    >
      <ServerOff className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
      <div>
        <p className="font-semibold text-sm" style={{ color: '#fbbf24' }}>{title}</p>
        <p className="mt-1 text-xs text-amber-500/70">{description}</p>
      </div>
    </div>
  );
}
