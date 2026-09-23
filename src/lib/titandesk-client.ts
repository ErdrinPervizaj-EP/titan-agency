/**
 * The marketing site's only link to the TitanDesk session: whether a visitor
 * is signed in (to show "Go to workspace") and signing out. Signing in and
 * signing up happen on the account pages — see lib/account-links.ts.
 * src/admin has its own separate Super Admin client.
 */

const API_BASE = (import.meta.env.VITE_TITANDESK_API_URL ?? 'http://127.0.0.1:4100').replace(/\/$/, '');

/** Where the TitanDesk product app runs — where "Go to workspace" sends a signed-in visitor. */
export const TITANDESK_WEB_URL = (import.meta.env.VITE_TITANDESK_WEB_URL ?? 'http://127.0.0.1:5173').replace(/\/$/, '');

export class TitanDeskApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(code: string, status: number) {
    super(code.replaceAll('_', ' '));
    this.status = status;
    this.code = code;
  }
}

/**
 * CSRF token for the current session, handed to us in the JSON body of
 * login/register/mfa-complete/me responses (never a cookie — a cookie set
 * on the API's own origin can't be read by JS running on this site's
 * different origin). Every non-GET request after that must echo it back
 * as a header — see the comment on computeCsrfToken in
 * server/src/auth/routes.ts.
 */
let csrfToken: string | null = null;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? 'GET').toUpperCase();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
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

export interface AuthUser {
  id: string;
  workspaceId: string;
  email: string;
  name: string;
  role: string;
  status: string;
  needsSetup: boolean;
}

/** Anonymous, cache-friendly read of a public endpoint (no cookies sent). */
async function publicGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new TitanDeskApiError(`http_${response.status}`, response.status);
  return (await response.json() as { data: T }).data;
}

export const publicContent = {
  siteContent: <T>() => publicGet<T>('/api/v1/public/site-content'),
  blogPosts: <T>(lang: 'en' | 'de') => publicGet<T>(`/api/v1/public/blog?lang=${lang}`),
  blogPost: <T>(slug: string) => publicGet<T>(`/api/v1/public/blog/${encodeURIComponent(slug)}`),
};

export const SALES_NEEDS = ['sso', 'integrations', 'invoicing', 'onboarding', 'migration', 'security_review', 'other'] as const;
export type SalesNeed = (typeof SALES_NEEDS)[number];

export interface SupportRequest {
  /** "sales" lands on the Leads board as well as in the ticket queue. */
  kind: 'question' | 'problem' | 'sales';
  name: string;
  email: string;
  company?: string;
  category?: 'website' | 'titandesk' | 'billing' | 'security' | 'other';
  message: string;
  /** Page the visitor was on. */
  page?: string;
  /** Sales enquiries only. */
  seats?: number;
  currentTool?: string;
  needs?: SalesNeed[];
  /** Workspace id of a signed-in visitor, so sales can see their current setup. */
  workspace?: string;
  /** Honeypot field; left empty by people. */
  website?: string;
}

/**
 * Files a question or problem report as a ticket in Titan Network's own
 * TitanDesk. Resolves to the ticket reference (e.g. "TD-148"), or null when a
 * bot tripped the honeypot. Rejects with code "support_not_configured" when
 * the server has no support workspace set, so callers can offer email instead.
 */
export async function submitSupportRequest(input: SupportRequest): Promise<string | null> {
  const response = await request<{ data: { reference: string | null } }>('/api/v1/public/support-requests', { method: 'POST', body: JSON.stringify(input) });
  return response.data.reference;
}

export const titanDeskAuth = {
  /** Resolves to null when nobody is signed in, rather than throwing — lets
   *  the marketing site's Navbar check session status without a login gate. */
  async me(signal?: AbortSignal): Promise<AuthUser | null> {
    try {
      const response = await request<{ data: AuthUser }>('/api/v1/auth/me', { signal });
      return response.data;
    } catch (error) {
      if (error instanceof TitanDeskApiError && error.status === 401) return null;
      throw error;
    }
  },
  async logout() {
    await request('/api/v1/auth/logout', { method: 'POST', body: '{}' });
  },
};
