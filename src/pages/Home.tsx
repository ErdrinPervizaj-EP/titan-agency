import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import Features from '../components/Features';
import ProductShowcase from '../components/ProductShowcase';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Faq from '../components/Faq';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Features />
      <ProductShowcase />
      <Testimonials />
      <Pricing />
      <Faq />
      <Contact />
    </>
  );
}
