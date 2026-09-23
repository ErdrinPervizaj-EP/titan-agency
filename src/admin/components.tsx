import { useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, CircleAlert, RotateCcw, X } from 'lucide-react';
import Drawer from './Drawer';
import { Badge, Button, EmptyState, Card } from './ui';
import { useFocusTrap } from './lib/useFocusTrap';
import { superAdminApi, isRealSensitiveAction } from './api';
import { useSuperAdminToast } from './toast';
import type { MetricDatum } from './types';

export function SuperAdminMetricCard({ metric }: { metric: MetricDatum }) {
  const iconTone = { neutral: 'bg-line-soft text-ink-soft', ok: 'bg-ok-bg text-ok', warn: 'bg-warn-bg text-warn', bad: 'bg-bad-bg text-bad', info: 'bg-info-bg text-info' }[metric.tone ?? 'neutral'];
  return (
    <Card className="min-w-0 px-5 py-4">
      <span className={`inline-flex rounded-control px-2.5 py-1 text-2xs font-semibold ${iconTone}`}>{metric.label}</span>
      <span className="mt-2 block break-words text-[26px] font-semibold leading-8 tracking-tight text-ink tabular-nums">{metric.value}</span>
      {metric.hint && <span className="mt-2 block text-xs leading-5 text-ink-soft">{metric.hint}</span>}
    </Card>
  );
}

export function LoadingState({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3 p-5" aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => <div key={index} className="h-11 rounded-control bg-line-soft" />)}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-5 py-10 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-control bg-bad-bg text-bad"><CircleAlert size={20} aria-hidden="true" /></span>
      <div><p className="text-sm font-semibold text-ink">Could not load this page</p><p className="mt-1 max-w-lg text-sm text-ink-soft">{message}</p></div>
      <Button type="button" variant="outline" icon={RotateCcw} onClick={onRetry}>Try again</Button>
    </div>
  );
}

export { EmptyState };

export function Pagination({ page, totalPages, total, onPage }: { page: number; totalPages: number; total: number; onPage: (page: number) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft px-5 py-3.5">
      <p className="text-2xs text-ink-soft">{total.toLocaleString()} records · Page {page} of {totalPages}</p>
      <div className="flex gap-1.5">
        <Button variant="outline" className="h-8 w-8 p-0" aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)}><ChevronLeft size={15} /></Button>
        <Button variant="outline" className="h-8 w-8 p-0" aria-label="Next page" disabled={page >= totalPages} onClick={() => onPage(page + 1)}><ChevronRight size={15} /></Button>
      </div>
    </div>
  );
}

export function DetailDrawer({ title, row, onClose }: { title: string; row: Record<string, unknown>; onClose: () => void }) {
  return (
    <Drawer open title={`${title} details`} onClose={onClose} width={512}>
      <Badge>Read-only details</Badge>
      <dl className="mt-5 divide-y divide-line-soft rounded-card border border-line bg-surface px-4">
        {Object.entries(row).map(([key, value]) => (
          <div key={key} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
            <dt className="text-2xs font-semibold uppercase tracking-wide text-ink-muted">{key.replace(/([A-Z])/g, ' $1')}</dt>
            <dd className="break-words text-body-sm text-ink">{typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? '—')}</dd>
          </div>
        ))}
      </dl>
    </Drawer>
  );
}

export interface SensitiveActionSpec {
  title: string;
  description: string;
  confirmLabel: string;
  endpoint: string;
  method?: string;
  body: Record<string, unknown>;
  danger?: boolean;
  inputs?: Array<{ key: string; label: string; type?: 'text' | 'number' | 'datetime-local'; required?: boolean; placeholder?: string; min?: number; max?: number }>;
}

/**
 * Every sensitive action — suspend a workspace, disable a user, kill a
 * feature flag — requires fresh password/MFA re-authentication on top of
 * an already-authenticated session, and is recorded to the immutable audit
 * log with a stated reason. Actions without a real backend workflow yet
 * are labeled "Preview only" and confirmed to have made no change.
 */
