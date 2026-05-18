import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const publicSitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
const distSitemapPath = path.join(distDir, 'sitemap.xml');
const siteOrigin = (process.env.PRERENDER_SITE_ORIGIN || process.env.VITE_SITE_ORIGIN || 'https://xrostaofficial.onrender.com').replace(/\/$/, '');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function xmlEscape(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function run() {
  const { PRODUCTS } = await import(pathToFileURL(path.join(projectRoot, 'src', 'data', 'products.ts')).href);
  const { INFO_PAGE_KEYS, INFO_PAGES } = await import(pathToFileURL(path.join(projectRoot, 'src', 'data', 'infoPages.ts')).href);

  const routes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    ...INFO_PAGE_KEYS.map((key) => ({
      path: INFO_PAGES[key].path,
      priority: '0.7',
      changefreq: 'monthly',
    })),
    ...PRODUCTS.map((product) => ({
      path: `/products/${product.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url>
    <loc>${xmlEscape(`${siteOrigin}${route.path}`)}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  ensureDir(path.dirname(publicSitemapPath));
  fs.writeFileSync(publicSitemapPath, xml, 'utf8');

  if (fs.existsSync(distDir)) {
    ensureDir(path.dirname(distSitemapPath));
    fs.writeFileSync(distSitemapPath, xml, 'utf8');
  }
}

run().catch((error) => {
  console.error('[generate-sitemap] failed:', error);
  process.exit(1);
});
