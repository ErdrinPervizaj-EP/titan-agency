import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, BadgeCheck, Building2, CalendarDays, Check, CreditCard, FolderKanban, LayoutDashboard, Minus, MonitorSmartphone, Network, Receipt, Router, Server, ShieldCheck, Ticket, Wallet, Wifi } from 'lucide-react';
import FeaturesGrid from '../components/FeaturesGrid';
import FloatingIcons from '../components/FloatingIcons';
import Seo from '../components/Seo';
import Section, { primaryButton, secondaryButton } from '../components/Section';
import TitanDeskReplica, { type ReplicaPage } from '../components/replica/TitanDeskReplica';
import ProductPanel from '../components/replica/ProductPanel';
import ProductPlans from '../components/ProductPlans';
import { NetworkView, ReportsView } from '../components/replica/views';
import { useParallax } from '../hooks/useParallax';
import { useT, useLocalizedPath } from '../i18n/useLang';
import { accountUrl } from '../lib/account-links';

export default function TitanDeskPage() {
  const t = useT();
  const lp = useLocalizedPath();
  const p = t.titandeskPage;
  const heroRef = useParallax<HTMLElement>();
  const [tourPage, setTourPage] = useState<ReplicaPage>('home');
  const tourStep = p.tour.find((step) => step.page === tourPage) ?? p.tour[0];

  return (
    <>
      <Seo
        path="/titandesk"
        titleEn="TitanDesk — Service Desk, CRM & Network Ops | Titan Network"
        titleDe="TitanDesk — Service Desk, CRM & Network Ops | Titan Network"
        descriptionEn="TitanDesk unifies tickets, network monitoring, client CRM, and reporting in one workspace. Built by Titan Network for MSPs and internal IT teams."
        descriptionDe="TitanDesk vereint Tickets, Netzwerküberwachung, Kunden-CRM und Reporting in einem Workspace. Entwickelt von Titan Network für MSPs und interne IT-Teams."
      />

      {/* Hero: headline, then the product itself */}
      <section ref={heroRef} className="overflow-hidden">
        <div className="relative isolate mx-auto max-w-6xl px-6 pb-4 pt-16 sm:pt-24">
          <FloatingIcons />
          <p className="text-sm font-medium text-navy-400">
            {p.partOf}{' '}
            <Link to={lp('/')} className="font-semibold text-indigo-500 hover:text-indigo-600">Titan Network</Link>
          </p>
          <h1 className="font-display text-balance mt-5 max-w-3xl text-4xl font-bold leading-[1.05] text-navy-900 sm:text-6xl">{p.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-500">{p.sub}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href={accountUrl('signup')} className={primaryButton}>{p.ctaPrimary}</a>
            <a href="#pricing" className={secondaryButton}>{p.pricingTag}</a>
          </div>
          <p className="mt-8 text-sm text-navy-400">{p.audiences.join(' · ')}</p>
        </div>
        <figure className="mx-auto mt-14 max-w-6xl px-6 [perspective:1600px] sm:mt-16">
          <div
            className="origin-top overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_40px_80px_-40px_rgba(16,26,51,0.35)] transition-transform duration-500 ease-out will-change-transform"
            style={{ transform: 'rotateX(calc((1 - var(--sp, 1)) * 12deg + var(--py, 0) * -2deg)) rotateY(calc(var(--px, 0) * 3deg)) scale(calc(0.96 + var(--sp, 1) * 0.04))' }}
          >
            <TitanDeskReplica />
          </div>
          <figcaption className="mt-5 text-sm text-navy-400">{p.tourHint}</figcaption>
        </figure>
      </section>

      {/* Product tour: the tabs drive the same working replica */}
      <Section label={p.tourTag} title={p.tourTitle} tinted fullWidth decor={{ icons: [LayoutDashboard, Ticket, Building2, FolderKanban, MonitorSmartphone, BarChart3], accent: '#0b8bd6' }}>
        <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <ol className="space-y-1" aria-label={p.tourTag}>
            {p.tour.map((step, i) => {
              const active = step.page === tourPage;
              return (
                <li key={step.page}>
                  <button
                    type="button"
                    onClick={() => setTourPage(step.page as ReplicaPage)}
                    aria-pressed={active}
                    className={`grid w-full grid-cols-[2rem_minmax(0,1fr)] gap-x-3 rounded-lg border-l-2 px-4 py-3 text-left transition-colors ${active ? 'border-indigo-500 bg-white shadow-sm' : 'border-transparent hover:bg-white/70'}`}
                  >
                    <span className={`font-mono text-sm ${active ? 'text-indigo-500' : 'text-navy-400'}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="block font-semibold text-navy-900">{step.label}</span>
                      {active && <span className="mt-1 block text-sm leading-relaxed text-navy-500">{step.desc}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div>
            <h3 className="font-display text-xl font-semibold text-navy-900">{tourStep.title}</h3>
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_30px_60px_-30px_rgba(16,26,51,0.3)]">
              <TitanDeskReplica page={tourPage} onPageChange={setTourPage} />
            </div>
          </div>
        </div>
      </Section>

      <FeaturesGrid />

      {/* Highlights: real product pages, not illustrations of them */}
      <Section label={p.highlight1Tag} title={p.highlight1Title} intro={p.highlight1Desc} fullWidth decor={{ icons: [Router, Network, Server, Wifi, ShieldCheck, MonitorSmartphone], accent: '#2f9e8f' }}>
        <ProductPanel label={p.highlight1Title}><NetworkView /></ProductPanel>
      </Section>
      <Section label={p.highlight2Tag} title={p.highlight2Title} intro={p.highlight2Desc} tinted fullWidth decor={{ icons: [BarChart3, CalendarDays, ShieldCheck, Ticket, BadgeCheck, LayoutDashboard], accent: '#d4541f' }}>
        <ProductPanel label={p.highlight2Title}><ReportsView /></ProductPanel>
      </Section>

      {/* Pricing and what each plan can handle */}
      <Section id="pricing" label={p.pricingTag} title={p.pricingTitle} intro={p.pricingSub} fullWidth decor={{ icons: [CreditCard, BadgeCheck, Receipt, Wallet, ShieldCheck, Building2], accent: '#c98a06' }}>
        <ProductPlans />

        <h3 className="font-display mt-16 text-2xl font-bold text-navy-900">{p.compareTitle}</h3>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 font-semibold text-navy-500">{p.compareFeature}</th>
                {p.plans.map((plan) => <th key={plan.name} className="w-40 px-6 py-4 text-center font-semibold text-navy-900">{plan.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {p.compareRows.map((row) => (
                <tr key={row.label} className="border-b border-slate-100 last:border-0">
                  <td className="px-6 py-4 text-navy-700">{row.label}</td>
                  {row.values.map((value, i) => (
                    <td key={i} className="px-6 py-4 text-center">
                      {value === 'yes' ? <Check size={18} aria-label="Included" className="mx-auto text-teal-500" />
                        : value === 'no' ? <Minus size={18} aria-label="Not included" className="mx-auto text-slate-300" />
                        : <span className="font-medium text-navy-800">{value}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section label="TitanDesk" title={p.finalCtaTitle} intro={p.finalCtaSub} tone="brand">
        <a href={accountUrl('signup')} className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50">
          {p.ctaPrimary}
        </a>
      </Section>
    </>
  );
}
