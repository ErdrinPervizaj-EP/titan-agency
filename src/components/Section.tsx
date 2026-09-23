import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import FloatingIcons from './FloatingIcons';

/**
 * The one section frame the marketing pages share: a small label in a left
 * rail, the heading and intro beside it, then the section's own content.
 * Sections stay visually related through this grid, while what goes inside
 * (a list, steps, a diagram, a form) is different each time.
 */
export default function Section({
  id,
  label,
  title,
  intro,
  children,
  tinted = false,
  tone,
  decor,
  fullWidth = false,
}: {
  id?: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  tinted?: boolean;
  /** 'dark' = navy band, 'brand' = brand-blue band; both switch the heading colors to light. */
  tone?: 'dark' | 'brand';
  /** Themed icons floating in the page margins beside this section. */
  decor?: { icons: LucideIcon[]; accent?: string };
  /** Content spans the whole container instead of lining up under the heading. */
  fullWidth?: boolean;
}) {
  return (
    <section id={id} className={`relative isolate scroll-mt-20 overflow-hidden ${SURFACE[tone ?? (tinted ? 'tinted' : 'light')]}`}>
      {tone && <span aria-hidden className="band-texture pointer-events-none absolute inset-0 -z-10" />}
      {decor && <FloatingIcons layout="edges" icons={decor.icons} accent={decor.accent} tone={tone ? 'dark' : 'light'} />}
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="flow-in grid gap-x-12 gap-y-4 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <p className={`flex items-center gap-2 text-sm font-semibold lg:pt-2 ${tone ? 'text-white/70' : 'text-indigo-500'}`}>
            <span aria-hidden className={`flow-dashline h-px w-8 origin-left ${tone ? 'bg-white/50' : 'bg-indigo-500'}`} />
            {label}
          </p>
          <div className="max-w-3xl">
            <h2 className={`font-display text-balance text-3xl font-bold leading-tight sm:text-4xl ${tone ? 'text-white' : 'text-navy-900'}`}>{title}</h2>
            {intro && <p className={`mt-4 text-lg leading-relaxed ${tone ? 'text-white/75' : 'text-navy-500'}`}>{intro}</p>}
          </div>
        </div>
        {children && (
          <div className={`flow-in-late mt-12 sm:mt-14 ${fullWidth ? '' : 'lg:ml-[15rem]'}`}>{children}</div>
        )}
      </div>
    </section>
  );
}

/** Top of an inner page: small label, big left-aligned title, one intro line. */
export function PageHeader({ label, title, intro, children }: { label: ReactNode; title: string; intro?: string; children?: ReactNode }) {
  return (
    <header className="relative isolate mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pb-20 sm:pt-24">
      <FloatingIcons />
      <div className="text-sm font-medium text-navy-400">{label}</div>
      <h1 className="font-display text-balance mt-5 max-w-4xl text-4xl font-bold leading-[1.08] text-navy-900 sm:text-5xl">{title}</h1>
      {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-500">{intro}</p>}
      {children}
    </header>
  );
}

const SURFACE = {
  light: 'border-t border-slate-200 bg-white',
  tinted: 'border-t border-slate-200 bg-slate-50',
  dark: 'bg-navy-950 text-white',
  brand: 'bg-indigo-500 text-white',
} as const;

export const primaryButton =
  'inline-flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600';
export const secondaryButton =
  'inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-300';
