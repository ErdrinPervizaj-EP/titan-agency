import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { accountUrl, type AccountPage } from '../lib/account-links';
import { useT } from '../i18n/useLang';

/**
 * Old /login, /register and /forgot-password links on this site forward to
 * the shared account pages (the only place anyone signs in), keeping the
 * query string so things like ?returnTo= survive.
 */
export default function AccountRedirect({ page }: { page: AccountPage }) {
  const { search } = useLocation();
  const target = accountUrl(page, search);
  const t = useT();

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <section className="flex min-h-[50vh] items-center justify-center px-6 py-16 text-center">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      <p className="text-sm text-navy-500">
        {t.nav.redirecting}{' '}
        <a href={target} className="font-medium text-indigo-500 hover:text-indigo-600">{t.nav.continue}</a>
      </p>
    </section>
  );
}
