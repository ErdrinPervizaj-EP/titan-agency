/**
 * Ports of TitanDesk's own UI primitives (web/src/components/ui, StatTile,
 * SectionIcon, TitanLogo, charts) — same markup and class names, so inside
 * `.td-app` they render exactly like the product. Only router links and the
 * `motion` animations are swapped for plain elements and CSS keyframes.
 */
import { useState, type ReactNode } from 'react';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';

export type Tone = 'ok' | 'warn' | 'bad' | 'info' | 'neutral' | 'brand';

const TONE_CLASS: Record<Tone, string> = {
  ok: 'bg-ok-bg text-ok',
  warn: 'bg-warn-bg text-warn',
  bad: 'bg-bad-bg text-bad',
  info: 'bg-info-bg text-info',
  brand: 'bg-brand-50 text-link',
  neutral: 'bg-line-soft text-ink-soft',
};

export function TitanLogo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M24 3.5 L43 15.2 V32.8 L24 44.5 L5 32.8 V15.2 Z" stroke="rgb(var(--logo-ink))" strokeWidth="4" strokeLinejoin="round" />
      <rect x="15" y="30" width="4" height="8" rx="2" fill="#F5A623" />
      <rect x="21.5" y="24" width="4" height="14" rx="2" fill="#1FA971" />
      <path d="M16 15.5 H32 L28.5 20 H25.5 V34.5 H22.5 V20 H19.5 Z" fill="rgb(var(--logo-ink))" />
      <rect x="28.5" y="27" width="4" height="11" rx="2" fill="#3B82F6" />
    </svg>
  );
}

export function SectionIcon({ icon: Icon, className = '' }: { icon: LucideIcon; className?: string }) {
  return <span aria-hidden className={`section-icon ${className}`}><Icon size={17} strokeWidth={1.8} /></span>;
}

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function CardHeader({ title, icon, action }: { title: ReactNode; icon: LucideIcon; action?: ReactNode }) {
  return (
    <header className="panel-heading">
      <h2 className="card-title flex min-w-0 items-center gap-3">
        <SectionIcon icon={icon} />
        <span className="min-w-0">{title}</span>
      </h2>
      {action}
    </header>
  );
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${TONE_CLASS[tone]}`}>{children}</span>;
}

const AVATAR_TINTS = ['bg-brand-50 text-link', 'bg-ok-bg text-ok', 'bg-warn-bg text-warn', 'bg-info-bg text-info', 'bg-bad-bg text-bad'];
export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const tint = AVATAR_TINTS[[...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % AVATAR_TINTS.length];
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${tint}`} style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials}
    </span>
  );
}

export function StatTile({ icon, label, value, tone = 'brand', onClick }: { icon: LucideIcon; label: string; value: string; tone?: Tone; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="card group block h-full w-full min-w-0 cursor-pointer px-5 py-4 text-left transition-colors hover:border-brand-300">
      <span className="flex min-h-10 items-center gap-2.5">
        <SectionIcon icon={icon} className={TONE_CLASS[tone]} />
        <span className="min-w-0 text-[13px] font-medium leading-5 text-ink-soft">{label}</span>
        <ArrowUpRight size={14} aria-hidden className="ml-auto shrink-0 text-ink-muted group-hover:text-link" />
      </span>
      <span className="mt-2 block text-[28px] font-semibold leading-8 tracking-tight text-ink tabular-nums">{value}</span>
    </button>
  );
}

const DOT_SHADES = ['#C7E7E4', '#9FD6D1', '#72C2BB', '#4FB3AC'];

/** TitanDesk's dot-matrix chart: one dot per `step`, darker toward the base; hover a column for its value. */
export function DotMatrixChart({ data, step = 2, height = 220 }: { data: { label: string; value: number }[]; step?: number; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const ceiling = Math.max(step, Math.ceil(Math.max(...data.map((d) => d.value)) / step) * step);
  const rows = Math.ceil(ceiling / step);
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round((ceiling / 4) * (4 - i)));

  return (
    <div className="flex gap-3 px-5 pb-5 pt-4" style={{ height }}>
      <ul className="flex w-8 shrink-0 flex-col justify-between py-1 text-right text-[12px] text-ink-muted">
        {ticks.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex flex-1 items-end justify-around gap-1">
          {data.map((d, i) => {
            const filled = Math.min(rows, Math.ceil(d.value / step));
            const active = hover === i;
            return (
              <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="relative flex h-full flex-1 cursor-default flex-col-reverse items-center gap-[5px] pb-1">
                {Array.from({ length: rows }, (_, r) => {
                  if (r >= filled) return <span key={r} className="h-2.5 w-2.5" />;
                  const shade = DOT_SHADES[Math.min(DOT_SHADES.length - 1, Math.floor(((filled - r) / filled) * DOT_SHADES.length))];
                  return (
                    <span
                      key={r}
                      className="td-dot h-2.5 w-2.5 rounded-full transition-colors"
                      style={{ background: active ? '#3B5BDB' : shade, animationDelay: `${Math.min(i, 10) * 40 + Math.min(r, 10) * 30}ms` }}
                    />
                  );
                })}
                {active && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-control border border-line bg-surface px-3 py-2 text-center shadow-pop">
                    <p className="text-[13px] font-semibold text-ink">{d.value} tickets</p>
                    <p className="text-[12px] text-ink-soft">{d.label}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-around border-t border-line pt-2">
          {data.map((d, i) => <span key={i} className="flex-1 text-center text-[12px] text-ink-muted">{d.label}</span>)}
        </div>
      </div>
    </div>
  );
}

/** TitanDesk's priority ring: 72 radial ticks colored by segment, with a slight length wobble. */
export function RadialSunburst({ segments, centerLabel, centerValue, size = 180, ticks = 72 }: {
  segments: { name: string; value: number; color: string }[];
  centerLabel: string;
  centerValue: string;
  size?: number;
  ticks?: number;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const c = size / 2;
  const inner = size * 0.29;
  const bounds: { color: string; upto: number }[] = [];
  let acc = 0;
  for (const s of segments) { acc += s.value / total; bounds.push({ color: s.color, upto: acc }); }

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden>
        {Array.from({ length: ticks }, (_, i) => {
          const frac = i / ticks;
          const color = bounds.find((b) => frac < b.upto)?.color ?? segments[segments.length - 1].color;
          const outer = inner + size * 0.19 * (0.72 + 0.28 * Math.abs(Math.sin(i * 1.7)));
          const angle = frac * Math.PI * 2 - Math.PI / 2;
          return (
            <line
              key={i}
              className="td-tick"
              style={{ animationDelay: `${frac * 500}ms` }}
              x1={c + Math.cos(angle) * inner}
              y1={c + Math.sin(angle) * inner}
              x2={c + Math.cos(angle) * outer}
              y2={c + Math.sin(angle) * outer}
              stroke={color}
              strokeWidth={3.2}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-[12px] text-ink-soft">{centerLabel}</p>
          <p className="text-lg font-semibold text-ink">{centerValue}</p>
        </div>
      </div>
    </div>
  );
}
