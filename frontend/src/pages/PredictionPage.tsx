import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Brain, ArrowLeft, AlertCircle, Info,
  Upload, FileText, Activity, User, X
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { runPrediction } from '../services/prediction';
import { getPatient } from '../services/patients';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils';
import { GENDER_OPTIONS } from '../types';
import type { Patient, PredictionResponse } from '../types';

const ANALYSIS_STEPS = [
  'Uploading EDF file',
  'Extracting EEG features',
  'Running model inference',
  'Assessing risk level',
  'Preparing result',
];

export function PredictionPage() {
  const { patientId: urlPatientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [existingPatient, setExistingPatient] = useState<Patient | null>(null);

  // Form fields
  const [patientId, setPatientId] = useState(urlPatientId || '');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [running, setRunning] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  // If visiting from a patient profile, pre-fill form fields
  useEffect(() => {
    if (!urlPatientId) return;
    getPatient(urlPatientId)
      .then((p) => {
        setExistingPatient(p);
        setPatientId(p.patient_id);
        setName(p.name);
        setAge(String(p.age));
        setGender(p.gender);
      })
      .catch(() => {});
  }, [urlPatientId]);

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!patientId.trim()) errs.patientId = 'Patient ID is required';
    if (!name.trim()) errs.name = 'Patient name is required';
    if (!age.trim()) {
      errs.age = 'Age is required';
    } else if (isNaN(Number(age)) || Number(age) <= 0 || !Number.isInteger(Number(age))) {
      errs.age = 'Age must be a positive integer';
    }
    if (!gender) errs.gender = 'Gender is required';
    if (!selectedFile) {
      errs.file = 'Please select an EDF file';
    } else if (!selectedFile.name.toLowerCase().endsWith('.edf')) {
      errs.file = 'Only .edf files are supported';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error('Validation error', 'Please fix the highlighted fields.');
      return;
    }

    setRunning(true);
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep((s) => Math.min(s + 1, ANALYSIS_STEPS.length - 1));
    }, 600);

    try {
      const result: PredictionResponse = await runPrediction(
        selectedFile!,
        patientId.trim(),
        name.trim(),
        Number(age),
        gender
      );
      clearInterval(stepInterval);
      setAnalysisStep(ANALYSIS_STEPS.length);

      // Navigate to result page, passing both the result and patient info
      const patient: Patient = {
        patient_id: result.patient_id,
        name: result.name,
        age: result.age,
        gender: result.gender,
      };
      navigate(`/prediction/${result.patient_id}/result`, { state: { result, patient } });
    } catch (err) {
      clearInterval(stepInterval);
      setRunning(false);
      setAnalysisStep(0);
      toast.error('Prediction failed', getErrorMessage(err));
    }
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith('.edf')) {
      setSelectedFile(file);
      setErrors((prev) => ({ ...prev, file: '' }));
    } else {
      toast.warning('Unsupported file', 'Please upload a .edf EEG file.');
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && !file.name.toLowerCase().endsWith('.edf')) {
      toast.warning('Unsupported file', 'Please upload a .edf EEG file.');
      return;
    }
    setSelectedFile(file);
    if (file) setErrors((prev) => ({ ...prev, file: '' }));
  }

  const isFormReady = patientId.trim() && name.trim() && age.trim() && gender && selectedFile;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[
        { label: 'Patients', href: '/patients' },
        ...(urlPatientId ? [{ label: urlPatientId, href: `/patients/${urlPatientId}` }] : []),
        { label: 'EEG Analysis' },
      ]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">EEG Analysis</h1>
          <p className="page-subtitle">
            Upload an EDF file to run seizure prediction
          </p>
        </div>
        {urlPatientId && (
          <button onClick={() => navigate(`/patients/${urlPatientId}`)} className="btn-secondary btn-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>

      {/* Loading overlay */}
      {running && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="card text-center py-12 px-10 max-w-sm w-full flex flex-col items-center gap-8 animate-fade-in"
               style={{ boxShadow: '0 0 50px rgba(6,182,212,0.1)' }}>
            <div className="eeg-loader scale-150" style={{ color: '#22d3ee' }}>
              <span /><span /><span /><span /><span /><span />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[color:var(--text-main)]">Analyzing EEG File</h3>
              <p className="text-sm text-[color:var(--text-muted)] mt-2">
                Processing {selectedFile?.name}...
              </p>
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Patient Information Card */}
        <div className="card">
          <div className="mb-6 pb-4" style={{ borderBottom: '1px solid var(--glass-bg-hover)' }}>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-[color:var(--text-main)]">Patient Information</h3>
            </div>
            <p className="text-xs text-[color:var(--text-muted)] mt-1">
              {existingPatient ? 'Pre-filled from patient record. You can edit if needed.' : 'Enter patient details for this analysis.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Patient ID */}
            <div>
              <label htmlFor="patientId" className="text-xs font-medium text-[color:var(--text-muted)] block mb-1.5">
                Patient ID <span className="text-red-400">*</span>
              </label>
              <input
                id="patientId"
                type="text"
                className={`form-input w-full text-sm ${errors.patientId ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                placeholder="e.g. P001"
                value={patientId}
                onChange={(e) => { setPatientId(e.target.value); setErrors((prev) => ({ ...prev, patientId: '' })); }}
              />
              {errors.patientId && <p className="text-xs text-red-400 mt-1.5">{errors.patientId}</p>}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="patientName" className="text-xs font-medium text-[color:var(--text-muted)] block mb-1.5">
                Patient Name <span className="text-red-400">*</span>
              </label>
              <input
                id="patientName"
                type="text"
                className={`form-input w-full text-sm ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: '' })); }}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="patientAge" className="text-xs font-medium text-[color:var(--text-muted)] block mb-1.5">
                Age <span className="text-red-400">*</span>
              </label>
              <input
                id="patientAge"
                type="number"
                min="1"
                max="150"
                className={`form-input w-full text-sm ${errors.age ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                placeholder="e.g. 25"
                value={age}
                onChange={(e) => { setAge(e.target.value); setErrors((prev) => ({ ...prev, age: '' })); }}
              />
              {errors.age && <p className="text-xs text-red-400 mt-1.5">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="patientGender" className="text-xs font-medium text-[color:var(--text-muted)] block mb-1.5">
                Gender <span className="text-red-400">*</span>
              </label>
              <select
                id="patientGender"
                className={`form-input w-full text-sm ${errors.gender ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                value={gender}
                onChange={(e) => { setGender(e.target.value); setErrors((prev) => ({ ...prev, gender: '' })); }}
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.gender && <p className="text-xs text-red-400 mt-1.5">{errors.gender}</p>}
            </div>
          </div>
        </div>

        {/* EDF File Upload Card */}
        <div className="card space-y-6">
          <div className="mb-2 pb-4" style={{ borderBottom: '1px solid var(--glass-bg-hover)' }}>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-[color:var(--text-main)]">EEG File Upload</h3>
            </div>
            <p className="text-xs text-[color:var(--text-muted)] mt-1">
              Upload a standard EDF (European Data Format) file containing EEG recordings
            </p>
          </div>

          {/* Info banner */}
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)' }}
          >
            <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-sky-300/90 leading-relaxed">
              The backend will automatically extract EEG features from your EDF file, run the prediction model,
              and compute the risk level. No manual feature entry needed.
            </div>
          </div>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-5 transition-all duration-300 cursor-pointer
              ${errors.file ? 'border-red-400/50 bg-red-500/5' :
                dragOver ? 'border-cyan-500/50 bg-cyan-500/5' :
                selectedFile ? 'border-emerald-500/30 bg-emerald-500/5' :
                'border-[color:var(--glass-border)] bg-[color:var(--glass-bg-base)] hover:border-slate-600 hover:bg-[color:var(--glass-bg-hover)]'}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById('edf-file-input')?.click()}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: selectedFile ? 'rgba(52,211,153,0.12)' : 'var(--glass-bg-base)',
                border: `1px solid ${selectedFile ? 'rgba(52,211,153,0.3)' : 'var(--glass-border)'}`,
              }}
            >
              {selectedFile
                ? <FileText className="w-8 h-8 text-emerald-400" />
                : <Upload className="w-8 h-8 text-[color:var(--text-muted)]" />
              }
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-[color:var(--text-main)] mb-1">
                {selectedFile ? selectedFile.name : 'Drag & drop EDF file here'}
              </p>
              <p className="text-sm text-[color:var(--text-muted)]">
                {selectedFile
                  ? `${(selectedFile.size / 1024).toFixed(1)} KB — Click to change`
                  : 'Supported format: .edf (European Data Format)'}
              </p>
            </div>
            {!selectedFile && (
              <span className="btn-secondary cursor-pointer mt-2 text-sm">
                Browse File
              </span>
            )}
            <input
              id="edf-file-input"
              type="file"
              accept=".edf"
              className="sr-only"
              onChange={handleFileSelect}
            />
          </div>

          {errors.file && <p className="text-xs text-red-400 -mt-4">{errors.file}</p>}

          {/* Selected file info */}
          {selectedFile && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: 'var(--glass-bg-base)', border: '1px solid var(--glass-border)' }}
            >
              <FileText className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-[color:var(--text-main)] font-medium truncate block">{selectedFile.name}</span>
                <span className="text-xs text-[color:var(--text-muted)]">{(selectedFile.size / 1024).toFixed(1)} KB</span>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-[color:var(--text-muted)] hover:text-red-400"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="card flex flex-col sm:flex-row items-center justify-between gap-5 sticky bottom-6 z-10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-cyan-500/20">
          <div>
            <p className="text-base font-semibold text-[color:var(--text-main)]">Ready to analyze?</p>
            <p className="text-sm text-[color:var(--text-muted)] mt-1">
              Upload an EDF file with patient details to run the EEG seizure prediction
            </p>
          </div>
          <button
            type="submit"
            disabled={running || !isFormReady}
            className="btn-primary btn-lg w-full sm:w-auto flex-shrink-0"
          >
            <Brain className="w-5 h-5 mr-2" />
            Analyze EEG File
          </button>
        </div>
      </form>
    </div>
  );
}
