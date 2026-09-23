import { useEffect, useState } from 'react';
import { titanDeskAuth, type AuthUser } from './titandesk-client';

/** Current TitanDesk session, if any — checked once on mount. Used by the
 *  marketing site's Navbar so it can tell a signed-in visitor apart from
 *  one who still needs to log in, instead of always showing "Log in". */
export function useSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    titanDeskAuth.me().then((current) => {
      if (!cancelled) { setUser(current); setLoading(false); }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { user, loading };
}
