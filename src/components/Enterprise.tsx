import { BadgeCheck, Scale, Activity, UserCheck, KeyRound, FileSignature } from 'lucide-react';
import { useT } from '../i18n/useLang';
import Reveal from './Reveal';

const ICONS = [BadgeCheck, Scale, Activity, UserCheck, KeyRound, FileSignature];

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
          {t.enterprise.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={item.title} delay={i * 60} className="bg-navy-950 p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-teal-400">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="font-display mt-4 text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{item.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
