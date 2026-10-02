import type { RiskLevel } from '../types';

/**
 * Format a confidence value (0–1) to a percentage string.
 * e.g. 0.9234 → "92.34%"
 */
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(2)}%`;
}

/**
 * Format a raw prediction value from the history endpoint.
 * Backend stores "1" or "0" as strings in the prediction column.
 */
export function formatPredictionLabel(raw: string): string {
  if (raw === '1') return 'Seizure';
  if (raw === '0') return 'No Seizure';
  // Forward-compat: if backend already returns display string
  return raw;
}

/**
 * Get Tailwind CSS class names for a risk level badge.
 */
export function getRiskBadgeClass(risk: string | undefined): string {
  switch (risk?.toLowerCase()) {
    case 'high':     return 'badge-risk-high';
    case 'moderate': return 'badge-risk-moderate';
    case 'low':      return 'badge-risk-low';
    default:         return 'badge-gray';
  }
}

/**
 * Get a semantic color identifier for a risk level.
 */
export function getRiskColor(risk: string | undefined): string {
  switch (risk?.toLowerCase()) {
    case 'high':     return 'text-red-600';
    case 'moderate': return 'text-amber-600';
    case 'low':      return 'text-emerald-600';
    default:         return 'text-surface-500';
  }
}

/**
 * Format a date string or ISO timestamp for display.
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format a date string with time for display.
 */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Normalize risk level string to typed RiskLevel.
 */
export function normalizeRiskLevel(risk: string | undefined): RiskLevel | undefined {
  switch (risk?.toLowerCase()) {
    case 'high':     return 'High';
    case 'moderate': return 'Moderate';
    case 'low':      return 'Low';
    default:         return undefined;
  }
}

/**
 * Extract a user-friendly error message from an API error.
 */
export function getErrorMessage(err: unknown): string {
  if (!err) return 'An unexpected error occurred.';
  if (typeof err === 'string') return err;
  if (typeof err === 'object') {
    const e = err as Record<string, unknown>;
    if (typeof e.message === 'string') return e.message;
  }
  return 'An unexpected error occurred.';
}

/**
 * Validate that a value is a positive integer.
 */
export function isPositiveInteger(value: string | number): boolean {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}
