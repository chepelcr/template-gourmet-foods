import { Link } from 'wouter';
import { catalogHref, categoriesWithItems, featuredItems, homeContent, paragraphs, useCatalog, useCmsPage, usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { CmsIcon } from '@/components/CmsIcon';
import { HeroLabel } from '@/components/HeroLabel';
import { JarCard, JarCardSkeleton } from '@/components/JarCard';
import { JarFrame } from '@/components/JarFrame';
import { MenuList } from '@/components/MenuList';
import { Placeholder } from '@/components/Placeholder';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';
import { swatch } from '@/components/swatch';

const PER_SECTION = 4;

export default function Home() {
  const { t } = useI18n();
  const cms = useCmsPage('home');
  const home = homeContent(cms.page);
  const catalog = useCatalog();
  usePageMeta(cms.page?.title, cms.page?.metaDescription);

  const featured = featuredItems(catalog.items, 8);
  const sections = categoriesWithItems(catalog.categories, catalog.items);
  const categoryOf = (id: string | null) => catalog.categories.find((c) => c.id === id);
  const story = paragraphs(home.story.content);

  return (
    <>
      <section className="on-deep bg-surface-deep text-ink-on-deep">
        <div className="page grid items-center gap-x-8 gap-y-10 pb-16 pt-6 md:grid-cols-12 md:pb-20 md:pt-10">
          <div className={home.hero.image ? 'md:col-span-7' : 'md:col-span-10 md:col-start-2'}>
            {cms.isLoading ? (
              <div aria-hidden="true" className="skeleton-deep h-[26rem] rounded-[50%/34%]" />
            ) : cms.isError ? (
              <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
            ) : (
              <HeroLabel>
                {home.hero.badge && <p className="font-bold text-accent-text">{home.hero.badge}</p>}
                {home.hero.title && <h1 className="mt-3 text-[clamp(2.3rem,5.5vw,4.25rem)] text-heading">{home.hero.title}</h1>}
                {home.hero.subtitle && <p className="mx-auto mt-5 max-w-[34rem] text-lg text-ink-soft">{home.hero.subtitle}</p>}
                {/* Stacked on phones and kept near the centre on the oval, so buttons never reach the label's curved edge. */}
                <div className="mt-8 flex flex-col gap-3 sm:mx-auto sm:max-w-[78%] sm:flex-row sm:flex-wrap sm:justify-center">
                  {home.hero.ctaPrimary && (
                    <Link href="/products" className="btn btn-accent w-full text-center sm:w-auto">
                      {home.hero.ctaPrimary}
                    </Link>
                  )}
                  {home.hero.ctaSecondary && (
                    <Link href="/contact" className="btn btn-strong w-full text-center sm:w-auto">
                      {home.hero.ctaSecondary}
                    </Link>
                  )}
                </div>
              </HeroLabel>
            )}
          </div>
          {home.hero.image && (
            <div className="md:col-span-5">
              <JarFrame src={home.hero.image} priority sizes="(min-width: 768px) 22rem, 78vw" className="mx-auto w-[min(22rem,78vw)]" />
            </div>
          )}
        </div>
      </section>

      {(sections.length > 0 || catalog.isLoading) && (
        <section aria-labelledby={home.categories.title ? 'home-carta' : undefined} className="page pt-16">
          <div className="menu-card px-6 py-10 sm:px-12 sm:py-14">
            {(home.categories.title || home.categories.subtitle) && (
              <header className="mx-auto max-w-2xl text-center">
                {home.categories.title && (
                  <h2 id="home-carta" className="text-[clamp(2.2rem,5vw,3.5rem)] text-heading">
                    {home.categories.title}
                  </h2>
                )}
                {home.categories.subtitle && <p className="mt-2 text-lg text-ink-soft">{home.categories.subtitle}</p>}
              </header>
            )}
            {catalog.isLoading ? (
              <div aria-hidden="true" className="mt-10 grid gap-10 md:grid-cols-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="skeleton h-8 w-40" />
                    <div className="skeleton h-5 w-full" />
                    <div className="skeleton h-5 w-full" />
                  </div>
                ))}
              </div>
            ) : catalog.isError ? (
              <div className="mt-8">
                <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
              </div>
            ) : (
              <div className="mt-10 grid gap-x-14 gap-y-12 md:grid-cols-2">
                {sections.map((category, index) => {
                  const items = catalog.items.filter((i) => i.categoryId === category.id);
                  return (
                    <section key={category.id} aria-labelledby={`carta-${category.id}`}>
                      <h3 id={`carta-${category.id}`} className="flex items-center gap-3 text-2xl text-heading">
                        <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0 rounded-full shadow-[0_0_0_1.5px_var(--rule)]" style={{ background: swatch(category, index) }} />
                        <Link href={catalogHref({ category: category.key })} className="hover:underline">
                          {category.name}
                        </Link>
                      </h3>
                      {category.description && <p className="mt-1 text-ink-soft">{category.description}</p>}
                      <div className="mt-3">
                        <MenuList items={items.slice(0, PER_SECTION)} />
                      </div>
                      {items.length > PER_SECTION && (
                        <Link href={catalogHref({ category: category.key })} className="mt-2 inline-flex min-h-tap items-center font-bold text-accent-text hover:underline">
                          {t('catalog.inCategory', { category: category.name })}
                        </Link>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <section aria-labelledby={home.featured.title ? 'home-shelf' : undefined} className="on-deep mt-20 bg-surface-deep py-16 text-ink-on-deep md:py-20">
        <div className="page">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              {home.featured.badge && <p className="mb-2 font-bold text-[color:var(--gf-saffron)]">{home.featured.badge}</p>}
              {home.featured.title && (
                <h2 id="home-shelf" className="text-[clamp(2.1rem,4.5vw,3.25rem)]">
                  {home.featured.title}
                </h2>
              )}
              {home.featured.subtitle && <p className="mt-2 text-lg text-ink-on-deep-soft">{home.featured.subtitle}</p>}
            </div>
            {catalog.items.length > 0 && (
              <Link href="/products" className="btn btn-on-deep">
                {t('catalog.viewAll')}
              </Link>
            )}
          </div>
          {catalog.isLoading ? (
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <JarCardSkeleton key={i} />
              ))}
            </div>
          ) : catalog.isError ? null : featured.length === 0 ? (
            <p className="text-ink-on-deep-soft">{t('catalog.empty.store')}</p>
          ) : (
            <ul className="shelf-grid grid-cols-2 pb-5 lg:grid-cols-4">
              {featured.map((item) => (
                <li key={item.id}>
                  <JarCard item={item} category={categoryOf(item.categoryId)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {home.benefits.length > 0 && (
        <section className="page pt-20">
          <ul className="grid gap-8 md:grid-cols-3">
            {home.benefits.map((benefit) => (
              <li key={benefit.title} className="flex gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[color:var(--accent)] text-[color:var(--accent-ink)] shadow-[0_0_0_4px_var(--surface),0_0_0_5.5px_var(--accent)]">
                  <CmsIcon icon={benefit.icon} className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="text-xl text-heading">{benefit.title}</h3>
                  {benefit.description && <p className="mt-1 text-ink-soft">{benefit.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(home.story.title || story.length > 0) && (
        <section className="page pt-20">
          <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-12">
            {home.story.image && (
              <div className="frame aspect-[4/3] bg-surface-quiet shadow-soft md:col-span-6">
                <StoreImage src={home.story.image} alt="" sizes="(min-width: 768px) 45vw, 100vw" maxWidth={1280} fallback={<Placeholder />} />
              </div>
            )}
            <div className={home.story.image ? 'md:col-span-6' : 'md:col-span-9'}>
              {home.story.title && <h2 className="text-[clamp(2.1rem,4.5vw,3.25rem)] text-heading">{home.story.title}</h2>}
              <div className="mt-4 flex max-w-[60ch] flex-col gap-3 text-lg text-ink-soft">
                {story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Link href="/about" className="btn btn-quiet mt-7">
                {t('nav.about')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {(home.cta.title || home.cta.description) && (
        <section className="page pt-20">
          <div className="flex flex-col gap-6 rounded-frame bg-[color:var(--accent)] p-8 text-[color:var(--accent-ink)] md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-xl">
              {home.cta.title && <h2 className="text-[clamp(2rem,4vw,2.75rem)]">{home.cta.title}</h2>}
              {home.cta.description && <p className="mt-2 text-lg font-medium">{home.cta.description}</p>}
            </div>
            {home.cta.buttonText && (
              <Link href="/contact" className="btn btn-strong shrink-0">
                {home.cta.buttonText}
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}
