import { MessageSquare, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, { bg: string; Icon: LucideIcon }> = {
  titandesk: { bg: 'bg-indigo-500', Icon: MessageSquare },
  hrm: { bg: 'bg-teal-500', Icon: Users },
};

export default function ProductIcon({ product, size = 32 }: { product: keyof typeof ICONS; size?: number }) {
  const { bg, Icon } = ICONS[product];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg ${bg}`}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.56} strokeWidth={1.9} color="white" />
    </span>
  );
}
