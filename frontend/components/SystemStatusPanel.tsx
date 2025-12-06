import { THEME } from '@/lib/theme';

interface SystemStatusPanelProps {
  activeTickets: number;
  completedTickets: number;
  logsThisWeek: number;
  lastUpdate: string;
}

export function SystemStatusPanel({
  activeTickets,
  completedTickets,
  logsThisWeek,
  lastUpdate,
}: SystemStatusPanelProps) {
  return (
    <div className="space-y-8 md:space-y-12">
      <div>
        <div
          className="text-5xl md:text-6xl font-light mb-3"
          style={{ color: THEME.colors.accent.primary }}
        >
          {activeTickets}
        </div>
        <div
          className="text-sm font-mono tracking-wider"
          style={{ color: THEME.colors.accent.primary }}
        >
          ACTIVE
        </div>
      </div>

      <div
        className="h-px"
        style={{ backgroundColor: THEME.colors.border.hairline }}
      />

      <div>
        <div
          className="text-5xl md:text-6xl font-light mb-3"
          style={{ color: THEME.colors.text.primary }}
        >
          {completedTickets}
        </div>
        <div
          className="text-sm font-mono tracking-wider"
          style={{ color: THEME.colors.text.muted }}
        >
          COMPLETED
        </div>
      </div>

      <div
        className="h-px"
        style={{ backgroundColor: THEME.colors.border.hairline }}
      />

      <div>
        <div
          className="text-5xl md:text-6xl font-light mb-3"
          style={{ color: THEME.colors.text.primary }}
        >
          {logsThisWeek}
        </div>
        <div
          className="text-sm font-mono tracking-wider"
          style={{ color: THEME.colors.text.muted }}
        >
          LOGS THIS WEEK
        </div>
      </div>

      <div
        className="h-px"
        style={{ backgroundColor: THEME.colors.border.hairline }}
      />

      <div>
        <div
          className="text-sm mb-3"
          style={{ color: THEME.colors.text.secondary }}
        >
          {lastUpdate}
        </div>
        <div
          className="text-sm font-mono tracking-wider"
          style={{ color: THEME.colors.text.muted }}
        >
          LAST UPDATE
        </div>
      </div>
    </div>
  );
}
