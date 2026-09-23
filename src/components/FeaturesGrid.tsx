import { BarChart3, BookOpen, Building2, CreditCard, Handshake, KanbanSquare, Package, Server, ShieldCheck, Terminal, Ticket, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useT } from '../i18n/useLang';
import { SERVICE_ACCENTS } from '../lib/icons';
import Section from './Section';

const ICONS: Record<string, LucideIcon> = {
  ticket: Ticket,
  building: Building2,
  kanban: KanbanSquare,
  handshake: Handshake,
  users: Users,
  book: BookOpen,
  server: Server,
  terminal: Terminal,
  package: Package,
  chart: BarChart3,
  shield: ShieldCheck,
  card: CreditCard,
};

/** The real, shipped TitanDesk feature set — see TitanNetwork-main/README.md's
 * "What's built" section. Not aspirational copy. */
export default function FeaturesGrid() {
  const t = useT();
  const p = t.titandeskPage;

  return (
    <Section label={p.featuresTag} title={p.featuresTitle} intro={p.featuresSub} fullWidth decor={{ icons: [Ticket, Server, Users, BookOpen, ShieldCheck, BarChart3], accent: '#7c5cd6' }}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {p.features.map((f, i) => {
          const Icon = ICONS[f.icon] ?? Ticket;
          const accent = SERVICE_ACCENTS[i % SERVICE_ACCENTS.length];
          return (
            <div
              key={f.title}
              style={{ '--accent': accent } as CSSProperties}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_35%,white)] hover:shadow-[0_20px_40px_-24px_color-mix(in_srgb,var(--accent)_50%,transparent)]"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 80%, white), var(--accent))' }}
              >
                <Icon size={19} strokeWidth={1.9} aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold text-navy-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
