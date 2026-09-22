import { useEffect, useState } from 'react';
import { useT, useLocalizedPath } from '../i18n/useLang';

export default function CookieBanner() {
  const t = useT();
  const lp = useLocalizedPath();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent');
    if (!stored) setVisible(true);
  }, []);

  function decide(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem('cookie-consent', value);
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-navy-600">
          {t.cookieBanner.text}{' '}
          <a href={`${lp('/')}#`} className="underline hover:text-navy-900">
            {t.cookieBanner.settingsLink}
          </a>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => decide('declined')}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-navy-700 transition hover:bg-slate-50"
          >
            {t.cookieBanner.decline}
          </button>
          <button
            onClick={() => decide('accepted')}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            {t.cookieBanner.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
