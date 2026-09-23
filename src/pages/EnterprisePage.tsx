import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import Seo from '../components/Seo';
import Section, { PageHeader, primaryButton } from '../components/Section';
import { useT } from '../i18n/useLang';
import { accountUrl } from '../lib/account-links';
import { useSiteContent } from '../lib/site-content';
import { SALES_NEEDS, submitSupportRequest, TitanDeskApiError, type SalesNeed } from '../lib/titandesk-client';
import { useSession } from '../lib/useSession';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unavailable';

const fieldClass =
  'mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15';

/**
 * Where "Talk to sales" goes, from the pricing cards and from inside the
 * product. The form files a "sales" request: a lead on the Leads board of
 * Titan Network's own TitanDesk plus a High ticket with the details.
 */
export default function EnterprisePage() {
  const t = useT();
  const e = t.titandeskPage.enterprise;
  const { company } = useSiteContent();
  const { user } = useSession();
  const [status, setStatus] = useState<Status>('idle');
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    const form = event.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? '').trim();
    const seats = Number(field('seats'));

    try {
      const ref = await submitSupportRequest({
        kind: 'sales',
        name: field('name'),
        email: field('email'),
        company: field('company'),
        seats: Number.isInteger(seats) && seats > 0 ? seats : undefined,
        currentTool: field('currentTool'),
        needs: data.getAll('needs').map(String).filter((need): need is SalesNeed => (SALES_NEEDS as readonly string[]).includes(need)),
        message: field('message'),
        workspace: user?.workspaceId,
        page: window.location.href,
        website: field('website'),
      });
      setReference(ref);
      setStatus('sent');
      form.reset();
    } catch (error) {
      setStatus(error instanceof TitanDeskApiError && error.code === 'support_not_configured' ? 'unavailable' : 'error');
    }
  }

  return (
    <>
      <Seo
        path="/titandesk/enterprise"
        titleEn="TitanDesk Enterprise — Talk to Sales | Titan Network"
        titleDe="TitanDesk Enterprise — Vertrieb kontaktieren | Titan Network"
        descriptionEn="TitanDesk Enterprise: onboarding and data migration by our engineers, a named contact, custom integrations, annual invoicing and a GDPR data processing agreement."
        descriptionDe="TitanDesk Enterprise: Onboarding und Datenmigration durch unsere Engineers, fester Ansprechpartner, individuelle Integrationen, Jahresrechnung und AVV nach DSGVO."
      />

      <PageHeader label={e.eyebrow} title={e.title} intro={e.sub}>
        <p className="mt-4 max-w-2xl text-sm font-medium text-navy-700">{e.forWho}</p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-600">
          {e.promise.map((item) => (
            <li key={item} className="flex items-center gap-2"><Check size={16} aria-hidden className="text-teal-500" />{item}</li>
          ))}
        </ul>
      </PageHeader>

      <Section label={e.includedTag} title={e.includedTitle} tinted>
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {e.included.map((item) => (
            <div key={item.title}>
              <dt className="font-display text-lg font-semibold text-navy-900">{item.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-navy-500">{item.desc}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="talk-to-sales" label={e.formTag} title={e.formTitle} intro={e.formSub}>
        <form onSubmit={handleSubmit} className="relative space-y-5 rounded-2xl border border-slate-200 bg-white p-6 text-navy-900 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-navy-700">
              {e.name}
              <input name="name" type="text" autoComplete="name" required maxLength={120} defaultValue={user?.name ?? ''} className={fieldClass} />
            </label>
            <label className="block text-sm font-medium text-navy-700">
              {e.email}
              <input name="email" type="email" autoComplete="email" required maxLength={200} defaultValue={user?.email ?? ''} className={fieldClass} />
            </label>
            <label className="block text-sm font-medium text-navy-700">
              {e.company}
              <input name="company" type="text" autoComplete="organization" required maxLength={160} className={fieldClass} />
            </label>
            <label className="block text-sm font-medium text-navy-700">
              {e.seats}
              <input name="seats" type="number" inputMode="numeric" min={1} max={100000} required className={fieldClass} />
            </label>
          </div>
          <label className="block text-sm font-medium text-navy-700">
            {e.currentTool}
            <input name="currentTool" type="text" maxLength={120} placeholder={e.currentToolPlaceholder} className={fieldClass} />
          </label>
          <fieldset>
            <legend className="text-sm font-medium text-navy-700">{e.needsLabel}</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {SALES_NEEDS.map((need) => (
                <label key={need} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-navy-700 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-500/[0.04]">
                  <input type="checkbox" name="needs" value={need} className="h-4 w-4 accent-indigo-500" />
                  {e.needs[need]}
                </label>
              ))}
            </div>
          </fieldset>
          {/* Honeypot: hidden from people, filled in by bots. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          <label className="block text-sm font-medium text-navy-700">
            {e.message}
            <textarea name="message" rows={4} required minLength={10} maxLength={5000} placeholder={e.messagePlaceholder} className={`${fieldClass} resize-y`} />
          </label>
          {user && <p className="text-sm text-navy-500">{e.signedIn}</p>}
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={status === 'sending'} className={`${primaryButton} disabled:opacity-60`}>
              {status === 'sending' ? e.sending : e.submit}
            </button>
            <a href={accountUrl('signup')} className="text-sm font-semibold text-navy-900 underline decoration-slate-300 underline-offset-4 hover:decoration-navy-900">{e.trialInstead}</a>
          </div>
          {status === 'sent' && <p role="status" className="text-sm font-medium text-teal-600">{e.success.replace('{ref}', reference ?? '—')}</p>}
          {status === 'error' && <p role="alert" className="text-sm font-medium text-red-600">{e.error}</p>}
          {status === 'unavailable' && <p role="alert" className="text-sm font-medium text-red-600">{e.unavailable} <a href={`mailto:${company.email}`} className="underline">{company.email}</a></p>}
        </form>
      </Section>
    </>
  );
}
