import { Link } from 'react-router-dom';
import logoMark from '../assets/logo-mark.svg';
import { useLang, useT, useLocalizedPath } from '../i18n/useLang';
import { loc, useSiteContent } from '../lib/site-content';
import SocialIcon from './SocialIcons';

export default function Footer() {
  const t = useT();
  const f = t.footer;
  const lang = useLang();
  const lp = useLocalizedPath();
  const { company } = useSiteContent();

  const columns: { heading: string; links: { label: string; to: string }[] }[] = [
    { heading: f.servicesHeading, links: t.services.items.slice(0, 4).map((s, i) => ({ label: f.services[i] ?? s.title, to: `${lp('/services')}/${s.slug}` })) },
    { heading: f.productsHeading, links: [{ label: 'TitanDesk', to: lp('/titandesk') }, { label: t.nav.pricing, to: `${lp('/')}#pricing` }] },
    { heading: f.companyHeading, links: [{ label: t.nav.careers, to: lp('/careers') }, { label: f.blog, to: lp('/blog') }, { label: t.nav.contact, to: `${lp('/')}#contact` }] },
    { heading: f.legalHeading, links: [{ label: f.privacy, to: lp('/privacy') }, { label: f.terms, to: lp('/terms') }, { label: f.serviceTerms, to: lp('/titandesk/terms') }, { label: f.refunds, to: lp('/refunds') }, { label: f.imprint, to: lp('/imprint') }, { label: f.security, to: lp('/security') }] },
  ];
  const socials = Object.entries(company.socials).filter(([, url]) => url);

  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link to={lp('/')} className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white"><img src={logoMark} alt="Titan Network" className="h-7 w-7" /></span>
              <span className="font-display text-lg font-bold text-white">Titan Network</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/60">{f.tagline}</p>
            <p className="mt-3 max-w-xs text-xs text-white/50">{loc(company.locations, lang)}</p>
            <a href={`mailto:${company.email}`} className="mt-3 block text-sm text-white/70 hover:text-white">{company.email}</a>
            {socials.length > 0 && (
              <ul className="mt-5 flex gap-3">
                {socials.map(([network, url]) => (
                  <li key={network}>
                    <a href={url} target="_blank" rel="noreferrer noopener" aria-label={network} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/70 hover:border-white/40 hover:text-white">
                      <SocialIcon network={network} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h4 className="text-sm font-semibold text-white">{column.heading}</h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to.includes('#')
                      ? <a href={link.to} className="text-sm text-white/60 transition hover:text-white">{link.label}</a>
                      : <Link to={link.to} className="text-sm text-white/60 transition hover:text-white">{link.label}</Link>}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-sm text-white/50">© {new Date().getFullYear()} {company.legal.name || 'Titan Network'}. {f.rights}</p>
        </div>
      </div>
    </footer>
  );
}
