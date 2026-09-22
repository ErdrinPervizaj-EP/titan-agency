import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoMark from '../assets/logo-mark.svg';
import ProductIcon from './ProductIcon';
import LanguageSwitcher from './LanguageSwitcher';
import { useT, useLocalizedPath } from '../i18n/useLang';

export default function Navbar() {
  const t = useT();
  const lp = useLocalizedPath();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const LINKS = [
    { href: `${lp('/')}#services`, label: t.nav.services },
    { href: `${lp('/')}#case-studies`, label: t.nav.caseStudies },
    { href: `${lp('/')}#pricing`, label: t.nav.pricing },
    { href: `${lp('/')}#faq`, label: t.nav.faq },
    { href: `${lp('/')}#contact`, label: t.nav.contact },
  ];

  const PRODUCTS = [
    { key: 'titandesk' as const, name: 'TitanDesk', tagline: t.services.items[4].desc, status: t.nav.productStatusLive, to: lp('/titandesk') },
    { key: 'titanshield' as const, name: 'TitanShield', tagline: t.productSuite.upcoming[0].tagline, status: t.nav.productStatusSoon, to: `${lp('/')}#products` },
    { key: 'titancloud' as const, name: 'TitanCloud', tagline: t.productSuite.upcoming[1].tagline, status: t.nav.productStatusSoon, to: `${lp('/')}#products` },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? 'bg-white/90 backdrop-blur-lg border-b border-slate-200' : 'bg-white/0'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to={lp('/')} className="flex items-center gap-2.5">
          <img src={logoMark} alt="Titan Network" className="h-8 w-8" />
          <span className="font-display text-lg font-bold text-navy-900">Titan Network</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <a
              href={`${lp('/')}#products`}
              className="flex items-center gap-1.5 text-sm font-medium text-navy-500 transition-colors hover:text-navy-900"
            >
              {t.nav.products}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {productsOpen && (
              <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-navy-900/10">
                  {PRODUCTS.map((p) => (
                    <Link
                      key={p.name}
                      to={p.to}
                      className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50"
                    >
                      <ProductIcon product={p.key} size={32} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-navy-900">{p.name}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              p.status === t.nav.productStatusLive ? 'bg-teal-500/10 text-teal-600' : 'bg-slate-100 text-navy-400'
                            }`}
                          >
                            {p.status}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-navy-500">{p.tagline}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-navy-500 transition-colors hover:text-navy-900"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <Link to={lp('/login')} className="text-sm font-medium text-navy-500 transition-colors hover:text-navy-900">
            {t.nav.login}
          </Link>
          <a
            href={`${lp('/')}#contact`}
            className="rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-600"
          >
            {t.nav.cta}
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 p-2 lg:hidden"
          aria-label="Toggle menu"
        >
          <span className="h-0.5 w-6 bg-navy-900" />
          <span className="h-0.5 w-6 bg-navy-900" />
          <span className="h-0.5 w-6 bg-navy-900" />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-5">
            <LanguageSwitcher className="w-fit" />
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-navy-400">{t.nav.products}</p>
              <div className="space-y-3">
                {PRODUCTS.map((p) => (
                  <Link key={p.name} to={p.to} onClick={() => setOpen(false)} className="flex items-center gap-3">
                    <ProductIcon product={p.key} size={32} />
                    <span>
                      <span className="block text-sm font-medium text-navy-700">{p.name}</span>
                      <span className="block text-xs text-navy-400">{p.status}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-navy-700"
              >
                {l.label}
              </a>
            ))}
            <Link to={lp('/login')} onClick={() => setOpen(false)} className="text-base font-medium text-navy-700">
              {t.nav.login}
            </Link>
            <a
              href={`${lp('/')}#contact`}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-indigo-500 px-5 py-3 text-center text-sm font-semibold text-white"
            >
              {t.nav.cta}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
