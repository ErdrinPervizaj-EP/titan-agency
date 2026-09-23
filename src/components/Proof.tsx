import { Quote } from 'lucide-react';
import { useLang, useT } from '../i18n/useLang';
import { loc, useSiteContent } from '../lib/site-content';
import Section from './Section';

/**
 * Real clients and testimonials, managed in the Super Admin console. Renders
 * nothing until something has been published there — no placeholder proof.
 */
export default function Proof() {
  const t = useT();
  const lang = useLang();
  const { clients, testimonials } = useSiteContent();
  if (clients.length === 0 && testimonials.length === 0) return null;

  return (
    <Section label={t.proof.tag} title={t.proof.title} fullWidth>
      {clients.length > 0 && (
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-6">
          {clients.map((client) => {
            const mark = client.logoUrl
              ? <img src={client.logoUrl} alt={client.name} className="h-8 w-auto max-w-[9rem] object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" loading="lazy" />
              : <span className="font-display text-lg font-bold text-navy-400">{client.name}</span>;
            return (
              <li key={client.id}>
                {client.website ? <a href={client.website} target="_blank" rel="noreferrer noopener" aria-label={client.name}>{mark}</a> : mark}
              </li>
            );
          })}
        </ul>
      )}
      {testimonials.length > 0 && (
        <div className={`grid gap-5 md:grid-cols-2 lg:grid-cols-3 ${clients.length ? 'mt-12' : ''}`}>
          {testimonials.map((item) => (
            <figure key={item.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
              <Quote size={22} aria-hidden className="text-indigo-500" />
              <blockquote className="mt-3 flex-1 leading-relaxed text-navy-700">{loc(item.quote, lang)}</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="block font-semibold text-navy-900">{item.name}</span>
                <span className="text-navy-500">{[item.role, item.company].filter(Boolean).join(', ')}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </Section>
  );
}
