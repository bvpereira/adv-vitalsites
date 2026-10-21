import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// This single-page site has only ~9 KiB of compressed CSS. Embed the complete
// stylesheet to avoid a blocking round trip without maintaining a second,
// easily outdated copy of critical styles. Share this path with local preview.
export async function renderHtml(root) {
  const [html, css] = await Promise.all([
    readFile(resolve(root, 'index.html'), 'utf8'),
    readFile(resolve(root, 'styles.css'), 'utf8'),
  ]);
  const stylesheet = '<link rel="stylesheet" href="styles.css">';
  if (!html.includes(stylesheet)) throw new Error('Stylesheet marker missing');
  // Keep responsive preload and <img> candidates identical so the browser
  // fetches just the selected variant, including on high-density displays.
  const hero = html.match(/<img class="hero-brand-logo"[^>]+>/)?.[0];
  const attribute = name => hero?.match(new RegExp(` ${name}="([^"]+)"`))?.[1];
  const [src, srcset, sizes] = ['src', 'srcset', 'sizes'].map(attribute);
  if (!src || !srcset || !sizes) throw new Error('Responsive hero image missing');
  const preload = `<link rel="preload" as="image" type="image/webp" href="${src}" imagesrcset="${srcset}" imagesizes="${sizes}" fetchpriority="high">`;
  return html.replace(stylesheet, () => `${preload}\n  <style data-site-styles>\n${css}\n</style>`);
}
