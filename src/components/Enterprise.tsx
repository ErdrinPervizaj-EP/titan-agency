import { useT } from '../i18n/useLang';
import Reveal from './Reveal';

const ICONS = [
  <path d="M12 2 4 6v6c0 5 3.6 8.7 8 10 4.4-1.3 8-5 8-10V6l-8-4Z" strokeWidth="1.6" strokeLinejoin="round" />,
  <path d="M12 3v18M3 12h18" strokeWidth="1.6" strokeLinecap="round" />,
  <path d="M12 2 4 6v6c0 5 3.6 8.7 8 10 4.4-1.3 8-5 8-10V6l-8-4Z" strokeWidth="1.6" strokeLinejoin="round" />,
  <path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m5-3.13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6 0a4 4 0 1 0 0-8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  <path d="M12 2 4 6v6c0 5 3.6 8.7 8 10 4.4-1.3 8-5 8-10V6l-8-4Zm0 5v6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  <path d="M9 12h6m-6 4h6M9 8h1M5 21h14a2 2 0 0 0 2-2V8.5L15.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
];

export default function Enterprise() {
  const t = useT();

  return (
    <section className="border-y border-slate-200 bg-navy-950 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400">{t.enterprise.tag}</span>
          <h2 className="font-display text-balance mt-4 text-3xl font-bold text-white sm:text-4xl">
            {t.enterprise.title}
          </h2>
          <p className="mt-4 text-ink-400">{t.enterprise.sub}</p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {t.enterprise.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 60} className="bg-navy-950 p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-teal-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {ICONS[i % ICONS.length]}
                </svg>
              </div>
              <h3 className="font-display mt-4 text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
