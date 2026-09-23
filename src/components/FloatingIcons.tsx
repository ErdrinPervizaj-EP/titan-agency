import { Cloud, Cpu, Database, HardDrive, KeyRound, Laptop, LifeBuoy, Lock, Network, Router, Server, ShieldCheck, Ticket, Wifi } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useParallax } from '../hooks/useParallax';

/**
 * Small IT line icons floating across a page area. Each sits at a depth:
 * nearer ones (higher depth) are larger, brighter and move further as the
 * cursor moves, which reads as 3D; all drift slowly on their own. Still for
 * touch devices and reduced-motion visitors. Place it as a direct child of a
 * full-width `relative` section so the icons use the whole width, never a
 * clipped box.
 *
 * - "scatter": all around a page header or hero, including the margins and
 *   above the headline, kept faint where text sits.
 * - "edges": down both margins beside a section's content.
 */
type Slot = { x: string; y: string; size: number; depth: number; delay: number; wide?: boolean };

const HERO_ICONS: LucideIcon[] = [Server, Router, ShieldCheck, Cloud, Ticket, Network, Database, Wifi, Lock, Cpu, Laptop, HardDrive, KeyRound, LifeBuoy];

// Distance into the margin outside the 72rem content column, as a share of that margin.
const inLeftMargin = (share: number) => `calc((100% - 72rem) / 2 * ${share})`;
const inRightMargin = (share: number) => `calc(100% - (100% - 72rem) / 2 * ${share})`;

const SCATTER: Slot[] = [
  // Right of the headline, where the hero has open space.
  { x: '62%', y: '6%', size: 22, depth: 0.6, delay: 0 },
  { x: '72%', y: '14%', size: 30, depth: 1.2, delay: 1.1 },
  { x: '84%', y: '5%', size: 18, depth: 0.4, delay: 0.5 },
  { x: '92%', y: '18%', size: 26, depth: 0.9, delay: 1.8 },
  { x: '66%', y: '27%', size: 18, depth: 0.35, delay: 2.3 },
  { x: '79%', y: '31%', size: 34, depth: 1.4, delay: 0.8 },
  { x: '90%', y: '38%', size: 20, depth: 0.5, delay: 1.5 },
  { x: '70%', y: '42%', size: 22, depth: 0.7, delay: 2.6 },
  // A light band above the headline.
  { x: '30%', y: '2%', size: 16, depth: 0.3, delay: 1.3 },
  { x: '46%', y: '4%', size: 18, depth: 0.4, delay: 0.2 },
  // The margins, top to bottom, beside the headline and the product preview.
  { x: inLeftMargin(0.35), y: '10%', size: 24, depth: 0.8, delay: 0.9, wide: true },
  { x: inLeftMargin(0.7), y: '28%', size: 18, depth: 0.4, delay: 2.1, wide: true },
  { x: inLeftMargin(0.25), y: '47%', size: 28, depth: 1.1, delay: 0.4, wide: true },
  { x: inLeftMargin(0.6), y: '66%', size: 20, depth: 0.5, delay: 1.6, wide: true },
  { x: inLeftMargin(0.3), y: '84%', size: 22, depth: 0.7, delay: 2.8, wide: true },
  { x: inRightMargin(0.45), y: '54%', size: 24, depth: 0.9, delay: 1.0, wide: true },
  { x: inRightMargin(0.75), y: '70%', size: 18, depth: 0.45, delay: 2.4, wide: true },
  { x: inRightMargin(0.35), y: '88%', size: 26, depth: 1, delay: 0.6, wide: true },
];

const EDGES: Slot[] = [
  { x: inLeftMargin(0.4), y: '10%', size: 24, depth: 0.9, delay: 0.4 },
  { x: inLeftMargin(0.75), y: '32%', size: 18, depth: 0.45, delay: 2.1 },
  { x: inLeftMargin(0.3), y: '56%', size: 22, depth: 0.7, delay: 1.2 },
  { x: inLeftMargin(0.65), y: '80%', size: 20, depth: 0.55, delay: 1.7 },
  { x: inRightMargin(0.5), y: '16%', size: 22, depth: 0.6, delay: 1.3 },
  { x: inRightMargin(0.25), y: '40%', size: 26, depth: 1.1, delay: 0.8 },
  { x: inRightMargin(0.7), y: '64%', size: 18, depth: 0.4, delay: 2.6 },
  { x: inRightMargin(0.4), y: '88%', size: 22, depth: 0.75, delay: 0.2 },
];

export default function FloatingIcons({
  icons = HERO_ICONS,
  accent = '#4165b7',
  tone = 'light',
  layout = 'scatter',
}: {
  icons?: LucideIcon[];
  accent?: string;
  tone?: 'light' | 'dark';
  layout?: 'scatter' | 'edges';
}) {
  const ref = useParallax<HTMLDivElement>();
  const slots = layout === 'scatter' ? SCATTER : EDGES;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${layout === 'scatter' ? 'hidden sm:block' : 'hidden lg:block'}`}
    >
      {slots.map((slot, i) => {
        const Icon = icons[i % icons.length];
        const { size, depth, delay } = slot;
        // Nearer icons are brighter; everything stays faint enough to read text over.
        const color = tone === 'dark'
          ? `rgba(255, 255, 255, ${0.22 + depth * 0.2})`
          : `color-mix(in srgb, ${accent} ${34 + depth * 30}%, transparent)`;
        return (
          <span
            key={i}
            className={`absolute transition-transform duration-700 ease-out ${slot.wide ? 'hidden xl:block' : ''}`}
            style={{
              left: slot.x,
              top: slot.y,
              transform: `translate3d(calc(-50% + var(--px, 0) * ${depth * -28}px), calc(var(--py, 0) * ${depth * -20}px), 0)`,
            }}
          >
            <span className="float-drift block" style={{ animationDelay: `${delay}s`, color, filter: `drop-shadow(0 ${2 + depth * 4}px ${4 + depth * 6}px color-mix(in srgb, ${tone === 'dark' ? '#000' : accent} ${14 + depth * 10}%, transparent))` }}>
              <Icon size={size} strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </div>
  );
}
