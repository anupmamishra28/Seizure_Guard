import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

// Main App Pages
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { NewPatientPage } from './pages/NewPatientPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { RiskScreeningPage } from './pages/RiskScreeningPage';
import { PredictionPage } from './pages/PredictionPage';
import { PredictionResultPage } from './pages/PredictionResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ThemeProvider } from './context/ThemeContext';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const RootRedirect = () => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/patients/new" element={<NewPatientPage />} />
              <Route path="/patients/:patientId" element={<PatientDetailPage />} />
              
              <Route path="/risk-screening/:patientId" element={<RiskScreeningPage />} />
              
              <Route path="/prediction/:patientId" element={<PredictionPage />} />
              <Route path="/prediction/:patientId/result" element={<PredictionResultPage />} />
              
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/history/:patientId" element={<HistoryPage />} />
              
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/:patientId" element={<ReportsPage />} />
              
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
