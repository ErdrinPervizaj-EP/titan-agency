import type { ReactElement } from 'react';

interface Def {
  color: string;
  path: ReactElement;
}

const DEFS: Record<string, Def> = {
  'Microsoft 365': {
    color: 'bg-indigo-500/10 text-indigo-500',
    path: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </>
    ),
  },
  Azure: {
    color: 'bg-indigo-500/10 text-indigo-500',
    path: <path d="M7 18a4 4 0 0 1-1-7.9A5 5 0 0 1 15.9 8H17a4 4 0 0 1 1 7.9" strokeLinecap="round" strokeLinejoin="round" />,
  },
  AWS: {
    color: 'bg-gold-500/15 text-gold-600',
    path: <path d="M7 17a4 4 0 0 1-1-7.9A5 5 0 0 1 15.9 8H17a4 4 0 0 1 1 7.9M5 21c4-2 10-2 14 0" strokeLinecap="round" strokeLinejoin="round" />,
  },
  'Google Workspace': {
    color: 'bg-teal-500/10 text-teal-600',
    path: (
      <>
        <circle cx="8" cy="8" r="2.6" />
        <circle cx="16" cy="8" r="2.6" />
        <circle cx="8" cy="16" r="2.6" />
        <circle cx="16" cy="16" r="2.6" />
      </>
    ),
  },
  Cisco: {
    color: 'bg-indigo-500/10 text-indigo-500',
    path: (
      <>
        <path d="M3 16v-3M7 16v-5M11 16v-3M13 16v-5M17 16v-3M21 16v-5" strokeLinecap="round" />
      </>
    ),
  },
  MikroTik: {
    color: 'bg-teal-500/10 text-teal-600',
    path: <path d="M4 18h16M4 14h16M8 10c0-2.2 1.8-4 4-4s4 1.8 4 4M12 18v-4" strokeLinecap="round" strokeLinejoin="round" />,
  },
  Ubiquiti: {
    color: 'bg-indigo-500/10 text-indigo-500',
    path: <path d="M4 9c4.5-4.5 11.5-4.5 16 0M7.2 12.2c2.7-2.7 6.9-2.7 9.6 0M10.4 15.4a3 3 0 0 1 3.2 0M12 19h.01" strokeLinecap="round" strokeLinejoin="round" />,
  },
  Fortinet: {
    color: 'bg-gold-500/15 text-gold-600',
    path: <path d="M12 2 4 6v6c0 5 3.6 8.7 8 10 4.4-1.3 8-5 8-10V6l-8-4Z" strokeLinejoin="round" />,
  },
  'Windows Server': {
    color: 'bg-indigo-500/10 text-indigo-500',
    path: (
      <>
        <rect x="3" y="4" width="18" height="6" rx="1.3" />
        <rect x="3" y="14" width="18" height="6" rx="1.3" />
        <circle cx="7" cy="7" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="7" cy="17" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
  },
  Linux: {
    color: 'bg-navy-500/10 text-navy-700',
    path: <path d="M6 20 9 4h6l3 16M4 20h16" strokeLinecap="round" strokeLinejoin="round" />,
  },
  VMware: {
    color: 'bg-teal-500/10 text-teal-600',
    path: (
      <>
        <path d="M4 8h16M4 12h16M4 16h16" strokeLinecap="round" />
      </>
    ),
  },
  Proxmox: {
    color: 'bg-gold-500/15 text-gold-600',
    path: <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 0v18M4 7.5l8 4.5 8-4.5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  TypeScript: {
    color: 'bg-indigo-500/10 text-indigo-500',
    path: <path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 6l-4 12" strokeLinecap="round" strokeLinejoin="round" />,
  },
  PostgreSQL: {
    color: 'bg-teal-500/10 text-teal-600',
    path: <path d="M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 0v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" strokeLinecap="round" strokeLinejoin="round" />,
  },
  Docker: {
    color: 'bg-indigo-500/10 text-indigo-500',
    path: (
      <>
        <rect x="3" y="11" width="4" height="4" />
        <rect x="8" y="11" width="4" height="4" />
        <rect x="13" y="11" width="4" height="4" />
        <rect x="8" y="6" width="4" height="4" />
        <path d="M2 15c0 3.5 3 6 8 6 6 0 10-3 11-8-1 0-2-.5-2.5-1.5-1 .5-1.5 0-1.5 0" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  'GitHub Actions': {
    color: 'bg-gold-500/15 text-gold-600',
    path: <path d="M6 3v12a3 3 0 0 0 3 3h3M6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm12 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 0v6a2 2 0 0 1-2 2" strokeLinecap="round" strokeLinejoin="round" />,
  },
};

const FALLBACK: Def = {
  color: 'bg-navy-500/10 text-navy-500',
  path: <circle cx="12" cy="12" r="8" />,
};

export default function TechIcon({ name, size = 20 }: { name: string; size?: number }) {
  const def = DEFS[name] ?? FALLBACK;
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-lg ${def.color}`} style={{ width: size * 1.8, height: size * 1.8 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {def.path}
      </svg>
    </span>
  );
}
