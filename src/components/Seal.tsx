import { formatPrice } from '@/core';

const BUMPS = 18;

// A scalloped edge: points on r=43, bulging out to r=50 between them.
const SCALLOP = (() => {
  const point = (r: number, a: number) => `${(r * Math.sin(a)).toFixed(2)} ${(-r * Math.cos(a)).toFixed(2)}`;
  const step = (Math.PI * 2) / BUMPS;
  let d = `M${point(43, 0)}`;
  for (let i = 0; i < BUMPS; i += 1) d += `Q${point(51, (i + 0.5) * step)} ${point(43, (i + 1) * step)}`;
  return `${d}Z`;
})();

/**
 * The price seal stuck on a label (decorative: callers also give the price as
 * text). `stamp` changes when the item is added, so it stamps again.
 */
export function Seal({ price, stamp = 0, className = '' }: { price: number; stamp?: number; className?: string }) {
  const text = formatPrice(price);
  const size = text.length <= 6 ? 'text-base' : text.length <= 8 ? 'text-[0.875rem]' : 'text-[0.75rem]';
  return (
    <span key={stamp} aria-hidden="true" className={`relative grid aspect-square w-[4.75rem] -rotate-[8deg] place-items-center ${stamp ? 'seal-stamp' : ''} ${className}`}>
      <svg aria-hidden="true" viewBox="-52 -52 104 104" className="absolute inset-0 h-full w-full drop-shadow-[0_3px_4px_rgb(42_26_43/0.3)]">
        <path d={SCALLOP} style={{ fill: 'var(--seal)' }} />
        <circle r="36" fill="none" strokeWidth="1.5" strokeDasharray="3 3" style={{ stroke: 'var(--seal-ink)', strokeOpacity: 0.45 }} />
      </svg>
      <span className={`relative font-display font-bold tabular-nums leading-none text-[color:var(--seal-ink)] ${size}`}>{text}</span>
    </span>
  );
}
