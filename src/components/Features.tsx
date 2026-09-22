import { useT } from '../i18n/useLang';

const ICONS = [
  <path d="M4 4h16v12H8l-4 4V4Z" strokeWidth="1.6" strokeLinejoin="round" />,
  <path d="M12 3v4M5 10h14M7 10v4a5 5 0 0 0 10 0v-4M9 21h6" strokeWidth="1.6" strokeLinecap="round" />,
  <path d="M12 2 4 6v6c0 5 3.6 8.7 8 10 4.4-1.3 8-5 8-10V6l-8-4Z" strokeWidth="1.6" strokeLinejoin="round" />,
  <path d="M7 18a4 4 0 0 1-1-7.9A5 5 0 0 1 15.9 8H17a4 4 0 0 1 1 7.9M9 15l3-3 3 3M12 12v9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  <path d="M4 6h16M4 12h10M4 18h7" strokeWidth="1.6" strokeLinecap="round" />,
  <path d="M4 20V10m6 10V4m6 16v-7" strokeWidth="1.6" strokeLinecap="round" />,
];

const COLORS = ['bg-indigo-500/10 text-indigo-500', 'bg-teal-500/10 text-teal-600', 'bg-gold-500/15 text-gold-600'];

export default function Features() {
  const t = useT();

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
          {t.services.items.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${COLORS[i % COLORS.length]}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {ICONS[i % ICONS.length]}
                </svg>
              </div>
              <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
