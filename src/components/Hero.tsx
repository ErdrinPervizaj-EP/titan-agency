import { useT, useLocalizedPath } from '../i18n/useLang';
import { useParallax } from '../hooks/useParallax';
import { primaryButton } from './Section';
import FloatingIcons from './FloatingIcons';
import TitanDeskReplica from './replica/TitanDeskReplica';

export default function Hero() {
  const t = useT();
  const lp = useLocalizedPath();
  const ref = useParallax<HTMLElement>();

  return (
    <section id="top" ref={ref} className="overflow-hidden">
      <div className="relative isolate mx-auto max-w-6xl px-6 pb-4 pt-16 sm:pt-24">
        <FloatingIcons />
        <p className="text-sm font-medium text-navy-400">{t.hero.eyebrow}</p>
        <h1 className="font-display text-balance mt-5 max-w-3xl text-4xl font-bold leading-[1.05] text-navy-900 sm:text-6xl">
          {t.hero.title1} <span className="text-indigo-500">{t.hero.titleHighlight}</span> {t.hero.title2}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-500">{t.hero.sub}</p>
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a href={`${lp('/')}#contact`} className={primaryButton}>{t.hero.ctaPrimary}</a>
          <a href={`${lp('/')}#services`} className="text-sm font-semibold text-navy-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-navy-900">
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>

      {/* The product (drawn, not a screenshot), tilted back in 3D. It turns slightly toward the
          cursor and settles flat as the visitor scrolls into it. */}
      <figure className="mx-auto mt-14 max-w-6xl px-6 [perspective:1600px] sm:mt-20">
        <div
          className="origin-top overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_40px_80px_-40px_rgba(16,26,51,0.35)] transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform:
              'rotateX(calc((1 - var(--sp, 1)) * 14deg + var(--py, 0) * -3deg)) rotateY(calc(var(--px, 0) * 4deg)) scale(calc(0.96 + var(--sp, 1) * 0.04))',
          }}
        >
          <TitanDeskReplica />
        </div>
        <figcaption className="mt-5 text-sm text-navy-400">{t.hero.pictureCaption}</figcaption>
      </figure>
    </section>
  );
}
