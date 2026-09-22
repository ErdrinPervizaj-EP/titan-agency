import logoMark from '../assets/logo-mark.svg';

const COLS = [
  {
    heading: 'Services',
    links: ['Managed IT', 'Networking', 'Cybersecurity', 'Cloud Solutions'],
  },
  {
    heading: 'Products',
    links: ['TitanDesk', 'Client Portals', 'Automation Tooling', 'Pricing'],
  },
  {
    heading: 'Company',
    links: ['About', 'Careers', 'Blog', 'Contact'],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <img src={logoMark} alt="Titan Network" className="h-8 w-8" />
              <span className="font-display text-lg font-bold text-navy-900">Titan Network</span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-navy-400">
              A full-service IT solutions agency — managed support, networking, security, and
              custom software, including our own TitanDesk platform.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-navy-400">{col.heading}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-navy-500 transition hover:text-navy-900">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-navy-400">© {new Date().getFullYear()} Titan Network. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-navy-400">
            <a href="#" className="hover:text-navy-900">Privacy</a>
            <a href="#" className="hover:text-navy-900">Terms</a>
            <a href="#" className="hover:text-navy-900">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
