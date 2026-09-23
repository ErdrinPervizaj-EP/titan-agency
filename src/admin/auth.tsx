/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { superAdminApi } from './api';
import type { SuperAdminUser } from './types';

interface AuthContextValue {
  user: SuperAdminUser | null;
  /** True until the initial session check resolves — avoids a flash-redirect to /admin/login. */
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ mfaRequired: boolean }>;
  completeMfa: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function SuperAdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SuperAdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const current = await superAdminApi.me().catch(() => null);
      if (!cancelled) {
        setUser(current);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(() => {
    superAdminApi.logout().catch(() => undefined);
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener('titandesk:super-admin-unauthorized', logout);
    return () => window.removeEventListener('titandesk:super-admin-unauthorized', logout);
  }, [logout]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login: async (email, password) => {
      const result = await superAdminApi.login(email, password);
      if (result.user) setUser(result.user);
      return { mfaRequired: result.mfaRequired };
    },
    completeMfa: async (code) => {
      setUser(await superAdminApi.completeMfa(code));
    },
    logout,
  }), [user, loading, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSuperAdminAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useSuperAdminAuth must be used inside SuperAdminAuthProvider');
  return value;
}

export function RequireSuperAdmin() {
  const { isAuthenticated, loading } = useSuperAdminAuth();
  const location = useLocation();
  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname + location.search }} replace />;
  }
  return <Outlet />;
}
