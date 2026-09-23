/**
 * Minimal client for TitanDesk's auth API — only what the Super Admin
 * console needs (session login/logout, MFA, step-up re-authentication,
 * passkey step-up). The product's own `web/src/lib/titandesk-api.ts` has
 * hundreds of tenant-facing methods (tickets, projects, deals...) that have
 * no business being pulled into the agency site's bundle.
 */

const API_BASE = (import.meta.env.VITE_TITANDESK_API_URL ?? 'http://127.0.0.1:4100').replace(/\/$/, '');

export class TitanDeskApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(code: string, status: number) {
    super(
      (
        {
          forbidden: 'Your role does not allow this action.',
          internal_error: 'The server could not complete this request. Please try again.',
        } as Record<string, string>
      )[code] ?? code.replaceAll('_', ' '),
    );
    this.status = status;
    this.code = code;
  }
}

/**
 * CSRF token for the current session, handed to us in the JSON body of
 * login/mfa-complete/me responses (never a cookie — a cookie set on the
 * API's own origin can't be read by JS running on the agency site's
 * different origin). Every non-GET request after that — including every
 * super-admin mutation, which all go through this same function — must
 * echo it back as a header. See the comment on computeCsrfToken in
 * server/src/auth/routes.ts.
 */
let csrfToken: string | null = null;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? 'GET').toUpperCase();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    // The session lives in an HttpOnly cookie, and the API is on a
    // different origin from the agency site — it only travels with this set.
    credentials: 'include',
    headers: {
      ...(init?.body ? { 'content-type': 'application/json' } : {}),
      ...(method !== 'GET' && method !== 'HEAD' && csrfToken ? { 'x-csrf-token': csrfToken } : {}),
      ...init?.headers,
    },
  });
  const body = response.status === 204 ? undefined : await response.json().catch(() => undefined);
  if (body && typeof body === 'object' && typeof (body as { csrfToken?: unknown }).csrfToken === 'string') {
    csrfToken = (body as { csrfToken: string }).csrfToken;
  }
  if (path === '/api/v1/auth/logout' && response.ok) csrfToken = null;
  if (!response.ok) {
    const error = body && typeof body === 'object' && 'error' in body ? String(body.error) : `Request failed (${response.status})`;
    throw new TitanDeskApiError(error, response.status);
  }
  return body as T;
}

/** Only the fields the Super Admin console actually reads. */
export interface AuthUser {
  id: string;
  workspaceId: string;
  email: string;
  name: string;
  role: string;
  status: string;
  isSuperAdmin: boolean;
}

export const titanDeskAuth = {
  /** `identifier` is either the account's email address or its optional username. */
  async login(input: { identifier: string; password: string; returnTo?: string }) {
    const response = await request<{ data: AuthUser | { mfaRequired: true } }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return response.data;
  },
  async completeMfa(code: string) {
    const response = await request<{ data: { user: AuthUser; returnTo: string } }>('/api/v1/auth/mfa/complete', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    return response.data;
  },
  async logout() {
    await request<{ data: { ok: boolean } }>('/api/v1/auth/logout', { method: 'POST', body: '{}' });
  },
  /** Resolves to null when nobody is signed in, rather than throwing. */
  async me(): Promise<AuthUser | null> {
    try {
      const response = await request<{ data: AuthUser }>('/api/v1/auth/me');
      return response.data;
    } catch (error) {
      if (error instanceof TitanDeskApiError && error.status === 401) return null;
      throw error;
    }
  },
  /** Marks this exact server-side session freshly verified for five minutes. */
  async stepUp(password?: string, code?: string) {
    const response = await request<{ data: { expiresAt: string } }>('/api/v1/auth/step-up', {
      method: 'POST',
      body: JSON.stringify({ ...(password ? { password } : {}), ...(code ? { code } : {}) }),
    });
    return response.data;
  },
};

export { request as superAdminRequest };
