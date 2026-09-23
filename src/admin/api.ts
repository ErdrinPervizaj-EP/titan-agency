import type { MetricDatum, OverviewPayload, ResourceKey, ResourcePayload, SuperAdminUser } from './types';
import { titanDeskAuth, TitanDeskApiError, superAdminRequest, type AuthUser } from './lib/titandesk-client';

/** Every action here has a real, implemented server workflow — unlike
 * TitanDesk's own super-admin module, this port drops the preview-only
 * resources/actions that have no backend behind them yet. */
const REAL_SENSITIVE_ACTIONS = new Set(['suspend', 'reactivate-organization', 'disable', 'reactivate']);
const REAL_SENSITIVE_PATHS = new Set([
  '/platform/feature-flags/kill',
  '/platform/feature-flags/create',
  '/platform/feature-flags/override',
  '/platform/privacy-requests/status',
  '/platform/privacy-requests/create',
  '/platform/support-cases/create',
]);
export function isRealSensitiveAction(path: string): boolean {
  const action = path.split('/').filter(Boolean).at(-1) ?? '';
  return REAL_SENSITIVE_ACTIONS.has(action) || REAL_SENSITIVE_PATHS.has(path);
}

class SuperAdminApiError extends Error {
  readonly status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}

function toSuperAdminUser(user: AuthUser): SuperAdminUser {
  return { id: user.id, email: user.email, name: user.name, roles: user.isSuperAdmin ? ['SUPER_ADMIN'] : [] };
}

function includesSearch(row: Record<string, unknown>, search: string) {
  return Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(search));
}

function paginate(rows: Array<Record<string, unknown>>, params: URLSearchParams) {
  const search = (params.get('search') ?? '').trim().toLowerCase();
  const status = (params.get('status') ?? '').trim().toLowerCase();
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const pageSize = Math.max(1, Number(params.get('pageSize') ?? 10));
  const sort = params.get('sort') ?? 'id';
  const order: 'asc' | 'desc' = params.get('order') === 'asc' ? 'asc' : 'desc';
  const filtered = rows.filter((row) => (!search || includesSearch(row, search)) && (!status || String(row.status ?? '').toLowerCase() === status));
  const sorted = [...filtered].sort((left, right) => {
    const comparison = String(left[sort] ?? '').localeCompare(String(right[sort] ?? ''), undefined, { numeric: true });
    return order === 'asc' ? comparison : -comparison;
  });
  const start = (page - 1) * pageSize;
  return {
    rows: sorted.slice(start, start + pageSize),
    meta: { page, pageSize, total: filtered.length, totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)), sort, order },
  };
}

interface RealOrganization {
  id: string; name: string; slug: string; plan: string; enabledModules: string[];
  isSuspended: boolean; createdAt: string; memberCount: number;
}
interface RealSupportCase { id: string; workspaceId: string; ticketId: string | null; requester: string; subject: string; category: string; priority: string; status: string; slaDueAt: string | null; createdAt: string; updatedAt: string; organization: string; ticket: { id: string; number: number; subject: string } | null; }
interface RealFeatureFlag { id: string; key: string; name: string; description: string | null; enabled: boolean; rolloutPercent: number; updatedBy: string; updatedAt: string; overrides: Array<{ workspaceId: string; enabled: boolean }>; }
interface RealPrivacyRequest { id: string; workspaceId: string; type: string; subject: string; reason: string; status: string; retentionUntil: string | null; scheduledFor: string | null; createdAt: string; organization: string; }