export function SensitiveActionDialog({ action, onClose, onComplete }: { action: SensitiveActionSpec; onClose: () => void; onComplete?: () => void }) {
  const { push } = useSuperAdminToast();
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [values, setValues] = useState<Record<string, unknown>>(action.body);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusTrap(true, formRef);
  const isReal = isRealSensitiveAction(action.endpoint);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const { stepUpToken } = await superAdminApi.reauthenticate(password, mfaCode || undefined);
      await superAdminApi.sensitive(action.endpoint, { ...values, reason }, stepUpToken, action.method);
      push(isReal ? `${action.confirmLabel} completed` : `${action.confirmLabel}: recorded as a preview only, nothing was changed`, isReal ? undefined : 'error');
      onComplete?.();
      onClose();
    } catch (error) {
      push(error instanceof Error ? error.message : 'Sensitive action failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="sensitive-action-title">
      <form ref={formRef} onSubmit={submit} className="w-full max-w-lg rounded-card border border-line bg-surface p-5 shadow-pop">
        <div className="flex items-start gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-control ${action.danger ? 'bg-bad-bg text-bad' : 'bg-warn-bg text-warn'}`}><AlertTriangle size={19} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="sensitive-action-title" className="text-body-lg font-semibold text-ink">{action.title}</h2>
              {isReal ? <Badge tone="ok">Persists</Badge> : <Badge tone="warn">Preview only</Badge>}
            </div>
            <p className="mt-1 text-body-sm text-ink-soft">{action.description}</p>
          </div>
          <button type="button" onClick={onClose} className="focus-ring rounded-control text-ink-muted hover:text-ink" aria-label="Close"><X size={18} /></button>
        </div>
        {!isReal && (
          <p className="mt-3 rounded-control border border-warn/30 bg-warn-bg px-3 py-2 text-2xs text-warn">
            This action has no backend behind it yet. Submitting only records a preview audit entry — it will not change anything for this organization or user.
          </p>
        )}
        {action.inputs?.map((input) => (
          <label key={input.key} className="mt-4 block text-2xs font-semibold text-ink-soft">
            {input.label}
            <input type={input.type ?? 'text'} className="input mt-1.5" required={input.required} placeholder={input.placeholder} min={input.min} max={input.max} value={String(values[input.key] ?? '')} onChange={(event) => setValues((current) => ({ ...current, [input.key]: input.type === 'number' ? Number(event.target.value) : event.target.value }))} />
          </label>
        ))}
        <label className="mt-5 block text-2xs font-semibold text-ink-soft">Reason for immutable audit log<input className="input mt-1.5" value={reason} onChange={(event) => setReason(event.target.value)} minLength={8} required placeholder="Explain why this action is necessary" /></label>
        <label className="mt-4 block text-2xs font-semibold text-ink-soft">Re-enter your Super Admin password <span className="font-normal text-ink-muted">(provider-only accounts can use MFA instead)</span><input type="password" autoComplete="current-password" className="input mt-1.5" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <label className="mt-4 block text-2xs font-semibold text-ink-soft">Authenticator or recovery code <span className="font-normal text-ink-muted">(required when MFA is enabled)</span><input autoComplete="one-time-code" className="input mt-1.5" value={mfaCode} onChange={(event) => setMfaCode(event.target.value)} /></label>
        <p className="mt-2 text-2xs text-ink-muted">Real actions require fresh server-side verification on this session and expire after five minutes.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" className="h-9 px-3 text-body-sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant={action.danger ? 'danger' : 'primary'} className="h-9 px-3 text-body-sm" disabled={busy || reason.length < 8 || (!password && !mfaCode)}>{action.confirmLabel}</Button>
        </div>
      </form>
    </div>
  );
}

export function PageIntro({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="page-title">{title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-soft"><Badge>{eyebrow}</Badge><span>{description}</span></div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
