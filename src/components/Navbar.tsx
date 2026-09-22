import { useEffect, useState } from 'react';
import logoMark from '../assets/logo-mark.svg';

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

const PRODUCTS = [
  { name: 'TitanDesk', tagline: 'Service desk, CRM & network ops', status: 'Live', color: 'bg-indigo-500' },
  { name: 'TitanShield', tagline: 'Continuous security monitoring', status: 'Coming soon', color: 'bg-gold-500' },
  { name: 'TitanCloud', tagline: 'Cloud cost & infrastructure control', status: 'Coming soon', color: 'bg-teal-500' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? 'bg-white/90 backdrop-blur-lg border-b border-slate-200' : 'bg-white/0'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={logoMark} alt="Titan Network" className="h-8 w-8" />
          <span className="font-display text-lg font-bold text-navy-900">Titan Network</span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <a
              href="#products"
              className="flex items-center gap-1.5 text-sm font-medium text-navy-500 transition-colors hover:text-navy-900"
            >
              Products
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {productsOpen && (
              <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-navy-900/10">
                  {PRODUCTS.map((p) => (
                    <a
                      key={p.name}
                      href="#products"
                      className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50"
                    >
                      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${p.color}`}>
                        {p.name[5]}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-navy-900">{p.name}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              p.status === 'Live' ? 'bg-teal-500/10 text-teal-600' : 'bg-slate-100 text-navy-400'
                            }`}
                          >
                            {p.status}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-navy-500">{p.tagline}</span>
                      </span>
                    </a>
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

        <div className="hidden lg:block">
          <a
            href="#contact"
            className="rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-600"
          >
            Get a Free Assessment
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
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-navy-400">Products</p>
              <div className="space-y-3">
                {PRODUCTS.map((p) => (
                  <a
                    key={p.name}
                    href="#products"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${p.color}`}>
                      {p.name[5]}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-navy-700">{p.name}</span>
                      <span className="block text-xs text-navy-400">{p.status}</span>
                    </span>
                  </a>
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
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-indigo-500 px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Get a Free Assessment
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
