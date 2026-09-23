import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { useLocalizedPath, useT } from '../i18n/useLang';

export default function NotFoundPage() {
  const t = useT().notFound;
  const lp = useLocalizedPath();
  return (
    <>
      <Helmet>
        <title>{`${t.title} | Titan Network`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="mx-auto max-w-3xl px-6 py-32">
        <h1 className="font-display text-3xl font-bold text-navy-900">{t.title}</h1>
        <p className="mt-3 text-navy-400">{t.body}</p>
        <Link to={lp('/')} className="mt-6 inline-flex items-center gap-1.5 font-semibold text-indigo-500"><ArrowLeft size={16} /> {t.home}</Link>
      </div>
    </>
  );
}
