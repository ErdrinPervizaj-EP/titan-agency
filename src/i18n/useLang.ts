import { useLocation } from 'react-router-dom';
import { translations, type Lang } from './translations';

export function useLang(): Lang {
  const { pathname } = useLocation();
  return pathname === '/de' || pathname.startsWith('/de/') ? 'de' : 'en';
}

export function useT() {
  const lang = useLang();
  return translations[lang];
}

/** Prefix a path with /de when in German, leaving English paths bare. */
export function useLocalizedPath() {
  const lang = useLang();
  return (path: string) => {
    if (lang === 'en') return path;
    if (path === '/') return '/de';
    return `/de${path}`;
  };
}
