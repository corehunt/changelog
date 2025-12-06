import { ReactNode } from 'react';
import { THEME } from '@/lib/theme';

interface SectionCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, children, className = '' }: SectionCardProps) {
  return (
    <div
      className={`p-6 md:p-8 ${className}`}
      style={{
        backgroundColor: THEME.colors.surface.primary,
        borderRadius: THEME.borderRadius.card,
        border: `1px solid ${THEME.colors.border.subtle}`,
      }}
    >
      {title && (
        <h2
          className="text-xl md:text-2xl font-mono font-semibold mb-6"
          style={{ color: THEME.colors.text.primary }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
