import clsx from 'clsx';
import { Bell, Building2, ChevronLeft, ChevronRight, FileClock, FileText, Flag, Gauge, Globe, LifeBuoy, LogOut, Search, ShieldCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar } from './ui';
import { useSuperAdminAuth } from './auth';

const NAVIGATION = [
  { label: 'Overview', path: '/admin', icon: Gauge, end: true },
  { label: 'Organizations', path: '/admin/organizations', icon: Building2 },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Support', path: '/admin/support', icon: LifeBuoy },
  { label: 'Feature Flags', path: '/admin/feature-flags', icon: Flag },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileClock },
  { label: 'Website', path: '/admin/website', icon: Globe },
  { label: 'Blog', path: '/admin/blog', icon: FileText },
];

function defaultRange() {
  const to = new Date();
  const from = new Date(to.getTime() - 29 * 86_400_000);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useSuperAdminAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const range = defaultRange();
  const from = searchParams.get('from') ?? range.from;
  const to = searchParams.get('to') ?? range.to;

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  function setDate(key: 'from' | 'to', value: string) {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next, { replace: true });
  }

  function runGlobalSearch() {
    if (!globalSearch.trim()) return;
    navigate(`/admin/users?search=${encodeURIComponent(globalSearch.trim())}&from=${from}&to=${to}`);
  }

  return (
    <div className="admin-scope min-h-screen bg-canvas text-ink">
      <aside className={clsx('fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-line bg-surface text-ink transition-[width] duration-200 md:flex', collapsed ? 'w-[78px]' : 'w-[248px]')}>
        <div className="flex h-[72px] items-center gap-3 border-b border-line px-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-brand-50"><ShieldCheck size={20} className="text-link" /></span>
          {!collapsed && <div className="min-w-0"><p className="truncate text-[16px] font-semibold">Titan Network</p><p className="truncate text-2xs text-ink-soft">Super Admin</p></div>}
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 py-3" aria-label="Super Admin navigation">
          {NAVIGATION.map(({ label, path, icon: Icon, end }) => (
            <NavLink key={path} to={path} end={end} title={collapsed ? label : undefined} className={({ isActive }) => clsx('mb-1 flex h-10 items-center gap-3 rounded-control px-3 text-[13px] font-medium transition-colors', isActive ? 'bg-brand-50 text-link' : 'text-ink-soft hover:bg-line-soft hover:text-ink')}>
              <Icon size={17} className="shrink-0" />{!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => setCollapsed((value) => !value)} className="focus-ring m-3 flex h-9 items-center justify-center gap-2 rounded-control border border-line text-2xs font-semibold text-ink-soft hover:bg-line-soft hover:text-ink" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> Collapse</>}
        </button>
      </aside>

      <div className={clsx('transition-[margin] duration-200', collapsed ? 'md:ml-[78px]' : 'md:ml-[248px]')}>
        <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
          <div className="flex min-h-[72px] flex-wrap items-center gap-3 px-4 py-3 lg:px-6">
            <div className="flex items-center gap-2 md:hidden"><ShieldCheck className="text-link" size={20} /><span className="font-semibold">Super Admin</span></div>
            <form onSubmit={(event) => { event.preventDefault(); runGlobalSearch(); }} className="relative order-last w-full md:order-none md:w-[min(420px,34vw)]">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
              <input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} className="input h-10 pl-9" placeholder="Search users or organizations…" aria-label="Global organization and user search" />
            </form>
            <div className="ml-auto flex items-center gap-2">
              <label className="hidden items-center gap-1.5 text-2xs text-ink-soft xl:flex">From<input type="date" className="h-9 rounded-control border border-line bg-surface px-2 text-2xs" value={from} onChange={(event) => setDate('from', event.target.value)} /></label>
              <label className="hidden items-center gap-1.5 text-2xs text-ink-soft xl:flex">To<input type="date" className="h-9 rounded-control border border-line bg-surface px-2 text-2xs" value={to} onChange={(event) => setDate('to', event.target.value)} /></label>
              <div className="relative">
                <button onClick={() => setNotificationsOpen((value) => !value)} className="focus-ring relative grid h-9 w-9 place-items-center rounded-control border border-line bg-surface text-ink-soft hover:text-ink" aria-label="Notifications"><Bell size={16} /></button>
                {notificationsOpen && <div className="absolute right-0 mt-2 w-80 rounded-card border border-line bg-surface p-3 shadow-pop"><p className="text-body-sm font-semibold text-ink">Platform notifications</p><p className="mt-2 text-2xs text-ink-soft">Nothing new.</p></div>}
              </div>
              <div className="relative">
                <button onClick={() => setProfileOpen((value) => !value)} className="focus-ring flex items-center gap-2 rounded-control border border-line bg-surface p-1.5 pr-3 text-left"><Avatar name={user?.name ?? 'Super Admin'} size={28} /><span className="hidden max-w-32 truncate text-2xs font-semibold text-ink lg:block">{user?.name}</span></button>
                {profileOpen && <div className="absolute right-0 mt-2 w-64 rounded-card border border-line bg-surface p-3 shadow-pop"><p className="truncate text-body-sm font-semibold text-ink">{user?.name}</p><p className="truncate text-2xs text-ink-muted">{user?.email}</p><button onClick={() => { logout(); navigate('/admin/login'); }} className="focus-ring mt-3 flex w-full items-center gap-2 rounded-control border-t border-line-soft px-2 py-2 text-body-sm font-medium text-bad hover:bg-bad-bg"><LogOut size={15} /> Sign out</button></div>}
              </div>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-2 md:hidden" aria-label="Mobile Super Admin navigation">{NAVIGATION.map(({ label, path, end }) => <NavLink key={path} to={path} end={end} className={({ isActive }) => clsx('whitespace-nowrap rounded-control px-3 py-2 text-2xs font-semibold', isActive ? 'bg-brand-600 text-white' : 'bg-surface text-ink-soft')}>{label}</NavLink>)}</nav>
        </header>

        <main key={pathname} className="mx-auto max-w-[1680px] p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
