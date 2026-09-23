import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown, PanelsTopLeft, SearchX } from 'lucide-react';
import type { ReactNode } from 'react';

export function SectionIcon({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return <span aria-hidden="true" className={clsx('section-icon', className)}><Icon size={17} strokeWidth={1.8} /></span>;
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={clsx('card', className)}>{children}</section>;
}

export function CardHeader({
  title, action, icon: Icon = PanelsTopLeft, className,
}: { title: ReactNode; action?: ReactNode; icon?: LucideIcon; className?: string }) {
  return (
    <header className={clsx('panel-heading', className)}>
      <h2 className="flex min-w-0 items-center gap-3 card-title">
        <SectionIcon icon={Icon} />
        <span className="min-w-0 break-words">{title}</span>
      </h2>
      {action}
    </header>
  );
}

export type Tone = 'ok' | 'warn' | 'bad' | 'info' | 'neutral' | 'brand';

const TONE_CLASS: Record<Tone, string> = {
  ok: 'bg-ok-bg text-ok',
  warn: 'bg-warn-bg text-warn',
  bad: 'bg-bad-bg text-bad',
  info: 'bg-info-bg text-info',
  brand: 'bg-brand-50 text-link',
  neutral: 'bg-line-soft text-ink-soft',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-semibold', TONE_CLASS[tone], className)}>{children}</span>;
}

export function Button({
  variant = 'primary', icon: Icon, children, className, ...rest
}: { variant?: 'primary' | 'ghost' | 'outline' | 'danger'; icon?: LucideIcon } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 border-transparent',
    outline: 'bg-surface text-ink border-line hover:bg-line-soft',
    ghost: 'bg-transparent text-ink-soft border-transparent hover:bg-line-soft',
    danger: 'bg-bad text-white hover:brightness-95 border-transparent',
  };
  return (
    <button {...rest} className={clsx('button-control', variants[variant], className)}>
      {Icon && <Icon size={16} strokeWidth={2} />}
      {children}
    </button>
  );
}

export function Select({ children, className, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={clsx('relative', className)}>
      <select {...rest} className="input appearance-none pr-8 cursor-pointer">{children}</select>
      <ChevronDown size={15} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
    </div>
  );
}

export function Table({ children, label = 'Records', className }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <div className="table-scroll focus-ring" role="region" aria-label={label} tabIndex={0}>
      <table className={clsx('data-table', className)}>{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={clsx('table-heading', className)}>{children}</th>;
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={clsx('table-cell', className)}>{children}</td>;
}

const AVATAR_TINTS = ['bg-brand-50 text-link', 'bg-ok-bg text-ok', 'bg-warn-bg text-warn', 'bg-info-bg text-info', 'bg-bad-bg text-bad'];

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const tint = AVATAR_TINTS[[...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % AVATAR_TINTS.length];
  return (
    <span className={clsx('inline-flex shrink-0 items-center justify-center rounded-full font-semibold', tint)} style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials}
    </span>
  );
}

export function EmptyState({ icon: Icon = SearchX, title = 'Nothing found', hint = 'Try adjusting the search or filters.' }: { icon?: LucideIcon; title?: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <SectionIcon icon={Icon} className="mb-1" />
      <p className="text-sm font-semibold text-ink">{title}</p>
      {hint && <p className="max-w-sm text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
