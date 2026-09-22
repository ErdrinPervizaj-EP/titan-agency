import { useState } from 'react';
import { useT, useLocalizedPath } from '../i18n/useLang';

export default function SupportWidget() {
  const t = useT();
  const lp = useLocalizedPath();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-navy-900/15">
          <div className="flex items-start justify-between">
            <h3 className="font-display text-base font-bold text-navy-900">{t.supportWidget.title}</h3>
            <button
              onClick={() => setOpen(false)}
              aria-label={t.supportWidget.close}
              className="text-navy-400 hover:text-navy-900"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-sm text-navy-500">{t.supportWidget.sub}</p>

          <div className="mt-5 space-y-3 border-t border-slate-200 pt-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{t.supportWidget.emailLabel}</p>
              <a href="mailto:hello@titannetwork.io" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                hello@titannetwork.io
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{t.supportWidget.phoneLabel}</p>
              <a href="tel:+38344000000" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                +383 44 000 000
              </a>
            </div>
          </div>

          <a
            href={`${lp('/')}#contact`}
            onClick={() => setOpen(false)}
            className="mt-5 block w-full rounded-lg bg-indigo-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            {t.supportWidget.formCta}
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-navy-900 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-navy-900/25 transition hover:-translate-y-0.5 hover:bg-navy-950"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 4h16v12H8l-4 4V4Z" strokeLinejoin="round" />
        </svg>
        {t.supportWidget.label}
      </button>
    </div>
  );
}
