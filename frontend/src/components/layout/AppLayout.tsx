import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '../common/Toast';

export function AppLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  /* Re-trigger page transition animation on route change */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.classList.remove('animate-page-enter');
    // Force reflow so the animation replays
    void el.offsetWidth;
    el.classList.add('animate-page-enter');
  }, [location.pathname]);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-gradient)' }}
    >
      {/* Ambient background orbs — opacity controlled by CSS variable */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
            opacity: 'var(--orb-opacity)',
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
            opacity: 'var(--orb-opacity)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 'var(--orb-opacity)',
          }}
        />
      </div>

      {/* App Container */}
      <div className="flex w-full h-full relative z-10">
        {/* Desktop Sidebar */}
        <Sidebar collapsed={true} onToggle={() => {}} />

        {/* Main content */}
        <div
          className="flex flex-col flex-1 min-w-0 overflow-hidden"
          style={{
            background: 'var(--bg-content)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Navbar />
          <main
            className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
            id="main-content"
            aria-label="Main content"
          >
            <div ref={mainRef} className="max-w-7xl mx-auto h-full animate-page-enter">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
