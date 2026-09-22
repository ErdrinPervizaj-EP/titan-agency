import { Check } from 'lucide-react';
import { useT } from '../i18n/useLang';

export default function Pricing() {
  const t = useT();

  return (
    <section id="pricing" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">{t.pricing.tag}</span>
          <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-navy-500">{t.pricing.sub}</p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {t.pricing.plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                p.featured
                  ? 'border-indigo-200 bg-white shadow-2xl shadow-indigo-500/10 lg:-translate-y-3'
                  : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-bold text-white">
                  {t.pricing.mostPopular}
                </span>
              )}
              <h3 className="font-display text-xl font-bold text-navy-900">{p.name}</h3>
              <p className="mt-1.5 text-sm text-navy-400">{p.desc}</p>

              <div className="mt-6 inline-flex w-fit items-center rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-navy-600">
                {p.scope}
              </div>

              <ul className="mt-7 flex-1 space-y-3.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-navy-600">
                    <Check size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-teal-600" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 rounded-lg py-3 text-center text-sm font-semibold transition ${
                  p.featured
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                    : 'border border-slate-200 text-navy-900 hover:bg-slate-50'
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-navy-400">{t.pricing.quoteNote}</p>
      </div>
    </section>
  );
}
