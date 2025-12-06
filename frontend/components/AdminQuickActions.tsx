'use client';

import Link from 'next/link';
import { THEME } from '@/lib/theme';
import { Plus, List, Clock } from 'lucide-react';

export function AdminQuickActions() {
  const actions = [
    { label: 'Create new ticket', href: '/admin/tickets/new', icon: Plus },
    { label: 'Manage tickets', href: '/admin/tickets', icon: List },
    { label: 'View timeline', href: '/timeline', icon: Clock },
  ];

  return (
    <div className="mb-12">
      <h3
        className="text-xs font-mono uppercase tracking-wider mb-4"
        style={{ color: THEME.colors.text.secondary }}
      >
        Quick actions
      </h3>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono transition-colors"
              style={{
                color: THEME.colors.text.secondary,
                borderBottom: `1px solid ${THEME.colors.border.hairline}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = THEME.colors.text.primary;
                e.currentTarget.style.borderColor = THEME.colors.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = THEME.colors.text.secondary;
                e.currentTarget.style.borderColor = THEME.colors.border.hairline;
              }}
            >
              <Icon size={14} />
              {action.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
