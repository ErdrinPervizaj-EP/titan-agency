const PLANS = [
  {
    name: 'Starter',
    desc: 'For small teams needing reliable support',
    price: '$49',
    period: '/user/mo',
    features: ['Help desk & ticketing', 'Business hours support', 'Basic network monitoring', 'Email support'],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Growth',
    desc: 'For growing companies managing multiple sites',
    price: '$89',
    period: '/user/mo',
    features: [
      'Everything in Starter',
      '24/7 monitoring & alerts',
      'Network & device management',
      'Quarterly security audits',
      'Priority support',
    ],
    cta: 'Get Started',
    featured: true,
  },
  {
    name: 'Enterprise',
    desc: 'For organizations with custom needs',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Growth',
      'Dedicated account manager',
      'Custom software & integrations',
      'On-site support options',
      '24/7 SLA-backed response',
    ],
    cta: 'Talk to Sales',
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Pricing</span>
          <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
            Support plans that scale with your team
          </h2>
          <p className="mt-4 text-navy-500">No setup fees. Cancel anytime. 14-day free trial on every plan.</p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((p) => (
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

              <a
                href="#contact"
                className={`mt-8 rounded-full py-3 text-center text-sm font-semibold transition ${
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
      </div>
    </section>
  );
}
