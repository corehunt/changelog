export const THEME = {
  colors: {
    background: {
      primary: '#000000',
      secondary: '#0A0A0A',
      tertiary: '#111111',
    },
    surface: {
      primary: 'rgba(255, 255, 255, 0.02)',
      secondary: 'rgba(255, 255, 255, 0.03)',
      elevated: 'rgba(255, 255, 255, 0.05)',
    },
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      subtle: 'rgba(255, 255, 255, 0.06)',
      hairline: 'rgba(255, 255, 255, 0.08)',
    },
    text: {
      primary: '#E5E5E5',
      secondary: '#A1A1A1',
      muted: '#737373',
      inverse: '#000000',
    },
    accent: {
      primary: '#10B981',
      hover: '#059669',
      muted: 'rgba(16, 185, 129, 0.2)',
    },
    status: {
      active: '#10B981',
      completed: '#3b82f6',
      private: '#A1A1A1',
      public: '#10B981',
    },
  },
  spacing: {
    section: '4rem',
    card: '2rem',
  },
  borderRadius: {
    card: '0',
    pill: '9999px',
    input: '0',
  },
  shadows: {
    card: 'none',
    cardHover: 'none',
  },
} as const;

export const ACCENT_COLOR = THEME.colors.accent.primary;
