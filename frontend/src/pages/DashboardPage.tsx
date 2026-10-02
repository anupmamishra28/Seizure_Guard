import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Plus, Brain, AlertCircle, Zap, ArrowRight,
  Users, TrendingUp, Clock, Shield, ChevronRight
} from 'lucide-react';

// Animated waveform SVG
function WaveformLine({ color = '#06b6d4', delay = 0 }: { color?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 120 40" className="w-full h-8" fill="none">
      <polyline
        points="0,20 10,10 20,30 30,5 40,25 50,15 60,28 70,8 80,22 90,12 100,26 110,14 120,20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 300,
          strokeDashoffset: 0,
          animation: `dashAnimate 3s linear infinite`,
          animationDelay: `${delay}s`,
        }}
      />
    </svg>
  );
}

const METRIC_CARDS = [
  {
    label: 'EEG Sessions',
    sublabel: 'This month',
    value: '247',
    unit: 'total',
    icon: <Activity className="w-4 h-4" />,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.2)',
    wave: '#f97316',
  },
  {
    label: 'Seizure Risk Score',
    sublabel: 'AI Confidence',
    value: '92',
    unit: '%',
    icon: <Brain className="w-4 h-4" />,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.2)',
    wave: '#8b5cf6',
  },
  {
    label: 'Alert Level',
    sublabel: 'Current status',
    value: 'Low',
    unit: '',
    icon: <Shield className="w-4 h-4" />,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.2)',
    wave: '#06b6d4',
  },
];

const QUICK_ACTIONS = [
  {
    label: 'Add Patient',
    description: 'Register a new patient profile',
    icon: <Plus className="w-5 h-5" />,
    href: '/patients/new',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.3)',
  },
  {
    label: 'EEG Analysis',
    description: 'Run AI-powered EEG prediction',
    icon: <Brain className="w-5 h-5" />,
    href: '/eeg',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.3)',
  },
  {
    label: 'View History',
    description: 'Browse past analysis results',
    icon: <Clock className="w-5 h-5" />,
    href: '/history',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.3)',
  },
  {
    label: 'Reports',
    description: 'Generate clinical reports',
    icon: <TrendingUp className="w-5 h-5" />,
    href: '/reports',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.3)',
  },
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      {/* Top section: Hero banner */}
      <div
        className="relative overflow-hidden rounded-3xl p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(10,15,30,0.8) 100%)',
          border: '1px solid rgba(6,182,212,0.15)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Sparkle dots */}
        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(6,182,212,0.8)' }} />
        <div className="absolute top-10 right-16 w-1 h-1 rounded-full bg-purple-400 animate-pulse delay-300" style={{ boxShadow: '0 0 6px rgba(139,92,246,0.8)' }} />
        <div className="absolute bottom-6 right-8 w-1 h-1 rounded-full bg-cyan-400 animate-pulse delay-500" style={{ boxShadow: '0 0 6px rgba(6,182,212,0.8)' }} />

        <div className="relative z-10 max-w-2xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-5"
            style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', color: '#22d3ee' }}
          >
            <Zap className="w-3 h-3" />
            AI-Powered EEG Intelligence
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-3">
            <span className="text-[color:var(--text-main)]">Brain health</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #67e8f9, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              overview
            </span>
          </h1>

          <p className="text-[color:var(--text-muted)] text-sm leading-relaxed mb-6 max-w-md">
            Real-time EEG insights, personalized seizure risk assessment, and full control over your patient analysis workflow.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/eeg')}
              className="btn-primary"
              style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingTop: '0.625rem', paddingBottom: '0.625rem' }}
            >
              EEG Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/patients/new')}
              className="btn-secondary"
              style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingTop: '0.625rem', paddingBottom: '0.625rem' }}
            >
              Add Patient
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right side decorative brain/waveform */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block opacity-40 pointer-events-none">
          <div className="relative">
            <Brain
              className="w-32 h-32 text-cyan-400 animate-float"
              strokeWidth={0.8}
              style={{ filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.5))' }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(ellipse, rgba(6,182,212,0.1) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Live Health Pulse — Metric cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(6,182,212,0.8)' }} />
          <h2 className="text-sm font-semibold text-[color:var(--text-muted)] uppercase tracking-widest">Live EEG Pulse</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {METRIC_CARDS.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 relative overflow-hidden group cursor-pointer transition-all duration-300"
              style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
                backdropFilter: 'blur(20px)',
              }}
              onClick={() => navigate('/eeg')}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at center, ${card.bg} 0%, transparent 70%)` }}
              />

              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div style={{ color: card.color }}>{card.icon}</div>
                    <span className="text-xs font-semibold" style={{ color: card.color }}>{card.label}</span>
                  </div>
                  <span className="text-xs text-[color:var(--text-muted)]">{card.sublabel}</span>
                </div>
              </div>

              <div className="flex items-end gap-1 mb-3">
                <span className="text-3xl font-bold text-[color:var(--text-main)]">{card.value}</span>
                {card.unit && <span className="text-base font-medium text-[color:var(--text-muted)] mb-1">{card.unit}</span>}
              </div>

              {/* Waveform */}
              <div className="opacity-60">
                <WaveformLine color={card.wave} delay={i * 0.5} />
              </div>
            </div>
          ))}

          {/* Stats */}
          <div
            className="rounded-2xl p-5 flex flex-col justify-center gap-4 sm:col-span-0"
            style={{
              background: 'var(--glass-bg-light)',
              border: '1px solid var(--glass-bg-hover)',
            }}
          >
            <div>
              <div
                className="text-4xl font-bold"
                style={{ background: 'linear-gradient(135deg, #67e8f9, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                98<span className="text-2xl">%</span>
              </div>
              <div className="text-xs text-[color:var(--text-muted)] mt-1">AI Accuracy</div>
            </div>
            <div className="w-12 h-px" style={{ background: 'var(--glass-border)' }} />
            <div>
              <div className="text-4xl font-bold text-[color:var(--text-main)]">
                500<span className="text-2xl text-[color:var(--text-muted)]">+</span>
              </div>
              <div className="text-xs text-[color:var(--text-muted)] mt-1">Analyses Run</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions grid */}
      <div>
        <h2 className="text-sm font-semibold text-[color:var(--text-muted)] uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.href)}
              className="group rounded-2xl p-4 text-left transition-all duration-300 relative overflow-hidden"
              style={{
                background: 'var(--glass-bg-base)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = `rgba(${action.color === '#06b6d4' ? '6,182,212' : action.color === '#8b5cf6' ? '139,92,246' : action.color === '#f97316' ? '249,115,22' : '16,185,129'},0.08)`;
                (e.currentTarget as HTMLElement).style.borderColor = `${action.color}33`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--glass-bg-base)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
                style={{ background: `${action.color}20`, color: action.color }}
              >
                {action.icon}
              </div>
              <p className="text-sm font-semibold text-[color:var(--text-main)] mb-1">{action.label}</p>
              <p className="text-xs text-[color:var(--text-muted)] leading-relaxed">{action.description}</p>
              <ChevronRight
                className="absolute bottom-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1"
                style={{ color: action.color }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Backend integration notice */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}
      >
        <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[color:var(--text-muted)] leading-relaxed">
          <strong className="text-[color:var(--text-muted)]">Backend integration note:</strong>{' '}
          Dashboard statistics require additional backend endpoints. Current endpoints (POST /patients, GET /patients/&#123;id&#125;, POST /predict, GET /history/&#123;id&#125;) are all connected. Use the sidebar navigation to interact with them.
        </div>
      </div>
    </div>
  );
}
