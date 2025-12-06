'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function ProtectedRoute({ children, enabled = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (enabled && !loading && !user) {
      router.push('/');
    }
  }, [enabled, user, loading, router]);

  if (enabled && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (enabled && !user) {
    return null;
  }

  return <>{children}</>;
}
