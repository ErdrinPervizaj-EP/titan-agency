import { Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ArrowRight, KeyRound, Search, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, Button, Card, CardHeader, Table, Td, Th } from './ui';
import { superAdminApi } from './api';
import { ErrorState, LoadingState, PageIntro, SensitiveActionDialog, SuperAdminMetricCard } from './components';
import type { SensitiveActionSpec } from './components';
import { displayValue, statusTone } from './resource-config';
import type { ResourcePayload } from './types';

export default function SupportPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cases, setCases] = useState<ResourcePayload | null>(null);
  const [users, setUsers] = useState<ResourcePayload | null>(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [action, setAction] = useState<SensitiveActionSpec | null>(null);
  const search = searchParams.get('search') ?? '';

  useEffect(() => {
    const controller = new AbortController();
    setError('');
    const params = new URLSearchParams(searchParams); params.set('pageSize', '8');
    Promise.all([superAdminApi.resource('support', params, controller.signal), superAdminApi.resource('users', params, controller.signal)])
      .then(([supportResult, userResult]) => { setCases(supportResult.data); setUsers(userResult.data); })
      .catch((caught: unknown) => {
        if (caught instanceof DOMException && caught.name === 'AbortError') return;
        setError(caught instanceof Error ? caught.message : 'Unable to load support workspace');
      });
    return () => controller.abort();
  }, [revision, searchParams]);

  function setSearch(value: string) {
    const next = new URLSearchParams(searchParams); if (value) next.set('search', value); else next.delete('search'); setSearchParams(next, { replace: true });
  }

  if (error) return <Card><ErrorState message={error} onRetry={() => setRevision((value) => value + 1)} /></Card>;

  return (
    <div className="space-y-5">
      <PageIntro eyebrow="Owner support workspace" title="Support & user control" description="Audited platform support cases linked to real organizations and tenant tickets, alongside account-recovery controls." actions={<Button className="h-9 px-3 text-body-sm" onClick={() => setAction({ title: 'New support case', description: 'Link an owner-support escalation to an organization and, optionally, a real tenant ticket.', confirmLabel: 'Create case', endpoint: '/platform/support-cases/create', body: { priority: 'Medium' }, inputs: [
        { key: 'workspaceId', label: 'Organization ID', required: true }, { key: 'ticketId', label: 'Linked ticket ID (optional)' },
        { key: 'requester', label: 'Requester', required: true }, { key: 'subject', label: 'Subject', required: true },
        { key: 'category', label: 'Category', required: true }, { key: 'priority', label: 'Priority (Low, Medium, High, Critical)', required: true },
      ] })}>New support case</Button>} />
      {cases && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cases.metrics.map((item) => <SuperAdminMetricCard key={item.key} metric={item} />)}</div>}
      <Card className="overflow-hidden border-brand-200/60">
        <div className="flex flex-wrap items-center gap-3 border-b border-line bg-surface px-5 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-control bg-brand-50 text-link"><KeyRound size={18} /></span>
          <div className="min-w-0 flex-1"><h2 className="text-body-md font-semibold text-ink">Find a user and resolve access</h2><p className="text-2xs text-ink-muted">Recovery and owner-only force controls live together on each user record.</p></div>
          <label className="relative w-full sm:w-[340px]"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={15} /><input className="input h-9 pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, organization..." /></label>
        </div>
        {!users && <LoadingState rows={4} />}
        {users && <Table><thead><tr><Th>User</Th><Th>Organization</Th><Th>Status</Th><Th>Verification</Th><Th>MFA</Th><Th>Sessions</Th><Th>Controls</Th></tr></thead><tbody>{users.rows.map((user) => <tr key={String(user.id)} className="hover:bg-canvas"><Td><p className="font-semibold">{displayValue(user.name)}</p><p className="text-2xs text-ink-muted">{displayValue(user.email)}</p></Td><Td>{displayValue(user.organization)}</Td><Td><Badge tone={statusTone(user.status)}>{displayValue(user.status)}</Badge></Td><Td><Badge tone={statusTone(user.verified)}>{displayValue(user.verified)}</Badge></Td><Td><Badge tone={statusTone(user.mfa)}>{displayValue(user.mfa)}</Badge></Td><Td>{displayValue(user.sessions)}</Td><Td><Button variant="outline" className="h-8 px-3 text-2xs" onClick={() => navigate(`/admin/users/${user.id}`)}>Open controls <ArrowRight size={13} /></Button></Td></tr>)}</tbody></Table>}
      </Card>
      <Card className="overflow-hidden">
        <CardHeader icon={Building2} title="Customer support cases" action={<Badge tone="info">SLA-aware</Badge>} />
        {!cases && <LoadingState rows={4} />}
        {cases && <Table><thead><tr><Th>Case</Th><Th>Organization</Th><Th>Ticket</Th><Th>Requester</Th><Th>Subject</Th><Th>Category</Th><Th>Priority</Th><Th>SLA</Th><Th>Status</Th></tr></thead><tbody>{cases.rows.map((row) => <tr key={String(row.id)} className="hover:bg-canvas"><Td className="font-mono text-2xs">{displayValue(row.id)}</Td><Td className="font-semibold">{displayValue(row.organization)}</Td><Td>{displayValue(row.ticket)}</Td><Td>{displayValue(row.requester)}</Td><Td>{displayValue(row.subject)}</Td><Td>{displayValue(row.category)}</Td><Td><Badge tone={statusTone(row.priority)}>{displayValue(row.priority)}</Badge></Td><Td>{displayValue(row.sla)}</Td><Td><Badge tone={statusTone(row.status)}>{displayValue(row.status)}</Badge></Td></tr>)}</tbody></Table>}
      </Card>
      <Card className="border-brand-200/60 bg-brand-50/30 p-4"><div className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-link" size={18} /><p className="text-body-sm text-ink-soft"><b className="text-ink">Tenant isolation:</b> linked ticket metadata is visible for diagnosis, but platform cases cannot silently edit the tenant ticket. All platform-case mutations require fresh authentication and write an audit event.</p></div></Card>
      {action && <SensitiveActionDialog action={action} onClose={() => setAction(null)} onComplete={() => setRevision((value) => value + 1)} />}
    </div>
  );
}
