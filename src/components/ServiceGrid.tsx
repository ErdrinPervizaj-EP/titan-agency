import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { useT, useLocalizedPath } from '../i18n/useLang';
import { SERVICE_ACCENTS, SERVICE_ICONS } from '../lib/icons';
import TicketDeskMimic from './mimics/TicketDeskMimic';
import patchPanel from '../assets/photos/network-patch-panel.webp';
import serverRoom from '../assets/photos/server-room-hallway.webp';
import codeMacbook from '../assets/photos/code-macbook.webp';

/** Picture per service, by position in translations.services.items. */
const MEDIA: Record<number, { src: string; kind: 'photo' } | { kind: 'mimic' }> = {
  0: { kind: 'mimic' },
  1: { src: patchPanel, kind: 'photo' },
  3: { src: serverRoom, kind: 'photo' },
  4: { src: codeMacbook, kind: 'photo' },
};

/** Grid placement per service: a wide lead card, then a row of three, then a wide closer. */
const SPAN = ['lg:col-span-2', '', '', '', '', 'lg:col-span-3'];

/** Moves a soft brand-colored glow to wherever the cursor is inside the card. */
function followCursor(event: MouseEvent<HTMLElement>) {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mx', `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty('--my', `${event.clientY - box.top}px`);
}

function Card({ to, className, accent, children }: { to: string; className: string; accent: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      onMouseMove={followCursor}
      style={{ '--accent': accent } as CSSProperties}
      className={`group relative isolate flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_35%,white)] hover:shadow-[0_24px_48px_-24px_color-mix(in_srgb,var(--accent)_45%,transparent)] ${className}`}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-1 bg-[var(--accent)]" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent) 14%, transparent), transparent 45%)' }}
      />
      {children}
    </Link>
  );
}

export default function ServiceGrid({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' }) {
  const t = useT();
  const lp = useLocalizedPath();
  const Heading = headingLevel;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {t.services.items.map((service, i) => {
        const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
        const media = MEDIA[i];
        const wide = i === 0 || i === 5;
        const body = (
          <div className="flex flex-1 flex-col p-7">
            <div className="flex items-start justify-between gap-4">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-[0_8px_16px_-8px_var(--accent)]"
                style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 80%, white), var(--accent))' }}
              >
                <Icon size={21} strokeWidth={1.9} aria-hidden />
              </span>
              <ArrowUpRight
                size={20}
                aria-hidden
                className="text-navy-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
              />
            </div>
            <Heading className="font-display mt-5 text-xl font-semibold text-navy-900">{service.title}</Heading>
            <p className="mt-2 leading-relaxed text-navy-500">{service.desc}</p>
            <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5">
              {service.included.slice(0, wide ? 3 : 2).map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-navy-600">
                  <Check size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );

        return (
          <Card key={service.slug} accent={SERVICE_ACCENTS[i % SERVICE_ACCENTS.length]} to={`${lp('/services')}/${service.slug}`} className={`${SPAN[i]} ${wide ? 'flex-col lg:flex-row' : 'flex-col'}`}>
            {media?.kind === 'photo' && (
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                <img src={media.src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
            )}
            {wide ? <div className="flex flex-1 lg:max-w-md">{body}</div> : body}
            {media?.kind === 'mimic' && (
              <div
                aria-hidden
                className="flex flex-1 items-center border-t border-slate-200 p-6 lg:border-l lg:border-t-0"
                style={{ background: 'linear-gradient(160deg, color-mix(in srgb, var(--accent) 10%, white), white 70%)' }}
              >
                <div className="w-full transition-transform duration-500 group-hover:-translate-y-1"><TicketDeskMimic compact /></div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
