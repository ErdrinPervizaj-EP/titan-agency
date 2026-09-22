import { useT } from '../i18n/useLang';

export default function Technologies() {
  const t = useT();

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-navy-500">{t.technologies.tag}</span>
          <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
            {t.technologies.title}
          </h2>
          <p className="mt-4 text-navy-500">{t.technologies.sub}</p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.technologies.groups.map((g) => (
            <div key={g.label}>
              <p className="text-xs font-bold uppercase tracking-wide text-navy-400">{g.label}</p>
              <ul className="mt-3 space-y-2">
                {g.items.map((item) => (
                  <li key={item} className="text-sm font-medium text-navy-700">
                    {item}
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
