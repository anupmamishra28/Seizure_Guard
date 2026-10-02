import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, AlertCircle, Eye, EyeOff, Zap } from 'lucide-react';

// NOTE: Backend POST /auth/signup is not yet implemented.
// This form is UI-ready. See BACKEND_INTEGRATION.md.

export function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    navigate('/login');
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'var(--bg-gradient)' }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              boxShadow: '0 0 20px rgba(6,182,212,0.5), 0 0 40px rgba(6,182,212,0.2)',
            }}
          >
            <Activity className="w-6 h-6 text-[color:var(--text-main)]" />
          </div>
          <h1 className="text-xl font-bold text-[color:var(--text-main)]">SeizureGuard</h1>
          <p className="text-sm text-[color:var(--text-muted)] mt-1">Clinical EEG Analysis Platform</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--glass-border-strong)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 var(--glass-border)',
          }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[color:var(--text-main)] mb-1">Create account</h2>
            <p className="text-sm text-[color:var(--text-muted)]">Join SeizureGuard to access EEG analysis tools</p>
          </div>

          {/* Backend notice */}
          <div
            className="flex items-start gap-3 p-3.5 rounded-2xl mb-6"
            style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}
          >
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-500/80">
              Registration requires backend auth (not yet available).{' '}
              <button
                onClick={() => { localStorage.setItem('token', 'guest-mode'); navigate('/dashboard'); }}
                className="underline text-amber-400 hover:text-amber-300 transition-colors"
              >
                Access as guest
              </button>
              .
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <label htmlFor="signup-name" className="form-label">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  className={`form-input pl-10 ${errors.name ? 'border-red-500/50' : ''}`}
                  placeholder="Dr. Jane Smith"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="signup-email" className="form-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="form-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] hover:text-[color:var(--text-muted)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="signup-confirm" className="form-label">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
                <input
                  id="signup-confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input pl-10 ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                />
              </div>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full btn-lg mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-[color:var(--text-muted)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium transition-colors" style={{ color: '#22d3ee' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
