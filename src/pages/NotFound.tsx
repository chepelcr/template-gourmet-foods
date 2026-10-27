import { Link } from 'wouter';
import { usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { JarFrame } from '@/components/JarFrame';

export default function NotFound() {
  const { t } = useI18n();
  usePageMeta(t('notFound.title'));
  return (
    <div className="page grid items-center gap-10 pt-14 md:grid-cols-12">
      <div className="md:col-span-7">
        <h1 className="text-[clamp(2.5rem,6.5vw,4.5rem)] text-heading">{t('notFound.title')}</h1>
        <p className="mt-4 max-w-md text-lg text-ink-soft">{t('notFound.body')}</p>
        <Link href="/" className="btn btn-strong mt-7">
          {t('notFound.cta')}
        </Link>
      </div>
      <div className="md:col-span-5">
        <JarFrame src={null} className="mx-auto w-[min(15rem,60vw)]" />
      </div>
    </div>
  );
}
