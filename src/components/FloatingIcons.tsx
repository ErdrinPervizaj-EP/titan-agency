import type { CSSProperties } from 'react';
import { Cloud, Cpu, Database, HardDrive, KeyRound, Laptop, LifeBuoy, Lock, Network, Router, Server, ShieldCheck, Ticket, Wifi } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useParallax } from '../hooks/useParallax';

/**
 * Faint IT line icons behind a page area. Each sits at a depth: nearer ones
 * (higher depth) move further as the cursor moves, which reads as 3D, and they
 * drift slowly on their own. Still for touch devices and reduced-motion visitors.
 *
 * - layout "right": a scattered cluster on the right of a page header, clear of
 *   the headline, intro and buttons.
 * - layout "edges": a few icons in the page margins beside a section, only on
 *   screens wide enough to have margins, so they never sit behind content.
 */
type Slot = { left?: string; right?: string; top: string; size: number; depth: number; delay: number };

const HERO_ICONS: LucideIcon[] = [Server, Router, ShieldCheck, Cloud, Ticket, Network, Database, Wifi, Lock, Cpu, Laptop, HardDrive, KeyRound, LifeBuoy];
const RIGHT_SLOTS: Slot[] = [
  { left: '78%', top: '10%', size: 34, depth: 1, delay: 0 },
  { left: '90%', top: '30%', size: 26, depth: 0.5, delay: 1.2 },
  { left: '70%', top: '42%', size: 40, depth: 1.4, delay: 0.6 },
  { left: '86%', top: '62%', size: 44, depth: 0.8, delay: 2 },
  { left: '66%', top: '26%', size: 24, depth: 0.4, delay: 1.6 },
  { left: '95%', top: '8%', size: 22, depth: 0.3, delay: 0.3 },
  { left: '74%', top: '76%', size: 28, depth: 1.1, delay: 2.4 },
  { left: '63%', top: '60%', size: 22, depth: 0.35, delay: 0.9 },
  { left: '60%', top: '4%', size: 24, depth: 0.6, delay: 1.4 },
  { left: '72%', top: '92%', size: 26, depth: 0.9, delay: 0.2 },
  { left: '92%', top: '84%', size: 30, depth: 1.2, delay: 1.8 },
  { left: '97%', top: '50%', size: 22, depth: 0.45, delay: 2.2 },
  { left: '82%', top: '46%', size: 20, depth: 0.25, delay: 0.5 },
  { left: '82%', top: '90%', size: 22, depth: 0.55, delay: 1.1 },
];
// Margin positions: centred in the space outside the 72rem content column.
const margin = (extra: number) => `max(0.5rem, calc((100% - 72rem) / 4 - ${extra}rem))`;
const EDGE_SLOTS: Slot[] = [
  { left: margin(1), top: '14%', size: 30, depth: 0.9, delay: 0.4 },
  { right: margin(0.5), top: '22%', size: 26, depth: 0.6, delay: 1.3 },
  { left: margin(-1.5), top: '52%', size: 22, depth: 0.4, delay: 2.1 },
  { right: margin(2), top: '60%', size: 34, depth: 1.2, delay: 0.8 },
  { left: margin(0.5), top: '82%', size: 26, depth: 1, delay: 1.7 },
  { right: margin(-1), top: '88%', size: 22, depth: 0.5, delay: 2.6 },
];

export default function FloatingIcons({
  icons = HERO_ICONS,
  accent = '#4165b7',
  tone = 'light',
  layout = 'right',
}: {
  icons?: LucideIcon[];
  accent?: string;
  tone?: 'light' | 'dark';
  layout?: 'right' | 'edges';
}) {
  const ref = useParallax<HTMLDivElement>();
  const slots = layout === 'right' ? RIGHT_SLOTS : EDGE_SLOTS;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${layout === 'right' ? 'hidden sm:block' : 'hidden xl:block'}`}
    >
      {slots.map((slot, i) => {
        const Icon = icons[i % icons.length];
        const { size, depth, delay } = slot;
        const tile: CSSProperties =
          tone === 'dark'
            ? {
                background: 'rgba(255, 255, 255, 0.06)',
                borderColor: `rgba(255, 255, 255, ${0.1 + depth * 0.06})`,
                color: `rgba(255, 255, 255, ${0.35 + depth * 0.2})`,
                boxShadow: `0 ${8 + depth * 10}px ${18 + depth * 18}px -14px rgba(0, 0, 0, 0.5)`,
              }
            : {
                background: `color-mix(in srgb, ${accent} ${4 + depth * 3}%, white)`,
                borderColor: `color-mix(in srgb, ${accent} ${14 + depth * 10}%, white)`,
                color: `color-mix(in srgb, ${accent} ${38 + depth * 30}%, white)`,
                boxShadow: `0 ${6 + depth * 10}px ${14 + depth * 18}px -12px color-mix(in srgb, ${accent} ${18 + depth * 12}%, transparent)`,
              };
        return (
          <span
            key={i}
            className="absolute transition-transform duration-700 ease-out"
            style={{
              left: slot.left,
              right: slot.right,
              top: slot.top,
              transform: `translate3d(calc(var(--px, 0) * ${depth * -28}px), calc(var(--py, 0) * ${depth * -20}px), 0)`,
            }}
          >
            <span
              className="float-drift flex items-center justify-center rounded-xl border backdrop-blur-[2px]"
              style={{ width: size + 22, height: size + 22, animationDelay: `${delay}s`, ...tile }}
            >
              <Icon size={size} strokeWidth={1.4} />
            </span>
          </span>
        );
      })}
    </div>
  );
}
