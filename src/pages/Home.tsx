import Hero from '../components/Hero';
import LogoMarquee from '../components/LogoMarquee';
import TrustBar from '../components/TrustBar';
import Features from '../components/Features';
import Technologies from '../components/Technologies';
import ProductShowcase from '../components/ProductShowcase';
import CaseStudies from '../components/CaseStudies';
import Enterprise from '../components/Enterprise';
import Testimonials from '../components/Testimonials';
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
      <LogoMarquee />
      <TrustBar />
      <Features />
      <Technologies />
      <ProductShowcase />
      <CaseStudies />
      <Enterprise />
      <Testimonials />
      <Pricing />
      <Faq />
      <Contact />
    </>
  );
}
