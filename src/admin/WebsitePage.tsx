import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Briefcase, Building2, CreditCard, Globe, MessageSquareQuote, Plus, Trash2, Users } from 'lucide-react';
import { Badge, Button, Card, CardHeader } from './ui';
import { ErrorState, LoadingState, PageIntro } from './components';
import { useSuperAdminToast } from './toast';
import PublishDialog from './PublishDialog';
import { websiteApi, type ContentKey, type ContentShapes, type ContentSnapshot } from './website-api';
import type { Localized } from '../lib/site-content';

const TABS: { key: ContentKey; label: string; icon: typeof Globe; hint: string }[] = [
  { key: 'company', label: 'Company', icon: Building2, hint: 'Contact details and the legal details shown on the Imprint and Privacy Policy.' },
  { key: 'plans', label: 'Plans & prices', icon: CreditCard, hint: 'What the site shows for TitanDesk plans. What a plan unlocks is set in the product; what customers pay is set by the Stripe price.' },
  { key: 'jobs', label: 'Jobs', icon: Briefcase, hint: 'Open roles on the Careers page. Closed roles stay here but are hidden.' },
  { key: 'clients', label: 'Clients', icon: Users, hint: 'Client names or logos. Only add clients who agreed to be listed.' },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, hint: 'Real quotes, with permission. Nothing shows on the site until you publish one.' },
];

const newId = () => `item-${Date.now().toString(36)}`;
const blank = (): Localized => ({ en: '', de: '' });

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block text-2xs font-semibold text-ink-soft">
      {label}
      {children}
      {hint && <span className="mt-1 block font-normal text-ink-muted">{hint}</span>}
    </label>
  );
}

