'use client';

import { useState } from 'react';
import { TechnologySelector } from '@/components/TechnologySelector';
import { THEME } from '@/lib/theme';
import { Ticket } from '@/lib/types';

interface TicketFormProps {
  ticket?: Ticket;
}

export function TicketForm({ ticket }: TicketFormProps) {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    ticket?.technologies || []
  );

  return (
    <div className="space-y-6">
      <div>
        <label
          className="block text-xs font-mono uppercase tracking-wider mb-2"
          style={{ color: THEME.colors.text.secondary }}
        >
          Title
        </label>
        <input
          type="text"
          defaultValue={ticket?.title}
          placeholder="Enter ticket title"
          className="w-full px-4 py-3 text-sm"
          style={{
            backgroundColor: THEME.colors.surface.elevated,
            color: THEME.colors.text.primary,
            border: `1px solid ${THEME.colors.border.subtle}`,
            borderRadius: THEME.borderRadius.input,
          }}
        />
      </div>

      <div>
        <label
          className="block text-xs font-mono uppercase tracking-wider mb-2"
          style={{ color: THEME.colors.text.secondary }}
        >
          Slug
        </label>
        <input
          type="text"
          defaultValue={ticket?.slug}
          placeholder="url-friendly-slug"
          className="w-full px-4 py-3 text-sm"
          style={{
            backgroundColor: THEME.colors.surface.elevated,
            color: THEME.colors.text.primary,
            border: `1px solid ${THEME.colors.border.subtle}`,
            borderRadius: THEME.borderRadius.input,
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-xs font-mono uppercase tracking-wider mb-2"
            style={{ color: THEME.colors.text.secondary }}
          >
            Status
          </label>
          <select
            defaultValue={ticket?.status || 'ACTIVE'}
            className="w-full px-4 py-3 text-sm"
            style={{
              backgroundColor: THEME.colors.surface.elevated,
              color: THEME.colors.text.primary,
              border: `1px solid ${THEME.colors.border.subtle}`,
              borderRadius: THEME.borderRadius.input,
            }}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>

        <div>
          <label
            className="block text-xs font-mono uppercase tracking-wider mb-2"
            style={{ color: THEME.colors.text.secondary }}
          >
            Visibility
          </label>
          <select
            defaultValue={ticket?.isPublic === false ? 'private' : 'public'}
            className="w-full px-4 py-3 text-sm"
            style={{
              backgroundColor: THEME.colors.surface.elevated,
              color: THEME.colors.text.primary,
              border: `1px solid ${THEME.colors.border.subtle}`,
              borderRadius: THEME.borderRadius.input,
            }}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-xs font-mono uppercase tracking-wider mb-2"
            style={{ color: THEME.colors.text.secondary }}
          >
            Start Date
          </label>
          <input
            type="date"
            defaultValue={ticket?.startDate}
            className="w-full px-4 py-3 text-sm"
            style={{
              backgroundColor: THEME.colors.surface.elevated,
              color: THEME.colors.text.primary,
              border: `1px solid ${THEME.colors.border.subtle}`,
              borderRadius: THEME.borderRadius.input,
            }}
          />
        </div>

        <div>
          <label
            className="block text-xs font-mono uppercase tracking-wider mb-2"
            style={{ color: THEME.colors.text.secondary }}
          >
            End Date
          </label>
          <input
            type="date"
            defaultValue={ticket?.endDate || ''}
            className="w-full px-4 py-3 text-sm"
            style={{
              backgroundColor: THEME.colors.surface.elevated,
              color: THEME.colors.text.primary,
              border: `1px solid ${THEME.colors.border.subtle}`,
              borderRadius: THEME.borderRadius.input,
            }}
          />
        </div>
      </div>

      <div>
        <label
          className="block text-xs font-mono uppercase tracking-wider mb-2"
          style={{ color: THEME.colors.text.secondary }}
        >
          Background
        </label>
        <textarea
          defaultValue={ticket?.background}
          placeholder="Describe the project background and context"
          rows={4}
          className="w-full px-4 py-3 text-sm"
          style={{
            backgroundColor: THEME.colors.surface.elevated,
            color: THEME.colors.text.primary,
            border: `1px solid ${THEME.colors.border.subtle}`,
            borderRadius: THEME.borderRadius.input,
          }}
        />
      </div>

      <div>
        <label
          className="block text-xs font-mono uppercase tracking-wider mb-2"
          style={{ color: THEME.colors.text.secondary }}
        >
          Technologies
        </label>
        <TechnologySelector
          selectedTechnologies={selectedTechnologies}
          onChange={setSelectedTechnologies}
        />
      </div>

      {ticket?.learned !== undefined && (
        <div>
          <label
            className="block text-xs font-mono uppercase tracking-wider mb-2"
            style={{ color: THEME.colors.text.secondary }}
          >
            What I Learned
          </label>
          <textarea
            defaultValue={ticket.learned}
            rows={3}
            className="w-full px-4 py-3 text-sm"
            style={{
              backgroundColor: THEME.colors.surface.elevated,
              color: THEME.colors.text.primary,
              border: `1px solid ${THEME.colors.border.subtle}`,
              borderRadius: THEME.borderRadius.input,
            }}
          />
        </div>
      )}

      {ticket?.roadblocksSummary && (
        <div>
          <label
            className="block text-xs font-mono uppercase tracking-wider mb-2"
            style={{ color: THEME.colors.text.secondary }}
          >
            Roadblocks Summary
          </label>
          <textarea
            defaultValue={ticket.roadblocksSummary}
            rows={3}
            className="w-full px-4 py-3 text-sm"
            style={{
              backgroundColor: THEME.colors.surface.elevated,
              color: THEME.colors.text.primary,
              border: `1px solid ${THEME.colors.border.subtle}`,
              borderRadius: THEME.borderRadius.input,
            }}
          />
        </div>
      )}

      {ticket?.metricsSummary && (
        <div>
          <label
            className="block text-xs font-mono uppercase tracking-wider mb-2"
            style={{ color: THEME.colors.text.secondary }}
          >
            Metrics Summary
          </label>
          <textarea
            defaultValue={ticket.metricsSummary}
            rows={2}
            className="w-full px-4 py-3 text-sm"
            style={{
              backgroundColor: THEME.colors.surface.elevated,
              color: THEME.colors.text.primary,
              border: `1px solid ${THEME.colors.border.subtle}`,
              borderRadius: THEME.borderRadius.input,
            }}
          />
        </div>
      )}
    </div>
  );
}
