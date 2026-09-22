import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import logoMark from '../assets/logo-mark.svg';
import { useT, useLocalizedPath } from '../i18n/useLang';

type Status = 'idle' | 'sending' | 'error';

export default function LoginPage() {
  const t = useT();
  const lp = useLocalizedPath();
  const p = t.loginPage;
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? p.errorGeneric);
        setStatus('error');
        return;
      }
      window.location.href = 'https://app.titandesk.io/dashboard';
    } catch {
      setError(p.errorGeneric);
      setStatus('error');
    }
  }

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 py-16">
      <Helmet>
        <title>{p.title} | Titan Network</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #4f63d2 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to={lp('/')} className="flex items-center gap-2.5">
            <img src={logoMark} alt="Titan Network" className="h-9 w-9" />
          </Link>
          <h1 className="font-display mt-5 text-2xl font-bold text-navy-900">{p.title}</h1>
          <p className="mt-2 text-sm text-navy-500">
            {p.notUser}{' '}
            <Link to={lp('/titandesk')} className="font-medium text-indigo-500 hover:text-indigo-600">
              {p.learnMore}
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-navy-900/5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-navy-700 transition hover:bg-slate-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23Z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.85Z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38Z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-navy-700 transition hover:bg-slate-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
                <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
                <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
                <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
              </svg>
              Microsoft
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-navy-400">{p.or}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy-500">{p.email}</label>
              <input
                name="email"
                type="email"
                required
                defaultValue="demo@titannetwork.io"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy-500">{p.password}</label>
              <input
                name="password"
                type="password"
                required
                defaultValue="Demo1234!"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-full bg-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:opacity-60"
            >
              {status === 'sending' ? p.signingIn : p.signIn}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-navy-400">{p.demoNote}</p>
        </div>

        <p className="mt-6 text-center text-sm text-navy-400">
          <Link to={lp('/')} className="hover:text-navy-700">{p.back}</Link>
        </p>
      </div>
    </section>
  );
}
