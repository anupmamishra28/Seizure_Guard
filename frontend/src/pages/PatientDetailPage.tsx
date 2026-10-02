import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Brain, History, ClipboardList,
  ArrowLeft, Calendar, Tag, Shield
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PageLoader } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/StateViews';
import { getPatient } from '../services/patients';
import type { Patient } from '../types';

export function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    getPatient(patientId)
      .then(setPatient)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading) return <PageLoader message={`Loading patient ${patientId}…`} />;
  if (error) return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: 'Patients', href: '/patients' }, { label: 'Patient Details' }]} />
      <ErrorState error={error} onRetry={() => { setError(null); setLoading(true); getPatient(patientId!).then(setPatient).catch(setError).finally(() => setLoading(false)); }} />
    </div>
  );
  if (!patient) return null;

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs items={[
        { label: 'Patients', href: '/patients' },
        { label: patient.name },
      ]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">{patient.name}</h1>
          <p className="page-subtitle">
            Patient ID:{' '}
            <code className="text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded text-xs font-mono">
              {patient.patient_id}
            </code>
          </p>
        </div>
        <button onClick={() => navigate('/patients')} className="btn-secondary btn-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Patients
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient card */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div
              className="flex flex-col items-center text-center pb-5 mb-5"
              style={{ borderBottom: '1px solid var(--glass-border)' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}
              >
                <User className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-base font-semibold text-[color:var(--text-main)]">{patient.name}</h2>
              <p className="text-sm text-[color:var(--text-muted)] font-mono mt-0.5">{patient.patient_id}</p>
            </div>

            <dl className="flex flex-col gap-4">
              <InfoRow icon={<Tag className="w-4 h-4 text-cyan-400" />} label="Patient ID" value={patient.patient_id} mono />
              <InfoRow icon={<Calendar className="w-4 h-4 text-cyan-400" />} label="Age" value={`${patient.age} years`} />
              <InfoRow icon={<Shield className="w-4 h-4 text-cyan-400" />} label="Gender" value={patient.gender} />
            </dl>
          </div>
        </div>

        {/* Actions */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[color:var(--text-muted)] uppercase tracking-wider mb-2">Actions</h2>

          <ActionCard
            icon={<ClipboardList className="w-5 h-5 text-violet-400" />}
            iconBg="rgba(139,92,246,0.12)"
            iconBorder="rgba(139,92,246,0.25)"
            title="Risk Screening"
            description="Complete a pre-EEG clinical risk assessment questionnaire for this patient."
            buttonLabel="Start Risk Screening"
            onClick={() => navigate(`/risk-screening/${patient.patient_id}`)}
          />

          <ActionCard
            icon={<Brain className="w-5 h-5 text-emerald-400" />}
            iconBg="rgba(16,185,129,0.12)"
            iconBorder="rgba(16,185,129,0.25)"
            title="EEG Analysis"
            description="Submit EEG features for AI-powered seizure prediction using the trained model."
            buttonLabel="Start EEG Analysis"
            onClick={() => navigate(`/prediction/${patient.patient_id}`)}
            primary
          />

          <ActionCard
            icon={<History className="w-5 h-5 text-cyan-400" />}
            iconBg="rgba(6,182,212,0.12)"
            iconBorder="rgba(6,182,212,0.25)"
            title="Prediction History"
            description="View all previous EEG predictions and results for this patient."
            buttonLabel="View History"
            onClick={() => navigate(`/history/${patient.patient_id}`)}
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, mono }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--glass-bg-base)', border: '1px solid var(--glass-border)' }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-[color:var(--text-muted)] font-medium">{label}</dt>
        <dd className={`text-sm font-medium text-[color:var(--text-main)] mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</dd>
      </div>
    </div>
  );
}

function ActionCard({
  icon, iconBg, iconBorder, title, description, buttonLabel, onClick, primary
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <div className="card flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-300 hover:border-cyan-500/30">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-[color:var(--text-main)]">{title}</h3>
        <p className="text-xs text-[color:var(--text-muted)] mt-1 leading-relaxed max-w-lg">{description}</p>
      </div>
      <button
        onClick={onClick}
        className={`${primary ? 'btn-primary' : 'btn-secondary'} btn-sm flex-shrink-0 mt-2 sm:mt-0 w-full sm:w-auto justify-center`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
