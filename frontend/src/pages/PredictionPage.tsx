import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Brain, ArrowLeft, AlertCircle, Info, ChevronRight,
  Upload, FileText, HelpCircle, Activity
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { runPrediction } from '../services/prediction';
import { getPatient } from '../services/patients';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils';
import { EEG_FEATURE_NAMES } from '../types';
import type { Patient, PredictionResponse } from '../types';

type InputMode = 'manual' | 'upload';

const FEATURE_LABELS: { key: string; label: string; unit: string }[] = [
  // Channel 1 — Time domain
  { key: 'ch1_mean',         label: 'CH1 Mean',         unit: 'μV' },
  { key: 'ch1_std',          label: 'CH1 Std Dev',       unit: 'μV' },
  { key: 'ch1_variance',     label: 'CH1 Variance',      unit: 'μV²' },
  { key: 'ch1_minimum',      label: 'CH1 Minimum',       unit: 'μV' },
  { key: 'ch1_maximum',      label: 'CH1 Maximum',       unit: 'μV' },
  { key: 'ch1_rms',          label: 'CH1 RMS',           unit: 'μV' },
  { key: 'ch1_energy',       label: 'CH1 Energy',        unit: 'μV²·s' },
  // Channel 1 — Frequency domain
  { key: 'ch1_delta_power',  label: 'CH1 Delta Power',   unit: 'μV²/Hz' },
  { key: 'ch1_theta_power',  label: 'CH1 Theta Power',   unit: 'μV²/Hz' },
  { key: 'ch1_alpha_power',  label: 'CH1 Alpha Power',   unit: 'μV²/Hz' },
  { key: 'ch1_beta_power',   label: 'CH1 Beta Power',    unit: 'μV²/Hz' },
  { key: 'ch1_gamma_power',  label: 'CH1 Gamma Power',   unit: 'μV²/Hz' },
  // Channel 2 — Time domain
  { key: 'ch2_mean',         label: 'CH2 Mean',         unit: 'μV' },
  { key: 'ch2_std',          label: 'CH2 Std Dev',       unit: 'μV' },
  { key: 'ch2_variance',     label: 'CH2 Variance',      unit: 'μV²' },
  { key: 'ch2_minimum',      label: 'CH2 Minimum',       unit: 'μV' },
  { key: 'ch2_maximum',      label: 'CH2 Maximum',       unit: 'μV' },
  { key: 'ch2_rms',          label: 'CH2 RMS',           unit: 'μV' },
  { key: 'ch2_energy',       label: 'CH2 Energy',        unit: 'μV²·s' },
  // Channel 2 — Frequency domain
  { key: 'ch2_delta_power',  label: 'CH2 Delta Power',   unit: 'μV²/Hz' },
  { key: 'ch2_theta_power',  label: 'CH2 Theta Power',   unit: 'μV²/Hz' },
  { key: 'ch2_alpha_power',  label: 'CH2 Alpha Power',   unit: 'μV²/Hz' },
  { key: 'ch2_beta_power',   label: 'CH2 Beta Power',    unit: 'μV²/Hz' },
  { key: 'ch2_gamma_power',  label: 'CH2 Gamma Power',   unit: 'μV²/Hz' },
];

const ANALYSIS_STEPS = [
  'Validating input',
  'Scaling features',
  'Running model inference',
  'Preparing result',
];

