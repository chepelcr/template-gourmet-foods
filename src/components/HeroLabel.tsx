import type { ReactNode } from 'react';

/**
 * The big preserve label in the hero; its saffron border draws once. On
 * phones the label is tall, so it rounds its corners instead of going oval.
 */
export function HeroLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  const border = (rx: number, ry: number, shown: string) => (
    <rect x="0" y="0" width="100" height="100" rx={rx} ry={ry} pathLength="1" fill="none" strokeWidth="3" className={`label-draw ${shown}`} style={{ stroke: 'var(--accent)' }} vectorEffect="non-scaling-stroke" />
  );
  return (
    <div className={`jar-label relative px-6 py-10 text-center text-ink max-sm:rounded-[2.5rem] sm:px-14 sm:py-16 ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-[10px] h-[calc(100%-20px)] w-[calc(100%-20px)] overflow-visible">
        {border(10, 5, 'sm:hidden')}
        {border(50, 34, 'hidden sm:block')}
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
