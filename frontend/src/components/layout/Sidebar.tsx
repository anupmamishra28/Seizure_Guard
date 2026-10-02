import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  Users,
  Brain,
  History,
  FileText,
  Moon,
  Sun,
  Settings
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Patients',     href: '/patients',  icon: <Users className="w-5 h-5" /> },
  { label: 'EEG Analysis', href: '/eeg',       icon: <Brain className="w-5 h-5" /> },
  { label: 'History',      href: '/history',   icon: <History className="w-5 h-5" /> },
  { label: 'Reports',      href: '/reports',   icon: <FileText className="w-5 h-5" /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className="hidden lg:flex flex-col items-center h-full py-6 flex-shrink-0"
      style={{
        width: '72px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--glass-border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="mb-10 flex-shrink-0">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            boxShadow: '0 0 20px var(--glow-cyan), 0 0 40px rgba(6,182,212,0.1)',
          }}
        >
          <Activity className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full" aria-label="Main navigation">
        <ul className="flex flex-col items-center gap-2 px-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="w-full">
              <NavLink
                to={item.href}
                title={item.label}
                className={({ isActive }) =>
                  `flex items-center justify-center w-full h-10 rounded-xl transition-all duration-200 relative group
                  ${isActive
                    ? 'text-cyan-400'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active background */}
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: 'rgba(6,182,212,0.12)',
                          border: '1px solid rgba(6,182,212,0.25)',
                          boxShadow: '0 0 15px var(--glow-cyan)',
                        }}
                      />
                    )}
                    {/* Hover background */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'var(--glass-bg-hover)' }}
                    />
                    <span className="relative z-10">{item.icon}</span>
                    {/* Tooltip */}
                    <span
                      className="absolute left-full ml-3 px-2.5 py-1.5 text-xs font-medium text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50"
                      style={{
                        background: 'var(--accent-cyan)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 15px var(--glow-cyan)',
                      }}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-2 px-2 w-full">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          className="flex items-center justify-center w-full h-10 rounded-xl text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)] transition-all duration-200 relative group"
          style={{ background: 'transparent' }}
        >
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'var(--glass-bg-hover)' }}
          />
          <span className="relative z-10">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </span>
        </button>

        {/* Settings */}
        <NavLink
          to="/settings"
          title="Settings"
          className={({ isActive }) =>
            `flex items-center justify-center w-full h-10 rounded-xl transition-all duration-200 relative group
            ${isActive ? 'text-cyan-400' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)]'}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'rgba(6,182,212,0.12)',
                    border: '1px solid rgba(6,182,212,0.25)',
                  }}
                />
              )}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'var(--glass-bg-hover)' }}
              />
              <span className="relative z-10"><Settings className="w-5 h-5" /></span>
            </>
          )}
        </NavLink>

        {/* User avatar */}
        <div className="mt-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(139,92,246,0.3))',
              border: '1px solid var(--border-accent)',
            }}
          >
            <svg className="w-4 h-4 text-[color:var(--text-muted)] mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}

/** Mobile-only drawer sidebar */
export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)] transition-colors"
        aria-label="Open navigation menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          style={{ background: 'var(--bg-overlay)' }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:hidden
          transform transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--glass-border)',
          backdropFilter: 'blur(20px)',
        }}
        role="dialog"
        aria-label="Navigation menu"
      >
        <div
          className="flex items-center justify-between px-5 py-5"
          style={{ borderBottom: '1px solid var(--glass-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 0 15px var(--glow-cyan)' }}
            >
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[color:var(--text-primary)] text-sm">SeizureGuard</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)] transition-colors rounded-lg"
            style={{ background: 'transparent' }}
            aria-label="Close navigation menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="py-4 px-3" aria-label="Mobile navigation">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'text-cyan-400'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)]'
                    }`
                  }
                  style={({ isActive }) => isActive ? {
                    background: 'rgba(6,182,212,0.10)',
                    border: '1px solid rgba(6,182,212,0.2)',
                  } : {}}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ borderTop: '1px solid var(--glass-border)' }}
        >
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)] transition-colors"
            style={{ background: 'transparent' }}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </div>
    </>
  );
}
