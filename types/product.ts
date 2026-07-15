export type LocaleString = Record<string, string>;

export interface Product {
  id: string;
  name: LocaleString;
  description: LocaleString;
  category: LocaleString;
  stack: string[];
  image?: string;
  link?: string;
  appStoreLink?: string;
  playStoreLink?: string;
  githubLink?: string;
  wide?: boolean;
  tall?: boolean;
}
