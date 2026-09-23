import { Plus } from 'lucide-react';
import { useT } from '../i18n/useLang';
import Section from './Section';
import { BookOpen, CircleHelp, Lightbulb, MessageCircle, MessagesSquare, Search } from 'lucide-react';

export default function Faq() {
  const t = useT();
  return (
    <Section id="faq" label={t.faq.tag} title={t.faq.title} decor={{ icons: [CircleHelp, MessageCircle, BookOpen, Lightbulb, MessagesSquare, Search], accent: '#7c5cd6' }}>
      <div className="border-t border-slate-200">
        {t.faq.items.map((item, i) => (
          <details key={item.q} open={i === 0} className="group border-b border-slate-200">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-medium text-navy-900 [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus size={18} aria-hidden className="shrink-0 text-navy-400 transition-transform group-open:rotate-45" />
            </summary>
            <p className="max-w-2xl pb-6 leading-relaxed text-navy-500">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
