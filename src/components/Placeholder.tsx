import { ProductFallbackIcon } from './CmsIcon';

/** Identity placeholder: the wall with a jar outline and the store's fallback icon. */
export function Placeholder({ label, tone = 'light' }: { label?: string; tone?: 'light' | 'deep' }) {
  const deep = tone === 'deep';
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${deep ? 'bg-surface-deep-raised text-ink-on-deep-soft' : 'bg-surface-quiet text-heading'}`}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <svg aria-hidden="true" viewBox="0 0 64 80" className="absolute h-[62%] opacity-20">
        <path d="M18 4h28v8c0 3 14 5 14 14v48a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V26c0-9 14-11 14-14z" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <ProductFallbackIcon className="relative h-9 w-9" strokeWidth={1.5} />
    </div>
  );
}
