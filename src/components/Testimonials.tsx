const QUOTES = [
  {
    quote:
      "Titan Network took over our IT within a week and our help desk tickets stopped piling up overnight. They actually pick up the phone.",
    name: 'Sarah Whitfield',
    role: 'Operations Director, Acme Retail Co.',
  },
  {
    quote:
      "We needed a network overhaul across four warehouses with zero downtime. They planned it in phases and delivered exactly on schedule.",
    name: 'Marcus Ade',
    role: 'IT Manager, Brightline Logistics',
  },
  {
    quote:
      'TitanDesk gave our small ops team the same visibility a much bigger company would have. Worth it for the reporting alone.',
    name: 'Elena Novak',
    role: 'Managing Partner, Norwood Legal',
  },
];

const BADGES = ['CompTIA Partner', 'Microsoft Partner', 'SOC 2 Type II — In Progress', '4.9/5 · 60+ reviews'];

export default function Testimonials() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Trusted By Clients</span>
          <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
            What our clients say
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {QUOTES.map((t) => (
            <div key={t.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none" className="text-indigo-200">
                <path
                  d="M0 22V13.2C0 5.9 4.7 1.1 12.1 0v4.4C8.1 5.3 6 8 6 11.4h6.1V22H0Zm15.9 0V13.2c0-7.3 4.7-12.1 12.1-13.2v4.4c-4 .9-6.1 3.6-6.1 7h6.1V22H15.9Z"
                  fill="currentColor"
                />
              </svg>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-navy-700">{t.quote}</p>
              <div className="mt-6">
                <p className="text-sm font-semibold text-navy-900">{t.name}</p>
                <p className="text-xs text-navy-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 pt-10">
          {BADGES.map((b) => (
            <span
              key={b}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-navy-500"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-teal-500">
                <path d="M12 2 4 6v6c0 5 3.6 8.7 8 10 4.4-1.3 8-5 8-10V6l-8-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
