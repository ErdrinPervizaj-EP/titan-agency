import { useMemo, useState } from 'react';
import { Building2, CalendarDays, CircleAlert, FolderKanban, Loader2, Network, Router, ShieldCheck, Ticket, UserRoundPlus, Users } from 'lucide-react';
import { Avatar, Badge, Card, CardHeader, DotMatrixChart, RadialSunburst, StatTile, type Tone } from './ui';
import { CUSTOMERS, DEVICES, PRIORITY_COLOR, PROJECT_COLUMNS, TICKETS, VOLUME, type Priority, type Status } from './data';

const PRIORITY_TONE: Record<Priority, Tone> = { Critical: 'bad', High: 'warn', Medium: 'info', Low: 'neutral' };
const STATUS_TONE: Record<Status, Tone> = { New: 'brand', Open: 'info', Pending: 'warn', Resolved: 'ok' };
const openTickets = TICKETS.filter((t) => t.status !== 'Resolved');
/** Due within about an hour and a half: "in 24m", "in 1h 12m". */
const atRisk = (sla: string) => /^in (\d+m|1h \d+m)$/.test(sla);

export type Queue = 'open' | 'unassigned' | 'risk';

/** Port of the product's admin dashboard (web/src/pages/HomePage.tsx → AdminHomePage). */
export function HomeView({ go }: { go: (page: string, queue?: Queue) => void }) {
  const [range, setRange] = useState('12');
  const volume = useMemo(() => {
    const days = Number(range);
    const values = days === 7 ? VOLUME.slice(-7) : VOLUME;
    return values.map((value, i) => ({ value, label: i % 2 === 0 ? `Sep ${10 + i + (12 - values.length)}` : '' }));
  }, [range]);
  const mix = (['Critical', 'High', 'Medium', 'Low'] as Priority[]).map((p) => ({ name: p, value: TICKETS.filter((t) => t.priority === p).length, color: PRIORITY_COLOR[p] }));
  const attention = TICKETS.filter((t) => t.priority === 'Critical' || t.priority === 'High').slice(0, 3);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-5 gap-4">
        <StatTile icon={Ticket} label="Open Tickets" value={String(openTickets.length)} onClick={() => go('tickets', 'open')} />
        <StatTile icon={UserRoundPlus} label="Unassigned" value={String(openTickets.filter((t) => !t.assignee).length)} onClick={() => go('tickets', 'unassigned')} />
        <StatTile icon={Users} label="Customers" value={String(CUSTOMERS.length).padStart(2, '0')} onClick={() => go('customers')} />
        <StatTile icon={ShieldCheck} label="SLA at risk" value={String(openTickets.filter((t) => atRisk(t.sla)).length)} onClick={() => go('tickets', 'risk')} />
        <StatTile icon={Router} label="Gateways" value="3 / 3" onClick={() => go('network')} />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <Card className="col-span-6">
          <CardHeader
            icon={Ticket}
            title="Ticket Analytics"
            action={
              <select value={range} onChange={(e) => setRange(e.target.value)} className="h-9 rounded-control border border-line bg-surface px-3 text-[13px] text-ink focus:border-brand-600 focus:outline-none">
                <option value="7">Last Week</option>
                <option value="12">Last 12 days</option>
              </select>
            }
          />
          <DotMatrixChart key={range} data={volume} />
        </Card>
        <Card className="col-span-3">
          <CardHeader icon={Ticket} title="Ticket Priority Mix" />
          <div className="px-5 pt-4"><RadialSunburst segments={mix} centerLabel="Total Tickets" centerValue={String(TICKETS.length)} /></div>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-5 pb-5 pt-3">
            {mix.map((slice) => (
              <li key={slice.name} className="flex items-center gap-1.5 text-[12px] text-ink-soft">
                <span className="h-2 w-2 rounded-full" style={{ background: slice.color }} />{slice.name}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="col-span-3">
          <CardHeader icon={CircleAlert} title="Needs Attention" />
          <ul className="px-3 pb-4 pt-1">
            {attention.map((t) => (
              <li key={t.number}>
                <button type="button" onClick={() => go('tickets', 'open')} className="flex w-full items-start gap-2.5 rounded-control px-3 py-3 text-left hover:bg-line-soft">
                  <Loader2 size={16} className={`mt-0.5 shrink-0 ${t.priority === 'Critical' ? 'text-bad' : 'text-[#DEA50B]'}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-ink">{t.subject}</span>
                    <span className="block truncate text-[12px] text-ink-soft">TD-{t.number} · {t.customer}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[12px] text-ink-muted"><CalendarDays size={12} />{t.sla}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

const QUEUES: { id: Queue; label: string; icon: typeof Ticket; test: (t: (typeof TICKETS)[number]) => boolean }[] = [
  { id: 'open', label: 'All open', icon: Ticket, test: (t) => t.status !== 'Resolved' },
  { id: 'unassigned', label: 'Unassigned', icon: UserRoundPlus, test: (t) => t.status !== 'Resolved' && !t.assignee },
  { id: 'risk', label: 'SLA at risk', icon: ShieldCheck, test: (t) => t.status !== 'Resolved' && atRisk(t.sla) },
];

export function TicketsView({ queue, setQueue }: { queue: Queue; setQueue: (q: Queue) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const rows = TICKETS.filter(QUEUES.find((q) => q.id === queue)!.test);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {QUEUES.map((q) => (
          <button key={q.id} type="button" onClick={() => setQueue(q.id)} className={`card flex items-center gap-3 px-5 py-4 text-left transition-colors hover:border-brand-300 ${queue === q.id ? 'border-brand-500 ring-1 ring-inset ring-brand-500' : ''}`}>
            <span className={`section-icon ${queue === q.id ? '' : 'bg-line-soft text-ink-soft'}`}><q.icon size={17} strokeWidth={1.8} /></span>
            <span className="text-[13px] font-medium text-ink-soft">{q.label}</span>
            <span className="ml-auto text-[22px] font-semibold text-ink tabular-nums">{TICKETS.filter(q.test).length}</span>
          </button>
        ))}
      </div>
      <Card>
        <CardHeader icon={Ticket} title={QUEUES.find((q) => q.id === queue)!.label} />
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line-soft text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
              {['Ticket', 'Customer', 'Priority', 'Status', 'Assignee', 'SLA'].map((h) => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.number} onClick={() => setSelected(t.number)} className={`cursor-pointer border-b border-line-soft last:border-0 ${selected === t.number ? 'bg-brand-50' : 'hover:bg-line-soft'}`}>
                <td className="px-5 py-3"><span className="block font-semibold text-ink">{t.subject}</span><span className="text-[12px] text-ink-soft">TD-{t.number}</span></td>
                <td className="px-5 py-3 text-ink-soft">{t.customer}</td>
                <td className="px-5 py-3"><Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge></td>
                <td className="px-5 py-3"><Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge></td>
                <td className="px-5 py-3">{t.assignee ? <span className="flex items-center gap-2"><Avatar name={t.assignee} size={26} /><span className="text-ink">{t.assignee}</span></span> : <span className="text-ink-muted">Unassigned</span>}</td>
                <td className={`px-5 py-3 ${atRisk(t.sla) ? 'font-semibold text-bad' : 'text-ink-soft'}`}>{t.sla}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export function CustomersView() {
  return (
    <Card>
      <CardHeader icon={Building2} title="Customers" />
      <ul className="divide-y divide-line-soft">
        {CUSTOMERS.map((c) => (
          <li key={c.name} className="flex items-center gap-4 px-5 py-4 hover:bg-line-soft">
            <Avatar name={c.name} size={36} />
            <span className="min-w-0 flex-1"><span className="block font-semibold text-ink">{c.name}</span><span className="text-[12px] text-ink-soft">{c.type} · {c.devices} devices</span></span>
            <Badge tone="brand">{c.plan}</Badge>
            <span className="w-28 text-right text-[13px] text-ink-soft">{c.open} open tickets</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function ProjectsView() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {PROJECT_COLUMNS.map((column) => (
        <Card key={column.title} className="bg-line-soft/60">
          <CardHeader icon={FolderKanban} title={`${column.title} · ${column.cards.length}`} />
          <ul className="space-y-3 p-4">
            {column.cards.map((card) => (
              <li key={card} className="card cursor-grab px-4 py-3 text-[13px] font-semibold text-ink transition-transform hover:-translate-y-0.5">{card}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

export function NetworkView() {
  const online = DEVICES.filter((d) => d.status === 'Online').length;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <StatTile icon={Network} label="Devices" value={String(DEVICES.length)} />
        <StatTile icon={Router} label="Online now" value={`${online} / ${DEVICES.length}`} tone="ok" />
        <StatTile icon={ShieldCheck} label="Gateways" value="3 / 3" />
      </div>
      <Card>
        <CardHeader icon={Network} title="Network devices" />
        <ul className="divide-y divide-line-soft">
          {DEVICES.map((d) => (
            <li key={d.name} className="grid grid-cols-[1fr_1.4fr_1fr_auto] items-center gap-4 px-5 py-3 text-[13px] hover:bg-line-soft">
              <span className="font-mono font-semibold text-ink">{d.name}</span>
              <span className="text-ink-soft">{d.model}</span>
              <span className="text-ink-soft">{d.site}</span>
              <Badge tone={d.status === 'Online' ? 'ok' : 'warn'}>● {d.status}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/** Port of the product's Reports overview: resolution metrics, volume and SLA compliance by week. */
export function ReportsView() {
  const weeks = [{ label: 'Week 1', value: 96 }, { label: 'Week 2', value: 99 }, { label: 'Week 3', value: 94 }, { label: 'Week 4', value: 100 }];
  const mix = (['Critical', 'High', 'Medium', 'Low'] as Priority[]).map((p) => ({ name: p, value: TICKETS.filter((t) => t.priority === p).length, color: PRIORITY_COLOR[p] }));
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <StatTile icon={Ticket} label="Tickets resolved" value="312" tone="ok" />
        <StatTile icon={CalendarDays} label="Avg. first response" value="38m" />
        <StatTile icon={ShieldCheck} label="SLA compliance" value="98%" tone="ok" />
        <StatTile icon={UserRoundPlus} label="Reopened" value="4" tone="warn" />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <Card className="col-span-7">
          <CardHeader icon={ShieldCheck} title="SLA compliance by week" />
          <ul className="space-y-4 p-5">
            {weeks.map((w) => (
              <li key={w.label}>
                <div className="flex justify-between text-[13px]"><span className="text-ink-soft">{w.label}</span><span className="font-semibold text-ink">{w.value}%</span></div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line-soft">
                  <div className="td-bar h-full rounded-full bg-[#4FB3AC]" style={{ width: `${w.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="col-span-5">
          <CardHeader icon={Ticket} title="Priority mix" />
          <div className="px-5 pb-5 pt-4"><RadialSunburst segments={mix} centerLabel="This month" centerValue="312" size={170} /></div>
        </Card>
      </div>
    </div>
  );
}
