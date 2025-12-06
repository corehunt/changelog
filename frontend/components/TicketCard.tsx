'use client';

import Link from 'next/link';
import { Ticket } from '@/lib/types';
import { THEME } from '@/lib/theme';
import { Calendar, Lock, Globe } from 'lucide-react';
import { useState } from 'react';

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColor = ticket.status === 'ACTIVE'
    ? THEME.colors.status.active
    : THEME.colors.status.completed;

  return (
    <Link href={`/tickets/${ticket.slug}`}>
      <div
        className="p-6 transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: THEME.colors.surface.primary,
          borderRadius: THEME.borderRadius.card,
          border: `1px solid ${THEME.colors.border.primary}`,
          boxShadow: isHovered ? THEME.shadows.cardHover : THEME.shadows.card,
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start justify-between mb-4 gap-3">
          <h3
            className="text-lg md:text-xl font-mono font-semibold flex-1 min-w-0"
            style={{ color: THEME.colors.text.primary }}
          >
            {ticket.title}
          </h3>
          <span
            className="px-3 py-1 text-xs font-mono font-medium rounded-full flex-shrink-0"
            style={{
              backgroundColor: `${statusColor}20`,
              color: statusColor,
            }}
          >
            {ticket.status}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} style={{ color: THEME.colors.text.muted }} />
            <span
              className="text-xs sm:text-sm font-mono"
              style={{ color: THEME.colors.text.secondary }}
            >
              {new Date(ticket.startDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
              {ticket.endDate && ` - ${new Date(ticket.endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {ticket.isPublic ? (
              <Globe size={14} style={{ color: THEME.colors.status.public }} />
            ) : (
              <Lock size={14} style={{ color: THEME.colors.status.private }} />
            )}
            <span
              className="text-xs font-mono"
              style={{ color: ticket.isPublic ? THEME.colors.status.public : THEME.colors.status.private }}
            >
              {ticket.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {ticket.technologies.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-mono"
              style={{
                backgroundColor: THEME.colors.surface.elevated,
                color: THEME.colors.text.secondary,
                borderRadius: THEME.borderRadius.input,
                border: `1px solid ${THEME.colors.border.subtle}`,
              }}
            >
              {tech}
            </span>
          ))}
          {ticket.technologies.length > 5 && (
            <span
              className="px-2 py-1 text-xs font-mono"
              style={{
                color: THEME.colors.text.muted,
              }}
            >
              +{ticket.technologies.length - 5} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
