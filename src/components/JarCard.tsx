import { useState } from 'react';
import { Link } from 'wouter';
import { formatPrice, isPurchasable, type CatalogCategory, type CatalogItem } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from './AddToCart';
import { Availability } from './Availability';
import { Placeholder } from './Placeholder';
import { Seal } from './Seal';
import { StoreImage } from './StoreImage';

/** A product as a preserve on the shelf: its photo, an oval label and a price seal. */
export function JarCard({ item, category, sizes = '(min-width: 1024px) 17rem, (min-width: 640px) 30vw, 46vw', headingLevel = 'h3' }: { item: CatalogItem; category?: CatalogCategory; sizes?: string; headingLevel?: 'h2' | 'h3' }) {
  const { t } = useI18n();
  const [stamp, setStamp] = useState(0);
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col">
      <div className={`relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface-quiet shadow-soft ${isPurchasable(item) ? '' : 'grayscale-[0.7]'}`}>
        <StoreImage src={item.imageUrl} alt="" sizes={sizes} maxWidth={720} fallback={<Placeholder />} />
        {item.kind === 'service' && (
          <span className="absolute left-3 top-3 rounded-full bg-surface-deep px-2.5 py-1 text-xs font-bold text-ink-on-deep">{t('product.service')}</span>
        )}
      </div>
      <div className="jar-label relative mx-1.5 -mt-14 flex flex-1 flex-col items-center px-6 pb-6 pt-12 text-center">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <Seal price={item.price} stamp={stamp} />
        </div>
        {category && <p className="text-sm font-semibold text-accent-text">{category.name}</p>}
        <Heading className="mt-1 text-lg leading-snug text-heading">
          <Link href={`/products/${item.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:underline">
            {item.name}
          </Link>
        </Heading>
        {item.duration && <p className="mt-1 text-sm text-ink-soft">{t('product.duration', { duration: item.duration })}</p>}
        {item.compareAtPrice !== null && (
          <p className="mt-1 text-sm text-offer">
            <span className="sr-only">{t('product.before', { price: formatPrice(item.compareAtPrice) })}</span>
            <s aria-hidden="true">{formatPrice(item.compareAtPrice)}</s>
            {item.percentOff !== null && <span className="ml-1.5 font-bold">{t('product.percentOff', { percent: item.percentOff })}</span>}
          </p>
        )}
        <div className="mt-1 flex flex-wrap justify-center gap-x-3">
          <Availability item={item} showDuration={false} />
        </div>
        <span className="sr-only">{formatPrice(item.price)}</span>
      </div>
      <div className="relative z-10 mt-3">
        <AddToCart item={item} variant="compact" tone="quiet" className="w-full" onAdded={() => setStamp((n) => n + 1)} />
      </div>
    </article>
  );
}

export function JarCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col">
      <div className="skeleton aspect-[4/5] rounded-[2rem]" />
      <div className="skeleton mx-1.5 -mt-14 h-32 rounded-[50%/34%]" />
      <div className="skeleton mt-3 h-11 rounded-full" />
    </div>
  );
}
