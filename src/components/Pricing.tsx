import { Link } from 'react-router-dom';
import { BadgeCheck, CreditCard, PiggyBank, Receipt, Scale, Wallet } from 'lucide-react';
import { useT, useLocalizedPath } from '../i18n/useLang';
import Section from './Section';
import ProductPlans from './ProductPlans';

export default function Pricing() {
  const t = useT();
  const lp = useLocalizedPath();

  return (
    <Section id="pricing" label={t.pricing.tag} title={t.pricing.title} intro={t.pricing.sub} tinted fullWidth decor={{ icons: [CreditCard, BadgeCheck, Receipt, Scale, PiggyBank, Wallet], accent: '#c98a06' }}>
      <ProductPlans />
      <p className="mt-6 text-sm">
        <Link to={`${lp('/titandesk')}#pricing`} className="font-semibold text-indigo-500 underline decoration-indigo-200 underline-offset-4 hover:decoration-indigo-500">{t.pricing.compare}</Link>
      </p>
    </Section>
  );
}
