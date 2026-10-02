// ==========================================
// AUTH SERVICE
// STATUS: BACKEND AUTH ENDPOINTS NOT IMPLEMENTED
//
// The backend does NOT currently have authentication.
// This file provides the interface ready for wiring.
// See BACKEND_INTEGRATION.md for the proposed contract.
// ==========================================

import type { LoginRequest, SignupRequest, AuthUser } from '../types';

// TODO: Replace with real API calls when auth backend is implemented
// import api from './api';

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

/**
 * Log in a user.
 * BACKEND REQUIRED: POST /auth/login
 */
export async function login(_credentials: LoginRequest): Promise<AuthTokenResponse> {
  // PLACEHOLDER: always rejects since backend doesn't exist
  // Replace with:
  //   const response = await api.post<AuthTokenResponse>('/auth/login', credentials);
  //   return response.data;
  throw {
    message: 'Authentication is not yet implemented. The backend requires POST /auth/login.',
    isBackendMissing: true,
  };
}

/**
 * Sign up a new user.
 * BACKEND REQUIRED: POST /auth/signup
 */
export async function signup(_data: SignupRequest): Promise<AuthTokenResponse> {
  // PLACEHOLDER
  // Replace with:
  //   const response = await api.post<AuthTokenResponse>('/auth/signup', data);
  //   return response.data;
  throw {
    message: 'Registration is not yet implemented. The backend requires POST /auth/signup.',
    isBackendMissing: true,
  };
}

/**
 * Get current authenticated user.
 * BACKEND REQUIRED: GET /auth/me
 */
export async function getMe(): Promise<AuthUser> {
  throw {
    message: 'Authentication is not yet implemented.',
    isBackendMissing: true,
  };
}

/**
 * Log out the current user.
 * BACKEND REQUIRED: POST /auth/logout
 */
export async function logout(): Promise<void> {
  // When implemented, also clear stored token:
  // sessionStorage.removeItem('sg_token');
  // await api.post('/auth/logout');
}
