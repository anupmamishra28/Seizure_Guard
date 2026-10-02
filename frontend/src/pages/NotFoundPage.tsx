import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Brain } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-gradient)' }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="relative z-10 text-center animate-fade-in">
        {/* 404 display */}
        <div className="mb-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'rgba(6,182,212,0.08)',
              border: '1px solid rgba(6,182,212,0.2)',
            }}
          >
            <Brain className="w-10 h-10 text-cyan-400" strokeWidth={1.5} />
          </div>
          <div
            className="text-8xl font-black leading-none tracking-tighter mb-2"
            style={{
              background: 'linear-gradient(135deg, #67e8f9, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[color:var(--text-main)] mb-3">Page Not Found</h1>
        <p className="text-[color:var(--text-muted)] text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or navigate back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to="/dashboard"
            className="btn-primary"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
