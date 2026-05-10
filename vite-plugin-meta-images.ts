import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin that updates SEO tags with the correct deployment URL
 * and emits robots.txt + sitemap.xml for production builds.
 */
export function metaImagesPlugin(): Plugin {
  let outDir = '';

  return {
    name: 'vite-plugin-meta-images',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      const baseUrl = getDeploymentUrl();
      const publicDir = path.resolve(process.cwd(), 'client', 'public');
      const opengraphPngPath = path.join(publicDir, 'opengraph.png');
      const opengraphJpgPath = path.join(publicDir, 'opengraph.jpg');
      const opengraphJpegPath = path.join(publicDir, 'opengraph.jpeg');

      let imageExt: string | null = null;
      if (fs.existsSync(opengraphPngPath)) {
        imageExt = 'png';
      } else if (fs.existsSync(opengraphJpgPath)) {
        imageExt = 'jpg';
      } else if (fs.existsSync(opengraphJpegPath)) {
        imageExt = 'jpeg';
      }

      if (!imageExt) {
        log('[meta-images] OpenGraph image not found, skipping meta tag updates');
        return html;
      }

      const imageUrl = baseUrl
        ? `${baseUrl}/opengraph.${imageExt}`
        : `/opengraph.${imageExt}`;
      const logoUrl = baseUrl
        ? `${baseUrl}/favicon.png`
        : '/favicon.png';

      const canonicalUrl = baseUrl || '';

      if (!baseUrl) {
        log('[meta-images] no deployment domain found, using relative asset URLs');
      }

      log('[meta-images] updating SEO tags');

      html = html
        .replaceAll('__SITE_URL__', canonicalUrl)
        .replaceAll('__OG_IMAGE_URL__', imageUrl)
        .replaceAll('__LOGO_URL__', logoUrl);

      return html;
    },
    closeBundle() {
      const baseUrl = getDeploymentUrl();
      if (!outDir) {
        return;
      }

      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(
        path.join(outDir, 'robots.txt'),
        baseUrl
          ? `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`
          : `User-agent: *\nAllow: /\n`
      );

      if (!baseUrl) {
        log('[meta-images] generated robots.txt only; set VITE_SITE_URL to emit sitemap.xml');
        return;
      }

      fs.writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
      );
      log('[meta-images] generated robots.txt and sitemap.xml');
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
