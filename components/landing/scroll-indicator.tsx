import {ArrowDown} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function ScrollIndicator() {
  const t = await getTranslations('Home');

  return (
    <div className="flex flex-col items-center gap-2 text-copy/70 text-xs mt-6">
      <div className="w-8 h-8 rounded-full border border-copy/20 flex items-center justify-center">
        <ArrowDown className="w-4 h-4" />
      </div>
      <span>{t('scrollToExplore')}</span>
    </div>
  );
}
