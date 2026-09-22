import { MapPin, Clock } from 'lucide-react';
import { useT, useLocalizedPath } from '../i18n/useLang';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import teamMeeting from '../assets/photos/team-meeting-table.jpg';
import officePairing from '../assets/photos/office-pairing.jpg';
import codeMacbook from '../assets/photos/code-macbook.jpg';

export default function CareersPage() {
  const t = useT();
  const lp = useLocalizedPath();
  const p = t.careersPage;

  return (
    <>
      <Seo
        path="/careers"
        titleEn="Careers | Titan Network"
        titleDe="Karriere | Titan Network"
        descriptionEn="Open IT support, network engineering, and software roles at Titan Network — based in Kosovo and Albania, remote-friendly."
        descriptionDe="Offene Stellen für IT-Support, Netzwerktechnik und Softwareentwicklung bei Titan Network — im Kosovo und in Albanien, remote-freundlich."
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{p.eyebrow}</span>
            <h1 className="font-display mt-4 text-4xl font-bold leading-tight text-navy-900 sm:text-5xl">{p.title}</h1>
            <p className="mt-5 text-lg text-navy-500">{p.sub}</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="overflow-hidden rounded-2xl shadow-xl shadow-navy-900/10">
              <img src={teamMeeting} alt="" className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal className="order-2 overflow-hidden rounded-2xl shadow-lg shadow-navy-900/10 lg:order-1">
              <img src={officePairing} alt="" className="aspect-[4/3] w-full object-cover" />
            </Reveal>
            <div className="order-1 lg:order-2">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">{p.valuesTag}</span>
              <h2 className="font-display mt-4 text-2xl font-bold text-navy-900 sm:text-3xl">{p.valuesTitle}</h2>
              <div className="mt-7 space-y-6">
                {p.values.map((v) => (
                  <div key={v.title}>
                    <h3 className="font-display text-base font-semibold text-navy-900">{v.title}</h3>
                    <p className="mt-1.5 text-sm text-navy-500">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">{p.openRolesTag}</span>
          <h2 className="font-display mt-4 text-2xl font-bold text-navy-900 sm:text-3xl">{p.openRolesTitle}</h2>

          <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {p.roles.map((role) => (
              <div key={role.title} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-navy-900">{role.title}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {role.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {role.type}</span>
                  </div>
                </div>
                <a
                  href={`mailto:hello@titannetwork.io?subject=${encodeURIComponent(role.title)}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
                >
                  {p.apply}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No role fit CTA */}
      <section className="border-t border-slate-200 bg-navy-950 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl">
            <img src={codeMacbook} alt="" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{p.noRoleTitle}</h2>
            <p className="mt-4 text-ink-400">{p.noRoleSub}</p>
            <a
              href={`${lp('/')}#contact`}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              {p.noRoleCta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