export const superAdminApi = {
  /** Real session-cookie login, shared with the tenant app's auth — reuses
   *  the TitanDesk server's own auth routes rather than a separate credential store. */
  async login(email: string, password: string) {
    let result: AuthUser | { mfaRequired: true };
    try {
      result = await titanDeskAuth.login({ identifier: email, password, returnTo: '/admin' });
    } catch (error) {
      if (error instanceof TitanDeskApiError) throw new SuperAdminApiError(error.message, error.status);
      throw error;
    }
    if ('mfaRequired' in result) return { user: null, mfaRequired: true } as const;
    const user = result;
    if (!user.isSuperAdmin) {
      // Don't leave a signed-in tenant session behind for a login attempt
      // that was specifically for the superadmin console.
      await titanDeskAuth.logout().catch(() => undefined);
      throw new SuperAdminApiError('This account does not have superadmin access.', 403);
    }
    return { user: toSuperAdminUser(user), mfaRequired: false };
  },
  async completeMfa(code: string) {
    const result = await titanDeskAuth.completeMfa(code);
    if (!result.user.isSuperAdmin) {
      await titanDeskAuth.logout().catch(() => undefined);
      throw new SuperAdminApiError('This account does not have superadmin access.', 403);
    }
    return toSuperAdminUser(result.user);
  },
  logout: titanDeskAuth.logout,
  /** Marks this exact server-side session freshly verified for five minutes. */
  async reauthenticate(password: string, code?: string) {
    try {
      const result = await titanDeskAuth.stepUp(password, code);
      return { stepUpToken: `server-session.${result.expiresAt}` };
    } catch (error) {
      if (error instanceof TitanDeskApiError) {
        const message = error.code === 'mfa_code_required'
          ? 'Enter your authenticator or recovery code too.'
          : error.code === 'step_up_unavailable'
            ? 'This provider-only account must enable MFA before sensitive actions.'
            : error.code === 'invalid_step_up'
              ? 'The password or verification code is incorrect.'
              : error.message;
        throw new SuperAdminApiError(message, error.status);
      }
      throw error;
    }
  },
  /** Resolves the current superadmin session, or null if signed out /
   *  not a superadmin. Called on mount instead of a sessionStorage flag,
   *  so refreshing the tab re-checks the real session. */
  async me(): Promise<SuperAdminUser | null> {
    const user = await titanDeskAuth.me();
    if (!user || !user.isSuperAdmin) return null;
    return toSuperAdminUser(user);
  },

  async overview(params: URLSearchParams, signal?: AbortSignal) {
    const [overview, auditEvents] = await Promise.all([
      superAdminRequest<{ data: { organizationCount: number; suspendedOrganizationCount: number; userCount: number; activeUserCount: number } }>('/api/v1/super-admin/overview', { signal }),
      superAdminRequest<{ data: Array<{ action: string; entityType: string; entityId: string; actorName: string | null; createdAt: string }> }>('/api/v1/super-admin/audit-logs?limit=8', { signal }),
    ]);
    const metrics: MetricDatum[] = [
      { key: 'organizations', label: 'Organizations', value: String(overview.data.organizationCount) },
      { key: 'suspended', label: 'Suspended organizations', value: String(overview.data.suspendedOrganizationCount), tone: overview.data.suspendedOrganizationCount > 0 ? 'warn' : 'ok' },
      { key: 'users', label: 'Users', value: String(overview.data.userCount) },
      { key: 'active-users', label: 'Active users', value: String(overview.data.activeUserCount) },
    ];
    const data: OverviewPayload = {
      generatedAt: new Date().toISOString(),
      range: { from: params.get('from') ?? '', to: params.get('to') ?? '' },
      metrics,
      recentActions: auditEvents.data.map((e) => ({
        action: e.action, resource: `${e.entityType}:${e.entityId}`,
        actor: e.actorName ?? 'System', timestamp: new Date(e.createdAt).toLocaleString(),
      })),
    };
    return { data };
  },

  async resource(resource: ResourceKey, params: URLSearchParams, signal?: AbortSignal) {
    if (resource === 'organizations') {
      const orgs = await superAdminRequest<{ data: RealOrganization[] }>('/api/v1/super-admin/organizations', { signal });
      const rows = orgs.data.map((o) => ({
        id: o.id, name: o.name, owner: '—', plan: o.plan,
        subscriptionStatus: 'Not tracked', users: o.memberCount,
        ticketUsage: 'Not tracked', storageUsage: 'Not tracked', aiUsage: 'Not tracked',
        lastActivity: new Date(o.createdAt).toLocaleDateString(),
        status: o.isSuspended ? 'Suspended' : 'Active',
      }));
      const { rows: page, meta } = paginate(rows, params);
      const data: ResourcePayload = {
        title: 'Organizations', description: 'Every workspace on this deployment.',
        metrics: [
          { key: 'total', label: 'Organizations', value: String(orgs.data.length) },
          { key: 'suspended', label: 'Suspended', value: String(orgs.data.filter((o) => o.isSuspended).length) },
        ],
        rows: page, meta,
      };
      return { data };
    }

    if (resource === 'users') {
      const [users, orgs] = await Promise.all([
        superAdminRequest<{ data: AuthUser[] }>('/api/v1/super-admin/users', { signal }),
        superAdminRequest<{ data: RealOrganization[] }>('/api/v1/super-admin/organizations', { signal }),
      ]);
      const orgById = new Map(orgs.data.map((o) => [o.id, o.name]));
      const rows = users.data.map((u) => ({
        id: u.id, name: u.name, email: u.email,
        organization: orgById.get(u.workspaceId) ?? '—', organizationRole: u.role,
        platformRole: u.isSuperAdmin ? 'Super Admin' : 'None', status: u.status === 'active' ? 'Active' : 'Disabled',
        verified: 'Not tracked', mfa: 'Not tracked', lastLogin: 'Not tracked', sessions: 'Not tracked',
      }));
      const { rows: page, meta } = paginate(rows, params);
      const data: ResourcePayload = {
        title: 'Users', description: 'Every user account on this deployment.',
        metrics: [
          { key: 'total', label: 'Users', value: String(users.data.length) },
          { key: 'active', label: 'Active', value: String(users.data.filter((u) => u.status === 'active').length) },
        ],
        rows: page, meta,
      };
      return { data };
    }

    if (resource === 'support') {
      const result = await superAdminRequest<{ data: RealSupportCase[] }>('/api/v1/super-admin/support-cases', { signal });
      const rows = result.data.map((row) => ({ ...row, ticket: row.ticket ? `TD-${row.ticket.number} · ${row.ticket.subject}` : 'Not linked', sla: row.slaDueAt ? new Date(row.slaDueAt).toLocaleString() : 'No deadline' }));
      const { rows: page, meta } = paginate(rows, params);
      return { data: { title: 'Support', description: 'Audited platform support cases linked to real organizations and tenant tickets.', metrics: [
        { key: 'total', label: 'Cases', value: String(rows.length) },
        { key: 'open', label: 'Open', value: String(rows.filter((row) => row.status !== 'Resolved').length), tone: 'warn' },
        { key: 'escalated', label: 'Escalated', value: String(rows.filter((row) => row.status === 'Escalated').length), tone: 'bad' },
      ], rows: page, meta } satisfies ResourcePayload };
    }

    if (resource === 'feature-flags') {
      const result = await superAdminRequest<{ data: RealFeatureFlag[] }>('/api/v1/super-admin/feature-flags', { signal });
      const rows = result.data.map((row) => ({ ...row, status: row.enabled ? (row.rolloutPercent < 100 ? 'Testing' : 'Enabled') : 'Disabled', targeting: row.overrides.length ? `${row.overrides.length} organization override(s)` : 'Global rollout', rollout: `${row.rolloutPercent}%`, lastChangedBy: row.updatedBy, killSwitch: row.enabled ? 'Ready' : 'Active kill' }));
      const { rows: page, meta } = paginate(rows, params);
      return { data: { title: 'Feature Flags', description: 'Audited global release switches with explicit organization overrides.', metrics: [
        { key: 'total', label: 'Flags', value: String(rows.length) },
        { key: 'enabled', label: 'Enabled', value: String(rows.filter((row) => row.enabled).length), tone: 'ok' },
        { key: 'targeted', label: 'With overrides', value: String(rows.filter((row) => row.overrides.length).length), tone: 'info' },
      ], rows: page, meta } satisfies ResourcePayload };
    }

    if (resource === 'data-privacy') {
      const result = await superAdminRequest<{ data: RealPrivacyRequest[] }>('/api/v1/super-admin/privacy-requests', { signal });
      const rows = result.data.map((row) => ({ ...row, type: row.type[0].toUpperCase() + row.type.slice(1), requestedAt: row.createdAt, waitingPeriod: row.scheduledFor ?? 'Not scheduled', retention: row.retentionUntil ?? 'No retention hold' }));
      const { rows: page, meta } = paginate(rows, params);
      return { data: { title: 'Data & Privacy', description: 'Audited export, retention and deletion requests with enforced review transitions.', metrics: [
        { key: 'open', label: 'Open requests', value: String(rows.filter((row) => !['Completed', 'Cancelled'].includes(row.status)).length), tone: 'warn' },
        { key: 'exports', label: 'Exports', value: String(rows.filter((row) => row.type === 'Export').length), tone: 'info' },
        { key: 'deletions', label: 'Deletions', value: String(rows.filter((row) => row.type === 'Deletion').length) },
      ], rows: page, meta } satisfies ResourcePayload };
    }

    // audit-logs
    const [events, orgs] = await Promise.all([
      superAdminRequest<{ data: Array<{ id: string; workspaceId: string; actorName: string | null; action: string; entityType: string; entityId: string; createdAt: string }> }>('/api/v1/super-admin/audit-logs?limit=500', { signal }),
      superAdminRequest<{ data: RealOrganization[] }>('/api/v1/super-admin/organizations', { signal }),
    ]);
    const orgById = new Map(orgs.data.map((o) => [o.id, o.name]));
    const rows = events.data.map((e) => ({
      id: e.id, timestamp: new Date(e.createdAt).toLocaleString(), actor: e.actorName ?? 'System',
      organization: orgById.get(e.workspaceId) ?? '—', action: e.action, resource: `${e.entityType}:${e.entityId}`,
      requestId: '—', ipAddress: '—',
      risk: /suspend|disable/.test(e.action) ? 'High' : 'Low',
    }));
    const { rows: page, meta } = paginate(rows, params);
    const data: ResourcePayload = {
      title: 'Audit log', description: 'Cross-workspace, append-only history of admin and superadmin actions.',
      metrics: [{ key: 'total', label: 'Events', value: String(events.data.length) }],
      rows: page, meta,
    };
    return { data };
  },

  async user(id: string, signal?: AbortSignal) {
    try {
      const [user, orgs] = await Promise.all([
        superAdminRequest<{ data: AuthUser }>(`/api/v1/super-admin/users/${encodeURIComponent(id)}`, { signal }),
        superAdminRequest<{ data: RealOrganization[] }>('/api/v1/super-admin/organizations', { signal }),
      ]);
      const orgName = orgs.data.find((o) => o.id === user.data.workspaceId)?.name ?? '—';
      return {
        data: {
          id: user.data.id, name: user.data.name, email: user.data.email,
          organization: orgName, organizationId: user.data.workspaceId,
          organizationRole: user.data.role, platformRole: user.data.isSuperAdmin ? 'Super Admin' : 'None',
          status: user.data.status === 'active' ? 'Active' : 'Disabled',
          verified: 'Not tracked', mfa: 'Not tracked', lastLogin: 'Not tracked', sessions: 'Not tracked',
          securityEvents: [], auditHistory: [],
        },
      };
    } catch (error) {
      if (error instanceof SuperAdminApiError && error.status === 404) throw new SuperAdminApiError('User not found.', 404);
      throw error;
    }
  },

  async organization(id: string, signal?: AbortSignal) {
    try {
      const org = await superAdminRequest<{ data: RealOrganization & { members: Array<{ userId: string; userName: string; userEmail: string; role: string; status: string }> } }>(
        `/api/v1/super-admin/organizations/${encodeURIComponent(id)}`, { signal },
      );
      return {
        data: {
          id: org.data.id, name: org.data.name, plan: org.data.plan,
          status: org.data.isSuspended ? 'Suspended' : 'Active', createdAt: org.data.createdAt,
          users: org.data.members.map((m) => ({ id: m.userId, name: m.userName, email: m.userEmail, role: m.role, status: m.status })),
          subscription: undefined,
        },
      };
    } catch (error) {
      if (error instanceof SuperAdminApiError && error.status === 404) throw new SuperAdminApiError('Organization not found.', 404);
      throw error;
    }
  },

  async sensitive(path: string, body: Record<string, unknown>, stepUpToken: string, method = 'POST') {
    if (!stepUpToken.startsWith('server-session.')) {
      throw new SuperAdminApiError('Fresh authentication is required.', 401);
    }
    const action = path.split('/').filter(Boolean).at(-1) ?? method.toLowerCase();
    const targetId = String(body.targetId ?? body.userId ?? body.organizationId ?? '');
    const reason = String(body.reason ?? 'No reason supplied');

    if (action === 'suspend' || action === 'reactivate-organization') {
      const result = await superAdminRequest<{ data: RealOrganization }>(`/api/v1/super-admin/organizations/${encodeURIComponent(targetId)}/suspend`, {
        method: 'POST',
        body: JSON.stringify({ isSuspended: action === 'suspend', reason }),
      });
      return { data: { ok: true, targetId, action, isSuspended: result.data.isSuspended } };
    }
    if (action === 'disable' || action === 'reactivate') {
      const result = await superAdminRequest<{ data: AuthUser }>(`/api/v1/super-admin/users/${encodeURIComponent(targetId)}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: action === 'disable' ? 'disabled' : 'active', reason }),
      });
      return { data: { ok: true, targetId, action, status: result.data.status } };
    }
    if (path === '/platform/feature-flags/kill') {
      await superAdminRequest(`/api/v1/super-admin/feature-flags/${encodeURIComponent(targetId)}`, { method: 'PATCH', body: JSON.stringify({ enabled: false, rolloutPercent: 0, reason }) });
      return { data: { ok: true, targetId, action } };
    }
    if (path === '/platform/feature-flags/create') {
      await superAdminRequest('/api/v1/super-admin/feature-flags', { method: 'POST', body: JSON.stringify({ key: body.key, name: body.name, description: body.description || null, enabled: body.enabled ?? false, rolloutPercent: Number(body.rolloutPercent ?? 0), reason }) });
      return { data: { ok: true, action: 'create' } };
    }
    if (path === '/platform/feature-flags/override') {
      await superAdminRequest(`/api/v1/super-admin/feature-flags/${encodeURIComponent(targetId)}/overrides`, { method: 'PUT', body: JSON.stringify({ workspaceId: body.workspaceId, enabled: body.enabled, reason }) });
      return { data: { ok: true, targetId, action } };
    }
    if (path === '/platform/privacy-requests/status') {
      await superAdminRequest(`/api/v1/super-admin/privacy-requests/${encodeURIComponent(targetId)}`, { method: 'PATCH', body: JSON.stringify({ status: body.status, result: body.receipt ? { receipt: body.receipt } : body.result, reason }) });
      return { data: { ok: true, targetId, action } };
    }
    if (path === '/platform/privacy-requests/create') {
      const retentionUntil = body.retentionUntil ? new Date(String(body.retentionUntil)).toISOString() : null;
      await superAdminRequest('/api/v1/super-admin/privacy-requests', { method: 'POST', body: JSON.stringify({ workspaceId: body.workspaceId, type: body.type, subject: body.subject, retentionUntil, reason }) });
      return { data: { ok: true, action: 'create' } };
    }
    if (path === '/platform/support-cases/create') {
      await superAdminRequest('/api/v1/super-admin/support-cases', { method: 'POST', body: JSON.stringify({ workspaceId: body.workspaceId, ticketId: body.ticketId || null, requester: body.requester, subject: body.subject, category: body.category, priority: body.priority || 'Medium', reason }) });
      return { data: { ok: true, action: 'create' } };
    }

    throw new SuperAdminApiError('This action is not implemented.', 503);
  },
};
