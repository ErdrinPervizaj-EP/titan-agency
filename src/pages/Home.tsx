import Hero from '../components/Hero';
import Features from '../components/Features';
import Proof from '../components/Proof';
import ProductShowcase from '../components/ProductShowcase';
import Process from '../components/Process';
import Technologies from '../components/Technologies';
import Pricing from '../components/Pricing';
import Faq from '../components/Faq';
import Contact from '../components/Contact';
import Seo from '../components/Seo';
import { useLang } from '../i18n/useLang';

export default function Home() {
  const lang = useLang();

  return (
    <>
      <Seo
        path="/"
        titleEn="Titan Network — IT Solutions Agency in Kosovo, Albania & Remote Worldwide"
        titleDe="Titan Network — IT-Lösungsagentur im Kosovo, Albanien & remote weltweit"
        descriptionEn="Managed IT, networking, cybersecurity, cloud, and custom software for businesses in Kosovo, Albania, and remote clients worldwide. English & German speaking team."
        descriptionDe="Managed IT, Netzwerktechnik, Cybersicherheit, Cloud und individuelle Software für Unternehmen im Kosovo, in Albanien und remote weltweit. Englisch- und deutschsprachiges Team."
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            inLanguage: lang,
            name: 'Titan Network',
          },
        ]}
      />
      <Hero />
      <Features />
      <Proof />
      <ProductShowcase />
      <Process />
      <Technologies />
      <Pricing />
      <Faq />
      <Contact />
    </>
  );
}
