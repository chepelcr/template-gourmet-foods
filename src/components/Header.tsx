import * as Dialog from '@radix-ui/react-dialog';
import { Menu, ShoppingBasket, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart, useCartTotals, useIsDemo, useStore, useStoreName } from '@/core';
import { useI18n } from '@/i18n';
import { BASKET_EVENT } from './AddToCart';
import { ThemeToggle } from './ThemeToggle';

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
  const name = useStoreName();
  const logo = theme?.logoUrl ?? organization?.logoUrl ?? null;
  if (!name) return <span aria-hidden="true" className="skeleton-deep block h-8 w-24 max-w-full" />;
  return (
    <span className="flex w-full min-w-0 items-center gap-2">
      {logo ? (
        <img src={logo} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover sm:h-10 sm:w-10" />
      ) : (
        <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--accent)] font-display text-xl font-bold text-[color:var(--accent-ink)] shadow-[0_0_0_3px_var(--gf-aubergine),0_0_0_4.5px_var(--accent)] sm:h-10 sm:w-10">
          {name.trim().slice(0, 1)}
        </span>
      )}
      <span className="font-display font-bold sm:text-2xl min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-base leading-tight">{name}</span>
    </span>
  );
}

export function Header() {
  const { t, plural } = useI18n();
  const name = useStoreName();
  const isDemo = useIsDemo();
  const { count } = useCartTotals();
  const openCart = useCart((s) => s.open);
  const isActive = useIsActive();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [adds, setAdds] = useState(0);

  useEffect(() => {
    const onAdded = () => setAdds((n) => n + 1);
    window.addEventListener(BASKET_EVENT, onAdded);
    return () => window.removeEventListener(BASKET_EVENT, onAdded);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header ref={headerRef} className="on-deep relative z-30 bg-surface-deep text-ink-on-deep">
      {isDemo && <p className="bg-surface-deep-raised px-4 py-1.5 text-center text-sm text-ink-on-deep-soft">{t('demo.notice')}</p>}
      <div className="page flex min-h-14 items-center gap-2 sm:min-h-16 py-1">
        <Link href="/" title={name || undefined} aria-label={name || undefined} className="flex min-h-tap items-center min-w-0 flex-1 rounded-full lg:flex-initial lg:max-w-[16rem]">
          <StoreMark />
        </Link>

        <nav aria-label={t('nav.primary')} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className="relative flex min-h-tap items-center px-3 font-bold text-ink-on-deep-soft transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-[3px] after:rounded-full hover:text-ink-on-deep aria-[current=page]:text-ink-on-deep aria-[current=page]:after:bg-[color:var(--accent)]"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />

        <button type="button" onClick={openCart} className="btn btn-accent shrink-0 gap-1.5 px-2 lg:gap-2.5 lg:pl-4">
          <ShoppingBasket key={adds} aria-hidden="true" className={`h-5 w-5 ${adds ? 'seal-stamp' : ''}`} />
          <span className="hidden lg:inline">{t('nav.cart')}</span>
          <span aria-hidden="true" className="grid h-6 min-w-[1.5rem] place-items-center rounded-full bg-surface-deep px-1.5 text-sm font-bold tabular-nums text-ink-on-deep">
            {count}
          </span>
          <span className="sr-only">{plural('nav.cart.count', count)}</span>
        </button>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger className="icon-btn shrink-0 hover:bg-surface-deep-raised lg:hidden" aria-label={t('nav.menu')}>
            <Menu aria-hidden="true" className="h-6 w-6" />
          </Dialog.Trigger>
          <Dialog.Portal container={headerRef.current}>
            <Dialog.Overlay className="overlay fixed inset-0 z-40 bg-[color:var(--scrim)]" />
            <Dialog.Content className="nav-menu fixed inset-x-0 top-0 z-50 max-h-dvh overflow-y-auto overscroll-contain rounded-b-2xl bg-surface px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] text-ink shadow-lift">
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-display text-xl text-heading">{t('nav.menu')}</Dialog.Title>
                <Dialog.Description className="sr-only">{t('nav.primary')}</Dialog.Description>
                <Dialog.Close className="icon-btn -mr-2 text-heading hover:bg-surface-quiet" aria-label={t('nav.close')}>
                  <X aria-hidden="true" className="h-6 w-6" />
                </Dialog.Close>
              </div>
              <nav aria-label={t('nav.primary')} className="mt-1">
                <ul className="flex flex-col">
                  {NAV.map(({ href, key }) => (
                    <li key={href}>
                      <Link href={href} onClick={() => setMenuOpen(false)} aria-current={isActive(href) ? 'page' : undefined} className="flex min-h-tap items-center gap-2 font-display text-xl text-heading decoration-2 underline-offset-4 aria-[current=page]:text-accent-text aria-[current=page]:underline">
                        {t(key)}
                        <span aria-hidden="true" className="leader" />
                        {isActive(href) && <span aria-hidden="true" className="h-3 w-3 self-center rounded-full bg-accent-text" />}
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
