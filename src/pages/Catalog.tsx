import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  productsContent,
  showsKindFilter,
  showsOfferFilter,
  useCatalogView,
  useCmsPage,
  usePageMeta,
  type CatalogCategory,
  type CatalogFacets,
  type CatalogItem,
  type CatalogParams,
  type ItemKind,
  type SetCatalogParams,
  type SortKey,
} from '@/core';
import { useI18n } from '@/i18n';
import { JarCard, JarCardSkeleton } from '@/components/JarCard';
import { MenuList } from '@/components/MenuList';
import { Sheet } from '@/components/Sheet';
import { SectionError } from '@/components/StoreStates';
import { swatch } from '@/components/swatch';

const SORTS: SortKey[] = ['featured', 'newest', 'price-asc', 'price-desc', 'name'];
const VIEW_KEY = 'tsuru:catalog-view';
type View = 'shelf' | 'carta';

function readView(): View {
  try {
    return window.localStorage.getItem(VIEW_KEY) === 'carta' ? 'carta' : 'shelf';
  } catch {
    return 'shelf';
  }
}

const chip =
  'inline-flex min-h-tap shrink-0 items-center gap-2 rounded-full bg-surface-raised px-4 font-bold text-heading shadow-[inset_0_0_0_2px_var(--rule)] transition-colors hover:shadow-[inset_0_0_0_2px_var(--heading)] aria-pressed:bg-surface-deep aria-pressed:text-ink-on-deep aria-pressed:shadow-none';

