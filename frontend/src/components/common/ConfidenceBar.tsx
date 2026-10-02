import React from 'react';

interface ConfidenceBarProps {
  confidence: number; // 0–1
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function getBarColor(confidence: number): string {
  if (confidence >= 0.8) return '#f87171'; // red
  if (confidence >= 0.5) return '#fbbf24'; // amber
  return '#34d399'; // emerald
}

export function ConfidenceBar({ confidence, size = 'md', showLabel = true }: ConfidenceBarProps) {
  const pct = Math.min(100, Math.max(0, confidence * 100));
  const color = getBarColor(confidence);
  const label = `${pct.toFixed(2)}%`;

  const heightClass = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }[size];

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-[color:var(--text-muted)]">Confidence</span>
          <span className="text-xs font-semibold text-[color:var(--text-main)]">{label}</span>
        </div>
      )}
      <div
        className={`w-full ${heightClass} rounded-full overflow-hidden`}
        style={{ background: 'var(--glass-border)' }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Prediction confidence: ${label}`}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}80` }}
        />
      </div>
    </div>
  );
}
