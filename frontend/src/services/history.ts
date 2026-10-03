import api from './api';
import type { HistoryRecord } from '../types';

// ==========================================
// HISTORY SERVICE
// Connected to:
//   GET /history           — all prediction records
//   GET /history/{patient_id} — records for a specific patient
//
// Response: { history: [ { id, patient_id, prediction, confidence, risk_level, timestamp } ] }
// ==========================================

interface HistoryResponse {
  history: HistoryRecord[];
}

/**
 * Get all prediction history.
 * GET /history
 */
export async function getAllHistory(): Promise<HistoryRecord[]> {
  const response = await api.get<HistoryResponse>('/history');
  return response.data.history;
}

/**
 * Get prediction history for a specific patient.
 * GET /history/{patient_id}
 */
export async function getHistory(patientId: string): Promise<HistoryRecord[]> {
  const response = await api.get<HistoryResponse>(`/history/${patientId}`);
  return response.data.history;
}
