import { useState } from 'react';
import DashboardMock from './mocks/DashboardMock';
import SupportMock from './mocks/SupportMock';
import NetworkMock from './mocks/NetworkMock';
import ReportsMock from './mocks/ReportsMock';
import CustomersMock from './mocks/CustomersMock';
import CalendarMock from './mocks/CalendarMock';

const TABS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    Mock: DashboardMock,
    title: 'One home screen for the whole operation',
    desc: 'Open tickets, active clients, and SLA compliance — the numbers that matter, the moment you log in.',
  },
  {
    key: 'support',
    label: 'Support Queue',
    Mock: SupportMock,
    title: 'A support queue that never loses track',
    desc: 'Every ticket triaged by priority and SLA risk, with client context attached automatically.',
  },
  {
    key: 'network',
    label: 'Network Ops',
    Mock: NetworkMock,
    title: 'Full visibility into every managed device',
    desc: 'Overview, Topology, IPAM, Terminal, and Configurations for every client environment — from a single Devices workspace.',
  },
  {
    key: 'reports',
    label: 'Reporting',
    Mock: ReportsMock,
    title: 'Answers our support team actually needs',
    desc: 'Ticket volume, priority mix, team workload, and SLA compliance trends — refreshed automatically for every client account.',
  },
  {
    key: 'customers',
    label: 'Clients',
    Mock: CustomersMock,
    title: 'Every client relationship, organized',
    desc: 'Customers, organizations, and their history in one clean list view — searchable, sortable, exportable.',
  },
  {
    key: 'calendar',
    label: 'Calendar',
    Mock: CalendarMock,
    title: 'Site visits and change windows, planned ahead',
    desc: 'Patch windows, onsite visits, and client reviews scheduled against real availability — never a surprise.',
  },
];

export default function ProductTour() {
  const [active, setActive] = useState(TABS[0].key);
  const current = TABS.find((t) => t.key === active)!;
  const Mock = current.Mock;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              active === t.key
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'border border-slate-200 bg-white text-navy-500 hover:text-navy-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-500">
            TitanDesk
          </span>
          <h3 className="font-display mt-4 text-2xl font-bold text-navy-900">{current.title}</h3>
          <p className="mt-4 text-navy-500">{current.desc}</p>
        </div>

        <div className="relative lg:col-span-3">
          <div className="absolute -inset-4 rounded-3xl bg-indigo-500/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-2xl shadow-navy-900/10">
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-navy-950 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-4 rounded-md bg-navy-900 px-3 py-1 text-xs text-ink-500">app.titandesk.io</span>
            </div>
            <Mock />
          </div>
        </div>
      </div>
    </div>
  );
}
