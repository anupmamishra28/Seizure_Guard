import api from './api';
import type { Patient } from '../types';

// ==========================================
// PATIENTS SERVICE
// Connected to:
//   POST /patients  — create patient
//   GET  /patients/{patient_id} — get single patient
//
// MISSING ENDPOINT (see BACKEND_INTEGRATION.md):
//   GET /patients — list all patients
// ==========================================

/**
 * Create a new patient.
 * POST /patients
 */
export async function createPatient(data: Patient): Promise<{
  message: string;
  patient_id: string;
  name: string;
  age: number;
  gender: string;
}> {
  const response = await api.post('/patients', data);
  return response.data;
}

/**
 * Get a single patient by ID.
 * GET /patients/{patient_id}
 *
 * Note: backend returns { message: "Patient not found" } with HTTP 200
 * when patient doesn't exist (not 404). We normalize this here.
 */
export async function getPatient(patientId: string): Promise<Patient> {
  const response = await api.get<Patient | { message: string }>(`/patients/${patientId}`);
  const data = response.data;

  // Backend quirk: returns 200 with { message: "Patient not found" } instead of 404
  if ('message' in data && data.message === 'Patient not found') {
    throw { message: `Patient "${patientId}" was not found.`, status: 404 };
  }

  return data as Patient;
}

// ==========================================
// TODO: Backend endpoint required
// GET /patients
// When implemented, use:
//   const response = await api.get<Patient[]>('/patients');
//   return response.data;
// ==========================================
export async function listPatients(): Promise<Patient[]> {
  // Backend does not yet provide GET /patients.
  // Returning empty array so UI can display empty state.
  // See BACKEND_INTEGRATION.md for required implementation.
  throw {
    message: 'Patient listing is not yet available. The backend requires a GET /patients endpoint.',
    status: 501,
    isBackendMissing: true,
  };
}
