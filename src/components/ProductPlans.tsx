import { Check } from 'lucide-react';
import { useLang, useLocalizedPath, useT } from '../i18n/useLang';
import { accountUrl } from '../lib/account-links';
import { formatPrice, loc, useSiteContent } from '../lib/site-content';
import { primaryButton, secondaryButton } from './Section';

/** What each product module is called on the site. Keys match server/src/billing/plans.ts. */
const MODULE_LABELS: Record<string, { en: string; de: string }> = {
  reports: { en: 'Reports', de: 'Berichte' },
  it: { en: 'IT devices & agents', de: 'IT-Geräte & Agents' },
  assets: { en: 'Inventory', de: 'Inventar' },
  projects: { en: 'Projects', de: 'Projekte' },
  network: { en: 'Network devices & diagnostics', de: 'Netzwerkgeräte & Diagnose' },
  leads: { en: 'Leads & CRM', de: 'Leads & CRM' },
  operations: { en: 'Operations & automation', de: 'Operations & Automatisierung' },
};

/**
 * The three TitanDesk plans. Name, price and feature copy come from the
 * Super Admin editor; the "Can handle" list comes from the product's billing
 * rules, so it always matches what the plan really unlocks.
 */
export default function ProductPlans() {
  const t = useT();
  const lang = useLang();
  const lp = useLocalizedPath();
  const { plans } = useSiteContent();
  const p = t.titandeskPage;

  return (
    <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-3 lg:divide-x lg:divide-slate-200">
      {plans.map((plan) => {
        const custom = plan.price === null;
        return (
          <div key={plan.key} className={`relative flex flex-col border-b border-slate-200 p-8 last:border-b-0 lg:border-b-0 ${plan.featured ? 'bg-indigo-500/[0.03]' : ''}`}>
            {plan.featured && <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-indigo-500" />}
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl font-bold text-navy-900">{plan.name}</h3>
              {plan.featured && <span className="text-xs font-semibold text-indigo-500">{t.pricing.mostPopular}</span>}
            </div>
            <p className="mt-2 text-sm text-navy-500">{loc(plan.description, lang)}</p>
            {custom && <p className="mt-1 text-xs font-medium text-navy-400">{t.pricing.enterpriseFor}</p>}
            <p className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-navy-900">{formatPrice(plan, lang)}</span>
              {!custom && <span className="text-sm text-navy-400">{t.pricing.perUser}</span>}
            </p>

            <ul className="mt-6 space-y-3 border-t border-slate-200 pt-6">
              {plan.features.map((feature) => (
                <li key={feature.en} className="flex gap-3 text-sm text-navy-600">
                  <Check size={17} aria-hidden className="mt-0.5 shrink-0 text-teal-500" />{loc(feature, lang)}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex-1 rounded-xl bg-slate-50 p-4">
              {custom ? (
                // Same modules as Business, so list what the agreement adds instead of repeating them.
                <>
                  <p className="text-xs font-semibold text-navy-900">{t.pricing.enterpriseCanHandle}</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-navy-600">
                    {t.pricing.enterpriseExtras.map((extra) => <li key={extra}>{extra}</li>)}
                  </ul>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-navy-900">{t.pricing.canHandle}</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-navy-600">
                    <li>{t.pricing.core}</li>
                    <li>{plan.gatewayLimit === null ? t.pricing.unlimitedGateways : t.pricing.gateways.replace('{n}', String(plan.gatewayLimit))}</li>
                    {plan.modules.map((module) => MODULE_LABELS[module] && <li key={module}>{loc(MODULE_LABELS[module], lang)}</li>)}
                  </ul>
                </>
              )}
            </div>

            <a href={custom ? lp('/titandesk/enterprise') : accountUrl('signup')} className={`mt-8 ${plan.featured ? primaryButton : secondaryButton}`}>
              {custom ? p.contactSales : p.pricingCta}
            </a>
          </div>
        );
      })}
    </div>
  );
}
