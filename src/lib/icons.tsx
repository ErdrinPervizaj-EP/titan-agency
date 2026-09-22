import { Headset, Network, ShieldCheck, Cloud, Code2, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Order matches translations.services.items — one icon per service. */
export const SERVICE_ICONS: LucideIcon[] = [Headset, Network, ShieldCheck, Cloud, Code2, Compass];

export const SERVICE_COLORS = [
  'bg-indigo-500/10 text-indigo-500',
  'bg-teal-500/10 text-teal-600',
  'bg-gold-500/15 text-gold-600',
];
