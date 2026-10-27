import * as Dialog from '@radix-ui/react-dialog';
import { Menu, ShoppingBasket, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart, useCartTotals, useIsDemo, useStore } from '@/core';
import { useI18n } from '@/i18n';
import { BASKET_EVENT } from './AddToCart';

export const NAV = [
  { href: '/', key: 'nav.home' },
  { href: '/products', key: 'nav.catalog' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
] as const;

export function useIsActive() {
  const [location] = useLocation();
  return (href: string) => (href === '/' ? location === '/' : location === href || location.startsWith(`${href}/`));
}

/** Without a logo the store gets a saffron seal with its initial. */
function StoreMark() {
  const { organization, theme } = useStore();
  const logo = theme?.logoUrl ?? organization?.logoUrl ?? null;
  if (!organization) return <span aria-hidden="true" className="skeleton-deep block h-8 w-40" />;
  return (
    <span className="flex items-center gap-3">
      {logo ? (
        <img src={logo} alt="" className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--accent)] font-display text-xl font-bold text-[color:var(--accent-ink)] shadow-[0_0_0_3px_var(--gf-aubergine),0_0_0_4.5px_var(--accent)]">
          {organization.name.trim().slice(0, 1)}
        </span>
      )}
      <span className="font-display text-xl font-bold leading-none sm:text-2xl">{organization.name}</span>
    </span>
  );
}

export function Header() {
  const { t, plural } = useI18n();
  const isDemo = useIsDemo();
  const { count } = useCartTotals();
  const openCart = useCart((s) => s.open);
  const isActive = useIsActive();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adds, setAdds] = useState(0);

  useEffect(() => {
    const onAdded = () => setAdds((n) => n + 1);
    window.addEventListener(BASKET_EVENT, onAdded);
    return () => window.removeEventListener(BASKET_EVENT, onAdded);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header className="on-deep relative z-30 bg-surface-deep text-ink-on-deep">
      {isDemo && <p className="bg-surface-deep-raised px-4 py-1.5 text-center text-sm text-ink-on-deep-soft">{t('demo.notice')}</p>}
      <div className="page flex h-16 items-center gap-3 sm:h-20">
        <Link href="/" className="rounded-full py-1 pr-2">
          <StoreMark />
        </Link>

        <nav aria-label={t('nav.primary')} className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className="relative flex min-h-tap items-center px-3.5 font-bold text-ink-on-deep-soft transition-colors after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-[3px] after:rounded-full hover:text-ink-on-deep aria-[current=page]:text-ink-on-deep aria-[current=page]:after:bg-[color:var(--accent)]"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" onClick={openCart} className="btn btn-accent ml-auto gap-2.5 pl-4 pr-2 md:ml-4">
          <ShoppingBasket key={adds} aria-hidden="true" className={`h-5 w-5 ${adds ? 'seal-stamp' : ''}`} />
          <span className="hidden sm:inline">{t('nav.cart')}</span>
          <span aria-hidden="true" className="grid h-7 min-w-[1.75rem] place-items-center rounded-full bg-surface-deep px-1.5 text-sm font-bold tabular-nums text-ink-on-deep">
            {count}
          </span>
          <span className="sr-only">{plural('nav.cart.count', count)}</span>
        </button>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger className="icon-btn hover:bg-surface-deep-raised md:hidden" aria-label={t('nav.menu')}>
            <Menu aria-hidden="true" className="h-6 w-6" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="overlay fixed inset-0 z-40 bg-[color:var(--scrim)]" />
            <Dialog.Content className="sheet fixed inset-x-0 bottom-0 z-50 rounded-t-[1.75rem] bg-surface px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-display text-2xl text-heading">{t('nav.menu')}</Dialog.Title>
                <Dialog.Description className="sr-only">{t('nav.primary')}</Dialog.Description>
                <Dialog.Close className="icon-btn -mr-2 text-heading hover:bg-surface-quiet" aria-label={t('nav.close')}>
                  <X aria-hidden="true" className="h-6 w-6" />
                </Dialog.Close>
              </div>
              <nav aria-label={t('nav.primary')} className="mt-3">
                <ul className="flex flex-col">
                  {NAV.map(({ href, key }) => (
                    <li key={href}>
                      <Link href={href} aria-current={isActive(href) ? 'page' : undefined} className="flex min-h-[3.25rem] items-baseline gap-2 font-display text-2xl text-heading">
                        {t(key)}
                        <span aria-hidden="true" className="leader" />
                        {isActive(href) && <span aria-hidden="true" className="h-3 w-3 self-center rounded-full bg-[color:var(--accent)]" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
