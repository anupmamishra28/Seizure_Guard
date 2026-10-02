import React, { useState, useEffect } from 'react';
import { Search, History as HistoryIcon, Brain, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState, BackendMissingNotice } from '../components/common/StateViews';
import { getHistory } from '../services/history';
import type { HistoryRecord } from '../types';
import { Link, useParams } from 'react-router-dom';

export function HistoryPage() {
  const { patientId: urlPatientId } = useParams<{ patientId: string }>();
  const [patientId, setPatientId] = useState('');
  const [query, setQuery] = useState(urlPatientId || '');
  const [records, setRecords] = useState<HistoryRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (urlPatientId) {
      setQuery(urlPatientId);
      performSearch(urlPatientId);
    }
  }, [urlPatientId]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setPatientId(searchQuery.trim());
    setHasSearched(true);

    try {
      const data = await getHistory(searchQuery.trim());
      setRecords(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setRecords([]);
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to fetch history');
        setRecords(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'History' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Prediction History</h1>
          <p className="page-subtitle">Look up EEG prediction records stored in the database</p>
        </div>
      </div>

      <BackendMissingNotice
        title="Backend Integration Note: Patient-Scoped History"
        description="The API provides GET /history/{patient_id} for a specific patient. System-wide history query endpoint is not implemented."
      />

      {/* Patient Search Form */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[color:var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Patient ID (e.g., PAT-101)..."
              className="form-input w-full pl-10 py-3"
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="btn-primary py-3 px-6 w-full sm:w-auto"
          >
            {loading ? <LoadingSpinner size="sm" /> : <Search className="w-4 h-4 mr-2" />}
            {loading ? '' : 'Fetch History'}
          </button>
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-16 card flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-[color:var(--text-muted)] mt-4">Fetching history for {patientId}...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          className="p-4 rounded-xl flex items-start gap-3"
          style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f87171' }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: '#f87171' }}>Unable to fetch history</p>
            <p className="mt-1 text-xs text-red-400/80">{error}</p>
          </div>
        </div>
      )}

      {/* Results table */}
      {!loading && !error && hasSearched && records && (
        records.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<HistoryIcon className="w-6 h-6" />}
              title={`No history found for patient ${patientId}`}
              description="No previous EEG predictions exist in the database for this patient ID."
              action={
                <Link
                  to={`/eeg?patient_id=${patientId}`}
                  className="btn-primary mt-4"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Run First EEG Analysis
                </Link>
              }
            />
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div
              className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              style={{ borderBottom: '1px solid var(--glass-border)' }}
            >
              <h2 className="font-semibold text-[color:var(--text-main)] text-base flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee' }}
                >
                  <HistoryIcon className="w-4 h-4" />
                </div>
                History for Patient:{' '}
                <span className="font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded text-sm">
                  {patientId}
                </span>
              </h2>
              <span className="text-xs text-[color:var(--text-muted)] font-medium px-3 py-1 rounded-full" style={{ background: 'var(--glass-bg-hover)' }}>
                {records.length} record{records.length !== 1 ? 's' : ''} found
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                <thead>
                  <tr
                    className="text-xs text-[color:var(--text-muted)] uppercase font-semibold tracking-wider"
                    style={{ background: 'var(--glass-bg-light)', borderBottom: '1px solid var(--glass-bg-hover)' }}
                  >
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Timestamp</th>
                    <th className="py-4 px-6">Prediction Output</th>
                    <th className="py-4 px-6">Confidence</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.map((rec) => {
                    const isSeizure = rec.prediction.toLowerCase().includes('seizure') && !rec.prediction.toLowerCase().includes('non');
                    return (
                      <tr key={rec.id} className="transition-colors hover:bg-white/[0.02]">
                        <td className="py-4 px-6 font-mono text-xs text-[color:var(--text-muted)]">
                          #{String(rec.id).substring(0, 8)}...
                        </td>
                        <td className="py-4 px-6 text-[color:var(--text-muted)] text-xs">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[color:var(--text-muted)]" />
                            {rec.timestamp ? new Date(rec.timestamp).toLocaleString() : 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{
                              background: isSeizure ? 'rgba(248,113,113,0.12)' : 'rgba(52,211,153,0.12)',
                              color: isSeizure ? '#f87171' : '#34d399',
                              border: `1px solid ${isSeizure ? 'rgba(248,113,113,0.25)' : 'rgba(52,211,153,0.25)'}`
                            }}
                          >
                            {rec.prediction}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-[color:var(--text-main)] font-semibold font-mono">
                              {(rec.confidence * 100).toFixed(1)}%
                            </span>
                            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--glass-border-strong)' }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${rec.confidence * 100}%`,
                                  background: isSeizure ? '#f87171' : '#34d399'
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            to={`/patients/${rec.patient_id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            <span>View Patient</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {!hasSearched && (
        <div className="card text-center py-16">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'var(--glass-bg-base)', border: '1px solid var(--glass-border)' }}
          >
            <HistoryIcon className="w-8 h-8 text-[color:var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-medium text-[color:var(--text-main)]">Look up history</h3>
          <p className="text-sm text-[color:var(--text-muted)] max-w-md mx-auto mt-2 leading-relaxed">
            SeizureGuard stores all prediction records in the database linked to patient IDs. Enter an ID above to look up records.
          </p>
        </div>
      )}
    </div>
  );
}
