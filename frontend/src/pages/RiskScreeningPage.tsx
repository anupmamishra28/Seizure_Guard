import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowLeft, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { submitRiskScreening } from '../services/riskScreening';
import { useToast } from '../context/ToastContext';
import type { RiskScreeningAnswers } from '../types';

type YesNo = 'yes' | 'no' | null;

const SCREENING_QUESTIONS: { key: keyof Omit<RiskScreeningAnswers, 'additional_notes'>; label: string; description?: string }[] = [
  { key: 'previous_seizure_history',     label: 'Previous seizure history',           description: 'Has this patient experienced a confirmed seizure before?' },
  { key: 'family_history_epilepsy',      label: 'Family history of epilepsy',          description: 'Does the patient have a first-degree relative with epilepsy?' },
  { key: 'previous_neurological_disorder', label: 'Previous neurological disorder',   description: 'Has this patient been diagnosed with any neurological condition?' },
  { key: 'anti_seizure_medication',      label: 'Currently on anti-seizure medication', description: 'Is the patient currently prescribed anti-epileptic drugs (AEDs)?' },
  { key: 'previous_abnormal_eeg',        label: 'Previous abnormal EEG finding',      description: 'Has a prior EEG recorded abnormal brain activity?' },
  { key: 'recent_loss_of_consciousness', label: 'Recent loss of consciousness',       description: 'Has the patient had an unexplained loss of consciousness recently?' },
  { key: 'recent_unusual_movements',     label: 'Recent unusual motor movements',     description: 'Has the patient experienced involuntary or unusual movements?' },
  { key: 'recent_sleep_deprivation',     label: 'Recent severe sleep deprivation',    description: 'Has the patient experienced significant sleep deprivation recently?' },
];

