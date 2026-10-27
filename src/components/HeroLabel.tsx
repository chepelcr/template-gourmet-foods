import { useRef, type ReactNode } from 'react';
import { useBoxSize } from './useBoxSize';

/**
 * The big preserve label in the hero; its saffron border draws once (drawn in
 * real pixels so the stroke keeps its width). Below `sm` the label is tall, so
 * the label and its border round their corners instead of going oval.
 */
export function HeroLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const { width, height } = useBoxSize(box);
  const border = (rx: number, ry: number, shown: string) => (
    <rect
      x="1.5"
      y="1.5"
      width={width - 3}
      height={height - 3}
      rx={rx}
      ry={ry}
      pathLength="1"
      fill="none"
      strokeWidth="3"
      className={`label-draw ${shown}`}
      style={{ stroke: 'var(--accent)' }}
    />
  );
  return (
    <div className={`jar-label relative px-5 pb-12 pt-10 text-center text-ink max-sm:rounded-[2.5rem] sm:px-14 sm:pb-20 sm:pt-16 ${className}`}>
      <div ref={box} aria-hidden="true" className="pointer-events-none absolute inset-[10px]">
        {width > 0 && (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 overflow-visible">
            {border(30, 30, 'sm:hidden')}
            {border((width - 3) / 2, (height - 3) * 0.34, 'hidden sm:block')}
          </svg>
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
