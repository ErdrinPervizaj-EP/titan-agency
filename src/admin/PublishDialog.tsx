import { useRef, useState, type FormEvent } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { Button } from './ui';
import { useFocusTrap } from './lib/useFocusTrap';
import { authenticate, clearFreshAuthentication, hasFreshAuthentication } from './website-api';

const FRIENDLY: Record<string, string> = {
  fresh_authentication_required: 'Your verification expired. Enter your password again.',
  content_changed: 'Someone else saved this section meanwhile. Reload the page before saving again.',
  invalid_content: 'Some fields are not valid. Check web addresses start with https:// and required fields are filled.',
  blog_slug_taken: 'Another post already uses that web address (slug).',
  rate_limit_exceeded: 'Too many changes in a short time. Wait a few minutes.',
  stripe_subscription_active: 'This workspace still has a card subscription and Stripe is not configured on the server, so it cannot be ended. Cancel it in the Stripe dashboard first.',
  plan_managed_by_stripe: 'A card subscription decides this plan. Change it in Stripe or the customer’s billing settings, or move them to Enterprise.',
  stripe_request_failed: 'Stripe did not respond. Nothing was changed. Try again.',
};

/**
 * Confirms a website change: a reason for the audit log, plus a password (or
 * MFA) check when the last one is older than the server's five-minute window.
 */
export default function PublishDialog({ title, description, confirmLabel = 'Publish', danger = false, onConfirm, onClose }: {
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
}) {
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [needsAuth, setNeedsAuth] = useState(!hasFreshAuthentication());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  useFocusTrap(true, formRef);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (needsAuth) await authenticate(password, code || undefined);
      await onConfirm(reason.trim());
      onClose();
    } catch (caught) {
      const code = (caught as { code?: string }).code ?? '';
      if (code === 'fresh_authentication_required') { clearFreshAuthentication(); setNeedsAuth(true); }
      setError(FRIENDLY[code] ?? (caught instanceof Error ? caught.message : 'That did not work. Try again.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="publish-title">
      <form ref={formRef} onSubmit={submit} className="w-full max-w-lg rounded-card border border-line bg-surface p-5 shadow-pop">
        <div className="flex items-start gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-control ${danger ? 'bg-bad-bg text-bad' : 'bg-brand-50 text-link'}`}><ShieldCheck size={19} /></span>
          <div className="min-w-0 flex-1">
            <h2 id="publish-title" className="text-body-lg font-semibold text-ink">{title}</h2>
            <p className="mt-1 text-body-sm text-ink-soft">{description}</p>
          </div>
          <button type="button" onClick={onClose} className="focus-ring rounded-control text-ink-muted hover:text-ink" aria-label="Close"><X size={18} /></button>
        </div>
        <label className="mt-5 block text-2xs font-semibold text-ink-soft">Reason, for the audit log
          <input className="input mt-1.5" value={reason} onChange={(e) => setReason(e.target.value)} minLength={8} maxLength={500} required placeholder="e.g. Updated Business plan price" />
        </label>
        {needsAuth && (
          <>
            <label className="mt-4 block text-2xs font-semibold text-ink-soft">Your Super Admin password
              <input type="password" autoComplete="current-password" className="input mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label className="mt-4 block text-2xs font-semibold text-ink-soft">Authenticator or recovery code <span className="font-normal text-ink-muted">(if MFA is on)</span>
              <input autoComplete="one-time-code" className="input mt-1.5" value={code} onChange={(e) => setCode(e.target.value)} />
            </label>
            <p className="mt-2 text-2xs text-ink-muted">One check covers further changes for five minutes.</p>
          </>
        )}
        {error && <p role="alert" className="mt-4 rounded-control bg-bad-bg px-3 py-2 text-body-sm text-bad">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" className="h-9 px-3 text-body-sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant={danger ? 'danger' : 'primary'} className="h-9 px-3 text-body-sm" disabled={busy || reason.trim().length < 8 || (needsAuth && !password && !code)}>
            {busy ? 'Saving…' : confirmLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
