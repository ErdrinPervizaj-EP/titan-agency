import { useT } from '../i18n/useLang';
import Section from './Section';
import ServiceGrid from './ServiceGrid';
import { Code2, Compass, Headset, ShieldCheck, Wrench, Cloud } from 'lucide-react';

export default function Features() {
  const t = useT();
  return (
    <Section id="services" label={t.services.tag} title={t.services.title} intro={t.services.sub} fullWidth decor={{ icons: [Headset, Wrench, ShieldCheck, Cloud, Code2, Compass], accent: '#4165b7' }}>
      <ServiceGrid />
    </Section>
  );
}
