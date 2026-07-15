import {Users, Code, Download, ShieldCheck} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

const icons = [Users, Code, Download, ShieldCheck];

export default async function StatsBar() {
  const t = await getTranslations('Home');

  const stats = [
    {value: t('stat1Value'), label: t('stat1Label'), sub: t('stat1Sub')},
    {value: t('stat2Value'), label: t('stat2Label'), sub: t('stat2Sub')},
    {value: t('stat3Value'), label: t('stat3Label'), sub: t('stat3Sub')},
    {value: t('stat4Value'), label: t('stat4Label'), sub: t('stat4Sub')},
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center px-4 sm:px-6 translate-y-1/2">
      <div className="bg-white/85 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 px-6 sm:px-10 py-5 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4 sm:gap-x-12 max-w-4xl w-full">
        {stats.map((stat, i) => {
          const Icon = icons[i];
          return (
            <div key={i} className="flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-heading/10 flex items-center justify-center mt-0.5">
                <Icon className="w-4.5 h-4.5 text-heading" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-ink tracking-tight leading-none">{stat.value}</div>
                <div className="text-xs font-semibold text-ink mt-1">{stat.label}</div>
                <div className="text-[10px] text-copy mt-0.5">{stat.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
