import { Helmet } from 'react-helmet-async';
import { useLang } from '../i18n/useLang';

export const SITE_URL = 'https://titannetwork.io';
export const SITE_NAME = 'Titan Network';

const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Titan Network',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description:
    'Titan Network is an IT solutions agency providing managed IT support, networking, cybersecurity, cloud, and custom software — serving Kosovo, Albania, and remote clients worldwide.',
  areaServed: [
    { '@type': 'Country', name: 'Kosovo' },
    { '@type': 'Country', name: 'Albania' },
    { '@type': 'AdministrativeArea', name: 'Worldwide (Remote)' },
  ],
  availableLanguage: [
    { '@type': 'Language', name: 'English', alternateName: 'en' },
    { '@type': 'Language', name: 'German', alternateName: 'de' },
    { '@type': 'Language', name: 'Albanian', alternateName: 'sq' },
  ],
  address: [
    {
      '@type': 'PostalAddress',
      addressLocality: 'Prishtina',
      addressCountry: 'XK',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'Tirana',
      addressCountry: 'AL',
    },
  ],
  sameAs: ['https://www.linkedin.com/', 'https://www.google.com/maps'],
};

interface SeoProps {
  titleEn: string;
  titleDe: string;
  descriptionEn: string;
  descriptionDe: string;
  /** Path without lang prefix, e.g. "/" or "/titandesk" */
  path: string;
  jsonLd?: Record<string, unknown>[];
}

export default function Seo({ titleEn, titleDe, descriptionEn, descriptionDe, path, jsonLd }: SeoProps) {
  const lang = useLang();
  const title = lang === 'de' ? titleDe : titleEn;
  const description = lang === 'de' ? descriptionDe : descriptionEn;

  const enUrl = `${SITE_URL}${path}`;
  const deUrl = path === '/' ? `${SITE_URL}/de` : `${SITE_URL}/de${path}`;
  const canonical = lang === 'de' ? deUrl : enUrl;

  const structuredData = [ORG_JSON_LD, ...(jsonLd ?? [])];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="de" href={deUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={lang === 'de' ? 'de_DE' : 'en_US'} />
      <meta property="og:image" content={`${SITE_URL}/og-image.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
