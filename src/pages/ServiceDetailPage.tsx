import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useT, useLocalizedPath } from '../i18n/useLang';
import Seo from '../components/Seo';
import { PageHeader, primaryButton } from '../components/Section';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const t = useT();
  const lp = useLocalizedPath();
  const p = t.servicesPage;

  const index = t.services.items.findIndex((s) => s.slug === slug);
  if (index === -1) return <Navigate to={lp('/services')} replace />;

  const service = t.services.items[index];
  const others = t.services.items.filter((_, i) => i !== index);

  return (
    <>
      <Seo
        path={`/services/${service.slug}`}
        titleEn={`${service.title} | Titan Network`}
        titleDe={`${service.title} | Titan Network`}
        descriptionEn={service.overview}
        descriptionDe={service.overview}
      />

      <PageHeader
        label={
          <Link to={lp('/services')} className="inline-flex items-center gap-1.5 hover:text-navy-900">
            <ArrowLeft size={15} aria-hidden /> {p.eyebrow} · {String(index + 1).padStart(2, '0')}
          </Link>
        }
        title={service.title}
        intro={service.overview}
      >
        <a href={`${lp('/')}#contact`} className={`mt-9 ${primaryButton}`}>{p.cta}</a>
      </PageHeader>

      <section className="border-t border-slate-200">
        <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-8 px-6 py-20 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <h2 className="text-sm font-medium text-navy-400 lg:pt-1">{p.includedLabel}</h2>
          <ol className="border-t border-slate-200">
            {service.included.map((item, i) => (
              <li key={item} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 border-b border-slate-200 py-5">
                <span className="font-mono text-sm text-navy-400">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-lg text-navy-800">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-6 px-6 py-16 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <h2 className="text-sm font-medium text-navy-400 lg:pt-1">{p.otherServices}</h2>
          <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {others.map((s) => (
              <li key={s.slug}>
                <Link to={`${lp('/services')}/${s.slug}`} className="font-semibold text-navy-900 underline decoration-slate-300 underline-offset-4 hover:decoration-navy-900">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
