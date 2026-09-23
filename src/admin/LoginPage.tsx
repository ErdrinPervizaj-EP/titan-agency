import { useState } from 'react';
import type { FormEvent } from 'react';
import { AlertCircle, LoaderCircle, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui';
import { useSuperAdminAuth } from './auth';
import { accountUrl } from '../lib/account-links';

export default function AdminLoginPage() {
  const { login, completeMfa, isAuthenticated } = useSuperAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [code, setCode] = useState('');

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mfaRequired) await completeMfa(code);
      else {
        const result = await login(email, password);
        if (result.mfaRequired) {
          setMfaRequired(true);
          return;
        }
      }
      const destination = (location.state as { from?: string } | null)?.from ?? '/admin';
      navigate(destination, { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-scope relative grid min-h-screen place-items-center bg-canvas px-4 py-20">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-card border border-line bg-surface shadow-pop md:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-navy-900 p-10 text-white md:flex md:flex-col">
          <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-white/10"><ShieldCheck size={22} /></span>
          <div className="my-auto">
            <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-white/55">Titan Network internal</p>
            <h1 className="mt-3 max-w-md text-[36px] font-semibold leading-tight tracking-tight">Platform administration</h1>
            <p className="mt-4 max-w-md text-body-sm leading-relaxed text-white/80">Manage organizations, access and service operations for Desk.TitanNetwork. Sensitive changes require identity verification and are recorded in the audit log.</p>
          </div>
          <p className="text-2xs text-white/45">Authorized Titan Network platform owners only</p>
        </section>

        <section className="p-5 sm:p-8">
          <span className="section-icon"><LockKeyhole size={17} /></span>
          <h2 className="mt-5 page-title">Super Admin sign in</h2>
          <p className="mt-2 text-body-sm text-ink-soft">Use your authorized platform account.</p>
          {error && <div className="mt-5 flex items-start gap-2 rounded-control border border-bad/25 bg-bad-bg/40 px-3.5 py-3 text-body-sm text-bad"><AlertCircle className="mt-0.5 shrink-0" size={16} />{error}</div>}
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mfaRequired ? (
              <label className="block text-2xs font-semibold text-ink-soft">Verification or recovery code<input autoComplete="one-time-code" className="input mt-1.5" value={code} onChange={(event) => setCode(event.target.value)} required autoFocus /></label>
            ) : <>
              <label className="block text-2xs font-semibold text-ink-soft">Email<input type="email" autoComplete="username" className="input mt-1.5" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              <label className="block text-2xs font-semibold text-ink-soft">Password<input type="password" autoComplete="current-password" className="input mt-1.5" value={password} onChange={(event) => setPassword(event.target.value)} minLength={10} required /></label>
            </>}
            <Button className="w-full" type="submit" disabled={busy}>{busy && <LoaderCircle className="animate-spin" size={16} />}{busy ? 'Checking…' : mfaRequired ? 'Verify and continue' : 'Enter control center'}</Button>
          </form>
          <p className="mt-5 border-t border-line-soft pt-4 text-body-xs text-ink-soft">Looking for your company workspace? <a href={accountUrl('login')} className="focus-ring rounded font-medium text-link">Workspace sign in</a></p>
        </section>
      </div>
    </main>
  );
}
