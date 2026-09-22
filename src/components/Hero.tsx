import DashboardMock from './mocks/DashboardMock';
import { useT } from '../i18n/useLang';
import { useParallax } from '../hooks/useParallax';

export default function Hero() {
  const t = useT();
  const ref = useParallax<HTMLDivElement>();

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pb-16 pt-16 sm:pb-24 sm:pt-20 lg:pt-28">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl transition-transform duration-300 ease-out sm:h-[560px] sm:w-[560px]"
        style={{
          background: 'radial-gradient(circle, #4f63d2 0%, transparent 70%)',
          transform: 'translate(calc(var(--px, 0) * 18px), calc(var(--py, 0) * 18px))',
        }}
      />
      <div
        className="pointer-events-none absolute -top-20 left-[-10%] h-[320px] w-[320px] rounded-full opacity-15 blur-3xl transition-transform duration-300 ease-out sm:h-[420px] sm:w-[420px]"
        style={{
          background: 'radial-gradient(circle, #2fb3a6 0%, transparent 70%)',
          transform: 'translate(calc(var(--px, 0) * -14px), calc(var(--py, 0) * -14px))',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-navy-500 shadow-sm sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            {t.hero.eyebrow}
          </span>

          <h1 className="font-display text-balance mt-6 text-[2.1rem] font-bold leading-[1.12] text-navy-900 sm:mt-7 sm:text-5xl sm:leading-[1.08] lg:text-6xl">
            {t.hero.title1} <span className="text-indigo-600">{t.hero.titleHighlight}</span> {t.hero.title2}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-navy-500 sm:mt-6 sm:text-lg">{t.hero.sub}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-9 sm:flex-row sm:gap-4">
            <a
              href="#contact"
              className="w-full rounded-full bg-indigo-500 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-600 sm:w-auto"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#services"
              className="w-full rounded-full border border-slate-200 bg-white px-7 py-3.5 text-center text-sm font-semibold text-navy-900 shadow-sm transition hover:bg-slate-50 sm:w-auto"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>

          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:mt-14 sm:grid-cols-4">
            {t.hero.stats.map(([stat, label]) => (
              <div key={label} className="text-center sm:text-left">
                <p className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">{stat}</p>
                <p className="mt-1 text-xs text-navy-400 sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product screenshot in browser frame */}
        <div className="relative mx-auto mt-12 max-w-5xl sm:mt-16">
          <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-tr from-indigo-500/10 via-transparent to-teal-500/10 blur-2xl" />
          <div
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-navy-900/10 transition-transform duration-300 ease-out"
            style={{
              transform:
                'perspective(1400px) rotateX(calc(var(--py, 0) * -2deg)) rotateY(calc(var(--px, 0) * 2deg))',
            }}
          >
            <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-4 hidden rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-navy-400 sm:inline-block">
                app.titandesk.io/dashboard
              </span>
            </div>
            <div className="overflow-x-auto">
              <DashboardMock />
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-navy-400 sm:text-sm">{t.hero.pictureCaption}</p>
        </div>
      </div>
    </section>
  );
}
