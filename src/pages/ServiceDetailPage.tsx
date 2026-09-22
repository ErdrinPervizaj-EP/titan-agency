import { useParams, Link, Navigate } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import { useT, useLocalizedPath } from '../i18n/useLang';
import { SERVICE_ICONS, SERVICE_COLORS } from '../lib/icons';
import Seo from '../components/Seo';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const t = useT();
  const lp = useLocalizedPath();
  const p = t.servicesPage;

  const index = t.services.items.findIndex((s) => s.slug === slug);
  if (index === -1) return <Navigate to={lp('/services')} replace />;

  const service = t.services.items[index];
  const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
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

      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <Link to={lp('/services')} className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900">
            <ArrowLeft size={16} /> {p.eyebrow}
          </Link>
          <div className={`mt-6 flex h-12 w-12 items-center justify-center rounded-xl ${SERVICE_COLORS[index % SERVICE_COLORS.length]}`}>
            <Icon size={24} strokeWidth={1.75} />
          </div>
          <h1 className="font-display mt-5 text-3xl font-bold text-navy-900 sm:text-4xl">{service.title}</h1>
          <p className="mt-4 text-lg text-navy-500">{service.overview}</p>
          <a
            href={`${lp('/')}#contact`}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            {p.cta}
          </a>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-navy-400">{p.includedLabel}</p>
          <ul className="mt-5 space-y-4">
            {service.included.map((item) => (
              <li key={item} className="flex items-start gap-3 text-navy-700">
                <Check size={20} strokeWidth={2} className="mt-0.5 shrink-0 text-teal-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-navy-400">{t.nav.services}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((s) => {
              const i2 = t.services.items.findIndex((x) => x.slug === s.slug);
              const OtherIcon = SERVICE_ICONS[i2 % SERVICE_ICONS.length];
              return (
                <Link
                  key={s.slug}
                  to={`${lp('/services')}/${s.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${SERVICE_COLORS[i2 % SERVICE_COLORS.length]}`}>
                    <OtherIcon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="text-sm font-semibold text-navy-900">{s.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
