import { useEffect, useState } from 'react';
import { BarChart3, BookOpen, Building2, FolderKanban, Home, Network, Search, Ticket } from 'lucide-react';

/**
 * A drawn (not screenshotted) TitanDesk window: sidebar, live counters and a
 * ticket queue where new tickets arrive on their own. Everything here is a
 * real TitanDesk concept — queues, priorities, SLA clocks, gateways — shown
 * with generic sample data. Pauses for visitors who prefer reduced motion.
 */
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
interface SampleTicket { id: number; title: string; queue: string; priority: Priority; sla: number }

const INCOMING: Omit<SampleTicket, 'id'>[] = [
  { title: 'VPN drops at the branch office', queue: 'Network', priority: 'High', sla: 72 },
  { title: 'New starter needs a laptop', queue: 'Onboarding', priority: 'Medium', sla: 86 },
  { title: 'Printer offline on floor 2', queue: 'Support', priority: 'Low', sla: 94 },
  { title: 'Core switch port flapping', queue: 'Network', priority: 'Critical', sla: 38 },
  { title: 'Reset MFA for front desk', queue: 'Accounts', priority: 'Medium', sla: 64 },
  { title: 'Backup job failed overnight', queue: 'Infrastructure', priority: 'High', sla: 51 },
];

const PRIORITY_STYLE: Record<Priority, string> = {
  Critical: 'bg-[#fdecea] text-[#c0362c]',
  High: 'bg-[#fff1e6] text-[#c2581c]',
  Medium: 'bg-[#eef1fb] text-[#4165b7]',
  Low: 'bg-[#e8f5f2] text-[#2f7f73]',
};
const slaColor = (sla: number) => (sla < 45 ? '#d6453a' : sla < 70 ? '#e0892b' : '#2f9e8f');

function useIncomingTickets(size: number) {
  // Start as if the last `size` samples of the cycle already arrived (newest
  // first), so the next arrival is always one that is not on screen.
  const [tickets, setTickets] = useState<SampleTicket[]>(() =>
    Array.from({ length: size }, (_, i) => ({ ...INCOMING[INCOMING.length - 1 - i], id: size - i })),
  );
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let arrivals = 0;
    const timer = window.setInterval(() => {
      const sample = INCOMING[arrivals % INCOMING.length];
      arrivals += 1;
      setTickets((current) => [{ ...sample, id: size + arrivals }, ...current].slice(0, size));
    }, 3200);
    // SLA bars tick down between arrivals, like the real clock.
    const clock = window.setInterval(() => {
      setTickets((current) => current.map((t) => ({ ...t, sla: Math.max(8, t.sla - 1) })));
    }, 900);
    return () => { window.clearInterval(timer); window.clearInterval(clock); };
  }, [size]);
  return tickets;
}

function TicketRows({ tickets, compact }: { tickets: SampleTicket[]; compact?: boolean }) {
  return (
    <ul className="divide-y divide-slate-100">
      {tickets.map((ticket, i) => (
        <li key={ticket.id} className={`flex items-center gap-3 ${compact ? 'px-3 py-2.5' : 'px-4 py-3'} ${i === 0 ? 'ticket-arrive' : ''}`}>
          <span className="w-12 shrink-0 font-mono text-[11px] text-navy-400">TD-{140 + ticket.id}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-navy-900">{ticket.title}</p>
            {!compact && <p className="text-[11px] text-navy-400">{ticket.queue}</p>}
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_STYLE[ticket.priority]}`}>{ticket.priority}</span>
          <div className="w-16 shrink-0" title="Time left on the SLA">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${ticket.sla}%`, background: slaColor(ticket.sla) }} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

const NAV = [
  { icon: Home, label: 'Home' },
  { icon: Ticket, label: 'Tickets', active: true },
  { icon: Building2, label: 'Customers' },
  { icon: FolderKanban, label: 'Projects' },
  { icon: Network, label: 'Network' },
  { icon: BarChart3, label: 'Reports' },
  { icon: BookOpen, label: 'Knowledge' },
];

export default function TicketDeskMimic({ compact = false }: { compact?: boolean }) {
  const tickets = useIncomingTickets(compact ? 4 : 5);
  const atRisk = tickets.filter((t) => t.sla < 45).length;

  if (compact) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
          <span className="text-xs font-semibold text-navy-900">Support queue</span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-teal-600">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-teal-500" /> Live
          </span>
        </div>
        <TicketRows tickets={tickets} compact />
      </div>
    );
  }

  return (
    <div className="flex overflow-hidden rounded-xl bg-white text-left" role="img" aria-label="Illustration of the TitanDesk ticket queue with sample tickets">
      <aside className="hidden w-44 shrink-0 flex-col bg-navy-950 p-3 sm:flex">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500 text-[11px] font-bold text-white">T</span>
          <span className="text-[13px] font-semibold text-white">TitanDesk</span>
        </div>
        <ul className="mt-4 space-y-0.5">
          {NAV.map(({ icon: Icon, label, active }) => (
            <li key={label} className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[12px] ${active ? 'bg-white/10 font-semibold text-white' : 'text-ink-300'}`}>
              <Icon size={14} strokeWidth={1.8} /> {label}
            </li>
          ))}
        </ul>
      </aside>

      <div className="min-w-0 flex-1 bg-slate-50">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <span className="text-sm font-bold text-navy-900">Tickets</span>
          <span className="hidden items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1 text-[11px] text-navy-400 md:flex">
            <Search size={12} /> Search tickets, customers, devices
          </span>
          <div className="flex -space-x-1.5">
            {['#4165b7', '#2f9e8f', '#d4541f'].map((color, i) => (
              <span key={color} className="h-6 w-6 rounded-full border-2 border-white" style={{ background: color, opacity: 1 - i * 0.12 }} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
          {[
            { label: 'Open', value: String(18 + tickets.length), tone: 'text-navy-900' },
            { label: 'Due today', value: '7', tone: 'text-navy-900' },
            { label: 'SLA at risk', value: String(atRisk), tone: atRisk ? 'text-[#d6453a]' : 'text-navy-900' },
            { label: 'Gateways online', value: '12 / 12', tone: 'text-teal-600', live: true },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-[11px] text-navy-400">
                {stat.live && <span className="live-dot h-1.5 w-1.5 rounded-full bg-teal-500" />}
                {stat.label}
              </p>
              <p className={`mt-0.5 text-lg font-bold tabular-nums ${stat.tone}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mx-4 mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-xs font-semibold text-navy-900">Incoming</span>
            <span className="text-[11px] text-navy-400">Priority · SLA</span>
          </div>
          <TicketRows tickets={tickets} />
        </div>
      </div>
    </div>
  );
}
