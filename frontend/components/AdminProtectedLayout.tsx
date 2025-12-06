'use client';

import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { AUTH_ENABLED } from '@/lib/auth/config';

export function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute enabled={AUTH_ENABLED}>
      {children}
    </ProtectedRoute>
  );
}
