import api from './api';
import type { PredictionResponse } from '../types';

// ==========================================
// PREDICTION SERVICE
// Connected to:
//   POST /predict
//
// Request: multipart/form-data with fields:
//   file       → EDF file
//   patient_id → string
//   name       → string
//   age        → integer
//   gender     → string
//
// Response: { patient_id, name, age, gender, prediction, confidence, risk_level }
// ==========================================

/**
 * Run seizure prediction by uploading an EDF file.
 * POST /predict (multipart/form-data)
 *
 * @param file      - The EEG .edf file
 * @param patientId - Patient ID string
 * @param name      - Patient name
 * @param age       - Patient age (integer)
 * @param gender    - Patient gender
 */
export async function runPrediction(
  file: File,
  patientId: string,
  name: string,
  age: number,
  gender: string
): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('patient_id', patientId);
  formData.append('name', name);
  formData.append('age', String(age));
  formData.append('gender', gender);

  // Let Axios/browser set the Content-Type with the correct multipart boundary
  const response = await api.post<PredictionResponse>('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
