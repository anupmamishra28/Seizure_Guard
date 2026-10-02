// ==========================================
// RISK SCREENING SERVICE
// STATUS: BACKEND ENDPOINT NOT YET IMPLEMENTED
//
// This file defines the integration interface for risk screening.
// The backend does NOT currently have a risk screening endpoint.
// See BACKEND_INTEGRATION.md for the proposed contract.
// ==========================================

import type { RiskScreeningAnswers } from '../types';

export interface RiskScreeningPayload {
  patient_id: string;
  answers: RiskScreeningAnswers;
}

export interface RiskScreeningResponse {
  screening_id: string;
  patient_id: string;
  answers: RiskScreeningAnswers;
  created_at: string;
}

// TODO: Connect to backend when POST /risk-screening is implemented
// import api from './api';
// export async function submitRiskScreening(payload: RiskScreeningPayload): Promise<RiskScreeningResponse> {
//   const response = await api.post<RiskScreeningResponse>('/risk-screening', payload);
//   return response.data;
// }

/**
 * Submit risk screening answers.
 * BACKEND REQUIRED: POST /risk-screening
 *
 * Currently stores answers in session/local state only.
 * No data is sent to the backend until the endpoint is implemented.
 */
export async function submitRiskScreening(
  payload: RiskScreeningPayload
): Promise<{ local: true; patient_id: string; answers: RiskScreeningAnswers }> {
  // PLACEHOLDER: returns the submitted data as-is
  // Replace with real API call when backend is available
  return {
    local: true,
    patient_id: payload.patient_id,
    answers: payload.answers,
  };
}
