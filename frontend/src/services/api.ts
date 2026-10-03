import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiError } from '../types';

// Base URL from environment — see .env.example
const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://127.0.0.1:8000';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000, // 60s — EDF file upload + processing may take longer
});

// Request interceptor — attach auth token when available
api.interceptors.request.use((config) => {
  // TODO: When auth backend is implemented, read token from secure storage
  // const token = sessionStorage.getItem('sg_token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred. Please try again.',
      status: error.response?.status,
    };

    if (!error.response) {
      apiError.message = 'Unable to reach the server. Please check that the backend is running.';
      return Promise.reject(apiError);
    }

    const status = error.response.status;
    const data = error.response.data as Record<string, unknown> | undefined;

    if (status === 400) {
      apiError.message = 'Invalid request. Please check the submitted data.';
    } else if (status === 401) {
      apiError.message = 'Authentication required. Please log in.';
    } else if (status === 403) {
      apiError.message = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      apiError.message = 'The requested record was not found.';
    } else if (status === 422) {
      // FastAPI validation errors
      apiError.message = 'Please check the entered information and try again.';
      if (data?.detail) {
        apiError.detail = data.detail as string | { msg: string; type: string }[];
      }
    } else if (status >= 500) {
      apiError.message = 'A server error occurred. Please try again later.';
    }

    return Promise.reject(apiError);
  }
);

export async function checkHealth(): Promise<boolean> {
  try {
    // Assuming GET / or /health exists. If not, this is a mock ping
    await api.get('/');
    return true;
  } catch (err: any) {
    if (err.status && err.status < 500) return true; // Backend is responding but returned 4xx
    return false;
  }
}

export default api;
