import type { ResourceKey } from './types';

export interface ColumnConfig {
  key: string;
  label: string;
  mono?: boolean;
  status?: boolean;
}

export interface ResourceConfig {
  columns: ColumnConfig[];
  statuses?: string[];
  searchPlaceholder: string;
  primaryAction?: string;
}

/** Only resources with a live backing API on the TitanDesk server. */
export const RESOURCE_CONFIG: Record<ResourceKey, ResourceConfig> = {
  organizations: {
    searchPlaceholder: 'Search organization, owner or plan…',
    statuses: ['Active', 'Suspended'],
    columns: [
      { key: 'name', label: 'Organization' }, { key: 'owner', label: 'Owner' },
      { key: 'plan', label: 'Plan', status: true }, { key: 'subscriptionStatus', label: 'Subscription', status: true },
      { key: 'users', label: 'Users' }, { key: 'ticketUsage', label: 'Tickets' },
      { key: 'storageUsage', label: 'Storage' }, { key: 'aiUsage', label: 'AI usage' },
      { key: 'lastActivity', label: 'Last activity' }, { key: 'status', label: 'Status', status: true },
    ],
  },
  users: {
    searchPlaceholder: 'Search name, email, organization or role…',
    statuses: ['Active', 'Disabled'],
    columns: [
      { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' },
      { key: 'organization', label: 'Organization' }, { key: 'organizationRole', label: 'Org role' },
      { key: 'platformRole', label: 'Platform role', status: true }, { key: 'status', label: 'Status', status: true },
      { key: 'verified', label: 'Verification', status: true }, { key: 'mfa', label: 'MFA', status: true },
      { key: 'lastLogin', label: 'Last login' }, { key: 'sessions', label: 'Sessions' },
    ],
  },
  support: {
    searchPlaceholder: 'Search case, organization, requester or category…',
    statuses: ['Open', 'Waiting', 'Escalated', 'Resolved'],
    columns: [
      { key: 'id', label: 'Case', mono: true }, { key: 'organization', label: 'Organization' },
      { key: 'requester', label: 'Requester' }, { key: 'subject', label: 'Subject' },
      { key: 'category', label: 'Category' }, { key: 'priority', label: 'Priority', status: true },
      { key: 'sla', label: 'SLA' }, { key: 'status', label: 'Status', status: true },
    ],
  },
  'feature-flags': {
    searchPlaceholder: 'Search flag key, name or targeting…',
    statuses: ['Enabled', 'Testing', 'Disabled'],
    primaryAction: 'New feature flag',
    columns: [
      { key: 'key', label: 'Key', mono: true }, { key: 'name', label: 'Name' },
      { key: 'status', label: 'Status', status: true }, { key: 'targeting', label: 'Targeting' },
      { key: 'rollout', label: 'Rollout' }, { key: 'lastChangedBy', label: 'Last changed by' },
      { key: 'updatedAt', label: 'Updated' }, { key: 'killSwitch', label: 'Kill switch', status: true },
    ],
  },
  'audit-logs': {
    searchPlaceholder: 'Search actor, action, resource, request ID or IP…',
    statuses: ['Low', 'Medium', 'High', 'Critical'],
    primaryAction: 'Export CSV',
    columns: [
      { key: 'timestamp', label: 'Timestamp' }, { key: 'actor', label: 'Actor' },
      { key: 'organization', label: 'Organization' }, { key: 'action', label: 'Action', mono: true },
      { key: 'resource', label: 'Resource', mono: true }, { key: 'requestId', label: 'Request ID', mono: true },
      { key: 'ipAddress', label: 'IP address', mono: true }, { key: 'risk', label: 'Risk', status: true },
    ],
  },
  'data-privacy': {
    searchPlaceholder: 'Search request, subject or organization…',
    statuses: ['Submitted', 'Verified', 'Reviewed', 'Waiting', 'Completed'],
    primaryAction: 'New data request',
    columns: [
      { key: 'id', label: 'Request', mono: true }, { key: 'type', label: 'Type' },
      { key: 'subject', label: 'Subject' }, { key: 'organization', label: 'Organization' },
      { key: 'status', label: 'Status', status: true }, { key: 'requestedAt', label: 'Requested' },
      { key: 'waitingPeriod', label: 'Waiting period' }, { key: 'retention', label: 'Retention' },
    ],
  },
};

export function statusTone(value: unknown): 'ok' | 'warn' | 'bad' | 'info' | 'neutral' {
  const normalized = String(value ?? '').toLowerCase();
  if (['active', 'enabled', 'verified', 'published', 'resolved', 'paid', 'ready', 'low'].some((word) => normalized.includes(word))) return 'ok';
  if (['suspended', 'disabled', 'failed', 'critical', 'urgent', 'past due', 'active kill'].some((word) => normalized.includes(word))) return 'bad';
  if (['warning', 'waiting', 'investigating', 'locked', 'high', 'scheduled'].some((word) => normalized.includes(word))) return 'warn';
  if (['trial', 'testing', 'open', 'medium', 'development', 'super_admin'].some((word) => normalized.includes(word))) return 'info';
  return 'neutral';
}

export function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  }
  return String(value);
}
