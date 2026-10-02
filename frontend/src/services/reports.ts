// ==========================================
// REPORTS SERVICE
// STATUS: BACKEND REPORT ENDPOINT NOT IMPLEMENTED
//
// The backend does NOT currently have a reports endpoint.
// Reports are generated client-side from prediction + patient data.
// See BACKEND_INTEGRATION.md for the proposed contract.
// ==========================================

// TODO: Connect when GET /reports/{prediction_id} is implemented
// import api from './api';

export interface ReportData {
  prediction_id: number;
  patient: {
    patient_id: string;
    name: string;
    age: number;
    gender: string;
  };
  prediction: {
    result: string;
    confidence: number;
    risk_level?: string;
    timestamp: string;
  };
  risk_screening?: Record<string, unknown>;
  eeg_features?: number[];
}

/**
 * Get report for a prediction.
 * BACKEND REQUIRED: GET /reports/{prediction_id}
 *
 * Currently, the report page is assembled client-side from
 * patient details + history data. No dedicated endpoint exists.
 */
export async function getReport(_predictionId: string): Promise<ReportData> {
  throw {
    message: 'Report endpoint not yet implemented. See BACKEND_INTEGRATION.md.',
    isBackendMissing: true,
  };
}
