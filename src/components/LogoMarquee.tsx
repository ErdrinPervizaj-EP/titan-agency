import { useT } from '../i18n/useLang';

export default function LogoMarquee() {
  const t = useT();
  const logos = [...t.logoBar.logos, ...t.logoBar.logos];

  return (
    <section className="overflow-hidden border-b border-slate-200 bg-white py-10">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-navy-400">
        {t.logoBar.label}
      </p>
      <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track flex w-max items-center gap-16">
          {logos.map((name, i) => (
            <span key={`${name}-${i}`} className="font-display shrink-0 text-lg font-bold tracking-tight text-navy-300">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
