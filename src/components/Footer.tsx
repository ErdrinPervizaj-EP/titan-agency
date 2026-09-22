import { Link } from 'react-router-dom';
import logoMark from '../assets/logo-mark.svg';
import { useT, useLocalizedPath } from '../i18n/useLang';

export default function Footer() {
  const t = useT();
  const lp = useLocalizedPath();

  const serviceSlugs = t.services.items.slice(0, 4).map((s) => s.slug);
  const productLinks: (string | null)[] = [lp('/titandesk'), `${lp('/')}#products`, `${lp('/')}#products`, `${lp('/')}#pricing`];

  const companyLinks: (string | null)[] = [null, lp('/careers'), null, `${lp('/')}#contact`];

  const COLS = [
    { heading: t.footer.servicesHeading, links: t.footer.services, hrefs: serviceSlugs.map((s) => `${lp('/services')}/${s}`) },
    { heading: t.footer.productsHeading, links: t.footer.products, hrefs: productLinks },
    { heading: t.footer.companyHeading, links: t.footer.company, hrefs: companyLinks },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link to={lp('/')} className="flex items-center gap-2.5">
              <img src={logoMark} alt="Titan Network" className="h-8 w-8" />
              <span className="font-display text-lg font-bold text-navy-900">Titan Network</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-navy-400">{t.footer.tagline}</p>
            <p className="mt-3 max-w-xs text-xs text-navy-400">{t.footer.location}</p>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-navy-400">{col.heading}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l, i) => (
                  <li key={l}>
                    <a href={col.hrefs ? col.hrefs[i] ?? '#' : '#'} className="text-sm text-navy-500 transition hover:text-navy-900">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-navy-400">© {new Date().getFullYear()} Titan Network. {t.footer.rights}</p>
          <div className="flex gap-6 text-sm text-navy-400">
            <a href="#" className="hover:text-navy-900">{t.footer.privacy}</a>
            <a href="#" className="hover:text-navy-900">{t.footer.terms}</a>
            <a href="#" className="hover:text-navy-900">{t.footer.security}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
