import { useT } from '../i18n/useLang';
import TechIcon from './TechIcon';
import Reveal from './Reveal';

export default function Technologies() {
  const t = useT();
  const all = t.technologies.groups.flatMap((g) => g.items);
  const half = Math.ceil(all.length / 2);
  const row1 = [...all.slice(0, half), ...all.slice(0, half)];
  const row2 = [...all.slice(half), ...all.slice(half)];

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-24">
      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-navy-500">{t.technologies.tag}</span>
        <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
          {t.technologies.title}
        </h2>
        <p className="mt-4 text-navy-500">{t.technologies.sub}</p>
      </Reveal>

      <div className="mt-14 space-y-4">
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee-track flex w-max items-center gap-4">
            {row1.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex shrink-0 items-center gap-3 rounded-full border border-slate-200 bg-white py-2.5 pl-2.5 pr-5 shadow-sm"
              >
                <TechIcon name={name} size={18} />
                <span className="text-sm font-semibold text-navy-700">{name}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee-track-reverse flex w-max items-center gap-4">
            {row2.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex shrink-0 items-center gap-3 rounded-full border border-slate-200 bg-white py-2.5 pl-2.5 pr-5 shadow-sm"
              >
                <TechIcon name={name} size={18} />
                <span className="text-sm font-semibold text-navy-700">{name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
