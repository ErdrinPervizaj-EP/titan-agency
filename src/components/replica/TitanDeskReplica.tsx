import { useEffect, useRef, useState } from 'react';
import {
  Activity, BarChart3, Bell, BookOpen, Boxes, Building2, CalendarDays, ChevronDown, FolderKanban, Handshake, Home,
  MonitorSmartphone, Moon, Network, PanelLeftClose, PanelLeftOpen, Router, Search, Settings, Target, Ticket, Users,
  type LucideIcon,
} from 'lucide-react';
import { Avatar, TitanLogo } from './ui';
import { CustomersView, HomeView, NetworkView, ProjectsView, ReportsView, TicketsView, type Queue } from './views';

/**
 * A working miniature of TitanDesk for the marketing site, built from the
 * product's own layout code (web/src/layout/Sidebar.tsx, Topbar.tsx,
 * AppLayout.tsx, config/workspaces.ts). Drawn at the app's real desktop size
 * and scaled to fit, so proportions match the product exactly. Sample data only.
 */
export type ReplicaPage = 'home' | 'tickets' | 'customers' | 'projects' | 'network' | 'reports';
type Page = ReplicaPage;
interface Item { label: string; icon: LucideIcon; page: Page }
interface Area { id: string; label: string; icon: LucideIcon; items: Item[] }

// Same areas, labels and icons as the product's WORKSPACE_AREAS; each item opens the closest sample page.
const AREAS: Area[] = [
  { id: 'home', label: 'Home', icon: Home, items: [{ label: 'Home', icon: Home, page: 'home' }] },
  { id: 'support', label: 'Support', icon: Ticket, items: [{ label: 'Tickets', icon: Ticket, page: 'tickets' }, { label: 'Knowledge base', icon: BookOpen, page: 'tickets' }] },
  { id: 'clients', label: 'Clients & sales', icon: Building2, items: [{ label: 'Customers', icon: Building2, page: 'customers' }, { label: 'Leads', icon: Target, page: 'customers' }, { label: 'Deals', icon: Handshake, page: 'customers' }] },
  { id: 'delivery', label: 'Delivery', icon: FolderKanban, items: [{ label: 'Operations', icon: Activity, page: 'projects' }, { label: 'Projects', icon: FolderKanban, page: 'projects' }, { label: 'Calendar', icon: CalendarDays, page: 'projects' }] },
  { id: 'devices', label: 'Devices', icon: MonitorSmartphone, items: [{ label: 'Computers & agents', icon: MonitorSmartphone, page: 'network' }, { label: 'Network', icon: Network, page: 'network' }, { label: 'Inventory', icon: Boxes, page: 'network' }] },
  { id: 'people', label: 'People', icon: Users, items: [{ label: 'People', icon: Users, page: 'customers' }] },
  { id: 'reports', label: 'Reports', icon: BarChart3, items: [{ label: 'Reports', icon: BarChart3, page: 'reports' }] },
];

const TITLES: Record<Page, string> = { home: 'Dashboard', tickets: 'Support', customers: 'Clients & sales', projects: 'Delivery', network: 'Devices', reports: 'Reports' };
const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 700;

