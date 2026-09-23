import { Headset, Network, ShieldCheck, Cloud, Code2, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Order matches translations.services.items — one icon per service. */
export const SERVICE_ICONS: LucideIcon[] = [Headset, Network, ShieldCheck, Cloud, Code2, Compass];

/**
 * One color per service, used consistently wherever that service appears
 * (navbar menu, service cards, detail pages). Brand indigo/teal/gold plus
 * three companions picked to sit at the same weight next to them.
 */
export const SERVICE_ACCENTS = ['#4165b7', '#2f9e8f', '#d4541f', '#0b8bd6', '#7c5cd6', '#c98a06'];

/** Tinted tile classes for small icon badges (navbar menus). */
export const SERVICE_COLORS = [
  'bg-[#4165b7]/10 text-[#4165b7]',
  'bg-[#2f9e8f]/10 text-[#2f9e8f]',
  'bg-[#d4541f]/10 text-[#d4541f]',
  'bg-[#0b8bd6]/10 text-[#0b8bd6]',
  'bg-[#7c5cd6]/10 text-[#7c5cd6]',
  'bg-[#c98a06]/12 text-[#c98a06]',
];
