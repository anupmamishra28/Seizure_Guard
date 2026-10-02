import api from './api';
import type { HistoryRecord } from '../types';

// ==========================================
// HISTORY SERVICE
// Connected to:
//   GET /history/{patient_id}
//
// Response array: { id, patient_id, prediction, confidence, timestamp }
// Note: risk_level is in DB but NOT returned by this endpoint currently.
// ==========================================

/**
 * Get prediction history for a patient.
 * GET /history/{patient_id}
 */
export async function getHistory(patientId: string): Promise<HistoryRecord[]> {
  const response = await api.get<HistoryRecord[]>(`/history/${patientId}`);
  return response.data;
}
