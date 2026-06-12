import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import express from 'express';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function routeToOutputFile(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  const normalized = route.replace(/^\//, '').replace(/\/+$/, '');
  return path.join(distDir, normalized, 'index.html');
}

async function run() {
  if (!fs.existsSync(distDir)) {
    throw new Error('dist/ not found. Run vite build first.');
  }

  const app = express();
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });

  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });

  const port = server.address().port;
  const origin = `http://127.0.0.1:${port}`;

  const productsModulePath = path.join(projectRoot, 'src', 'data', 'products.ts');
  const { PRODUCTS } = await import(pathToFileURL(productsModulePath).href);
  const infoPagesModulePath = path.join(projectRoot, 'src', 'data', 'infoPages.ts');
  const { INFO_PAGE_KEYS, INFO_PAGES } = await import(pathToFileURL(infoPagesModulePath).href);

  const routes = [
    '/',
    ...INFO_PAGE_KEYS.map((key) => INFO_PAGES[key].path),
    ...PRODUCTS.map((p) => `/products/${p.slug}`),
  ];

  const browser = await puppeteer.launch({
    headless: 'new',
  });

  try {
    const page = await browser.newPage();
    const siteOrigin = 'https://www.xrostao.shop';
    await page.evaluateOnNewDocument((originValue) => {
      // @ts-ignore
      window.__XR_SITE_ORIGIN = originValue;
    }, siteOrigin);

    for (const route of routes) {
      const url = `${origin}${route}`;
      await page.goto(url, { waitUntil: 'networkidle0' });

      try {
        await page.waitForFunction(() => {
          return (window && window.document && window.document.querySelector('link[rel="canonical"]'));
        }, { timeout: 5000 });
      } catch (e) {
        console.warn(`[prerender] Canonical link not found for ${route} (might be coming soon mode)`);
      }

      const html = await page.content();

      const outFile = routeToOutputFile(route);
      ensureDir(path.dirname(outFile));
      fs.writeFileSync(outFile, html, 'utf-8');
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

run().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
