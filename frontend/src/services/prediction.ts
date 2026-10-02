import api from './api';
import type { PredictionRequest, PredictionResponse } from '../types';

// ==========================================
// PREDICTION SERVICE
// Connected to:
//   POST /predict
//
// Request: { patient_id, features: number[24] }
// Response: { patient_id, prediction, confidence, risk_level }
// ==========================================

/**
 * Run seizure prediction for a patient.
 * POST /predict
 *
 * @param patientId - Patient ID string
 * @param features  - Array of exactly 24 EEG feature floats
 *                    (order: ch1_mean, ch1_std, ..., ch2_gamma_power)
 */
export async function runPrediction(
  patientId: string,
  features: number[]
): Promise<PredictionResponse> {
  if (features.length !== 24) {
    throw new Error(`Expected exactly 24 features, got ${features.length}.`);
  }

  const payload: PredictionRequest = {
    patient_id: patientId,
    features,
  };

  const response = await api.post<PredictionResponse>('/predict', payload);
  return response.data;
}
