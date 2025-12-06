'use client';

import { AuthProvider } from '@/lib/auth/AuthContext';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
