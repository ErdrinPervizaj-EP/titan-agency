import type { ReactElement } from 'react';

const ICONS: Record<string, { bg: string; path: ReactElement }> = {
  titandesk: {
    bg: 'bg-indigo-500',
    path: (
      <path
        d="M4 5h16v11H9l-4 4V5Z"
        stroke="white"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  titanshield: {
    bg: 'bg-gold-500',
    path: (
      <path
        d="M12 3 5 6v5c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6l-7-3Z"
        stroke="white"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  titancloud: {
    bg: 'bg-teal-500',
    path: (
      <path
        d="M7 17a4 4 0 0 1-1-7.9A5 5 0 0 1 15.9 8H17a4 4 0 0 1 1 7.9"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
};

export default function ProductIcon({ product, size = 32 }: { product: keyof typeof ICONS; size?: number }) {
  const icon = ICONS[product];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg ${icon.bg}`}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none">
        {icon.path}
      </svg>
    </span>
  );
}
