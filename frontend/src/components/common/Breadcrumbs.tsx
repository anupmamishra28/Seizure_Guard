import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 mb-5">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 transition-colors"
        style={{ color: '#475569' }}
        aria-label="Dashboard"
        onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
        onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: '#334155' }} aria-hidden="true" />
            {isLast || !item.href ? (
              <span
                className="text-sm"
                style={{ color: isLast ? '#94a3b8' : '#475569', fontWeight: isLast ? 500 : 400 }}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-sm transition-colors"
                style={{ color: '#475569' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
                onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