/** Pass `page` to drive it from outside (e.g. tour tabs); clicks inside report back through `onPageChange`. */
export default function TitanDeskReplica({ page: controlledPage, onPageChange }: { page?: Page; onPageChange?: (page: Page) => void } = {}) {
  const [ownPage, setOwnPage] = useState<Page>(controlledPage ?? 'home');
  const page = controlledPage ?? ownPage;
  const setPage = (next: Page) => { setOwnPage(next); onPageChange?.(next); };
  const [activeItem, setActiveItem] = useState('Home');
  const [expanded, setExpanded] = useState<string | null>('home');
  const [compact, setCompact] = useState(false);
  const [queue, setQueue] = useState<Queue>('open');
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / DESIGN_WIDTH)));
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const open = (item: Item, areaId: string) => { setPage(item.page); setActiveItem(item.label); setExpanded(areaId); };
  const go = (next: string, nextQueue?: Queue) => {
    const target = next as Page;
    const area = AREAS.find((a) => a.items.some((i) => i.page === target))!;
    open(area.items.find((i) => i.page === target)!, area.id);
    if (nextQueue) setQueue(nextQueue);
  };
  const activeArea = AREAS.find((a) => a.items.some((i) => i.label === activeItem))?.id;

  // Keep the sidebar in step when the page is changed from outside.
  useEffect(() => {
    if (!controlledPage) return;
    const area = AREAS.find((a) => a.items.some((i) => i.page === controlledPage));
    if (!area || area.items.some((i) => i.label === activeItem && i.page === controlledPage)) return;
    setActiveItem(area.items.find((i) => i.page === controlledPage)!.label);
    setExpanded(area.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledPage]);

  return (
    <div ref={frameRef} className="w-full" style={{ height: DESIGN_HEIGHT * scale }}>
      <div
        className="td-app flex origin-top-left overflow-hidden bg-canvas text-left"
        style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})` }}
        role="region"
        aria-label="Interactive preview of TitanDesk with sample data"
      >
        {/* Sidebar — web/src/layout/Sidebar.tsx */}
        <aside className={`flex shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 ${compact ? 'w-[76px]' : 'w-[264px]'}`}>
          <div className={`flex h-16 shrink-0 items-center ${compact ? 'justify-center' : 'gap-2.5 px-5'}`}>
            <TitanLogo size={30} />
            {!compact && <span className="flex-1 whitespace-nowrap text-[16px] font-semibold tracking-tight text-ink">Titan Network</span>}
          </div>
          <div className={`mx-3 mb-3 border-y border-line-soft py-3 ${compact ? 'flex justify-center' : 'px-1'}`}>
            <span className={`flex min-w-0 items-center rounded-control ${compact ? '' : 'gap-3 p-1'}`}>
              <Avatar name="Jane Reporter" size={34} />
              {!compact && <span className="min-w-0"><span className="block truncate text-sm font-semibold text-ink">Jane Reporter</span><span className="mt-0.5 block text-xs text-ink-soft">Workspace Owner</span></span>}
            </span>
          </div>
          <nav className="min-h-0 flex-1 overflow-hidden px-3 pb-3">
            {!compact && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">Workspace</p>}
            <ul className="space-y-1">
              {AREAS.map((area) => {
                const active = activeArea === area.id;
                const hasChildren = area.items.length > 1;
                const opened = expanded === area.id && !compact && hasChildren;
                return (
                  <li key={area.id}>
                    <button
                      type="button"
                      title={compact ? area.label : undefined}
                      onClick={() => {
                        if (compact) setCompact(false);
                        if (hasChildren) setExpanded(opened ? null : area.id);
                        else open(area.items[0], area.id);
                      }}
                      className={`relative flex min-h-11 w-full items-center rounded-control text-sm transition-colors ${compact ? 'justify-center px-2' : 'gap-3 px-3'} ${active ? 'bg-brand-50 font-semibold text-link' : 'font-medium text-ink-soft hover:bg-line-soft hover:text-ink'}`}
                    >
                      <area.icon size={19} strokeWidth={active ? 2 : 1.7} className="shrink-0" />
                      {!compact && <span className="min-w-0 flex-1 text-left">{hasChildren ? area.label : area.items[0].label}</span>}
                      {!compact && hasChildren && <ChevronDown size={14} className={`shrink-0 transition-transform ${opened ? 'rotate-180' : ''}`} />}
                    </button>
                    {opened && (
                      <ul className="mb-2 ml-[21px] mt-1 space-y-0.5 border-l border-line pl-3">
                        {area.items.map((item) => (
                          <li key={item.label}>
                            <button
                              type="button"
                              onClick={() => open(item, area.id)}
                              className={`flex min-h-10 w-full items-center gap-2.5 rounded-control px-3 py-2 text-[13px] transition-colors ${activeItem === item.label ? 'bg-line-soft font-semibold text-ink' : 'text-ink-soft hover:bg-line-soft hover:text-ink'}`}
                            >
                              <item.icon size={15} strokeWidth={1.7} className="shrink-0" /><span>{item.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="shrink-0 border-t border-line-soft px-3 pb-3 pt-2">
            <span className={`flex min-h-11 items-center rounded-control text-sm font-medium text-ink-soft ${compact ? 'justify-center' : 'gap-3 px-3'}`}>
              <Settings size={19} strokeWidth={1.7} />{!compact && 'Settings'}
            </span>
            <button type="button" onClick={() => setCompact((v) => !v)} className={`mt-2 flex min-h-10 w-full items-center rounded-control text-xs text-ink-muted hover:bg-line-soft hover:text-ink ${compact ? 'justify-center' : 'gap-3 px-3'}`}>
              {compact ? <PanelLeftOpen size={18} /> : <><PanelLeftClose size={18} /><span>Collapse sidebar</span></>}
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar — web/src/layout/Topbar.tsx */}
          <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-surface px-7">
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="inline-block h-4 w-[3px] rounded-full bg-brand-600" />
              <h1 className="text-[22px] font-semibold tracking-tight text-ink">{TITLES[page]}</h1>
            </span>
            <span className="flex h-10 w-72 items-center gap-2 rounded-control border border-line bg-canvas px-3 text-[13px] text-ink-muted">
              <Search size={16} /> Search workspace…<kbd className="ml-auto rounded border border-line bg-surface px-1.5 font-mono text-[11px]">Ctrl K</kbd>
            </span>
            <span className="ml-auto flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-control border border-line text-ink-soft"><Moon size={18} /></span>
              <span className="flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok-bg px-3 py-1.5 text-[12px] font-semibold text-ok"><Router size={14} /> 3 gateways online</span>
              <span className="relative grid h-10 w-10 place-items-center rounded-control text-ink-soft"><Bell size={19} /><span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-bad ring-2 ring-surface" /></span>
              <span className="flex items-center gap-2.5 border-l border-line pl-4">
                <Avatar name="Jane Reporter" size={34} />
                <span><span className="block text-sm font-semibold text-ink">Jane Reporter</span><span className="block text-xs text-ink-soft">Workspace Owner</span></span>
                <ChevronDown size={16} className="text-ink-soft" />
              </span>
            </span>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <div key={page} className="td-view">
              {page === 'home' && <HomeView go={go} />}
              {page === 'tickets' && <TicketsView queue={queue} setQueue={setQueue} />}
              {page === 'customers' && <CustomersView />}
              {page === 'projects' && <ProjectsView />}
              {page === 'network' && <NetworkView />}
              {page === 'reports' && <ReportsView />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
