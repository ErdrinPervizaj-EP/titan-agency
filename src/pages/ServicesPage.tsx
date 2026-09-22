import { Link } from 'react-router-dom';
import { useT, useLocalizedPath } from '../i18n/useLang';
import { SERVICE_ICONS, SERVICE_COLORS } from '../lib/icons';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';

export default function ServicesPage() {
  const t = useT();
  const lp = useLocalizedPath();
  const p = t.servicesPage;

  return (
    <>
      <Seo
        path="/services"
        titleEn="IT Services — Managed IT, Networking, Security, Cloud | Titan Network"
        titleDe="IT-Leistungen — Managed IT, Netzwerk, Sicherheit, Cloud | Titan Network"
        descriptionEn="Managed IT support, network infrastructure, cybersecurity, cloud, custom software, and IT consulting — one contract, one team, for Kosovo, Albania, and remote clients worldwide."
        descriptionDe="Managed IT Support, Netzwerkinfrastruktur, Cybersicherheit, Cloud, individuelle Software und IT-Beratung — ein Vertrag, ein Team, für Kosovo, Albanien und remote weltweit."
      />

      <section className="border-b border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{p.eyebrow}</span>
          <h1 className="font-display mt-4 text-4xl font-bold text-navy-900 sm:text-5xl">{p.title}</h1>
          <p className="mt-5 text-lg text-navy-500">{p.sub}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.items.map((service, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
              return (
                <Reveal key={service.slug} delay={i * 60}>
                  <Link
                    to={`${lp('/services')}/${service.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${SERVICE_COLORS[i % SERVICE_COLORS.length]}`}>
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <h2 className="font-display mt-5 text-lg font-semibold text-navy-900">{service.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-500">{service.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-500">
                      {p.includedLabel} →
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
