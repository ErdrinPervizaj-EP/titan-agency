import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Download, MoreHorizontal, Plus, Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, Button, Card, Select, Table, Td, Th } from './ui';
import { superAdminApi } from './api';
import { DetailDrawer, EmptyState, ErrorState, LoadingState, PageIntro, Pagination, SensitiveActionDialog, SuperAdminMetricCard } from './components';
import type { SensitiveActionSpec } from './components';
import { displayValue, RESOURCE_CONFIG, statusTone } from './resource-config';
import { useSuperAdminToast } from './toast';
import type { ResourceKey, ResourcePayload } from './types';

function csvValue(value: unknown) { return `"${String(value ?? '').replaceAll('"', '""')}"`; }

export default function ResourcePage({ resource }: { resource: ResourceKey }) {
  const config = RESOURCE_CONFIG[resource];
  const navigate = useNavigate();
  const { push } = useSuperAdminToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [payload, setPayload] = useState<ResourcePayload | null>(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [action, setAction] = useState<SensitiveActionSpec | null>(null);
  const [revision, setRevision] = useState(0);
  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';

  useEffect(() => {
    const controller = new AbortController();
    setError('');
    superAdminApi.resource(resource, searchParams, controller.signal).then(({ data }) => setPayload(data)).catch((caught: unknown) => {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setError(caught instanceof Error ? caught.message : 'Unable to load data');
    });
    return () => controller.abort();
  }, [resource, revision, searchParams]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next, { replace: true });
  }

  function sortBy(key: string) {
    const next = new URLSearchParams(searchParams);
    const sameColumn = next.get('sort') === key;
    next.set('sort', key);
    next.set('order', sameColumn && next.get('order') === 'asc' ? 'desc' : 'asc');
    next.set('page', '1');
    setSearchParams(next, { replace: true });
  }

  const pageEyebrow = useMemo(() => resource === 'support' ? 'Owner support workspace' : 'Super Admin', [resource]);

  function openRow(row: Record<string, unknown>) {
    if (resource === 'users') navigate(`/admin/users/${row.id}`);
    else if (resource === 'organizations') navigate(`/admin/organizations/${row.id}`);
    else setSelected(row);
  }

  function exportCsv() {
    if (!payload?.rows.length) { push('There is nothing to export', 'error'); return; }
    const keys = config.columns.map((column) => column.key);
    const csv = [keys.map(csvValue).join(','), ...payload.rows.map((row) => keys.map((key) => csvValue(row[key])).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `${resource}-export.csv`; link.click(); URL.revokeObjectURL(url);
    push('CSV exported from the visible rows');
  }

  function primaryAction() {
    if (resource === 'audit-logs') { exportCsv(); return; }
    if (resource === 'feature-flags') {
      setAction({ title: 'New feature flag', description: 'Create a disabled-by-default release switch. Enable it only after validation.', confirmLabel: 'Create flag', endpoint: '/platform/feature-flags/create', body: { enabled: false, rolloutPercent: 0 }, inputs: [
        { key: 'key', label: 'Stable flag key', required: true, placeholder: 'module.capability.v1' },
        { key: 'name', label: 'Display name', required: true }, { key: 'description', label: 'Description' },
        { key: 'rolloutPercent', label: 'Initial rollout percent', type: 'number', min: 0, max: 100, required: true },
      ] }); return;
    }
    if (resource === 'data-privacy') {
      setAction({ title: 'New data request', description: 'Open a reviewed privacy workflow. Use export, retention, or deletion as the request type.', confirmLabel: 'Create request', endpoint: '/platform/privacy-requests/create', body: { type: 'export' }, inputs: [
        { key: 'workspaceId', label: 'Organization ID', required: true }, { key: 'type', label: 'Type (export, retention, or deletion)', required: true },
        { key: 'subject', label: 'Data subject or scope', required: true }, { key: 'retentionUntil', label: 'Retention until (optional)', type: 'datetime-local' },
      ] }); return;
    }
  }

  function contextualAction(row: Record<string, unknown>) {
    const targetId = String(row.id);
    if (resource === 'feature-flags') setAction({ title: 'Activate kill switch', description: `Immediately disable ${row.name} and record the reason in the immutable audit log.`, confirmLabel: 'Disable feature', endpoint: '/platform/feature-flags/kill', body: { targetId }, danger: true });
    else if (resource === 'data-privacy' && !['Completed', 'Cancelled'].includes(String(row.status))) {
      const next = ({ Submitted: 'Verified', Verified: 'Reviewed', Reviewed: row.type === 'Deletion' ? 'Waiting' : 'Completed', Waiting: 'Completed' } as Record<string, string>)[String(row.status)];
      setAction({ title: `Move request to ${next}`, description: `Advance ${row.id} through the enforced privacy review workflow.`, confirmLabel: `Mark ${next}`, endpoint: '/platform/privacy-requests/status', body: { targetId, status: next }, danger: row.type === 'Deletion' && next === 'Completed', inputs: row.type === 'Deletion' && next === 'Completed' ? [{ key: 'receipt', label: 'Deletion job receipt', required: true, placeholder: 'delete-job-…' }] : undefined });
    }
    else setSelected(row);
  }

  return (
    <div className="space-y-5">
      <PageIntro eyebrow={pageEyebrow} title={payload?.title ?? resource.replaceAll('-', ' ')} description={payload?.description ?? 'Loading platform information...'} actions={config.primaryAction && <Button className="h-9 px-3 text-body-sm" onClick={primaryAction} icon={resource === 'audit-logs' ? Download : Plus}>{config.primaryAction}</Button>} />
      {payload && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{payload.metrics.map((item) => <SuperAdminMetricCard key={item.key} metric={item} />)}</div>}
      {resource === 'data-privacy' && <Card className="p-4"><p className="text-body-sm font-semibold text-ink">Deletion workflow</p><div className="mt-3 grid gap-2 md:grid-cols-3 xl:grid-cols-6">{['1. Submitted', '2. Authority verified', '3. Impact reviewed', '4. Waiting period', '5. Delete or retain legally', '6. Result recorded'].map((step) => <div key={step} className="rounded-control border border-line bg-surface px-3 py-2 text-2xs font-medium text-ink-soft">{step}</div>)}</div></Card>}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3">
          <label className="relative min-w-[240px] flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={15} /><input className="input h-9 pl-9" placeholder={config.searchPlaceholder} value={search} onChange={(event) => updateParam('search', event.target.value)} /></label>
          {config.statuses && <Select className="w-48" value={status} onChange={(event) => updateParam('status', event.target.value)}><option value="">All statuses</option>{config.statuses.map((item) => <option key={item} value={item.toLowerCase()}>{item}</option>)}</Select>}
          {(search || status) && <Button variant="ghost" className="h-9 px-3 text-body-sm" onClick={() => { const next = new URLSearchParams(searchParams); next.delete('search'); next.delete('status'); next.set('page', '1'); setSearchParams(next, { replace: true }); }}>Clear filters</Button>}
        </div>
        {!payload && !error && <LoadingState />}
        {error && <ErrorState message={error} onRetry={() => setRevision((value) => value + 1)} />}
        {payload && payload.rows.length === 0 && <EmptyState />}
        {payload && payload.rows.length > 0 && (
          <>
            <Table>
              <thead><tr>{config.columns.map((column) => <Th key={column.key}><button onClick={() => sortBy(column.key)} className="focus-ring inline-flex items-center gap-1.5 rounded-control hover:text-link">{column.label}<ArrowUpDown size={12} /></button></Th>)}<Th><span className="sr-only">Actions</span></Th></tr></thead>
              <tbody>
                {payload.rows.map((row) => (
                  <tr key={String(row.id)} className="group hover:bg-canvas">
                    {config.columns.map((column) => <Td key={column.key} className={column.mono ? 'font-mono text-2xs' : 'text-body-sm'}><button onClick={() => openRow(row)} className="focus-ring max-w-[260px] truncate rounded-control text-left hover:text-link">{column.status ? <Badge tone={statusTone(row[column.key])}>{displayValue(row[column.key])}</Badge> : displayValue(row[column.key])}</button></Td>)}
                    <Td><button onClick={() => contextualAction(row)} className="focus-ring grid h-8 w-8 place-items-center rounded-control text-ink-muted hover:bg-line-soft hover:text-ink" aria-label="Row actions"><MoreHorizontal size={16} /></button></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination page={payload.meta.page} totalPages={payload.meta.totalPages} total={payload.meta.total} onPage={(page) => updateParam('page', String(page))} />
          </>
        )}
      </Card>
      {selected && <DetailDrawer title={displayValue(selected.name ?? selected.title ?? selected.id)} row={selected} onClose={() => setSelected(null)} />}
      {action && <SensitiveActionDialog action={action} onClose={() => setAction(null)} onComplete={() => setRevision((value) => value + 1)} />}
    </div>
  );
}
