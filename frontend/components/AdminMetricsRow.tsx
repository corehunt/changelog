'use client';

import { THEME } from '@/lib/theme';

interface Metric {
  label: string;
  value: number;
}

interface AdminMetricsRowProps {
  metrics: Metric[];
}

export function AdminMetricsRow({ metrics }: AdminMetricsRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="py-6"
          style={{
            borderBottom: `1px solid ${THEME.colors.border.hairline}`,
          }}
        >
          <div
            className="text-5xl font-mono font-light mb-2"
            style={{ color: THEME.colors.text.primary }}
          >
            {metric.value}
          </div>
          <div
            className="text-xs font-mono uppercase tracking-wider"
            style={{ color: THEME.colors.text.secondary }}
          >
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}
