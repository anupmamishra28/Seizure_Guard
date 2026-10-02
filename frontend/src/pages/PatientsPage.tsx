import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState, ErrorState } from '../components/common/StateViews';
import { getPatient } from '../services/patients';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils';

// NOTE: GET /patients (list all patients) does not exist in the backend.
// This page provides a patient lookup by ID as a workaround.

export function PatientsPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [searchId, setSearchId] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<unknown>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const id = searchId.trim();
    if (!id) return;
    setSearching(true);
    setSearchError(null);
    try {
      await getPatient(id);
      navigate(`/patients/${id}`);
    } catch (err) {
      setSearchError(err);
      toast.error('Patient not found', getErrorMessage(err));
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs items={[{ label: 'Patients' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">Manage and look up patient records</p>
        </div>
        <button onClick={() => navigate('/patients/new')} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      {/* Backend notice */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}
      >
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-500/80">
          <strong className="text-amber-400">Backend endpoint required:</strong> The backend does not yet provide{' '}
          <code
            className="px-1.5 py-0.5 rounded font-mono text-xs"
            style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}
          >
            GET /patients
          </code>{' '}
          to list all patients. Use the search below to look up a patient by their ID, or{' '}
          <button
            onClick={() => navigate('/patients/new')}
            className="underline font-medium transition-colors"
            style={{ color: '#fbbf24' }}
          >
            add a new patient
          </button>.
        </div>
      </div>

      {/* Patient lookup */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'var(--glass-bg-base)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee' }}
          >
            <Search className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-semibold text-[color:var(--text-main)]">Find Patient by ID</h2>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3" role="search">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
            <input
              id="patient-search"
              type="text"
              className="form-input pl-10"
              placeholder="Enter Patient ID (e.g. P001)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              aria-label="Patient ID search"
            />
          </div>
          <button type="submit" disabled={searching || !searchId.trim()} className="btn-primary">
            {searching ? (
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching…
              </span>
            ) : (
              <>Find Patient <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </form>

        {searchError !== null && (
          <div className="mt-4">
            <ErrorState error={searchError} onRetry={() => setSearchError(null)} title="Patient not found" />
          </div>
        )}
      </div>

      {/* Empty state */}
      <div
        className="rounded-2xl"
        style={{
          background: 'var(--glass-bg-light)',
          border: '1px solid var(--glass-bg-hover)',
        }}
      >
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="Patient list not available"
          description="A full patient list requires the backend to implement GET /patients. Use the search above or add a new patient."
          action={
            <div className="flex gap-3 flex-wrap justify-center">
              <button onClick={() => navigate('/patients/new')} className="btn-primary btn-sm">
                <Plus className="w-3.5 h-3.5" />
                Add Patient
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
}
