import { UsersRound, ShieldCheck as PanelShieldCheck, History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ArrowLeft, Building2, KeyRound, MailCheck, MonitorX, ShieldCheck, ShieldOff, UserCheck, UserRoundX } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, Card, CardHeader } from './ui';
import { superAdminApi } from './api';
import { ErrorState, LoadingState, SensitiveActionDialog } from './components';
import type { SensitiveActionSpec } from './components';
import { displayValue, statusTone } from './resource-config';

const supportActions = [
  { key: 'password-reset', label: 'Send reset link', icon: KeyRound, description: 'Generate a password-reset email. Existing passwords remain inaccessible.' },
  { key: 'unlock', label: 'Unlock account', icon: UserCheck, description: 'Clear the temporary account lockout.' },
  { key: 'verification', label: 'Resend verification', icon: MailCheck, description: 'Send a fresh email-verification link.' },
  { key: 'mfa-recovery', label: 'Start MFA recovery', icon: ShieldCheck, description: 'Begin the identity-verified MFA recovery workflow.' },
  { key: 'revoke-sessions', label: 'Revoke sessions', icon: MonitorX, description: 'Sign the user out from every active session.', danger: true },
];

const ownerActions = [
  { key: 'disable', label: 'Disable account', icon: UserRoundX, description: 'Block sign-in while keeping the account and audit history.', danger: true },
  { key: 'remove-workspace', label: 'Remove workspace access', icon: Building2, description: 'Remove this user from the selected customer workspace.', danger: true },
  { key: 'platform-role', label: 'Change platform role', icon: ShieldOff, description: 'Change platform-level access separately from organization roles.', danger: true },
];

export default function UserDetailPage() {
  const { id = '' } = useParams();
  // Keyed by id: after navigating to another record, the old one reads as not loaded.
  const [loaded, setLoaded] = useState<{ id: string; data: Record<string, unknown> | null; error: string } | null>(null);
  const data = loaded?.id === id ? loaded.data : null;
  const error = loaded?.id === id ? loaded.error : '';
  const [revision, setRevision] = useState(0);
  const [action, setAction] = useState<SensitiveActionSpec | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    superAdminApi.user(id, controller.signal).then(({ data: result }) => setLoaded({ id, data: result, error: '' })).catch((caught: unknown) => {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setLoaded(current => ({ id, data: current?.id === id ? current.data : null, error: caught instanceof Error ? caught.message : 'Unable to load user' }));
    });
    return () => controller.abort();
  }, [id, revision]);

  function chooseAction(item: (typeof supportActions)[number] | (typeof ownerActions)[number]) {
    // isRealSensitiveAction() matches on the endpoint's final path segment, not
    // the "/preview/" prefix — "disable" hits the real user-status workflow;
    // the rest have no backend yet and are recorded as a preview only.
    setAction({ title: item.label, description: item.description, confirmLabel: item.label, endpoint: `/preview/users/${item.key}`, body: { targetId: id }, danger: item.danger });
  }

  if (error) return <Card><ErrorState message={error} onRetry={() => setRevision((value) => value + 1)} /></Card>;
  if (!data) return <Card><LoadingState rows={9} /></Card>;

  const identity = ['email', 'organization', 'organizationRole', 'platformRole', 'status', 'verified', 'mfa', 'createdAt'];
  return (
    <div className="space-y-5">
      <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-link"><ArrowLeft size={15} /> Back to all users</Link>
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-card border border-line bg-surface p-5">
        <div><p className="text-2xs font-semibold uppercase tracking-[0.12em] text-link">Customer support + owner controls</p><div className="mt-1 flex items-center gap-3"><h1 className="page-title">{displayValue(data.name)}</h1><Badge tone={statusTone(data.status)}>{displayValue(data.status)}</Badge></div><p className="mt-1 text-body-sm text-ink-soft">{displayValue(data.email)} · {displayValue(data.organization)}</p></div>
        <Link to={`/admin/organizations/${data.organizationId}`}><Button variant="outline" className="h-9 px-3 text-body-sm" icon={Building2}>Organization</Button></Link>
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="overflow-hidden"><CardHeader icon={UsersRound} title="Account identity" /><dl className="divide-y divide-line-soft px-5">{identity.map((key) => <div key={key} className="flex items-center justify-between gap-4 py-3"><dt className="text-2xs font-semibold capitalize text-ink-muted">{key.replace(/([A-Z])/g, ' $1')}</dt><dd className="max-w-[62%] truncate text-right text-body-sm font-medium text-ink">{['status', 'verified', 'mfa', 'platformRole'].includes(key) ? <Badge tone={statusTone(data[key])}>{displayValue(data[key])}</Badge> : displayValue(data[key])}</dd></div>)}</dl></Card>
        <div className="space-y-4">
          <Card className="overflow-hidden"><CardHeader icon={UsersRound} title="Support & account recovery" /><div className="grid gap-2 p-4 sm:grid-cols-2">{supportActions.map((item) => <button key={item.key} onClick={() => chooseAction(item)} className="flex gap-3 rounded-control border border-line bg-surface p-3 text-left hover:border-brand-200 hover:bg-surface"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-control bg-brand-50 text-link"><item.icon size={17} /></span><span><span className="block text-body-sm font-semibold text-ink">{item.label}</span><span className="mt-0.5 block text-2xs leading-snug text-ink-muted">{item.description}</span></span></button>)}</div></Card>
          <Card className="overflow-hidden border-bad/20"><CardHeader icon={PanelShieldCheck} title="Owner-only force actions" /><div className="grid gap-2 p-4 sm:grid-cols-3">{ownerActions.map((item) => <button key={item.key} onClick={() => chooseAction(item)} className="rounded-control border border-bad/20 bg-bad-bg/20 p-3 text-left hover:bg-bad-bg/50"><item.icon size={17} className="text-bad" /><span className="mt-2 block text-body-sm font-semibold text-ink">{item.label}</span><span className="mt-0.5 block text-2xs leading-snug text-ink-muted">{item.description}</span></button>)}</div></Card>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="overflow-hidden"><CardHeader icon={PanelShieldCheck} title="Security context" /><div className="p-5">{Array.isArray(data.securityEvents) && data.securityEvents.length ? <pre className="whitespace-pre-wrap rounded-control bg-line-soft p-3 text-2xs text-ink-soft">{JSON.stringify(data.securityEvents, null, 2)}</pre> : <p className="text-body-sm text-ink-muted">No recent security events for this user.</p>}</div></Card>
        <Card className="overflow-hidden"><CardHeader icon={History} title="Account audit history" /><div className="p-5">{Array.isArray(data.auditHistory) && data.auditHistory.length ? <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-control bg-line-soft p-3 text-2xs text-ink-soft">{JSON.stringify(data.auditHistory, null, 2)}</pre> : <p className="text-body-sm text-ink-muted">No user-specific audit events in this preview.</p>}</div></Card>
      </div>
      {action && <SensitiveActionDialog action={action} onClose={() => setAction(null)} onComplete={() => setRevision((value) => value + 1)} />}
    </div>
  );
}
