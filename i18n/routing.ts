import {defineRouting} from 'next-intl/routing';

export const localeDetails = {
  en: {flag: '🇬🇧', nativeLabel: 'English', ogLocale: 'en_US'},
  vi: {flag: '🇻🇳', nativeLabel: 'Tiếng Việt', ogLocale: 'vi_VN'},
  hi: {flag: '🇮🇳', nativeLabel: 'हिन्दी', ogLocale: 'hi_IN'},
  km: {flag: '🇰🇭', nativeLabel: 'ខ្មែរ', ogLocale: 'km_KH'},
  th: {flag: '🇹🇭', nativeLabel: 'ไทย', ogLocale: 'th_TH'},
  id: {flag: '🇮🇩', nativeLabel: 'Bahasa Indonesia', ogLocale: 'id_ID'},
  fil: {flag: '🇵🇭', nativeLabel: 'Filipino', ogLocale: 'fil_PH'},
  de: {flag: '🇩🇪', nativeLabel: 'Deutsch', ogLocale: 'de_DE'},
  fr: {flag: '🇫🇷', nativeLabel: 'Français', ogLocale: 'fr_FR'}
} as const;

export const routing = defineRouting({
  defaultLocale: 'en',
  locales: ['en', 'vi', 'hi', 'km', 'th', 'id', 'fil', 'de', 'fr']
});

export type Locale = (typeof routing.locales)[number];
