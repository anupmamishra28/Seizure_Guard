import React from 'react';

interface RiskBadgeProps {
  risk: string | undefined;
  size?: 'sm' | 'md' | 'lg';
}

const BADGE_STYLES: Record<string, { bg: string, border: string, color: string }> = {
  high:     { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)', color: '#f87171' },
  moderate: { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)',  color: '#fbbf24' },
  low:      { bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.25)',  color: '#34d399' },
};

export function RiskBadge({ risk, size = 'md' }: RiskBadgeProps) {
  if (!risk) {
    return (
      <span
        className="inline-flex items-center gap-1.5 font-medium rounded-full text-xs px-2.5 py-0.5"
        style={{ background: 'var(--glass-bg-hover)', border: '1px solid var(--glass-border-strong)', color: '#94a3b8' }}
      >
        Unknown
      </span>
    );
  }

  const normalized = risk.toLowerCase();
  const style = BADGE_STYLES[normalized] ?? { bg: 'var(--glass-bg-hover)', border: 'var(--glass-border-strong)', color: '#94a3b8' };
  const label = risk.charAt(0).toUpperCase() + risk.slice(1).toLowerCase();

  const sizeClass = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  }[size];

  return (
    <span
      className={`${sizeClass} inline-flex items-center gap-1.5 font-medium rounded-full`}
      style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
      aria-label={`Risk level: ${label}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: style.color, boxShadow: `0 0 6px ${style.color}` }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
