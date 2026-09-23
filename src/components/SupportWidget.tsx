import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CircleHelp, Bug, MessageSquare, X, CheckCircle2 } from 'lucide-react';
import { useT } from '../i18n/useLang';
import { submitSupportRequest, TitanDeskApiError, type SupportRequest } from '../lib/titandesk-client';
import { useSiteContent } from '../lib/site-content';

type Kind = SupportRequest['kind'];
type Category = NonNullable<SupportRequest['category']>;
type State = { status: 'idle' | 'sending' | 'error' | 'unavailable' } | { status: 'sent'; reference: string | null };

const field = 'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15';

/**
 * "Talk to us": ask a question or report a problem from any page. Each
 * message is filed as a ticket in Titan Network's own TitanDesk, and the
 * visitor gets the ticket reference back.
 */
export default function SupportWidget() {
  const t = useT();
  const w = t.supportWidget;
  const { company } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>('question');
  const [state, setState] = useState<State>({ status: 'idle' });
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: 'sending' });
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? '').trim();
    try {
      const reference = await submitSupportRequest({
        kind,
        name: value('name'),
        email: value('email'),
        company: value('company'),
        category: kind === 'problem' ? (value('category') as Category) : undefined,
        message: value('message'),
        page: window.location.href,
        website: value('website'),
      });
      setState({ status: 'sent', reference });
    } catch (error) {
      setState({ status: error instanceof TitanDeskApiError && error.code === 'support_not_configured' ? 'unavailable' : 'error' });
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label={w.title}
          className="mb-3 max-h-[calc(100vh-7rem)] w-[min(24rem,calc(100vw-3rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-navy-900/15"
        >
          <div className="flex items-start justify-between gap-4 bg-navy-950 px-5 py-4 text-white">
            <div>
              <h2 className="font-display text-base font-bold">{w.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-white/70">{w.sub}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={w.close} className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {state.status === 'sent' ? (
            <div className="p-5 text-center">
              <CheckCircle2 size={36} className="mx-auto text-teal-500" aria-hidden />
              <p className="mt-3 font-semibold text-navy-900">{w.sentTitle}</p>
              <p className="mt-1 text-sm text-navy-500">{state.reference ? w.sentBody.replace('{ref}', state.reference) : w.sentNoRef}</p>
              <button type="button" onClick={() => setState({ status: 'idle' })} className="mt-4 text-sm font-semibold text-indigo-500 hover:text-indigo-600">{w.another}</button>
            </div>
          ) : (
            <form onSubmit={submit} className="relative space-y-3 p-5">
              <div role="tablist" aria-label={w.title} className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
                {([['question', w.tabAsk, CircleHelp], ['problem', w.tabReport, Bug]] as const).map(([value, label, Icon]) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={kind === value}
                    onClick={() => setKind(value)}
                    className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold transition-colors ${kind === value ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500 hover:text-navy-900'}`}
                  >
                    <Icon size={14} aria-hidden /> {label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-medium text-navy-700">{w.name}<input name="name" required maxLength={120} autoComplete="name" className={field} /></label>
                <label className="block text-xs font-medium text-navy-700">{w.email}<input name="email" type="email" required maxLength={200} autoComplete="email" className={field} /></label>
              </div>
              <label className="block text-xs font-medium text-navy-700">{w.company}<input name="company" maxLength={160} autoComplete="organization" className={field} /></label>
              {kind === 'problem' && (
                <label className="block text-xs font-medium text-navy-700">
                  {w.category}
                  <select name="category" defaultValue="titandesk" className={field}>
                    {(Object.entries(w.categories) as [Category, string][]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              )}
              <textarea
                name="message"
                aria-label={kind === 'problem' ? w.problemPlaceholder : w.questionPlaceholder}
                placeholder={kind === 'problem' ? w.problemPlaceholder : w.questionPlaceholder}
                required
                minLength={10}
                maxLength={5000}
                rows={4}
                className={`${field} resize-y`}
              />
              {/* Honeypot: hidden from people, filled in by bots. */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
              {state.status === 'error' && <p role="alert" className="text-xs font-medium text-red-600">{w.error}</p>}
              {state.status === 'unavailable' && <p role="alert" className="text-xs font-medium text-red-600">{w.unavailable}</p>}
              <button type="submit" disabled={state.status === 'sending'} className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 disabled:opacity-60">
                {state.status === 'sending' ? w.sending : w.send}
              </button>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs text-navy-500">
                <a href={`mailto:${company.email}`} className="hover:text-navy-900">{w.emailLabel}: {company.email}</a>
                {company.phone && <a href={`tel:${company.phone.replace(/[^+0-9]/g, '')}`} className="hover:text-navy-900">{w.phoneLabel}: {company.phone}</a>}
              </div>
            </form>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="ml-auto flex items-center gap-2 rounded-full bg-navy-900 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-navy-900/25 transition hover:bg-navy-950"
      >
        <MessageSquare size={18} aria-hidden />
        {w.label}
      </button>
    </div>
  );
}
