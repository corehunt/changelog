'use client';

import { SectionCard } from '@/components/SectionCard';
import { PageHeader } from '@/components/PageHeader';
import { THEME } from '@/lib/theme';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SectionCard>
          <div className="text-center">
            <PageHeader title="ChangeLog" />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-6"
          >
            <div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 text-sm"
                placeholder="username"
                style={{
                  backgroundColor: THEME.colors.surface.elevated,
                  color: THEME.colors.text.primary,
                  border: `1px solid ${THEME.colors.border.primary}`,
                  borderRadius: THEME.borderRadius.input,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = THEME.colors.accent.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = THEME.colors.border.primary;
                }}
              />
            </div>

            <div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm"
                placeholder="password"
                style={{
                  backgroundColor: THEME.colors.surface.elevated,
                  color: THEME.colors.text.primary,
                  border: `1px solid ${THEME.colors.border.primary}`,
                  borderRadius: THEME.borderRadius.input,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = THEME.colors.accent.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = THEME.colors.border.primary;
                }}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 font-medium text-sm transition-all duration-200"
                style={{
                  backgroundColor: THEME.colors.accent.primary,
                  color: THEME.colors.text.inverse,
                  borderRadius: THEME.borderRadius.input,
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = THEME.colors.accent.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = THEME.colors.accent.primary;
                }}
              >
                Sign In
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
