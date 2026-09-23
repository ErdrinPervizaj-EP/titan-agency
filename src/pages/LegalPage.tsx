import { useLang } from '../i18n/useLang';
import { LAST_UPDATED, LEGAL, type LegalPageKey } from '../i18n/legal';
import { useSiteContent, type SiteCompany } from '../lib/site-content';
import type { Lang } from '../i18n/translations';
import Seo from '../components/Seo';
import { PageHeader } from '../components/Section';

const PATHS: Record<LegalPageKey | 'imprint', string> = { privacy: '/privacy', terms: '/terms', security: '/security', imprint: '/imprint', service: '/titandesk/terms', refunds: '/refunds' };

/** Privacy, Terms, TitanDesk Terms of Service, Refunds, Security and Imprint — copy in i18n/legal.ts, company specifics from the Super Admin company details. */
export default function LegalPage({ page }: { page: LegalPageKey | 'imprint' }) {
  const lang = useLang();
  const { company } = useSiteContent();
  const copy = LEGAL[lang];
  const controller = [company.legal.name || 'Titan Network', company.legal.address].filter(Boolean).join(', ');
  const fill = (text: string) => text.replaceAll('{controller}', controller).replaceAll('{email}', company.email);

  const title = copy[page].title;
  return (
    <>
      <Seo path={PATHS[page]} titleEn={`${LEGAL.en[page].title} | Titan Network`} titleDe={`${LEGAL.de[page].title} | Titan Network`} descriptionEn={LEGAL.en[page].intro} descriptionDe={LEGAL.de[page].intro} />
      <PageHeader label={LAST_UPDATED[lang]} title={title} intro={copy[page].intro} />
      <article className="mx-auto max-w-6xl px-6 pb-24">
        <div className="max-w-3xl border-t border-slate-200 lg:ml-[15rem]">
          {page === 'imprint' ? (
            <Imprint lang={lang} company={company} />
          ) : (
            copy[page].sections.map((section) => (
              <section key={section.heading} className="border-b border-slate-100 py-7">
                <h2 className="font-display text-lg font-semibold text-navy-900">{section.heading}</h2>
                {section.body.map((paragraph) => <p key={paragraph.slice(0, 40)} className="mt-3 leading-relaxed text-navy-600">{fill(paragraph)}</p>)}
              </section>
            ))
          )}
        </div>
      </article>
    </>
  );
}

function Imprint({ lang, company }: { lang: Lang; company: SiteCompany }) {
  const { labels, missing } = LEGAL[lang].imprint;
  const rows: [string, string][] = [
    [labels.name, company.legal.name || 'Titan Network'],
    [labels.address, company.legal.address],
    [labels.representative, company.legal.representative],
    [labels.email, company.email],
    [labels.phone, company.phone],
    [labels.registration, company.legal.registration],
    [labels.vatId, company.legal.vatId],
  ];
  const complete = Boolean(company.legal.address && company.legal.representative);
  return (
    <>
      <dl className="divide-y divide-slate-100">
        {rows.filter(([, value]) => value).map(([label, value]) => (
          <div key={label} className="grid gap-1 py-5 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <dt className="text-sm font-medium text-navy-400">{label}</dt>
            <dd className="whitespace-pre-line text-navy-800">{label === labels.email ? <a href={`mailto:${value}`} className="text-indigo-500 hover:underline">{value}</a> : value}</dd>
          </div>
        ))}
      </dl>
      {!complete && <p className="mt-4 text-sm text-navy-400">{missing}</p>}
    </>
  );
}
