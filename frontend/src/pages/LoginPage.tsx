import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, AlertCircle, Eye, EyeOff, Zap, Brain, Shield } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// NOTE: Backend authentication (POST /auth/login) is not yet implemented.
// This page is UI-ready. See BACKEND_INTEGRATION.md.

export function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [backendNote, setBackendNote] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 800));
      setBackendNote(true);
      setLoading(false);
    } catch {
      setLoading(false);
      toast.error('Login unavailable', 'Backend authentication is not yet implemented.');
    }
  }

  function handleDemoAccess() {
    localStorage.setItem('token', 'guest-mode');
    navigate('/dashboard');
  }

  const stats = [
    { icon: <Brain className="w-4 h-4" />, value: '98.3%', label: 'AI Accuracy' },
    { icon: <Zap className="w-4 h-4" />, value: '<2s', label: 'Analysis Time' },
    { icon: <Shield className="w-4 h-4" />, value: 'HIPAA', label: 'Compliant' },
  ];

  return (
    <div
      className="min-h-screen flex overflow-hidden relative"
      style={{ background: 'var(--bg-gradient)' }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              boxShadow: '0 0 20px rgba(6,182,212,0.5), 0 0 40px rgba(6,182,212,0.2)',
            }}
          >
            <Activity className="w-5 h-5 text-[color:var(--text-main)]" />
          </div>
          <span className="font-bold text-[color:var(--text-main)] text-lg tracking-tight">SeizureGuard</span>
        </div>

        {/* Hero text */}
        <div className="space-y-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.25)',
              color: '#22d3ee',
            }}
          >
            <Zap className="w-3 h-3" />
            AI-Powered Seizure Detection
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight">
            <span className="text-[color:var(--text-main)]">Intelligent</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #67e8f9, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              EEG Analysis
            </span>
            <br />
            <span className="text-[color:var(--text-main)]">starts with AI</span>
          </h1>

          <p className="text-[color:var(--text-muted)] text-base leading-relaxed max-w-sm">
            Real-time seizure prediction, personalized risk assessment, and full control over your EEG analysis workflow with our advanced AI platform.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 pt-2">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  {s.icon}
                  <span className="text-2xl font-bold">{s.value}</span>
                </div>
                <span className="text-xs text-[color:var(--text-muted)]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partner logos strip */}
        <div className="space-y-4">
          <p className="text-xs text-[color:var(--text-muted)] uppercase tracking-widest font-medium">Trusted by leading hospitals</p>
          <div className="flex items-center gap-6 opacity-30">
            {['Mayo Clinic', 'Johns Hopkins', 'Cleveland Clinic', 'UCSF'].map((name) => (
              <span key={name} className="text-xs font-semibold text-[color:var(--text-muted)] whitespace-nowrap">{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[400px] animate-fade-in">
          {/* Mobile logo */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}
            >
              <Activity className="w-6 h-6 text-[color:var(--text-main)]" />
            </div>
            <h1 className="text-xl font-bold text-[color:var(--text-main)]">SeizureGuard</h1>
            <p className="text-sm text-[color:var(--text-muted)] mt-1">Clinical EEG Analysis Platform</p>
          </div>

          {/* Form card */}
          <div
            className="rounded-3xl p-8"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--glass-border-strong)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 var(--glass-border)',
            }}
          >
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-[color:var(--text-main)] mb-1">Welcome back</h2>
              <p className="text-sm text-[color:var(--text-muted)]">Sign in to your clinical account</p>
            </div>

            {backendNote && (
              <div
                className="flex items-start gap-3 p-4 rounded-2xl mb-6"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}
              >
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-amber-300">Authentication not yet available</p>
                  <p className="text-amber-500/80 mt-1">
                    Use <strong>Continue as Guest</strong> to access the app.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div>
                <label htmlFor="login-email" className="form-label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    className={`form-input pl-10 ${errors.email ? 'border-red-500/50' : ''}`}
                    placeholder="clinician@hospital.org"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="login-password" className="form-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] hover:text-[color:var(--text-muted)] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full btn-lg mt-1"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : 'Sign in'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1" style={{ height: '1px', background: 'var(--glass-border)' }} />
              <span className="text-xs text-[color:var(--text-muted)]">or</span>
              <div className="flex-1" style={{ height: '1px', background: 'var(--glass-border)' }} />
            </div>

            <button
              onClick={handleDemoAccess}
              className="btn-secondary w-full btn-lg"
            >
              Continue as Guest
            </button>

            <p className="text-center text-sm text-[color:var(--text-muted)] mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-medium transition-colors" style={{ color: '#22d3ee' }}>
                Sign up
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-[color:var(--text-muted)] mt-6 leading-relaxed">
            SeizureGuard is a clinical support tool.<br />
            Results do not replace professional medical evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}
