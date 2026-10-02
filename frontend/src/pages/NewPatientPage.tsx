import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { createPatient } from '../services/patients';
import { useToast } from '../context/ToastContext';
import { getErrorMessage, isPositiveInteger } from '../utils';
import type { Patient } from '../types';

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export function NewPatientPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<{ patient_id: string; name: string; age: string; gender: string }>({
    patient_id: '',
    name: '',
    age: '',
    gender: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.patient_id.trim()) {
      errs.patient_id = 'Patient ID is required.';
    }
    if (!form.name.trim()) {
      errs.name = 'Full name is required.';
    }
    if (!form.age) {
      errs.age = 'Age is required.';
    } else if (!isPositiveInteger(form.age)) {
      errs.age = 'Age must be a positive whole number.';
    } else if (Number(form.age) > 120) {
      errs.age = 'Please enter a valid age.';
    }
    if (!form.gender) {
      errs.gender = 'Gender is required.';
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const payload: Patient = {
        patient_id: form.patient_id.trim(),
        name: form.name.trim(),
        age: Number(form.age),
        gender: form.gender,
      };
      await createPatient(payload);
      toast.success('Patient created', `${payload.name} (${payload.patient_id}) has been registered.`);
      navigate(`/patients/${payload.patient_id}`);
    } catch (err) {
      const msg = getErrorMessage(err);
      if (msg.includes('UNIQUE') || msg.includes('unique') || msg.includes('already')) {
        setErrors({ patient_id: 'A patient with this ID already exists.' });
      } else {
        toast.error('Failed to create patient', msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in max-w-xl space-y-6">
      <Breadcrumbs items={[
        { label: 'Patients', href: '/patients' },
        { label: 'Add Patient' },
      ]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Patient</h1>
          <p className="page-subtitle">Register a new patient in SeizureGuard</p>
        </div>
        <button onClick={() => navigate('/patients')} className="btn-secondary btn-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

          {/* Patient ID */}
          <div>
            <label htmlFor="field-patient-id" className="form-label text-sm text-[color:var(--text-muted)] font-medium block mb-1">
              Patient ID <span aria-hidden="true" className="text-cyan-400">*</span>
            </label>
            <input
              id="field-patient-id"
              type="text"
              className={`form-input w-full ${errors.patient_id ? 'border-red-400 focus:border-red-400' : ''}`}
              placeholder="e.g. P001"
              value={form.patient_id}
              onChange={(e) => setForm((f) => ({ ...f, patient_id: e.target.value }))}
              aria-required="true"
              aria-describedby={errors.patient_id ? 'err-patient-id' : undefined}
            />
            {errors.patient_id && <p id="err-patient-id" className="text-xs text-red-400 mt-1">{errors.patient_id}</p>}
            <p className="text-xs text-[color:var(--text-muted)] mt-1">A unique identifier for this patient (e.g. P001, PT-2024-001).</p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="field-name" className="form-label text-sm text-[color:var(--text-muted)] font-medium block mb-1">
              Full Name <span aria-hidden="true" className="text-cyan-400">*</span>
            </label>
            <input
              id="field-name"
              type="text"
              className={`form-input w-full ${errors.name ? 'border-red-400 focus:border-red-400' : ''}`}
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              aria-required="true"
              aria-describedby={errors.name ? 'err-name' : undefined}
            />
            {errors.name && <p id="err-name" className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label htmlFor="field-age" className="form-label text-sm text-[color:var(--text-muted)] font-medium block mb-1">
              Age <span aria-hidden="true" className="text-cyan-400">*</span>
            </label>
            <input
              id="field-age"
              type="number"
              min="1"
              max="120"
              className={`form-input w-full ${errors.age ? 'border-red-400 focus:border-red-400' : ''}`}
              placeholder="e.g. 35"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              aria-required="true"
              aria-describedby={errors.age ? 'err-age' : undefined}
            />
            {errors.age && <p id="err-age" className="text-xs text-red-400 mt-1">{errors.age}</p>}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="field-gender" className="form-label text-sm text-[color:var(--text-muted)] font-medium block mb-1">
              Gender <span aria-hidden="true" className="text-cyan-400">*</span>
            </label>
            <select
              id="field-gender"
              className={`form-input w-full ${errors.gender ? 'border-red-400 focus:border-red-400' : ''}`}
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              aria-required="true"
              aria-describedby={errors.gender ? 'err-gender' : undefined}
              style={{
                background: 'var(--glass-bg-base)',
                color: 'white',
              }}
            >
              <option value="" className="bg-[color:var(--bg-secondary)] text-[color:var(--text-muted)]">Select gender…</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g} className="bg-[color:var(--bg-secondary)] text-[color:var(--text-main)]">{g}</option>
              ))}
            </select>
            {errors.gender && <p id="err-gender" className="text-xs text-red-400 mt-1">{errors.gender}</p>}
          </div>

          <div className="h-px w-full" style={{ background: 'var(--glass-border)' }} />

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate('/patients')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating…' : 'Create Patient'}
            </button>
          </div>
        </form>
      </div>

      <p className="text-xs text-[color:var(--text-muted)] mt-4 text-center">
        Required fields are marked with <span className="text-cyan-400">*</span>
      </p>
    </div>
  );
}
