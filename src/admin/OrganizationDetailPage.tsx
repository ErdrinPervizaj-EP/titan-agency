import { Building2, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock3, FlaskConical, Gauge, MessageSquareText, ShieldBan, UserRoundCog } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, Card, CardHeader, Table, Td, Th } from './ui';
import { superAdminApi } from './api';
import { ErrorState, LoadingState, SensitiveActionDialog } from './components';
import PublishDialog from './PublishDialog';
import { useSuperAdminToast } from './toast';
import { websiteApi } from './website-api';
import type { SensitiveActionSpec } from './components';
import { displayValue, statusTone } from './resource-config';

const organizationActions = [
  { key: 'extend-trial', label: 'Extend trial', icon: Clock3, description: 'Add time to the current trial.' },
  { key: 'custom-limits', label: 'Custom limits', icon: Gauge, description: 'Apply organization-specific consumption limits.' },
  { key: 'beta-features', label: 'Beta features', icon: FlaskConical, description: 'Enable an organization-targeted beta.' },
  { key: 'internal-note', label: 'Internal note', icon: MessageSquareText, description: 'Add an internal owner note.' },
  { key: 'suspend', label: 'Suspend organization', icon: ShieldBan, description: 'Block workspace access while preserving records.', danger: true },
];

export default function OrganizationDetailPage() {
  const { id = '' } = useParams();
  // Keyed by id: after navigating to another record, the old one reads as not loaded.
  const [loaded, setLoaded] = useState<{ id: string; data: Record<string, unknown> | null; error: string } | null>(null);
  const data = loaded?.id === id ? loaded.data : null;
  const error = loaded?.id === id ? loaded.error : '';
  const [revision, setRevision] = useState(0);
  const [action, setAction] = useState<SensitiveActionSpec | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    superAdminApi.organization(id, controller.signal).then(({ data: result }) => setLoaded({ id, data: result, error: '' })).catch((caught: unknown) => {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setLoaded(current => ({ id, data: current?.id === id ? current.data : null, error: caught instanceof Error ? caught.message : 'Unable to load organization' }));
    });
    return () => controller.abort();
  }, [id, revision]);

  function chooseAction(item: (typeof organizationActions)[number]) {
    // "suspend" hits the real workspace-suspension workflow (isRealSensitiveAction
    // matches by action name); the rest have no backend yet and preview only.
    setAction({ title: item.label, description: item.description, confirmLabel: item.label, endpoint: `/preview/organizations/${item.key}`, body: { targetId: id }, danger: item.danger });
  }

  if (error) return <Card><ErrorState message={error} onRetry={() => setRevision((value) => value + 1)} /></Card>;
  if (!data) return <Card><LoadingState rows={9} /></Card>;
  const users = Array.isArray(data.users) ? data.users as Array<Record<string, unknown>> : [];

  return (
    <div className="space-y-5">
      <Link to="/admin/organizations" className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-link"><ArrowLeft size={15} /> Back to organizations</Link>
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-card border border-line bg-surface p-5"><div><p className="text-2xs font-semibold uppercase tracking-[0.12em] text-link">Organization control</p><div className="mt-1 flex items-center gap-3"><h1 className="page-title">{displayValue(data.name)}</h1><Badge tone={statusTone(data.status)}>{displayValue(data.status)}</Badge></div><p className="mt-1 text-body-sm text-ink-soft">Created {displayValue(data.createdAt)}</p></div><Button variant="danger" className="h-9 px-3 text-body-sm" icon={UserRoundCog} onClick={() => chooseAction({ key: 'suspend', label: 'Suspend organization', icon: ShieldBan, description: 'Block workspace access while preserving records.', danger: true })}>Suspend</Button></div>
      <Card className="overflow-hidden"><CardHeader icon={Building2} title="Organization controls" /><div className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">{organizationActions.map((item) => <button key={item.key} onClick={() => chooseAction(item)} className={`flex gap-3 rounded-control border p-3 text-left ${item.danger ? 'border-bad/20 bg-bad-bg/20 hover:bg-bad-bg/50' : 'border-line bg-surface hover:border-brand-200'}`}><item.icon size={17} className={item.danger ? 'mt-0.5 text-bad' : 'mt-0.5 text-link'} /><span><span className="block text-body-sm font-semibold text-ink">{item.label}</span><span className="block text-2xs text-ink-muted">{item.description}</span></span></button>)}</div></Card>
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden"><CardHeader icon={Building2} title="Organization users" /><Table><thead><tr><Th>Name</Th><Th>Role</Th><Th>Status</Th></tr></thead><tbody>{users.map((user) => <tr key={String(user.id)}><Td><Link className="font-semibold text-link" to={`/admin/users/${user.id}`}>{displayValue(user.name)}</Link><p className="text-2xs text-ink-muted">{displayValue(user.email)}</p></Td><Td>{displayValue(user.role)}</Td><Td><Badge tone={statusTone(user.status)}>{displayValue(user.status)}</Badge></Td></tr>)}</tbody></Table></Card>
        <PlanCard organizationId={id} plan={String(data.plan ?? '')} onChanged={() => setRevision((value) => value + 1)} />
      </div>
      {action && <SensitiveActionDialog action={action} onClose={() => setAction(null)} onComplete={() => setRevision((value) => value + 1)} />}
    </div>
  );
}

const PLANS = ['Trial', 'Team', 'Business', 'Enterprise'] as const;
/** Pre-rename names map to what they became, so the card never shows a plan that no longer exists. */
const CURRENT_NAME: Record<string, (typeof PLANS)[number]> = { 'Service Desk': 'Team', 'Managed IT': 'Business', MSP: 'Business' };

/** Moves a workspace between plans. Enterprise is set up by sales, so this is where it is assigned. */
function PlanCard({ organizationId, plan, onChanged }: { organizationId: string; plan: string; onChanged: () => void }) {
  const { push } = useSuperAdminToast();
  const current = (PLANS as readonly string[]).includes(plan) ? (plan as (typeof PLANS)[number]) : CURRENT_NAME[plan] ?? 'Team';
  const [choice, setChoice] = useState<(typeof PLANS)[number]>(current);
  const [confirming, setConfirming] = useState(false);
  return (
    <Card className="overflow-hidden">
      <CardHeader icon={CreditCard} title="Plan" />
      <div className="space-y-4 p-5">
        <p className="text-body-sm text-ink-soft">Current plan: <Badge tone="brand">{current}</Badge></p>
        <label className="block text-2xs font-semibold text-ink-soft">Change to
          <select className="input mt-1.5" value={choice} onChange={(e) => setChoice(e.target.value as (typeof PLANS)[number])}>
            {PLANS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <p className="text-2xs text-ink-muted">Changes what the workspace can use right away. Moving to Enterprise ends any card subscription immediately (no refund is issued; credit it on the first invoice) and locks out self-serve billing. While a card subscription is live, Team and Business follow Stripe and cannot be changed here.</p>
        <Button type="button" className="h-9 px-3 text-body-sm" disabled={choice === current} onClick={() => setConfirming(true)}>Change plan</Button>
      </div>
      {confirming && (
        <PublishDialog
          title={`Move this workspace to ${choice}`}
          description="Access to modules and gateway limits changes immediately."
          confirmLabel="Change plan"
          onClose={() => setConfirming(false)}
          onConfirm={async (reason) => {
            await websiteApi.setPlan(organizationId, choice, reason);
            push(`Workspace moved to ${choice}`);
            onChanged();
          }}
        />
      )}
    </Card>
  );
}
