import type { LucideIcon } from 'lucide-react';

/**
 * A small box-and-arrow diagram renderer. Each node and edge belongs to one or
 * more numbered steps; the active step lights up in its color with a dot
 * travelling its arrows, and everything else steps back. Every arrow carries a
 * slow dashed "flow" so the diagram reads as live even when idle.
 */
export interface FlowNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  icon?: LucideIcon;
  /** Badge/highlight color for this node. */
  accent?: string;
  /** Label/value rows drawn under the title, for a record-like card. */
  rows?: [string, string][];
  steps: number[];
}

export interface FlowEdge {
  id: string;
  d: string;
  steps: number[];
  label?: string;
  lx?: number;
  ly?: number;
}

export interface FlowZone {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  note?: string;
  icon?: LucideIcon;
  accent?: string;
  /** A marker on the zone boundary where traffic crosses it (e.g. the firewall). */
  gate?: { x: number; y: number; icon: LucideIcon };
}

const INK = '#1e305a';
const MUTED = '#6b7aa8';
const LINE = '#cfd6e6';
const BRAND = '#4165b7';

function Badge({ x, y, icon: Icon, color, size = 30 }: { x: number; y: number; icon: LucideIcon; color: string; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={8} fill={color} />
      <Icon x={x + size * 0.22} y={y + size * 0.22} width={size * 0.56} height={size * 0.56} color="#ffffff" strokeWidth={2} />
    </g>
  );
}

export default function FlowDiagram({
  width,
  height,
  nodes,
  edges,
  zones = [],
  active,
  onActivate,
  title,
}: {
  width: number;
  height: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
  zones?: FlowZone[];
  /** null = nothing highlighted, everything drawn normally. */
  active: number | null;
  onActivate: (step: number | null) => void;
  title: string;
}) {
  const on = (steps: number[]) => active === null || steps.includes(active);
  const uid = title.replace(/\W+/g, '-').toLowerCase();

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} className="block h-auto w-full min-w-[560px]">
      <defs>
        <pattern id={`${uid}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="#e3e8f3" />
        </pattern>
        <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#101a33" floodOpacity="0.10" />
        </filter>
        <filter id={`${uid}-lift`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#101a33" floodOpacity="0.18" />
        </filter>
        <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M1 1 L9 5 L1 9" fill="none" stroke={LINE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id={`${uid}-arrow-on`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M1 1 L9 5 L1 9" fill="none" stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      <rect width={width} height={height} fill={`url(#${uid}-dots)`} />

      {zones.map((zone) => {
        const accent = zone.accent ?? '#2f9e8f';
        return (
          <g key={zone.label}>
            <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx={18} fill={accent} fillOpacity={0.05} stroke={accent} strokeOpacity={0.45} strokeDasharray="6 6" />
            {zone.icon && <Badge x={zone.x + 14} y={zone.y + 12} icon={zone.icon} color={accent} size={22} />}
            <text x={zone.x + (zone.icon ? 44 : 16)} y={zone.y + 28} fontSize={12} fontWeight={700} fill={accent}>{zone.label}</text>
            {zone.note && <text x={zone.x + 16} y={zone.y + zone.h - 14} fontSize={11} fontWeight={500} fill={MUTED}>{zone.note}</text>}
          </g>
        );
      })}

      {edges.map((edge) => {
        const lit = active !== null && edge.steps.includes(active);
        return (
          <g key={edge.id} style={{ opacity: on(edge.steps) ? 1 : 0.3, transition: 'opacity 300ms' }}>
            <path d={edge.d} fill="none" stroke={lit ? BRAND : LINE} strokeOpacity={lit ? 0.18 : 0} strokeWidth={8} strokeLinecap="round" />
            <path
              id={`${uid}-${edge.id}`}
              d={edge.d}
              fill="none"
              stroke={lit ? BRAND : LINE}
              strokeWidth={lit ? 2.2 : 1.6}
              strokeDasharray="6 5"
              strokeLinecap="round"
              markerEnd={`url(#${uid}-${lit ? 'arrow-on' : 'arrow'})`}
              className="flow-dash"
              style={{ transition: 'stroke 300ms' }}
            />
            {edge.label && (
              <g>
                <rect
                  x={(edge.lx ?? 0) - edge.label.length * 3.3 - 9}
                  y={(edge.ly ?? 0) - 12}
                  width={edge.label.length * 6.6 + 18}
                  height={20}
                  rx={10}
                  fill={lit ? BRAND : '#ffffff'}
                  stroke={lit ? BRAND : LINE}
                />
                <text x={edge.lx} y={(edge.ly ?? 0) + 2} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={lit ? '#ffffff' : MUTED}>
                  {edge.label}
                </text>
              </g>
            )}
            {lit && (
              <circle r={4} fill={BRAND} stroke="#ffffff" strokeWidth={1.5} className="motion-reduce:hidden">
                <animateMotion dur="1.4s" repeatCount="indefinite">
                  <mpath href={`#${uid}-${edge.id}`} />
                </animateMotion>
              </circle>
            )}
          </g>
        );
      })}

      {zones.map((zone) => zone.gate && (
        <g key={`${zone.label}-gate`}>
          <circle cx={zone.gate.x} cy={zone.gate.y} r={15} fill="#ffffff" stroke={zone.accent ?? '#2f9e8f'} strokeWidth={1.5} />
          <zone.gate.icon x={zone.gate.x - 8} y={zone.gate.y - 8} width={16} height={16} color={zone.accent ?? '#2f9e8f'} strokeWidth={2} />
        </g>
      ))}

      {nodes.map((node) => {
        const lit = active !== null && node.steps.includes(active);
        const accent = node.accent ?? BRAND;
        const hasIcon = !!node.icon;
        const textX = node.x + (hasIcon ? 52 : 14);
        const titleY = node.y + (node.sub || node.rows ? 25 : node.h / 2 + 4);
        return (
          <g
            key={node.id}
            onMouseEnter={() => onActivate(node.steps[0])}
            onMouseLeave={() => onActivate(null)}
            filter={`url(#${uid}-${lit ? 'lift' : 'shadow'})`}
            style={{
              opacity: on(node.steps) ? 1 : 0.45,
              transform: lit ? 'translateY(-3px)' : 'none',
              transition: 'opacity 300ms, transform 300ms',
              cursor: 'default',
            }}
          >
            <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={12} fill="#ffffff" stroke={lit ? accent : '#e3e8f3'} strokeWidth={lit ? 2 : 1} />
            {node.icon && <Badge x={node.x + 12} y={node.y + (node.rows ? 12 : (node.h - 30) / 2)} icon={node.icon} color={accent} />}
            <text x={textX} y={titleY} fontSize={13} fontWeight={700} fill={INK}>{node.title}</text>
            {node.sub && <text x={textX} y={node.y + 42} fontSize={11} fill={MUTED}>{node.sub}</text>}
            {node.rows?.map(([label, value], i) => {
              const y = node.y + 84 + i * 33;
              return (
                <g key={label}>
                  <line x1={node.x + 14} x2={node.x + node.w - 14} y1={y - 19} y2={y - 19} stroke="#eef1f8" />
                  <text x={node.x + 14} y={y} fontSize={11} fill={MUTED}>{label}</text>
                  <text x={node.x + node.w - 14} y={y} fontSize={11} fontWeight={700} fill={INK} textAnchor="end">{value}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
