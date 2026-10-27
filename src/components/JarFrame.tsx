import { useId } from 'react';
import { Placeholder } from './Placeholder';
import { StoreImage } from './StoreImage';

// A preserve jar in object-bounding-box units: neck, shoulders, body.
const JAR =
  'M0.29,0.055H0.71V0.105C0.71,0.145,0.95,0.155,0.95,0.245V0.94C0.95,0.975,0.92,1,0.88,1H0.12C0.08,1,0.05,0.975,0.05,0.94V0.245C0.05,0.155,0.29,0.145,0.29,0.105Z';

/** An image held in a jar with a saffron lid; used once per page, for the hero. */
export function JarFrame({ src, priority = false, sizes, className = '' }: { src: string | null; priority?: boolean; sizes?: string; className?: string }) {
  const id = `jar-${useId().replace(/:/g, '')}`;
  return (
    <div className={`relative ${className}`}>
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path d={JAR} />
          </clipPath>
        </defs>
      </svg>
      <div className="aspect-[4/5] bg-surface-deep-raised" style={{ clipPath: `url(#${id})` }}>
        <StoreImage src={src} alt="" priority={priority} sizes={sizes ?? '(min-width: 768px) 24rem, 80vw'} maxWidth={1000} fallback={<Placeholder tone="deep" />} />
      </div>
      <svg aria-hidden="true" viewBox="0 0 100 125" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
        <path d="M11 40C11 34 16 31 22 30" fill="none" strokeWidth="2.5" strokeLinecap="round" style={{ stroke: 'var(--gf-label)', strokeOpacity: 0.55 }} vectorEffect="non-scaling-stroke" />
        <path d="M11 48V100" fill="none" strokeWidth="2.5" strokeLinecap="round" style={{ stroke: 'var(--gf-label)', strokeOpacity: 0.35 }} vectorEffect="non-scaling-stroke" />
      </svg>
      <span aria-hidden="true" className="absolute left-[26%] right-[26%] top-0 h-[7%] rounded-[0.5rem] bg-[repeating-linear-gradient(90deg,var(--gf-saffron)_0_6px,color-mix(in_srgb,var(--gf-saffron)_80%,var(--gf-aubergine))_6px_8px)] shadow-[0_4px_8px_-4px_rgb(0_0_0/0.5)]" />
    </div>
  );
}