/** Type, offers and order: inline on wide screens, in a sheet on phones. */
function Refine({ params, setParams, facets, idPrefix, stacked }: { params: CatalogParams; setParams: SetCatalogParams; facets: CatalogFacets; idPrefix: string; stacked: boolean }) {
  const { t } = useI18n();
  const kinds: Array<{ value: ItemKind | null; key: string }> = [
    { value: null, key: 'catalog.kind.all' },
    { value: 'product', key: 'catalog.kind.product' },
    { value: 'service', key: 'catalog.kind.service' },
  ];
  return (
    <div className={stacked ? 'flex flex-col gap-7' : 'flex flex-wrap items-center gap-3'}>
      {showsKindFilter(facets) && (
        <div role="group" aria-labelledby={`${idPrefix}-kind`} className={stacked ? '' : 'flex items-center gap-2'}>
          <p id={`${idPrefix}-kind`} className={stacked ? 'mb-2 font-bold text-heading' : 'sr-only'}>
            {t('catalog.kind')}
          </p>
          <div className="flex flex-wrap gap-2">
            {kinds.map(({ value, key }) => (
              <button key={key} type="button" aria-pressed={params.kind === value} className={chip} onClick={() => setParams({ kind: value })}>
                {t(key)}
              </button>
            ))}
          </div>
        </div>
      )}
      {showsOfferFilter(facets) && (
        <label className="inline-flex min-h-tap cursor-pointer items-center gap-3 font-bold text-heading">
          <input type="checkbox" className="h-5 w-5 accent-[color:var(--focus)]" checked={params.sale} onChange={(e) => setParams({ sale: e.target.checked })} />
          {t('catalog.offers')}
        </label>
      )}
      <div className={stacked ? '' : 'ml-auto'}>
        <label htmlFor={`${idPrefix}-sort`} className={stacked ? 'mb-2 block font-bold text-heading' : 'sr-only'}>
          {t('catalog.sort')}
        </label>
        <select id={`${idPrefix}-sort`} className={`field ${stacked ? '' : 'w-auto min-w-[13rem]'}`} value={params.sort} onChange={(e) => setParams({ sort: e.target.value as SortKey })}>
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {t(`catalog.sort.${s}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Results({ items, view, categoryOf }: { items: CatalogItem[]; view: View; categoryOf: (id: string | null) => CatalogCategory | undefined }) {
  if (view === 'carta') {
    return (
      <div className="menu-card px-5 py-4 sm:px-8 sm:py-6">
        <MenuList items={items} rich />
      </div>
    );
  }
  return (
    <ul className="shelf-grid grid-cols-2 pb-5 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.id}>
          <JarCard item={item} category={categoryOf(item.categoryId)} />
        </li>
      ))}
    </ul>
  );
}

export default function Catalog() {
  const { t, plural } = useI18n();
  const cms = useCmsPage('products');
  const content = productsContent(cms.page);
  usePageMeta(cms.page?.title ?? t('catalog.title'), cms.page?.metaDescription);
  const { catalog, params, setParams, query, setQuery, facets, categories, results, active, grouped, selected, uncategorized, categoryOf, clearAll } =
    useCatalogView();
  const [refineOpen, setRefineOpen] = useState(false);
  const [view, setView] = useState<View>('shelf');

  useEffect(() => setView(readView()), []);
  const chooseView = (next: View) => {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Storage blocked: the choice lasts for this page only.
    }
  };
  const segment =
    'inline-grid min-h-tap min-w-tap place-items-center rounded-full text-ink-soft hover:text-heading aria-pressed:bg-surface-deep aria-pressed:text-ink-on-deep';

  return (
    <>
      <div className="page pt-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 max-w-full md:max-w-3xl">
            {cms.isLoading ? (
              <div aria-hidden="true" className="flex flex-col gap-3">
                <div className="skeleton h-14 w-72 max-w-full" />
                <div className="skeleton h-5 w-96 max-w-full" />
              </div>
            ) : (
              <>
                <h1 className="text-[clamp(2.5rem,6.5vw,4.5rem)] text-heading">{content.hero.title ?? t('catalog.title')}</h1>
                {content.hero.subtitle && <p className="mt-3 text-lg text-ink-soft">{content.hero.subtitle}</p>}
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <p aria-live="polite" className="font-bold text-heading">
              {catalog.isLoading ? t('state.loading') : plural('catalog.results', results.length)}
              {selected && <span className="font-normal text-ink-soft"> · {selected.name}</span>}
            </p>
            <div role="group" aria-label={t('catalog.view')} className="flex rounded-full bg-surface-raised p-1 shadow-[inset_0_0_0_2px_var(--rule)]">
              <button type="button" aria-pressed={view === 'shelf'} className={segment} onClick={() => chooseView('shelf')} aria-label={t('catalog.view.shelf')}>
                <LayoutGrid aria-hidden="true" className="h-4 w-4" />
              </button>
              <button type="button" aria-pressed={view === 'carta'} className={segment} onClick={() => chooseView('carta')} aria-label={t('catalog.view.carta')}>
                <List aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="mt-8 flex flex-col gap-4">
          <div className="flex gap-3">
            <label htmlFor="catalog-search" className="sr-only">
              {t('catalog.search')}
            </label>
            <div className="relative min-w-0 flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input id="catalog-search" type="search" className="field rounded-full pl-11" placeholder={t('catalog.search.placeholder')} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <button type="button" className="btn btn-strong px-4 md:hidden" onClick={() => setRefineOpen(true)}>
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
              {t('catalog.filters')}
            </button>
          </div>
          <div className="hidden md:block">
            <Refine params={params} setParams={setParams} facets={facets} idPrefix="bar" stacked={false} />
          </div>
          {categories.length > 1 && (
            <div role="group" aria-label={t('catalog.category')} className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
              <button type="button" aria-pressed={!params.category} className={chip} onClick={() => setParams({ category: null })}>
                {t('catalog.category.all')}
                <span className="tabular-nums opacity-70">{facets.total}</span>
              </button>
              {categories.map((c, index) => (
                <button key={c.id} type="button" aria-pressed={params.category === c.key} className={chip} onClick={() => setParams({ category: c.key })}>
                  <span aria-hidden="true" className="h-3 w-3 rounded-full shadow-[0_0_0_1.5px_var(--rule)]" style={{ background: swatch(c, index) }} />
                  {c.name}
                  <span className="tabular-nums opacity-70">{facets.categories.get(c.id) ?? 0}</span>
                </button>
              ))}
            </div>
          )}
          {active && (
            <button type="button" className="btn btn-quiet w-fit px-4 text-sm" onClick={clearAll}>
              <X aria-hidden="true" className="h-4 w-4" />
              {t('catalog.filters.clear')}
            </button>
          )}
        </div>

        {selected?.description && !grouped && <p className="mt-6 max-w-2xl text-lg text-ink-soft">{selected.description}</p>}

        <div className="mt-12">
          {catalog.isLoading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <JarCardSkeleton key={i} />
              ))}
            </div>
          ) : catalog.isError ? (
            <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
          ) : catalog.items.length === 0 ? (
            <p className="menu-card p-8 text-ink-soft">{t('catalog.empty.store')}</p>
          ) : results.length === 0 ? (
            <div className="menu-card flex flex-col items-start gap-3 p-8 sm:p-10">
              <p className="font-display text-2xl font-bold text-heading">{t('catalog.empty.title')}</p>
              <p className="text-ink-soft">{t('catalog.empty.body')}</p>
              <button type="button" className="btn btn-strong mt-2" onClick={clearAll}>
                {t('catalog.filters.clear')}
              </button>
            </div>
          ) : grouped ? (
            <div className="flex flex-col gap-16">
              {categories.map((category, index) => {
                const items = results.filter((i) => i.categoryId === category.id);
                if (!items.length) return null;
                return (
                  <section key={category.id} aria-labelledby={`shelf-${category.id}`}>
                    <div className="mb-8 flex items-baseline gap-3">
                      <span aria-hidden="true" className="h-4 w-4 shrink-0 self-center rounded-full shadow-[0_0_0_1.5px_var(--rule)]" style={{ background: swatch(category, index) }} />
                      <h2 id={`shelf-${category.id}`} className="text-[clamp(1.8rem,3.5vw,2.5rem)] text-heading">
                        {category.name}
                      </h2>
                      <span aria-hidden="true" className="leader hidden sm:block" />
                      {category.description && <p className="hidden text-ink-soft sm:block">{category.description}</p>}
                    </div>
                    <Results items={items} view={view} categoryOf={() => undefined} />
                  </section>
                );
              })}
              {uncategorized.length > 0 && <Results items={uncategorized} view={view} categoryOf={categoryOf} />}
            </div>
          ) : (
            <Results items={results} view={view} categoryOf={selected ? () => undefined : categoryOf} />
          )}
        </div>
      </div>

      <Sheet
        open={refineOpen}
        onOpenChange={setRefineOpen}
        title={t('catalog.filters')}
        footer={
          <button type="button" className="btn btn-accent w-full" onClick={() => setRefineOpen(false)}>
            {plural('catalog.filters.show', results.length)}
          </button>
        }
      >
        <Refine params={params} setParams={setParams} facets={facets} idPrefix="sheet" stacked />
      </Sheet>
    </>
  );
}
