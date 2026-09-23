import { useT } from '../i18n/useLang';
import Seo from '../components/Seo';
import ServiceGrid from '../components/ServiceGrid';
import { PageHeader } from '../components/Section';

export default function ServicesPage() {
  const t = useT();
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
      <PageHeader label={p.eyebrow} title={p.title} intro={p.sub} />
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <ServiceGrid headingLevel="h2" />
      </section>
    </>
  );
}
