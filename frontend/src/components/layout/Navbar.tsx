import React, { useState } from 'react';
import { Bell, User, Settings, LogOut, ChevronDown, Activity, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileSidebar } from './Sidebar';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      className="h-14 flex items-center px-4 sm:px-6 gap-4 z-30 flex-shrink-0"
      style={{
        background: 'var(--bg-navbar)',
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Mobile sidebar trigger */}
      <MobileSidebar />

      {/* Mobile brand */}
      <div className="flex items-center gap-2 lg:hidden">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 0 10px var(--glow-cyan)' }}
        >
          <Activity className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-sm text-[color:var(--text-primary)]">SeizureGuard</span>
      </div>

      {/* Desktop: Page context / search area */}
      <div className="hidden lg:flex flex-1 items-center gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
            style={{ boxShadow: '0 0 6px var(--glow-cyan)' }}
          />
          <span className="text-xs text-[color:var(--text-muted)] font-medium tracking-wide">LIVE MONITORING</span>
        </div>

        {/* Glow line separator */}
        <div className="h-4 w-px" style={{ background: 'var(--glass-border)' }} />

        <span className="text-xs text-[color:var(--text-muted)] font-mono">SeizureGuard AI Platform</span>
      </div>

      {/* Spacer for mobile */}
      <div className="flex-1 lg:hidden" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search - desktop only */}
        <button
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)] transition-all"
          style={{ background: 'var(--glass-bg-base)', border: '1px solid var(--glass-border)' }}
          aria-label="Search"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Quick search...</span>
          <kbd className="text-xs text-[color:var(--text-muted)] ml-1">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)] transition-all"
          style={{ background: 'var(--glass-bg-base)' }}
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {/* Notification dot */}
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400"
            style={{ boxShadow: '0 0 6px var(--glow-cyan)' }}
          />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)] transition-all"
            style={{ background: 'var(--glass-bg-base)', border: '1px solid var(--glass-border)' }}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="User menu"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(139,92,246,0.3))',
                border: '1px solid var(--border-accent)',
              }}
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="text-xs font-medium hidden sm:block text-[color:var(--text-secondary)]">Clinician</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              {/* Menu */}
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-2xl py-1.5 z-50 animate-fade-in"
                style={{
                  background: 'var(--bg-dropdown)',
                  border: '1px solid var(--glass-border-strong)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 0 1px var(--glass-border-strong)',
                }}
                role="menu"
              >
                {/* User info */}
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <p className="text-xs font-semibold text-[color:var(--text-primary)]">Dr. Clinician</p>
                  <p className="text-xs text-[color:var(--text-muted)] mt-0.5">clinician@hospital.org</p>
                </div>

                <div className="py-1.5">
                  <button
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors text-left"
                    style={{ background: 'transparent' }}
                    onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                    role="menuitem"
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--glass-bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Settings
                  </button>
                  <div className="my-1 mx-4" style={{ height: '1px', background: 'var(--glass-border)' }} />
                  <button
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs transition-colors text-left"
                    style={{ color: 'var(--color-danger-text)', background: 'transparent' }}
                    onClick={() => { setMenuOpen(false); localStorage.removeItem('token'); navigate('/login'); }}
                    role="menuitem"
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
