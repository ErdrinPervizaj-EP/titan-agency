import { useEffect, useState } from 'react';
import { publicContent } from './titandesk-client';
import { translations, type Lang } from '../i18n/translations';

/**
 * Content edited in the Super Admin console (server: src/site-content). Text
 * is localized; German falls back to English when it has not been written.
 */
export interface Localized { en: string; de: string }
export type PlanKey = 'Team' | 'Business' | 'Enterprise';

export interface SitePlan {
  key: PlanKey;
  name: string;
  price: number | null;
  currency: 'USD' | 'EUR';
  description: Localized;
  features: Localized[];
  featured: boolean;
  /** From the product's billing rules: null = unlimited. */
  gatewayLimit: number | null;
  modules: string[];
}
export interface SiteJob { id: string; title: Localized; location: Localized; type: string; description: Localized }
export interface SiteClient { id: string; name: string; logoUrl: string; website: string }
export interface SiteTestimonial { id: string; quote: Localized; name: string; role: string; company: string }
export interface SiteCompany {
  email: string;
  phone: string;
  locations: Localized;
  socials: Record<'linkedin' | 'github' | 'x' | 'facebook' | 'instagram', string>;
  legal: { name: string; address: string; registration: string; vatId: string; representative: string };
}
export interface SiteContent {
  company: SiteCompany;
  plans: SitePlan[];
  jobs: SiteJob[];
  clients: SiteClient[];
  testimonials: SiteTestimonial[];
}

export const loc = (value: Localized | undefined, lang: Lang) => (value ? (lang === 'de' && value.de) || value.en : '');

export function formatPrice(plan: Pick<SitePlan, 'price' | 'currency'>, lang: Lang) {
  if (plan.price === null) return lang === 'de' ? 'Individuell' : 'Custom';
  return new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US', { style: 'currency', currency: plan.currency, maximumFractionDigits: plan.price % 1 ? 2 : 0 }).format(plan.price);
}

/**
 * Used until the server answers, and if it cannot be reached: the same
 * content the site shipped with, built from the translation files, so the
 * page never renders empty.
 */
function fallbackContent(): SiteContent {
  const { en, de } = translations;
  const both = (pick: (t: typeof en) => string) => ({ en: pick(en), de: pick(de as unknown as typeof en) });
  const PLAN_RULES: Record<PlanKey, { gatewayLimit: number | null; modules: string[] }> = {
    Team: { gatewayLimit: 3, modules: ['reports'] },
    Business: { gatewayLimit: null, modules: ['reports', 'it', 'assets', 'projects', 'network', 'leads', 'operations'] },
    Enterprise: { gatewayLimit: null, modules: ['reports', 'it', 'assets', 'projects', 'network', 'leads', 'operations'] },
  };
  const keys: PlanKey[] = ['Team', 'Business', 'Enterprise'];
  return {
    company: {
      email: 'hello@titannetwork.io',
      phone: '',
      locations: both((t) => t.footer.location),
      socials: { linkedin: '', github: '', x: '', facebook: '', instagram: '' },
      legal: { name: 'Titan Network', address: '', registration: '', vatId: '', representative: '' },
    },
    plans: en.titandeskPage.plans.map((plan, i) => {
      const numeric = Number(plan.price.replace(/[^0-9.]/g, ''));
      return {
        key: keys[i],
        name: plan.name,
        price: plan.price.match(/\d/) ? numeric : null,
        currency: 'USD' as const,
        description: { en: plan.desc, de: de.titandeskPage.plans[i]?.desc ?? '' },
        features: plan.features.map((feature, f) => ({ en: feature, de: de.titandeskPage.plans[i]?.features[f] ?? '' })),
        featured: Boolean(plan.featured),
        ...PLAN_RULES[keys[i]],
      };
    }),
    jobs: en.careersPage.roles.map((role, i) => ({
      id: String(i),
      title: { en: role.title, de: de.careersPage.roles[i]?.title ?? '' },
      location: { en: role.location, de: de.careersPage.roles[i]?.location ?? '' },
      type: role.type,
      description: { en: '', de: '' },
    })),
    clients: [],
    testimonials: [],
  };
}

let cache: SiteContent | null = null;
let pending: Promise<SiteContent> | null = null;

function load(): Promise<SiteContent> {
  pending ??= publicContent.siteContent<SiteContent>()
    .then((content) => (cache = content))
    .catch(() => (cache = fallbackContent()));
  return pending;
}

/** Site content, fetched once per visit and shared by every section. */
export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(() => cache ?? fallbackContent());
  useEffect(() => {
    let active = true;
    void load().then((loaded) => { if (active) setContent(loaded); });
    return () => { active = false; };
  }, []);
  return content;
}
