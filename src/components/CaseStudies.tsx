import { useT } from '../i18n/useLang';
import Reveal from './Reveal';
import Counter from './Counter';

export default function CaseStudies() {
  const t = useT();

  return (
    <section id="case-studies" className="bg-slate-50 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">{t.caseStudies.tag}</span>
          <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
            {t.caseStudies.title}
          </h2>
          <p className="mt-4 text-navy-500">{t.caseStudies.sub}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {t.caseStudies.items.map((c, i) => (
            <Reveal key={c.name} delay={i * 90}>
              <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <h3 className="font-display text-lg font-bold text-navy-900">{c.name}</h3>
                <p className="text-xs text-navy-400">{c.industry}</p>

                <div className="mt-5 space-y-3 text-sm">
                  <p className="text-navy-600">
                    <span className="font-semibold text-navy-900">{t.caseStudies.challengeLabel} </span>
                    {c.challenge}
                  </p>
                  <p className="text-navy-600">
                    <span className="font-semibold text-navy-900">{t.caseStudies.solutionLabel} </span>
                    {c.solution}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-200 pt-6">
                  {c.metrics.map(([value, label]) => (
                    <div key={label}>
                      <p className="font-display text-lg font-bold text-indigo-500">
                        <Counter value={value} />
                      </p>
                      <p className="text-[11px] leading-tight text-navy-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
