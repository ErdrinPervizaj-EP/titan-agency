import { Search, ClipboardList, Rocket, LifeBuoy, BarChart3 } from 'lucide-react';
import { useT } from '../i18n/useLang';
import Reveal from './Reveal';

const ICONS = [Search, ClipboardList, Rocket, LifeBuoy, BarChart3];

export default function Process() {
  const t = useT();

  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{t.process.tag}</span>
          <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
            {t.process.title}
          </h2>
          <p className="mt-4 text-navy-500">{t.process.sub}</p>
        </Reveal>

        <div className="relative mt-16">
          {/* connecting line — desktop only */}
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-slate-200 lg:block" />

          <div className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {t.process.steps.map((step, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <Reveal key={step.title} delay={i * 80} className="relative">
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-0">
                    <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-indigo-500 bg-white text-indigo-500">
                      <Icon size={20} strokeWidth={1.9} />
                    </span>
                    <div className="lg:mt-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-navy-400">
                        {String(i + 1).padStart(2, '0')} · {step.role}
                      </p>
                      <h3 className="font-display mt-1 text-lg font-semibold text-navy-900">{step.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-navy-500 lg:mt-4">{step.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
