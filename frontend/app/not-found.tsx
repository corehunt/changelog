'use client';

import Link from 'next/link';
import { THEME } from '@/lib/theme';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: THEME.colors.background.primary }}
    >
      <div className="max-w-2xl w-full space-y-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <div
              className="text-[120px] sm:text-[180px] md:text-[220px] font-mono font-light leading-none tracking-tighter"
              style={{
                color: THEME.colors.text.primary,
                opacity: 0.6
              }}
            >
              404
            </div>
            <div
              className="h-px w-24"
              style={{ backgroundColor: THEME.colors.accent.primary }}
            />
          </div>

          <div className="space-y-4 max-w-lg">
            <h1
              className="text-2xl sm:text-3xl font-light tracking-tight"
              style={{ color: THEME.colors.text.primary }}
            >
              Page not found
            </h1>
            <p
              className="text-base leading-relaxed"
              style={{ color: THEME.colors.text.secondary }}
            >
              The page you're looking for doesn't exist. It may have been moved, deleted, or the URL might be incorrect.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 px-6 py-4 text-sm tracking-wide transition-all duration-300"
            style={{
              backgroundColor: THEME.colors.surface.elevated,
              color: THEME.colors.text.primary,
              border: `1px solid ${THEME.colors.border.subtle}`,
            }}
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Return home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-3 px-6 py-4 text-sm tracking-wide transition-all duration-300 hover:opacity-70"
            style={{
              backgroundColor: THEME.colors.surface.primary,
              color: THEME.colors.text.secondary,
              border: `1px solid ${THEME.colors.border.hairline}`,
            }}
          >
            <span>Go back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
