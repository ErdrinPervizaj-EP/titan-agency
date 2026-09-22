import { Link } from 'react-router-dom';
import ProductIcon from '../components/ProductIcon';
import ProductTour from '../components/ProductTour';
import Testimonials from '../components/Testimonials';
import NetworkMock from '../components/mocks/NetworkMock';
import ReportsMock from '../components/mocks/ReportsMock';

const AUDIENCES = ['MSPs', 'Internal IT Teams', 'Field Service', 'IT Consultancies'];

const PLANS = [
  {
    name: 'Team',
    desc: 'For small IT teams getting started',
    price: '$19',
    period: '/user/mo',
    features: ['Ticketing & knowledge base', 'Up to 3 gateways', 'Basic reporting', 'Email support'],
  },
  {
    name: 'Business',
    desc: 'For growing MSPs managing multiple clients',
    price: '$39',
    period: '/user/mo',
    features: ['Everything in Team', 'Unlimited gateways', 'Network & device ops', 'SLA tracking & alerts', 'Priority support'],
    featured: true,
  },
  {
    name: 'Enterprise',
    desc: 'For larger operations with custom needs',
    price: 'Custom',
    period: '',
    features: ['Everything in Business', 'SSO & audit logs', 'Custom integrations', 'Dedicated onboarding'],
  },
];

export default function TitanDeskPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-20 lg:pt-28">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
        <div
          className="pointer-events-none absolute -top-40 right-0 h-[560px] w-[560px] rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4f63d2 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-navy-400">
            <span>Part of</span>
            <Link to="/" className="font-semibold text-navy-700 hover:text-navy-900">
              Titan Network
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <ProductIcon product="titandesk" size={56} />
          </div>

          <h1 className="font-display text-balance mt-6 text-4xl font-bold leading-[1.08] text-navy-900 sm:text-5xl">
            The service desk built for how IT teams actually work
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-navy-500">
            Tickets, network ops, client CRM, and reporting in one workspace. Built by Titan
            Network, and used to run our own client operations every day.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="rounded-full bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-600"
            >
              Start Free Trial →
            </Link>
            <a
              href="/#contact"
              className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-sm transition hover:bg-slate-50"
            >
              Talk to Sales
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {AUDIENCES.map((a) => (
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
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Product Tour</span>
            <h2 className="font-display mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
              Every part of the operation, in one place
            </h2>
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
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Network Ops</span>
              <h3 className="font-display mt-4 text-2xl font-bold text-navy-900 sm:text-3xl">
                Full visibility into every managed device
              </h3>
              <p className="mt-4 text-navy-500">
                Devices, VLANs, subnets, and gateways — monitored in real time across every client
                site, with no inbound firewall rule ever required.
              </p>
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
              <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Reporting</span>
              <h3 className="font-display mt-4 text-2xl font-bold text-navy-900 sm:text-3xl">
                Answers your team actually needs
              </h3>
              <p className="mt-4 text-navy-500">
                Ticket volume, priority mix, team workload, and SLA compliance — refreshed
                automatically, exportable in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* TitanDesk pricing */}
      <section id="titandesk-pricing" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600">TitanDesk Pricing</span>
            <h2 className="font-display mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
              Seat-based pricing, not project pricing
            </h2>
            <p className="mt-4 text-navy-500">
              This is what TitanDesk itself costs to license — separate from our agency support
              plans. 14-day free trial on every tier.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  p.featured ? 'border-indigo-200 bg-white shadow-2xl shadow-indigo-500/10 lg:-translate-y-3' : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-bold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-navy-900">{p.name}</h3>
                <p className="mt-1.5 text-sm text-navy-400">{p.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-navy-900">{p.price}</span>
                  <span className="text-sm text-navy-400">{p.period}</span>
                </div>
                <ul className="mt-7 flex-1 space-y-3.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-navy-600">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-teal-600">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`mt-8 rounded-full py-3 text-center text-sm font-semibold transition ${
                    p.featured ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'border border-slate-200 text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Ready to see TitanDesk on your own data?
          </h2>
          <p className="mt-3 text-navy-500">No credit card required to start your trial.</p>
          <Link
            to="/login"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-600"
          >
            Start Free Trial →
          </Link>
        </div>
      </section>
    </>
  );
}