function Text({ label, value, onChange, type = 'text', hint, multiline }: { label: string; value: string; onChange: (value: string) => void; type?: string; hint?: string; multiline?: boolean }) {
  return (
    <Field label={label} hint={hint}>
      {multiline
        ? <textarea className="input mt-1.5 min-h-24" value={value} onChange={(e) => onChange(e.target.value)} />
        : <input type={type} className="input mt-1.5" value={value} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

function Bilingual({ label, value, onChange, multiline }: { label: string; value: Localized; onChange: (value: Localized) => void; multiline?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Text label={`${label} (English)`} value={value.en} multiline={multiline} onChange={(en) => onChange({ ...value, en })} />
      <Text label={`${label} (German)`} value={value.de} multiline={multiline} hint="Empty = English is shown." onChange={(de) => onChange({ ...value, de })} />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-body-sm text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /> {label}
    </label>
  );
}

function ListItem({ title, onRemove, children }: { title: string; onRemove: () => void; children: ReactNode }) {
  return (
    <div className="rounded-control border border-line p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-semibold text-ink">{title || 'Untitled'}</p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-bad" icon={Trash2} onClick={onRemove}>Remove</Button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function WebsitePage() {
  const { push } = useSuperAdminToast();
  const [snapshot, setSnapshot] = useState<ContentSnapshot | null>(null);
  const [draft, setDraft] = useState<ContentSnapshot | null>(null);
  const [tab, setTab] = useState<ContentKey>('company');
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await websiteApi.content();
      setSnapshot(data);
      setDraft(structuredClone(data));
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load website content.');
    }
  }, []);
  // First load; ignores a response that lands after the page closed. `load` handles retry.
  useEffect(() => {
    let active = true;
    websiteApi.content()
      .then(data => { if (active) { setSnapshot(data); setDraft(structuredClone(data)); } })
      .catch((caught: unknown) => { if (active) setError(caught instanceof Error ? caught.message : 'Could not load website content.'); });
    return () => { active = false; };
  }, []);

  const dirty = useMemo(() => Boolean(snapshot && draft && JSON.stringify(snapshot[tab].data) !== JSON.stringify(draft[tab].data)), [snapshot, draft, tab]);

  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!draft || !snapshot) return <LoadingState />;

  const set = <K extends ContentKey>(key: K, data: ContentShapes[K]) => setDraft((current) => current && { ...current, [key]: { ...current[key], data } });
  const active = TABS.find((t) => t.key === tab)!;
  const entry = draft[tab];

  return (
    <div className="space-y-5">
      <PageIntro eyebrow="Website" title="Website content" description="Edit what titannetwork.io shows. Changes go live within about a minute of publishing." />
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
            className={`focus-ring inline-flex items-center gap-2 rounded-control border px-3 py-2 text-body-sm font-medium ${tab === t.key ? 'border-brand-600 bg-brand-50 text-link' : 'border-line text-ink-soft hover:bg-line-soft'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader icon={active.icon} title={active.label} action={
          <div className="flex items-center gap-2">
            <Badge tone={entry.version === 0 ? 'neutral' : 'ok'}>{entry.version === 0 ? 'Using defaults' : `Version ${entry.version}`}</Badge>
            <Button type="button" variant="outline" className="h-9 px-3 text-body-sm" disabled={!dirty} onClick={() => setDraft({ ...draft, [tab]: structuredClone(snapshot[tab]) })}>Discard</Button>
            <Button type="button" className="h-9 px-3 text-body-sm" disabled={!dirty} onClick={() => setPublishing(true)}>Publish</Button>
          </div>
        } />
        <div className="space-y-5 p-5">
          <p className="text-body-sm text-ink-soft">{active.hint}</p>
          {tab === 'company' && <CompanyEditor value={draft.company.data} onChange={(v) => set('company', v)} />}
          {tab === 'plans' && <PlansEditor value={draft.plans.data} onChange={(v) => set('plans', v)} />}
          {tab === 'jobs' && <JobsEditor value={draft.jobs.data} onChange={(v) => set('jobs', v)} />}
          {tab === 'clients' && <ClientsEditor value={draft.clients.data} onChange={(v) => set('clients', v)} />}
          {tab === 'testimonials' && <TestimonialsEditor value={draft.testimonials.data} onChange={(v) => set('testimonials', v)} />}
        </div>
      </Card>

      {publishing && (
        <PublishDialog
          title={`Publish ${active.label.toLowerCase()}`}
          description="This updates the public website."
          onClose={() => setPublishing(false)}
          onConfirm={async (reason) => {
            const saved = await websiteApi.saveContent(tab, snapshot[tab].version, draft[tab].data as never, reason);
            setSnapshot({ ...snapshot, [tab]: saved });
            setDraft({ ...draft, [tab]: structuredClone(saved) });
            push(`${active.label} published`);
          }}
        />
      )}
    </div>
  );
}

function CompanyEditor({ value, onChange }: { value: ContentShapes['company']; onChange: (value: ContentShapes['company']) => void }) {
  const legal = value.legal;
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Text label="Contact email" type="email" value={value.email} onChange={(email) => onChange({ ...value, email })} />
        <Text label="Phone" value={value.phone} hint="Leave empty to hide the phone number." onChange={(phone) => onChange({ ...value, phone })} />
      </div>
      <Bilingual label="Locations line" value={value.locations} onChange={(locations) => onChange({ ...value, locations })} />
      <div>
        <p className="text-body-sm font-semibold text-ink">Social profiles</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {(Object.keys(value.socials) as (keyof typeof value.socials)[]).map((network) => (
            <Text key={network} label={network === 'x' ? 'X (Twitter)' : network[0].toUpperCase() + network.slice(1)} value={value.socials[network]} hint="Full https:// link, or empty."
              onChange={(url) => onChange({ ...value, socials: { ...value.socials, [network]: url } })} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-body-sm font-semibold text-ink">Legal details (Imprint)</p>
        <p className="text-2xs text-ink-muted">Required by law for businesses serving the EU and German-speaking countries. Fill in the registered company details.</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Text label="Legal company name" value={legal.name} onChange={(name) => onChange({ ...value, legal: { ...legal, name } })} />
          <Text label="Represented by" value={legal.representative} hint="Managing director(s)." onChange={(representative) => onChange({ ...value, legal: { ...legal, representative } })} />
          <Text label="Registered address" value={legal.address} multiline onChange={(address) => onChange({ ...value, legal: { ...legal, address } })} />
          <div className="space-y-3">
            <Text label="Registration (court / business register and number)" value={legal.registration} onChange={(registration) => onChange({ ...value, legal: { ...legal, registration } })} />
            <Text label="VAT ID" value={legal.vatId} onChange={(vatId) => onChange({ ...value, legal: { ...legal, vatId } })} />
          </div>
        </div>
      </div>
    </>
  );
}

function PlansEditor({ value, onChange }: { value: ContentShapes['plans']; onChange: (value: ContentShapes['plans']) => void }) {
  const update = (index: number, plan: ContentShapes['plans'][number]) => onChange(value.map((p, i) => (i === index ? plan : p)));
  return (
    <div className="space-y-4">
      {value.map((plan, index) => (
        <div key={plan.key} className="rounded-control border border-line p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2"><Badge tone="brand">{plan.key}</Badge><span className="text-2xs text-ink-muted">Billing plan key; cannot be changed here.</span></div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Text label="Name" value={plan.name} onChange={(name) => update(index, { ...plan, name })} />
            <Text label="Price per user / month" type="number" value={plan.price === null ? '' : String(plan.price)} hint="Empty = Custom (contact sales)."
              onChange={(price) => update(index, { ...plan, price: price === '' ? null : Number(price) })} />
            <Field label="Currency">
              <select className="input mt-1.5" value={plan.currency} onChange={(e) => update(index, { ...plan, currency: e.target.value as 'USD' | 'EUR' })}><option>USD</option><option>EUR</option></select>
            </Field>
            <div className="flex items-end pb-2"><Toggle label="Mark as most popular" checked={plan.featured} onChange={(featured) => update(index, { ...plan, featured })} /></div>
          </div>
          <div className="mt-3"><Bilingual label="Short description" value={plan.description} onChange={(description) => update(index, { ...plan, description })} /></div>
          <div className="mt-3 space-y-2">
            <p className="text-2xs font-semibold text-ink-soft">Feature bullets</p>
            {plan.features.map((feature, f) => (
              <div key={f} className="flex items-start gap-2">
                <div className="min-w-0 flex-1"><Bilingual label={`Bullet ${f + 1}`} value={feature} onChange={(next) => update(index, { ...plan, features: plan.features.map((x, i) => (i === f ? next : x)) })} /></div>
                <Button type="button" variant="ghost" className="mt-6 h-9 px-2 text-bad" icon={Trash2} aria-label="Remove bullet" onClick={() => update(index, { ...plan, features: plan.features.filter((_, i) => i !== f) })} />
              </div>
            ))}
            {plan.features.length < 10 && <Button type="button" variant="outline" className="h-8 px-3 text-body-sm" icon={Plus} onClick={() => update(index, { ...plan, features: [...plan.features, blank()] })}>Add bullet</Button>}
          </div>
        </div>
      ))}
    </div>
  );
}

function JobsEditor({ value, onChange }: { value: ContentShapes['jobs']; onChange: (value: ContentShapes['jobs']) => void }) {
  const update = (index: number, job: ContentShapes['jobs'][number]) => onChange(value.map((j, i) => (i === index ? job : j)));
  return (
    <div className="space-y-4">
      {value.length === 0 && <p className="text-body-sm text-ink-muted">No roles yet. The Careers page shows a friendly "no open roles" message.</p>}
      {value.map((job, index) => (
        <ListItem key={job.id} title={job.title.en} onRemove={() => onChange(value.filter((_, i) => i !== index))}>
          <Bilingual label="Title" value={job.title} onChange={(title) => update(index, { ...job, title })} />
          <Bilingual label="Location" value={job.location} onChange={(location) => update(index, { ...job, location })} />
          <div className="flex flex-wrap items-end gap-4">
            <Field label="Type">
              <select className="input mt-1.5 w-44" value={job.type} onChange={(e) => update(index, { ...job, type: e.target.value })}>
                {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => <option key={type}>{type}</option>)}
              </select>
            </Field>
            <Toggle label="Open (shown on the site)" checked={job.open} onChange={(open) => update(index, { ...job, open })} />
          </div>
          <Bilingual label="Description" value={job.description} multiline onChange={(description) => update(index, { ...job, description })} />
        </ListItem>
      ))}
      <Button type="button" variant="outline" className="h-9 px-3 text-body-sm" icon={Plus}
        onClick={() => onChange([...value, { id: newId(), title: blank(), location: blank(), type: 'Full-time', description: blank(), open: true }])}>Add role</Button>
    </div>
  );
}

function ClientsEditor({ value, onChange }: { value: ContentShapes['clients']; onChange: (value: ContentShapes['clients']) => void }) {
  const update = (index: number, client: ContentShapes['clients'][number]) => onChange(value.map((c, i) => (i === index ? client : c)));
  return (
    <div className="space-y-4">
      {value.map((client, index) => (
        <ListItem key={client.id} title={client.name} onRemove={() => onChange(value.filter((_, i) => i !== index))}>
          <div className="grid gap-3 sm:grid-cols-3">
            <Text label="Name" value={client.name} onChange={(name) => update(index, { ...client, name })} />
            <Text label="Logo image" value={client.logoUrl} hint="https:// link; empty shows the name." onChange={(logoUrl) => update(index, { ...client, logoUrl })} />
            <Text label="Website" value={client.website} hint="Optional https:// link." onChange={(website) => update(index, { ...client, website })} />
          </div>
          <Toggle label="Published" checked={client.published} onChange={(published) => update(index, { ...client, published })} />
        </ListItem>
      ))}
      <Button type="button" variant="outline" className="h-9 px-3 text-body-sm" icon={Plus}
        onClick={() => onChange([...value, { id: newId(), name: '', logoUrl: '', website: '', published: false }])}>Add client</Button>
    </div>
  );
}

function TestimonialsEditor({ value, onChange }: { value: ContentShapes['testimonials']; onChange: (value: ContentShapes['testimonials']) => void }) {
  const update = (index: number, item: ContentShapes['testimonials'][number]) => onChange(value.map((t, i) => (i === index ? item : t)));
  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <ListItem key={item.id} title={item.name} onRemove={() => onChange(value.filter((_, i) => i !== index))}>
          <Bilingual label="Quote" value={item.quote} multiline onChange={(quote) => update(index, { ...item, quote })} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Text label="Name" value={item.name} onChange={(name) => update(index, { ...item, name })} />
            <Text label="Role" value={item.role} onChange={(role) => update(index, { ...item, role })} />
            <Text label="Company" value={item.company} onChange={(company) => update(index, { ...item, company })} />
          </div>
          <Toggle label="Published (only with the person's permission)" checked={item.published} onChange={(published) => update(index, { ...item, published })} />
        </ListItem>
      ))}
      <Button type="button" variant="outline" className="h-9 px-3 text-body-sm" icon={Plus}
        onClick={() => onChange([...value, { id: newId(), quote: blank(), name: '', role: '', company: '', published: false }])}>Add testimonial</Button>
    </div>
  );
}
