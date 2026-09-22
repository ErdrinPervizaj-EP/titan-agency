import { Link } from 'react-router-dom';
import { useT, useLocalizedPath } from '../i18n/useLang';
import { SERVICE_ICONS, SERVICE_COLORS } from '../lib/icons';
import Reveal from './Reveal';

export default function Features() {
  const t = useT();
  const lp = useLocalizedPath();

  return (
    <section id="services" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{t.services.tag}</span>
          <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
            {t.services.title}
          </h2>
          <p className="mt-4 text-navy-500">{t.services.sub}</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((f, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
              <Reveal key={f.title} delay={(i % 3) * 80}>
                <Link
                  to={`${lp('/services')}#${f.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${SERVICE_COLORS[i % SERVICE_COLORS.length]}`}>
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">{f.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-500">{f.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-500 opacity-0 transition group-hover:opacity-100">
                    {t.servicesPage.includedLabel} →
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to={lp('/services')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-navy-900 shadow-sm transition hover:bg-slate-50"
          >
            {t.servicesPage.viewAll} →
          </Link>
        </div>
      </div>
    </section>
  );
}
