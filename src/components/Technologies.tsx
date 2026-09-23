import { useT } from '../i18n/useLang';
import Section from './Section';
import { Container, Cpu, Database, GitBranch, Terminal, Workflow } from 'lucide-react';

/** Official brand marks (simple-icons / devicon), keyed by file name. */
const LOGOS = import.meta.glob<string>('../assets/tech/*.svg', { eager: true, import: 'default' });
const logo = (name: string) => LOGOS[`../assets/tech/${name.toLowerCase().replace(/\s+/g, '-')}.svg`];

function Strip({ items, reverse }: { items: string[]; reverse?: boolean }) {
  // Rendered twice back to back; the track slides by exactly one copy, so the loop has no seam.
  const loop = [...items, ...items];
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <ul className={`flex w-max gap-4 py-2 ${reverse ? 'marquee-reverse' : 'marquee'} group-hover:[animation-play-state:paused]`}>
        {loop.map((name, i) => (
          <li
            key={`${name}-${i}`}
            aria-hidden={i >= items.length}
            className="flex h-16 shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 transition-colors hover:border-indigo-200"
          >
            {logo(name) && <img src={logo(name)} alt="" className="h-7 w-7 object-contain" loading="lazy" />}
            <span className="whitespace-nowrap text-sm font-semibold text-navy-800">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Technologies() {
  const t = useT();
  const groups = t.technologies.groups;
  // Cloud & infrastructure on one strip, networking & dev tooling on the other.
  const first = [...groups[0].items, ...groups[2].items];
  const second = [...groups[1].items, ...groups[3].items];

  return (
    <Section label={t.technologies.tag} title={t.technologies.title} intro={t.technologies.sub} tinted fullWidth decor={{ icons: [Cpu, Database, Terminal, GitBranch, Container, Workflow], accent: '#d4541f' }}>
      <div className="-mx-6 space-y-3 sm:mx-0">
        <Strip items={first} />
        <Strip items={second} reverse />
      </div>
    </Section>
  );
}
