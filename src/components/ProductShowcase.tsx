import { Link } from 'react-router-dom';
import DashboardMock from './mocks/DashboardMock';
import ProductIcon from './ProductIcon';

const UPCOMING = [
  {
    key: 'titanshield' as const,
    name: 'TitanShield',
    tagline: 'Continuous security monitoring',
    bullets: [
      '24/7 threat detection across endpoints and network',
      'Automated alerts routed straight into TitanDesk tickets',
      'Monthly posture reports for clients and auditors',
    ],
  },
  {
    key: 'titancloud' as const,
    name: 'TitanCloud',
    tagline: 'Cloud cost & infrastructure control',
    bullets: [
      'Unified visibility across AWS, Azure, and hybrid setups',
      'Cost anomaly alerts before the bill arrives',
      'One-click backup and disaster-recovery drills',
    ],
  },
];

export default function ProductShowcase() {
  return (
    <section id="products" className="relative bg-slate-50 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Product Suite</span>
          <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
            We don't just support IT — we build it
          </h2>
          <p className="mt-4 text-navy-500">
            Titan Network is building a suite of tools for IT operations. TitanDesk is live today;
            TitanShield and TitanCloud are next on the roadmap.
          </p>
        </div>

        {/* Flagship: TitanDesk */}
        <div className="mt-14 grid items-center gap-10 rounded-3xl border border-indigo-200 bg-white p-8 shadow-sm lg:grid-cols-5 lg:p-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <ProductIcon product="titandesk" size={40} />
              <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600">Live</span>
            </div>
            <h3 className="font-display mt-5 text-2xl font-bold text-navy-900">TitanDesk</h3>
            <p className="mt-2 text-navy-500">
              Our service desk, CRM, and network-ops platform — the tool we use to run our own
              client operations, and yours.
            </p>
            <Link
              to="/titandesk"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-600"
            >
              Explore TitanDesk →
            </Link>
          </div>

          <div className="relative lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl shadow-navy-900/10">
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-navy-950 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-4 rounded-md bg-navy-900 px-3 py-1 text-xs text-ink-500">app.titandesk.io</span>
              </div>
              <DashboardMock />
            </div>
          </div>
        </div>

        {/* Roadmap teasers */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {UPCOMING.map((p) => (
            <div key={p.name} className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ProductIcon product={p.key} size={32} />
                  <div>
                    <h4 className="font-display text-sm font-semibold text-navy-700">{p.name}</h4>
                    <p className="text-xs text-navy-400">{p.tagline}</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-navy-400">
                  Coming soon
                </span>
              </div>
              <ul className="mt-4 space-y-1.5">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-navy-400">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-navy-300" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
