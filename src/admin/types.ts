export type ResourceKey = 'organizations' | 'users' | 'support' | 'feature-flags' | 'audit-logs' | 'data-privacy';

export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface MetricDatum {
  key: string;
  label: string;
  value: string;
  delta?: number;
  tone?: 'neutral' | 'ok' | 'warn' | 'bad' | 'info';
  hint?: string;
}

export interface ResourcePayload {
  title: string;
  description: string;
  metrics: MetricDatum[];
  rows: Array<Record<string, unknown>>;
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    sort: string;
    order: 'asc' | 'desc';
  };
}

export interface OverviewPayload {
  generatedAt: string;
  range: { from: string; to: string };
  metrics: MetricDatum[];
  recentActions: Array<Record<string, unknown>>;
}
