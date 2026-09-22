import { useLocation, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/useLang';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const lang = useLang();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  function switchTo(target: 'en' | 'de') {
    let rest = pathname;
    if (pathname === '/de') rest = '/';
    else if (pathname.startsWith('/de/')) rest = pathname.slice(3);

    const next = target === 'en' ? rest : rest === '/' ? '/de' : `/de${rest}`;
    navigate(`${next}${hash}`);
  }

  return (
    <div className={`flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold ${className}`}>
      <button
        onClick={() => switchTo('en')}
        className={`rounded-full px-2.5 py-1 transition ${lang === 'en' ? 'bg-navy-900 text-white' : 'text-navy-400 hover:text-navy-900'}`}
      >
        EN
      </button>
      <button
        onClick={() => switchTo('de')}
        className={`rounded-full px-2.5 py-1 transition ${lang === 'de' ? 'bg-navy-900 text-white' : 'text-navy-400 hover:text-navy-900'}`}
      >
        DE
      </button>
    </div>
  );
}
