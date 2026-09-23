import { useLang, useT, useLocalizedPath } from '../i18n/useLang';
import { loc, useSiteContent } from '../lib/site-content';
import Seo from '../components/Seo';
import Section, { PageHeader, primaryButton, secondaryButton } from '../components/Section';
import { Briefcase, Coffee, GraduationCap, Heart, Laptop, Rocket, Send, Users } from 'lucide-react';

export default function CareersPage() {
  const t = useT();
  const lp = useLocalizedPath();
  const p = t.careersPage;
  const lang = useLang();
  const { jobs, company } = useSiteContent();

  return (
    <>
      <Seo
        path="/careers"
        titleEn="Careers | Titan Network"
        titleDe="Karriere | Titan Network"
        descriptionEn="Open IT support, network engineering, and software roles at Titan Network — based in Kosovo and Albania, remote-friendly."
        descriptionDe="Offene Stellen für IT-Support, Netzwerktechnik und Softwareentwicklung bei Titan Network — im Kosovo und in Albanien, remote-freundlich."
      />

      <PageHeader label={p.eyebrow} title={p.title} intro={p.sub} />

      <Section label={p.valuesTag} title={p.valuesTitle} fullWidth decor={{ icons: [Heart, Users, Rocket, Coffee, GraduationCap, Laptop], accent: '#7c5cd6' }}>
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
          {p.values.map((value, i) => (
            <div key={value.title} className="border-t-2 border-navy-900 pt-5">
              <p className="font-mono text-sm text-navy-400">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="font-display mt-2 text-lg font-semibold text-navy-900">{value.title}</h3>
              <p className="mt-2 leading-relaxed text-navy-500">{value.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="roles" label={p.openRolesTag} title={p.openRolesTitle} tinted decor={{ icons: [Briefcase, Laptop, Users, Send, Rocket, GraduationCap], accent: '#2f9e8f' }}>
        {jobs.length === 0 ? (
          <p className="border-t border-slate-200 pt-6 text-navy-500">{p.noOpenings}</p>
        ) : (
          <ul className="border-t border-slate-200">
            {jobs.map((job) => {
              const title = loc(job.title, lang);
              const description = loc(job.description, lang);
              return (
                <li key={job.id} className="grid gap-4 border-b border-slate-200 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-navy-900">{title}</h3>
                    <p className="mt-1 text-sm text-navy-500">{loc(job.location, lang)} · {job.type}</p>
                    {description && <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-navy-600">{description}</p>}
                  </div>
                  <a href={`mailto:${company.email}?subject=${encodeURIComponent(title)}`} className={secondaryButton}>
                    {p.apply}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section label={p.noRoleTag} title={p.noRoleTitle} intro={p.noRoleSub}>
        <a href={`${lp('/')}#contact`} className={primaryButton}>{p.noRoleCta}</a>
      </Section>
    </>
  );
}
