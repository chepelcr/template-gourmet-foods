import { Link } from 'wouter';
import { formatPrice, type CatalogItem } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from './AddToCart';
import { Placeholder } from './Placeholder';
import { StoreImage } from './StoreImage';

/** "La carta": each item, a dotted leader and its price — read at a glance. */
export function MenuList({ items, rich = false }: { items: CatalogItem[]; rich?: boolean }) {
  const { t, plural } = useI18n();
  return (
    <ul className={rich ? 'divide-y divide-[color:var(--rule)]' : 'flex flex-col gap-1'}>
      {items.map((item) => {
        const soldOut = item.availability.state === 'sold_out';
        const note = [
          item.kind === 'service' ? t('product.service') : null,
          item.duration,
          // With an add button, a sold-out row already says so on the button.
          soldOut ? (rich ? null : t('product.soldOut')) : item.availability.state === 'low' ? plural('product.low', item.availability.quantity) : null,
        ].filter(Boolean);
        return (
          <li key={item.id} className={rich ? 'grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-3 gap-y-2 py-3 sm:flex sm:items-center sm:gap-4' : 'py-1.5'}>
            {rich && (
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-quiet sm:h-14 sm:w-14">
                <StoreImage src={item.imageUrl} alt="" sizes="3.5rem" maxWidth={240} fallback={<Placeholder />} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className={rich ? 'flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:gap-2' : 'flex items-baseline gap-2'}>
                <Link href={`/products/${item.id}`} className={`min-w-0 font-bold text-heading hover:underline ${soldOut ? 'opacity-70' : ''}`}>
                  {item.name}
                </Link>
                <span aria-hidden="true" className={rich ? 'leader hidden sm:block' : 'leader'} />
                <span className={rich ? 'price-tag flex flex-wrap items-baseline gap-x-2 gap-y-1 text-lg sm:max-w-[45%] sm:justify-end' : 'price-tag shrink-0 text-lg'}>
                  {item.compareAtPrice !== null && (
                    <>
                      <span className="sr-only">{t('product.before', { price: formatPrice(item.compareAtPrice) })}</span>
                      <s aria-hidden="true" className={`whitespace-nowrap text-sm font-medium text-offer ${rich ? '' : 'mr-2'}`}>
                        {formatPrice(item.compareAtPrice)}
                      </s>
                    </>
                  )}
                  <span className="whitespace-nowrap">{formatPrice(item.price)}</span>
                </span>
              </div>
              {note.length > 0 && <p className={`text-sm ${soldOut || item.availability.state === 'low' ? 'text-offer' : 'text-ink-soft'}`}>{note.join(' · ')}</p>}
            </div>
            {rich && (
              <div className="relative col-start-2 justify-self-start sm:shrink-0">
                <AddToCart item={item} variant="compact" tone="quiet" />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
