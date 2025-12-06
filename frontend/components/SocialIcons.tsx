'use client';

import { Linkedin, Mail, Github } from 'lucide-react';
import { THEME } from '@/lib/theme';

export function SocialIcons() {
  return (
    <div className="flex items-center gap-3">
      <a
        href="https://www.linkedin.com/in/coreyroach"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-9 h-9 transition-all"
        style={{
          border: `1px solid ${THEME.colors.border.subtle}`,
          color: THEME.colors.text.secondary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = THEME.colors.border.primary;
          e.currentTarget.style.color = THEME.colors.accent.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = THEME.colors.border.subtle;
          e.currentTarget.style.color = THEME.colors.text.secondary;
        }}
        aria-label="LinkedIn"
      >
        <Linkedin size={18} />
      </a>
      <a
        href="https://github.com/coreyroach"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-9 h-9 transition-all"
        style={{
          border: `1px solid ${THEME.colors.border.subtle}`,
          color: THEME.colors.text.secondary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = THEME.colors.border.primary;
          e.currentTarget.style.color = THEME.colors.accent.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = THEME.colors.border.subtle;
          e.currentTarget.style.color = THEME.colors.text.secondary;
        }}
        aria-label="GitHub"
      >
        <Github size={18} />
      </a>
      <a
        href="mailto:corey.roach@gmail.com"
        className="flex items-center justify-center w-9 h-9 transition-all"
        style={{
          border: `1px solid ${THEME.colors.border.subtle}`,
          color: THEME.colors.text.secondary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = THEME.colors.border.primary;
          e.currentTarget.style.color = THEME.colors.accent.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = THEME.colors.border.subtle;
          e.currentTarget.style.color = THEME.colors.text.secondary;
        }}
        aria-label="Email"
      >
        <Mail size={18} />
      </a>
    </div>
  );
}
