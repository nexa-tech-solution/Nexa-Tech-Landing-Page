import type {Metadata, Viewport} from 'next';
import '../globals.css';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {localeDetails, routing} from '@/i18n/routing';

const languageAlternates = Object.fromEntries(routing.locales.map((locale) => [locale, `/${locale}`]));

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata(props: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: 'Metadata'});

  return {
    title: {
      default: t('title'),
      template: '%s | Nexa Tech'
    },
    description: t('description'),
    keywords: t('keywords').split(',').map((keyword) => keyword.trim()),
    applicationName: 'Nexa Tech',
    category: 'technology',
    robots: {
      index: true,
      follow: true
    },
    icons: {
      icon: [
        {url: '/favicon.ico'},
        {url: '/favicon.png', type: 'image/png'}
      ],
      shortcut: '/favicon.ico',
      apple: '/favicon.png'
    },
    alternates: {
      canonical: `/${locale}`,
      languages: languageAlternates
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      siteName: 'Nexa Tech',
      locale: localeDetails[locale].ogLocale
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description')
    }
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#edf1ea'
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>;

export default async function RootLayout({children, params}: RootLayoutProps) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@100..900&family=Noto+Sans+Thai:wght@100..900&family=Noto+Sans+Devanagari:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
