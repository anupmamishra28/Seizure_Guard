import React, { useState, useEffect } from 'react';
import { Server, Brain, Activity, CheckCircle, XCircle, Database, Cpu } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { checkHealth } from '../services/api';

export function SettingsPage() {
  const [apiHealth, setApiHealth] = useState<'checking' | 'healthy' | 'error'>('checking');

  useEffect(() => {
    let mounted = true;
    checkHealth()
      .then((isHealthy: boolean) => {
        if (mounted) setApiHealth(isHealthy ? 'healthy' : 'error');
      })
      .catch(() => {
        if (mounted) setApiHealth('error');
      });
    return () => { mounted = false; };
  }, []);

  const endpoints = [
    { method: 'POST', path: '/predict', status: 'active' },
    { method: 'POST', path: '/patients', status: 'active' },
    { method: 'GET', path: '/patients/{id}', status: 'active' },
    { method: 'GET', path: '/history/{patient_id}', status: 'active' },
  ];

  const mlInfo = [
    { label: 'Model Type', value: 'Random Forest' },
    { label: 'Input Features', value: '24 Extraction Points' },
    { label: 'Model File', value: 'seizure_rf_model.pkl' },
    { label: 'Framework', value: 'scikit-learn' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Settings' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure application preferences and view system status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* API Connection Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'var(--glass-bg-base)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div
            className="flex items-center gap-3 mb-6 pb-4"
            style={{ borderBottom: '1px solid var(--glass-bg-hover)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee' }}
            >
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-[color:var(--text-main)] text-sm">API Connection</h2>
              <p className="text-xs text-[color:var(--text-muted)]">FastAPI Backend Status</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Status row */}
            <div
              className="flex items-center justify-between p-3.5 rounded-xl"
              style={{ background: 'var(--glass-bg-base)', border: '1px solid var(--glass-bg-hover)' }}
            >
              <div>
                <p className="text-sm font-medium text-[color:var(--text-main)]">Status</p>
                <p className="text-xs text-[color:var(--text-muted)] mt-0.5 font-mono">
                  {(import.meta as any).env.VITE_API_URL || 'http://localhost:8000'}
                </p>
              </div>
              <div>
                {apiHealth === 'checking' && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'var(--glass-bg-hover)', color: '#94a3b8', border: '1px solid var(--glass-border-strong)' }}
                  >
                    <Activity className="w-3 h-3 animate-pulse" />
                    Checking...
                  </span>
                )}
                {apiHealth === 'healthy' && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}
                  >
                    <CheckCircle className="w-3 h-3" />
                    Connected
                  </span>
                )}
                {apiHealth === 'error' && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}
                  >
                    <XCircle className="w-3 h-3" />
                    Offline
                  </span>
                )}
              </div>
            </div>

            {/* Endpoints */}
            <div>
              <p className="text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wider mb-2">Available Endpoints</p>
              <div className="space-y-1.5">
                {endpoints.map((ep) => (
                  <div
                    key={ep.path}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ background: 'var(--glass-bg-light)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                        style={{
                          background: ep.method === 'POST' ? 'rgba(6,182,212,0.15)' : 'rgba(139,92,246,0.15)',
                          color: ep.method === 'POST' ? '#22d3ee' : '#a78bfa',
                        }}
                      >
                        {ep.method}
                      </span>
                      <code className="text-xs text-[color:var(--text-muted)] font-mono">{ep.path}</code>
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: '#34d399' }}
                    >
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ML Model Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'var(--glass-bg-base)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div
            className="flex items-center gap-3 mb-6 pb-4"
            style={{ borderBottom: '1px solid var(--glass-bg-hover)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}
            >
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-[color:var(--text-main)] text-sm">ML Model Information</h2>
              <p className="text-xs text-[color:var(--text-muted)]">Prediction Engine Details</p>
            </div>
          </div>

          <div className="space-y-3">
            {mlInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3.5 rounded-xl"
                style={{ background: 'var(--glass-bg-base)', border: '1px solid var(--glass-bg-hover)' }}
              >
                <p className="text-xs text-[color:var(--text-muted)]">{item.label}</p>
                <p className="text-xs font-semibold text-[color:var(--text-main)] font-mono">{item.value}</p>
              </div>
            ))}

            {/* Model accuracy indicator */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[color:var(--text-muted)] font-medium">Model Accuracy</p>
                <p className="text-xs font-bold" style={{ color: '#22d3ee' }}>98.3%</p>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--glass-border)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: '98.3%',
                    background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
                    boxShadow: '0 0 8px rgba(6,182,212,0.5)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
