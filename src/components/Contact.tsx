import { useState, type FormEvent } from 'react';
import { submitSupportRequest, TitanDeskApiError } from '../lib/titandesk-client';
import { useLang, useT } from '../i18n/useLang';
import { loc, useSiteContent } from '../lib/site-content';
import Section, { primaryButton } from './Section';
import { AtSign, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unavailable';

const fieldClass =
  'mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15';

export default function Contact() {
  const t = useT();
  const lang = useLang();
  const { company } = useSiteContent();
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? '').trim();

    try {
      // Becomes a ticket in Titan Network's own TitanDesk.
      await submitSupportRequest({
        kind: 'question',
        name: field('name'),
        email: field('email'),
        company: field('company'),
        message: field('message'),
        page: window.location.href,
        website: field('website'),
      });
      setStatus('sent');
      form.reset();
    } catch (error) {
      setStatus(error instanceof TitanDeskApiError && error.code === 'support_not_configured' ? 'unavailable' : 'error');
    }
  }

  return (
    <Section id="contact" label={t.contact.tag} title={t.contact.title} intro={t.contact.sub} tone="brand" decor={{ icons: [Mail, Phone, MapPin, Send, MessageSquare, AtSign] }}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <form onSubmit={handleSubmit} className="relative space-y-5 rounded-2xl bg-white p-6 text-navy-900 shadow-[0_30px_60px_-30px_rgba(16,26,51,0.5)] sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-navy-700">
              {t.contact.name}
              <input name="name" type="text" autoComplete="name" required className={fieldClass} />
            </label>
            <label className="block text-sm font-medium text-navy-700">
              {t.contact.email}
              <input name="email" type="email" autoComplete="email" required className={fieldClass} />
            </label>
          </div>
          <label className="block text-sm font-medium text-navy-700">
            {t.contact.company}
            <input name="company" type="text" autoComplete="organization" className={fieldClass} />
          </label>
          {/* Honeypot: hidden from people, filled in by bots. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          <label className="block text-sm font-medium text-navy-700">
            {t.contact.message}
            <textarea name="message" rows={5} required minLength={10} maxLength={5000} className={`${fieldClass} resize-y`} />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={status === 'sending'} className={`${primaryButton} disabled:opacity-60`}>
              {status === 'sending' ? t.contact.sending : t.contact.submit}
            </button>
            {status === 'sent' && <p role="status" className="text-sm font-medium text-teal-600">{t.contact.success}</p>}
            {status === 'error' && <p role="alert" className="text-sm font-medium text-red-600">{t.contact.error}</p>}
            {status === 'unavailable' && <p role="alert" className="text-sm font-medium text-red-600">{t.contact.unavailable} <a href={`mailto:${company.email}`} className="underline">{company.email}</a></p>}
          </div>
        </form>

        <div className="space-y-6 text-sm lg:pt-2">
          <div>
            <p className="font-medium text-white/65">{t.contact.emailUs}</p>
            <a href={`mailto:${company.email}`} className="mt-1 block text-base font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">{company.email}</a>
          </div>
          <div>
            <p className="font-medium text-white/65">{t.contact.where}</p>
            <p className="mt-1 leading-relaxed text-white">{loc(company.locations, lang)}</p>
          </div>
          {company.phone && (
            <div>
              <p className="font-medium text-white/65">{t.supportWidget.phoneLabel}</p>
              <a href={`tel:${company.phone.replace(/[^+0-9]/g, '')}`} className="mt-1 block text-base font-semibold text-white">{company.phone}</a>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