export function PredictionPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('manual');
  const [featureValues, setFeatureValues] = useState<Record<string, string>>(
    Object.fromEntries(EEG_FEATURE_NAMES.map((k) => [k, '']))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [running, setRunning] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!patientId) return;
    getPatient(patientId).then(setPatient).catch(() => {});
  }, [patientId]);

  function validateFeatures(): boolean {
    const errs: Record<string, string> = {};
    EEG_FEATURE_NAMES.forEach((key) => {
      const v = featureValues[key].trim();
      if (!v) {
        errs[key] = 'Required';
      } else if (isNaN(Number(v))) {
        errs[key] = 'Must be a number';
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleRunPrediction(e: React.FormEvent) {
    e.preventDefault();
    if (inputMode === 'upload') {
      toast.warning(
        'EEG file upload not yet supported',
        'The backend currently requires pre-extracted features. Please use manual feature entry.'
      );
      return;
    }
    if (!validateFeatures()) {
      toast.error('Validation error', 'Please fill in all 24 EEG feature values.');
      return;
    }

    setRunning(true);
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep((s) => Math.min(s + 1, ANALYSIS_STEPS.length - 1));
    }, 400);

    try {
      const features = EEG_FEATURE_NAMES.map((key) => Number(featureValues[key]));
      const result: PredictionResponse = await runPrediction(patientId!, features);
      clearInterval(stepInterval);
      setAnalysisStep(ANALYSIS_STEPS.length);

      navigate(`/prediction/${patientId}/result`, { state: { result, patient } });
    } catch (err) {
      clearInterval(stepInterval);
      setRunning(false);
      setAnalysisStep(0);
      toast.error('Prediction failed', getErrorMessage(err));
    }
  }

  const filledCount = Object.values(featureValues).filter((v) => v.trim() && !isNaN(Number(v))).length;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[
        { label: 'Patients', href: '/patients' },
        { label: patientId!, href: `/patients/${patientId}` },
        { label: 'EEG Analysis' },
      ]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">EEG Analysis</h1>
          <p className="page-subtitle">
            {patient ? `Patient: ${patient.name} (` : `Patient ID: `}
            <code className="text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded text-xs font-mono">
              {patientId}
            </code>
            {patient ? ')' : ''}
          </p>
        </div>
        <button onClick={() => navigate(`/patients/${patientId}`)} className="btn-secondary btn-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {running && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="card text-center py-12 px-10 max-w-sm w-full flex flex-col items-center gap-8 animate-fade-in"
               style={{ boxShadow: '0 0 50px rgba(6,182,212,0.1)' }}>
            <div className="eeg-loader scale-150" style={{ color: '#22d3ee' }}>
              <span /><span /><span /><span /><span /><span />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[color:var(--text-main)]">Analyzing EEG Pattern</h3>
              <p className="text-sm text-[color:var(--text-muted)] mt-2">Processing 24 EEG features...</p>
            </div>
            <div className="w-full flex flex-col gap-3">
              {ANALYSIS_STEPS.map((step, idx) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 text-sm transition-colors ${
                    idx < analysisStep ? 'text-emerald-400' :
                    idx === analysisStep ? 'text-cyan-400 font-medium' : 'text-[color:var(--text-muted)]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                    idx < analysisStep ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' :
                    idx === analysisStep ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse' : 'bg-[color:var(--glass-border)]'
                  }`} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode selector */}
      <div
        className="flex gap-2 p-1.5 rounded-xl w-fit"
        style={{ background: 'var(--glass-bg-base)', border: '1px solid var(--glass-border)' }}
      >
        <button
          onClick={() => setInputMode('manual')}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            inputMode === 'manual' ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)]'
          }`}
          aria-pressed={inputMode === 'manual'}
        >
          Manual Feature Entry
        </button>
        <button
          onClick={() => setInputMode('upload')}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            inputMode === 'upload' ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)]'
          }`}
          aria-pressed={inputMode === 'upload'}
        >
          EEG File Upload
        </button>
      </div>

      {inputMode === 'upload' && (
        <div className="card space-y-6">
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}
          >
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-500/80 leading-relaxed">
              <strong className="text-amber-400">Backend endpoint required:</strong>{' '}
              The current <code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-xs text-amber-300">POST /predict</code> endpoint
              accepts only pre-extracted 24-feature arrays.
              EEG file upload requires a new backend endpoint that extracts features from .edf files.
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-5 transition-all duration-300 cursor-default
              ${dragOver ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-[color:var(--glass-border)] bg-[color:var(--glass-bg-base)] hover:border-slate-600 hover:bg-[color:var(--glass-bg-hover)]'}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault(); setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file && (file.name.endsWith('.edf') || file.name.endsWith('.csv'))) {
                setSelectedFile(file);
              } else {
                toast.warning('Unsupported file', 'Please upload a .edf or .csv EEG file.');
              }
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'var(--glass-bg-base)', border: '1px solid var(--glass-border)' }}
            >
              <Upload className="w-8 h-8 text-[color:var(--text-muted)]" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-[color:var(--text-main)] mb-1">
                {selectedFile ? selectedFile.name : 'Drag & drop EEG file here'}
              </p>
              <p className="text-sm text-[color:var(--text-muted)]">Supported formats: .edf, .csv</p>
            </div>
            <label className="btn-secondary cursor-pointer mt-2">
              Browse File
              <input
                type="file"
                accept=".edf,.csv"
                className="sr-only"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {selectedFile && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: 'var(--glass-bg-base)', border: '1px solid var(--glass-border)' }}
            >
              <FileText className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-[color:var(--text-main)] font-medium">{selectedFile.name}</span>
              <span className="text-xs text-[color:var(--text-muted)] ml-auto">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}

          <button
            disabled
            className="w-full py-3.5 bg-[color:var(--bg-secondary)] text-[color:var(--text-muted)] rounded-xl font-medium border border-[color:var(--glass-border)] flex items-center justify-center gap-2 cursor-not-allowed transition-colors hover:bg-[color:var(--glass-border)]/50 hover:text-[color:var(--text-muted)]"
            title="EEG file upload requires backend implementation"
          >
            <Brain className="w-5 h-5" />
            Analyze EEG File
            <span className="ml-1 text-xs opacity-75 font-normal">(backend required)</span>
          </button>
        </div>
      )}

      {inputMode === 'manual' && (
        <form onSubmit={handleRunPrediction} className="flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs text-[color:var(--text-muted)] mb-1 px-1">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              24 EEG-derived features required
            </span>
            <span className={filledCount === 24 ? 'text-emerald-400 font-medium' : 'text-[color:var(--text-muted)]'}>
              {filledCount}/24 features entered
            </span>
          </div>

          {/* Channel 1 */}
          <FeatureSection
            title="Channel 1 — Time Domain"
            subtitle="Statistical features computed from raw EEG signal"
            features={FEATURE_LABELS.slice(0, 7)}
            values={featureValues}
            errors={errors}
            onChange={(key, val) => setFeatureValues((f) => ({ ...f, [key]: val }))}
          />
          <FeatureSection
            title="Channel 1 — Frequency Domain"
            subtitle="Band power computed using Welch's method (fs=256 Hz)"
            features={FEATURE_LABELS.slice(7, 12)}
            values={featureValues}
            errors={errors}
            onChange={(key, val) => setFeatureValues((f) => ({ ...f, [key]: val }))}
          />

          {/* Channel 2 */}
          <FeatureSection
            title="Channel 2 — Time Domain"
            subtitle="Statistical features computed from raw EEG signal"
            features={FEATURE_LABELS.slice(12, 19)}
            values={featureValues}
            errors={errors}
            onChange={(key, val) => setFeatureValues((f) => ({ ...f, [key]: val }))}
          />
          <FeatureSection
            title="Channel 2 — Frequency Domain"
            subtitle="Band power computed using Welch's method (fs=256 Hz)"
            features={FEATURE_LABELS.slice(19, 24)}
            values={featureValues}
            errors={errors}
            onChange={(key, val) => setFeatureValues((f) => ({ ...f, [key]: val }))}
          />

          {/* Submit */}
          <div className="card flex flex-col sm:flex-row items-center justify-between gap-5 sticky bottom-6 z-10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-cyan-500/20">
            <div>
              <p className="text-base font-semibold text-[color:var(--text-main)]">Ready to run analysis?</p>
              <p className="text-sm text-[color:var(--text-muted)] mt-1">Submit the {filledCount} entered features to the model</p>
            </div>
            <button
              type="submit"
              disabled={running || filledCount < 24}
              className="btn-primary btn-lg w-full sm:w-auto flex-shrink-0"
            >
              <Activity className="w-5 h-5 mr-2" />
              Analyze EEG
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function FeatureSection({
  title, subtitle, features, values, errors, onChange
}: {
  title: string;
  subtitle: string;
  features: { key: string; label: string; unit: string }[];
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  return (
    <div className="card">
      <div className="mb-6 pb-4" style={{ borderBottom: '1px solid var(--glass-bg-hover)' }}>
        <h3 className="text-sm font-semibold text-[color:var(--text-main)]">{title}</h3>
        <p className="text-xs text-[color:var(--text-muted)] mt-1">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {features.map((f) => (
          <div key={f.key}>
            <label
              htmlFor={`feat-${f.key}`}
              className="text-xs font-medium text-[color:var(--text-muted)] block mb-1.5"
            >
              {f.label}
              <span className="text-[color:var(--text-muted)] font-normal ml-1.5 font-mono">({f.unit})</span>
            </label>
            <input
              id={`feat-${f.key}`}
              type="number"
              step="any"
              className={`form-input w-full font-mono text-sm ${errors[f.key] ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
              placeholder="0.0"
              value={values[f.key]}
              onChange={(e) => onChange(f.key, e.target.value)}
              aria-label={f.label}
              aria-invalid={!!errors[f.key]}
            />
            {errors[f.key] && (
              <p className="text-xs text-red-400 mt-1.5">{errors[f.key]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
