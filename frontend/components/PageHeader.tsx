import { THEME } from '@/lib/theme';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8 md:mb-12">
      <h1
        className="text-3xl md:text-4xl font-mono font-bold tracking-tight mb-2"
        style={{ color: THEME.colors.text.primary }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-base md:text-lg"
          style={{ color: THEME.colors.text.secondary }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
