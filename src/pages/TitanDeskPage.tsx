import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import ProductIcon from '../components/ProductIcon';
import ProductTour from '../components/ProductTour';
import Testimonials from '../components/Testimonials';
import Seo from '../components/Seo';
import NetworkMock from '../components/mocks/NetworkMock';
import ReportsMock from '../components/mocks/ReportsMock';
import { useT, useLocalizedPath } from '../i18n/useLang';

export default function TitanDeskPage() {
  const t = useT();
  const lp = useLocalizedPath();
  const p = t.titandeskPage;

  return (
    <>
      <Seo
        path="/titandesk"
        titleEn="TitanDesk — Service Desk, CRM & Network Ops | Titan Network"
        titleDe="TitanDesk — Service Desk, CRM & Network Ops | Titan Network"
        descriptionEn="TitanDesk unifies tickets, network monitoring, client CRM, and reporting in one workspace. Built by Titan Network for MSPs and internal IT teams."
        descriptionDe="TitanDesk vereint Tickets, Netzwerküberwachung, Kunden-CRM und Reporting in einem Workspace. Entwickelt von Titan Network für MSPs und interne IT-Teams."
      />

      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-20 lg:pt-28">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
        <div
          className="pointer-events-none absolute -top-40 right-0 h-[560px] w-[560px] rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4f63d2 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-navy-400">
            <span>{p.partOf}</span>
            <Link to={lp('/')} className="font-semibold text-navy-700 hover:text-navy-900">
              Titan Network
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <ProductIcon product="titandesk" size={56} />
          </div>

          <h1 className="font-display text-balance mt-6 text-4xl font-bold leading-[1.08] text-navy-900 sm:text-5xl">
            {p.title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-navy-500">{p.sub}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={lp('/login')}
              className="rounded-lg bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-600"
            >
              {p.ctaPrimary}
            </Link>
            <a
              href={`${lp('/')}#contact`}
              className="rounded-lg border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-sm transition hover:bg-slate-50"
            >
              {p.ctaSecondary}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {p.audiences.map((a) => (
              <span key={a} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-navy-500">
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Full product tour */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600">{p.tourTag}</span>
            <h2 className="font-display mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">{p.tourTitle}</h2>
          </div>
          <div className="mt-12">
            <ProductTour />
          </div>
        </div>
      </section>

      {/* Alternating feature highlights */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl space-y-24 px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{p.highlight1Tag}</span>
              <h3 className="font-display mt-4 text-2xl font-bold text-navy-900 sm:text-3xl">{p.highlight1Title}</h3>
              <p className="mt-4 text-navy-500">{p.highlight1Desc}</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl shadow-navy-900/10">
              <NetworkMock />
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 overflow-hidden rounded-2xl border border-slate-200 shadow-xl shadow-navy-900/10 lg:order-1">
              <ReportsMock />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-600">{p.highlight2Tag}</span>
              <h3 className="font-display mt-4 text-2xl font-bold text-navy-900 sm:text-3xl">{p.highlight2Title}</h3>
              <p className="mt-4 text-navy-500">{p.highlight2Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* TitanDesk pricing */}
      <section id="titandesk-pricing" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600">{p.pricingTag}</span>
            <h2 className="font-display mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">{p.pricingTitle}</h2>
            <p className="mt-4 text-navy-500">{p.pricingSub}</p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {p.plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.featured ? 'border-indigo-200 bg-white shadow-2xl shadow-indigo-500/10 lg:-translate-y-3' : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-bold text-white">
                    {t.pricing.mostPopular}
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-navy-900">{plan.name}</h3>
                <p className="mt-1.5 text-sm text-navy-400">{plan.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-navy-900">{plan.price}</span>
                  <span className="text-sm text-navy-400">{plan.period}</span>
                </div>
                <ul className="mt-7 flex-1 space-y-3.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-navy-600">
                      <Check size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-teal-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={lp('/login')}
                  className={`mt-8 rounded-lg py-3 text-center text-sm font-semibold transition ${
                    plan.featured ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'border border-slate-200 text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  {p.pricingCta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">{p.finalCtaTitle}</h2>
          <p className="mt-3 text-navy-500">{p.finalCtaSub}</p>
          <Link
            to={lp('/login')}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-600"
          >
            {p.ctaPrimary}
          </Link>
        </div>
      </section>
    </>
  );
}
