'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from './api';
import { AUTH_ENABLED } from './config';

type ProtectedRouteProps = {
  enabled?: boolean;
  children: React.ReactNode;
};

export function ProtectedRoute({ enabled = true, children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(enabled); // if not enabled, we skip checks
  const [authorized, setAuthorized] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      // auth turned off – always allow
      setAuthorized(true);
      setChecking(false);
      return;
    }

    let cancelled = false;

    async function checkAuth() {
      setChecking(true);

      const user = await getCurrentUser();

      if (cancelled) return;

      if (user) {
        setAuthorized(true);
        setChecking(false);
      } else {
        // no valid user -> clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('changelog_token');
        }

        // optional: pass redirect param so login can send you back
        const searchParams = new URLSearchParams({ redirectTo: pathname || '/' });
        router.replace('/');
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [enabled, pathname, router]);

  if (!enabled) {
    return <>{children}</>;
  }

  if (checking) {
    // You can return a skeleton, spinner, or nothing.
    return null;
  }

  if (!authorized) {
    // We're in the process of redirecting; render nothing.
    return null;
  }

  return <>{children}</>;
}
