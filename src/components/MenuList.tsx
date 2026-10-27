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
          <li key={item.id} className={rich ? 'flex items-center gap-4 py-3' : 'py-1.5'}>
            {rich && (
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface-quiet">
                <StoreImage src={item.imageUrl} alt="" sizes="3.5rem" maxWidth={240} fallback={<Placeholder />} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <Link href={`/products/${item.id}`} className={`font-bold text-heading hover:underline ${soldOut ? 'opacity-70' : ''}`}>
                  {item.name}
                </Link>
                <span aria-hidden="true" className="leader" />
                <span className="price-tag shrink-0 text-lg">
                  {item.compareAtPrice !== null && (
                    <>
                      <span className="sr-only">{t('product.before', { price: formatPrice(item.compareAtPrice) })}</span>
                      <s aria-hidden="true" className="mr-2 text-sm font-medium text-offer">
                        {formatPrice(item.compareAtPrice)}
                      </s>
                    </>
                  )}
                  {formatPrice(item.price)}
                </span>
              </div>
              {note.length > 0 && <p className={`text-sm ${soldOut || item.availability.state === 'low' ? 'text-offer' : 'text-ink-soft'}`}>{note.join(' · ')}</p>}
            </div>
            {rich && (
              <div className="relative shrink-0">
                <AddToCart item={item} variant="compact" tone="quiet" />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
