import { Check } from 'lucide-react';
import { useT, useLocalizedPath } from '../i18n/useLang';
import { SERVICE_ICONS, SERVICE_COLORS } from '../lib/icons';
import Seo from '../components/Seo';
import Reveal from './../components/Reveal';

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
        <div className="mx-auto max-w-5xl space-y-16 px-6">
          {t.services.items.map((service, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
              <Reveal key={service.slug} delay={i * 40}>
                <div
                  id={service.slug}
                  className="grid gap-8 border-b border-slate-200 pb-16 last:border-0 lg:grid-cols-[1fr_1.2fr]"
                >
                  <div>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${SERVICE_COLORS[i % SERVICE_COLORS.length]}`}>
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <h2 className="font-display mt-4 text-2xl font-bold text-navy-900">{service.title}</h2>
                    <p className="mt-3 text-navy-500">{service.overview}</p>
                    <a
                      href={`${lp('/')}#contact`}
                      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
                    >
                      {p.cta}
                    </a>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-7">
                    <p className="text-xs font-bold uppercase tracking-widest text-navy-400">{p.includedLabel}</p>
                    <ul className="mt-4 space-y-3">
                      {service.included.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-navy-700">
                          <Check size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-teal-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
