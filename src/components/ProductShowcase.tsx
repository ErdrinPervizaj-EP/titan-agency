import { Link } from 'react-router-dom';
import { useT, useLocalizedPath } from '../i18n/useLang';
import Section from './Section';
import ProductIcon from './ProductIcon';
import HowItWorks from './diagrams/HowItWorks';
import FlowDiagram from './diagrams/FlowDiagram';
import { Building2, Cloud, Globe, Mail, MailCheck, Network, Phone, Router, ShieldCheck, Ticket, UserRound, Wrench } from 'lucide-react';

/** Node colors, from the site's service accents. */
const C = { indigo: '#4165b7', teal: '#2f9e8f', orange: '#d4541f', sky: '#0b8bd6', violet: '#7c5cd6', gold: '#c98a06' };

export default function ProductShowcase() {
  const t = useT();
  const lp = useLocalizedPath();
  const h = t.howItWorks;
  const tk = h.ticket.diagram;
  const gw = h.gateway.diagram;

  return (
    <Section id="products" label={t.productSuite.tag} title={t.productSuite.title} intro={t.productSuite.sub} fullWidth decor={{ icons: [Ticket, Mail, Router, Network, Globe, Cloud], accent: C.teal }}>
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-6">
        <div className="flex items-center gap-4">
          <ProductIcon product="titandesk" size={40} />
          <div>
            <p className="font-display text-lg font-semibold text-navy-900">
              TitanDesk <span className="ml-2 align-middle text-xs font-semibold text-teal-600">{t.nav.productStatusLive}</span>
            </p>
            <p className="text-sm text-navy-500">{t.productSuite.titandeskDesc}</p>
          </div>
        </div>
        <Link to={lp('/titandesk')} className="text-sm font-semibold text-navy-900 underline decoration-slate-300 underline-offset-4 hover:decoration-navy-900">
          {t.productSuite.explore}
        </Link>
      </div>

      <div className="mt-16 space-y-24">
        <HowItWorks
          title={h.ticket.title}
          body={h.ticket.body}
          steps={h.ticket.steps}
          renderDiagram={(active, setActive) => (
            <FlowDiagram
              title={h.ticket.title}
              width={680}
              height={330}
              active={active}
              onActivate={setActive}
              nodes={[
                { id: 'email', x: 16, y: 36, w: 150, h: 52, title: tk.email, icon: Mail, accent: C.indigo, steps: [1] },
                { id: 'portal', x: 16, y: 144, w: 150, h: 52, title: tk.portal, icon: Globe, accent: C.sky, steps: [1] },
                { id: 'phone', x: 16, y: 252, w: 150, h: 52, title: tk.phone, icon: Phone, accent: C.violet, steps: [1] },
                {
                  id: 'ticket', x: 232, y: 50, w: 216, h: 232, title: 'TD-142', sub: tk.subject, icon: Ticket, accent: C.orange, steps: [2],
                  rows: [[tk.queue, tk.queueValue], [tk.priority, tk.priorityValue], [tk.sla, tk.slaValue], [tk.status, tk.statusValue]],
                },
                { id: 'tech', x: 514, y: 80, w: 150, h: 60, title: tk.tech, sub: tk.techSub, icon: Wrench, accent: C.teal, steps: [3] },
                { id: 'client', x: 514, y: 200, w: 150, h: 60, title: tk.client, sub: tk.clientSub, icon: MailCheck, accent: C.gold, steps: [3] },
              ]}
              edges={[
                { id: 't-email', d: 'M166 62 C 200 62 198 120 232 120', steps: [1] },
                { id: 't-portal', d: 'M166 170 L232 170', steps: [1] },
                { id: 't-phone', d: 'M166 278 C 200 278 198 220 232 220', steps: [1] },
                { id: 't-tech', d: 'M448 130 C 482 130 480 110 514 110', steps: [3] },
                { id: 't-client', d: 'M448 210 C 482 210 480 230 514 230', steps: [3] },
              ]}
            />
          )}
        />

        <HowItWorks
          reverse
          title={h.gateway.title}
          body={h.gateway.body}
          steps={h.gateway.steps}
          renderDiagram={(active, setActive) => (
            <FlowDiagram
              title={h.gateway.title}
              width={680}
              height={360}
              active={active}
              onActivate={setActive}
              zones={[{ x: 440, y: 20, w: 224, h: 320, label: gw.network, note: gw.firewall, icon: Building2, accent: C.teal, gate: { x: 440, y: 170, icon: ShieldCheck } }]}
              nodes={[
                { id: 'tech', x: 16, y: 138, w: 160, h: 64, title: gw.technician, sub: gw.technicianSub, icon: UserRound, accent: C.violet, steps: [1, 4] },
                { id: 'server', x: 240, y: 138, w: 150, h: 64, title: 'TitanDesk', sub: gw.serverSub, icon: Cloud, accent: C.indigo, steps: [1, 2, 4] },
                { id: 'gateway', x: 478, y: 138, w: 160, h: 64, title: gw.gateway, sub: gw.gatewaySub, icon: Router, accent: C.teal, steps: [2, 3] },
                { id: 'switch', x: 486, y: 54, w: 144, h: 44, title: gw.switch, icon: Network, accent: C.sky, steps: [3] },
                { id: 'router', x: 486, y: 252, w: 144, h: 44, title: gw.router, icon: Globe, accent: C.orange, steps: [3] },
              ]}
              edges={[
                { id: 'g-request', d: 'M176 158 L240 158', steps: [1], label: gw.request, lx: 208, ly: 128 },
                { id: 'g-poll', d: 'M478 170 L390 170', steps: [2], label: gw.poll, lx: 434, ly: 138 },
                { id: 'g-switch', d: 'M558 138 L558 98', steps: [3] },
                { id: 'g-router', d: 'M558 202 L558 252', steps: [3] },
                { id: 'g-result', d: 'M240 184 L176 184', steps: [4], label: gw.result, lx: 208, ly: 216 },
              ]}
            />
          )}
        />
      </div>

      <div className="mt-24 border-t border-slate-200 pt-8">
        <p className="text-sm font-medium text-navy-400">{t.productSuite.comingSoon}</p>
        <ul className="mt-4 grid gap-6 sm:grid-cols-2">
          {t.productSuite.upcoming.map((product) => (
            <li key={product.name}>
              <p className="font-semibold text-navy-900">{product.name}</p>
              <p className="mt-1 text-sm text-navy-500">{product.tagline}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
