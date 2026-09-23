import { useT } from '../i18n/useLang';
import { SERVICE_ACCENTS } from '../lib/icons';
import Section from './Section';
import { BarChart3, CalendarCheck, ClipboardList, LifeBuoy, Rocket, Search } from 'lucide-react';

export default function Process() {
  const t = useT();
  return (
    <Section label={t.process.tag} title={t.process.title} intro={t.process.sub} tone="dark" fullWidth decor={{ icons: [Search, ClipboardList, Rocket, LifeBuoy, BarChart3, CalendarCheck] }}>
      <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
        {t.process.steps.map((step, i) => {
          const accent = SERVICE_ACCENTS[i % SERVICE_ACCENTS.length];
          return (
            <li key={step.title} className="group relative pt-6">
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-white/15" />
              <span
                aria-hidden
                className="absolute left-0 top-0 h-0.5 w-10 rounded-full transition-all duration-500 group-hover:w-full"
                style={{ background: accent }}
              />
              <p className="font-mono text-sm font-semibold" style={{ color: `color-mix(in srgb, ${accent} 60%, white)` }}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-display mt-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{step.desc}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
