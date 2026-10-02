import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useToast, type ToastType } from '../../context/ToastContext';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4" style={{ color: '#34d399' }} />,
  error:   <AlertCircle className="w-4 h-4" style={{ color: '#f87171' }} />,
  warning: <AlertTriangle className="w-4 h-4" style={{ color: '#fbbf24' }} />,
  info:    <Info className="w-4 h-4" style={{ color: '#22d3ee' }} />,
};

const accentMap: Record<ToastType, { border: string; glow: string }> = {
  success: { border: 'rgba(52,211,153,0.25)', glow: 'rgba(52,211,153,0.1)' },
  error:   { border: 'rgba(248,113,113,0.25)', glow: 'rgba(248,113,113,0.1)' },
  warning: { border: 'rgba(251,191,36,0.25)', glow: 'rgba(251,191,36,0.1)' },
  info:    { border: 'rgba(34,211,238,0.25)', glow: 'rgba(34,211,238,0.1)' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
    >
      {toasts.map((toast) => {
        const accent = accentMap[toast.type];
        return (
          <div
            key={toast.id}
            role="alert"
            className="flex items-start gap-3 p-4 rounded-2xl animate-fade-in"
            style={{
              background: 'rgba(10, 15, 30, 0.92)',
              border: `1px solid ${accent.border}`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${accent.glow}`,
            }}
          >
            <span className="flex-shrink-0 mt-0.5">{iconMap[toast.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[color:var(--text-main)]">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-[color:var(--text-muted)] mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-[color:var(--text-muted)] hover:text-[color:var(--text-muted)] transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
