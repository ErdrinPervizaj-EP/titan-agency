import { useT } from '../i18n/useLang';

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} className="text-gold-500">
      <path
        d="M12 2.5 15 9l7 1-5.2 4.9L18 22l-6-3.4L6 22l1.2-7.1L2 10l7-1 3-6.5Z"
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Testimonials() {
  const t = useT();

  return (
    <section id="reviews" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{t.reviews.tag}</span>
          <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
            {t.reviews.title}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} filled />
            ))}
            <span className="ml-2 text-sm text-navy-500">{t.reviews.rating}</span>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {t.reviews.quotes.map((r) => (
            <div key={r.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} filled />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-navy-700">"{r.quote}"</p>
              <div className="mt-6">
                <p className="text-sm font-semibold text-navy-900">{r.name}</p>
                <p className="text-xs text-navy-400">{r.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 pt-10">
          {t.reviews.badges.map((b) => (
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
