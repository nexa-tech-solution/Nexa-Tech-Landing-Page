import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin that fills the SEO placeholders in index.html with the deployment URL.
 * robots.txt and sitemaps are emitted by scripts/prerender.mjs.
 */
export function metaImagesPlugin(): Plugin {
  return {
    name: 'vite-plugin-meta-images',
    transformIndexHtml(html) {
      const baseUrl = getDeploymentUrl() ?? '';
      const publicDir = path.resolve(process.cwd(), 'client', 'public');
      const imageExt = ['webp', 'png', 'jpg', 'jpeg'].find((ext) =>
        fs.existsSync(path.join(publicDir, `opengraph.${ext}`))
      );

      if (!baseUrl) {
        log('[meta-images] no VITE_SITE_URL, using relative URLs');
      }

      return html
        .replaceAll('__SITE_URL__', baseUrl)
        .replaceAll('__OG_IMAGE_URL__', imageExt ? `${baseUrl}/opengraph.${imageExt}?v=2` : '')
        .replaceAll('__LOGO_URL__', `${baseUrl}/favicon.webp`);
    },
  };
}

function getDeploymentUrl(): string | null {
  if (process.env.VITE_SITE_URL) {
    const normalized = normalizeBaseUrl(process.env.VITE_SITE_URL);
    log('[meta-images] using VITE_SITE_URL:', normalized);
    return normalized;
  }

  return null;
}

function normalizeBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

function log(...args: any[]): void {
  if (process.env.NODE_ENV === 'production') {
    console.log(...args);
  }
}
