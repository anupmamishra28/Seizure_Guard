// ==========================================
// BACKEND-VERIFIED TYPES
// Sourced from: main.py, database.py
// ==========================================

// Patient — matches POST /patients and GET /patients/{patient_id}
export interface Patient {
  patient_id: string;
  name: string;
  age: number;
  gender: string;
}

// Prediction request — POST /predict
export interface PredictionRequest {
  patient_id: string;
  features: number[]; // exactly 24 floats
}

// Prediction response — POST /predict
// Backend returns: patient_id, prediction ("Seizure" | "No Seizure"),
// confidence (float 0–1), risk_level ("High" | "Moderate" | "Low")
export interface PredictionResponse {
  patient_id: string;
  prediction: 'Seizure' | 'No Seizure';
  confidence: number;
  risk_level: 'High' | 'Moderate' | 'Low';
}

// History record — GET /history/{patient_id}
// Backend returns id, patient_id, prediction, confidence, timestamp.
// risk_level is also in DB (Prediction table) but NOT returned by history endpoint.
export interface HistoryRecord {
  id: number;
  patient_id: string;
  prediction: string; // "1" or "0" as stored raw
  confidence: number;
  timestamp: string;
  risk_level?: string; // included if backend adds it later
}

// ==========================================
// FRONTEND-ONLY TYPES (not in backend yet)
// ==========================================

// Risk screening — frontend questionnaire only
// Backend endpoint does NOT exist yet (see BACKEND_INTEGRATION.md)
export interface RiskScreeningAnswers {
  previous_seizure_history: boolean | null;
  family_history_epilepsy: boolean | null;
  previous_neurological_disorder: boolean | null;
  anti_seizure_medication: boolean | null;
  previous_abnormal_eeg: boolean | null;
  recent_loss_of_consciousness: boolean | null;
  recent_unusual_movements: boolean | null;
  recent_sleep_deprivation: boolean | null;
  additional_notes: string;
}

// Auth types — backend auth endpoints not yet implemented
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// EEG feature names — verified from feature_extraction.py
export const EEG_FEATURE_NAMES: readonly string[] = [
  // Channel 1
  'ch1_mean', 'ch1_std', 'ch1_variance', 'ch1_minimum', 'ch1_maximum',
  'ch1_rms', 'ch1_energy', 'ch1_delta_power', 'ch1_theta_power',
  'ch1_alpha_power', 'ch1_beta_power', 'ch1_gamma_power',
  // Channel 2
  'ch2_mean', 'ch2_std', 'ch2_variance', 'ch2_minimum', 'ch2_maximum',
  'ch2_rms', 'ch2_energy', 'ch2_delta_power', 'ch2_theta_power',
  'ch2_alpha_power', 'ch2_beta_power', 'ch2_gamma_power',
] as const;

export type RiskLevel = 'High' | 'Moderate' | 'Low';

// API error shape
export interface ApiError {
  message: string;
  detail?: string | { msg: string; type: string }[];
  status?: number;
}