export function RiskScreeningPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const initialAnswers: Record<string, YesNo> = {};
  SCREENING_QUESTIONS.forEach((q) => { initialAnswers[q.key] = null; });

  const [answers, setAnswers] = useState<Record<string, YesNo>>(initialAnswers);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const unanswered = SCREENING_QUESTIONS.filter((q) => answers[q.key] === null).length;
  const yesCount = Object.values(answers).filter((v) => v === 'yes').length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (unanswered > 0) {
      toast.warning('Incomplete screening', `Please answer all ${unanswered} remaining question(s).`);
      return;
    }

    setSubmitting(true);
    const answersPayload: RiskScreeningAnswers = {
      previous_seizure_history:      answers.previous_seizure_history === 'yes',
      family_history_epilepsy:       answers.family_history_epilepsy === 'yes',
      previous_neurological_disorder: answers.previous_neurological_disorder === 'yes',
      anti_seizure_medication:       answers.anti_seizure_medication === 'yes',
      previous_abnormal_eeg:         answers.previous_abnormal_eeg === 'yes',
      recent_loss_of_consciousness:  answers.recent_loss_of_consciousness === 'yes',
      recent_unusual_movements:      answers.recent_unusual_movements === 'yes',
      recent_sleep_deprivation:      answers.recent_sleep_deprivation === 'yes',
      additional_notes:              notes,
    };

    try {
      await submitRiskScreening({ patient_id: patientId!, answers: answersPayload });
      setSubmitted(true);
      toast.success('Screening recorded', 'Risk screening answers have been saved locally.');
    } catch {
      toast.info('Screening saved locally', 'Backend endpoint not yet implemented — answers are held in memory only.');
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="animate-fade-in max-w-xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Patients', href: '/patients' },
          { label: patientId!, href: `/patients/${patientId}` },
          { label: 'Risk Screening' },
        ]} />
        <div className="card text-center py-12 px-6 flex flex-col items-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[color:var(--text-main)]">Screening Complete</h2>
            <p className="text-sm text-[color:var(--text-muted)] mt-2">
              {yesCount} of {SCREENING_QUESTIONS.length} risk factors were flagged.
            </p>
          </div>
          <div
            className="flex items-start gap-3 p-4 rounded-xl text-left w-full"
            style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}
          >
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-500/80 leading-relaxed">
              Answers are saved in local session only. The backend does not yet have a <code className="text-amber-400 bg-amber-900/30 px-1 rounded text-xs">POST /risk-screening</code> endpoint.
            </p>
          </div>
          <div className="flex gap-4 flex-wrap justify-center w-full mt-2">
            <button onClick={() => navigate(`/prediction/${patientId}`)} className="btn-primary flex-1 min-w-[200px]">
              Proceed to EEG Analysis
            </button>
            <button onClick={() => navigate(`/patients/${patientId}`)} className="btn-secondary flex-1 min-w-[200px]">
              Back to Patient
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <Breadcrumbs items={[
        { label: 'Patients', href: '/patients' },
        { label: patientId!, href: `/patients/${patientId}` },
        { label: 'Risk Screening' },
      ]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Risk Screening</h1>
          <p className="page-subtitle">
            Patient:{' '}
            <code className="text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded text-xs font-mono">
              {patientId}
            </code>
          </p>
        </div>
        <button onClick={() => navigate(`/patients/${patientId}`)} className="btn-secondary btn-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div
        className="flex items-start gap-3 p-4 rounded-xl mb-6"
        style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}
      >
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-500/80 leading-relaxed">
          <strong className="text-amber-400">Note:</strong> Risk screening answers are saved locally only.
          Backend integration (POST /risk-screening) is required for persistent storage.
        </p>
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-2 pb-4" style={{ borderBottom: '1px solid var(--glass-bg-hover)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <ClipboardList className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[color:var(--text-main)]">Clinical Risk Questionnaire</h2>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Answer each question based on the patient's clinical history.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
          {SCREENING_QUESTIONS.map((q, idx) => (
            <fieldset key={q.key} className="p-4 rounded-xl" style={{ background: 'var(--glass-bg-light)', border: '1px solid var(--glass-bg-hover)' }}>
              <legend className="text-sm font-semibold text-[color:var(--text-main)] px-1 mb-1">
                <span className="text-violet-400 mr-2">{idx + 1}.</span>{q.label}
              </legend>
              {q.description && (
                <p className="text-xs text-[color:var(--text-muted)] mt-1 mb-4 px-1">{q.description}</p>
              )}
              <div className="flex gap-3">
                <YesNoButton
                  value="yes"
                  selected={answers[q.key] === 'yes'}
                  onClick={() => setAnswers((a) => ({ ...a, [q.key]: 'yes' }))}
                  id={`${q.key}-yes`}
                  name={q.key}
                />
                <YesNoButton
                  value="no"
                  selected={answers[q.key] === 'no'}
                  onClick={() => setAnswers((a) => ({ ...a, [q.key]: 'no' }))}
                  id={`${q.key}-no`}
                  name={q.key}
                />
              </div>
            </fieldset>
          ))}

          <div className="p-4 rounded-xl" style={{ background: 'var(--glass-bg-light)', border: '1px solid var(--glass-bg-hover)' }}>
            <label htmlFor="screening-notes" className="text-sm font-semibold text-[color:var(--text-main)] block mb-2 px-1">
              Additional clinical notes <span className="text-[color:var(--text-muted)] font-normal">(optional)</span>
            </label>
            <textarea
              id="screening-notes"
              className="form-input w-full resize-none min-h-[100px]"
              placeholder="Enter any additional observations or clinical context…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2" style={{ borderTop: '1px solid var(--glass-bg-hover)' }}>
            <div className="text-sm">
              {unanswered > 0
                ? <span className="text-[color:var(--text-muted)]">{unanswered} question(s) remaining</span>
                : <span className="text-emerald-400 font-medium flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> All questions answered</span>
              }
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
              {submitting ? 'Submitting…' : 'Complete Screening'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>
      </div>

      <p className="text-xs text-center text-[color:var(--text-muted)]">
        This screening supports clinical assessment and does not replace professional medical evaluation.
      </p>
    </div>
  );
}

function YesNoButton({ value, selected, onClick, id, name }: {
  value: 'yes' | 'no';
  selected: boolean;
  onClick: () => void;
  id: string;
  name: string;
}) {
  const isYes = value === 'yes';
  return (
    <button
      type="button"
      id={id}
      role="radio"
      aria-checked={selected}
      aria-label={`${name}: ${value}`}
      onClick={onClick}
      className={`
        flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all duration-300
        ${selected && isYes  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : ''}
        ${selected && !isYes ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(248,113,113,0.15)]' : ''}
        ${!selected ? 'bg-[color:var(--glass-bg-base)] border-[color:var(--glass-border)] text-[color:var(--text-muted)] hover:border-[color:var(--glass-border-strong)] hover:bg-[color:var(--bg-secondary)]/60' : ''}
      `}
    >
      {value === 'yes' ? 'Yes' : 'No'}
    </button>
  );
}
