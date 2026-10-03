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

// Prediction request — POST /predict (multipart/form-data)
// The actual request is sent as FormData, this interface describes the fields.
export interface PredictionRequest {
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  file: File;
}

// Prediction response — POST /predict
// Backend returns: patient_id, name, age, gender, prediction, confidence, risk_level
export interface PredictionResponse {
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  prediction: 'Seizure' | 'No Seizure';
  confidence: number;
  risk_level: 'High' | 'Moderate' | 'Low';
}

// History record — GET /history and GET /history/{patient_id}
// Backend returns { history: [...] } wrapper.
// Each record: id, patient_id, prediction, confidence, risk_level, timestamp.
export interface HistoryRecord {
  id: number;
  patient_id: string;
  prediction: string;
  confidence: number;
  risk_level: string;
  timestamp: string;
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

// Supported gender options for the prediction form
export const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;

export type RiskLevel = 'High' | 'Moderate' | 'Low';

// API error shape
export interface ApiError {
  message: string;
  detail?: string | { msg: string; type: string }[];
  status?: number;
}
