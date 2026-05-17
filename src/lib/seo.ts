export const SITE_NAME = 'xrostao clothing';
export const DEFAULT_SITE_ORIGIN = 'https://xrostao-site.onrender.com';
export const DEFAULT_SEO_KEYWORDS = [
  'xrostao clothing',
  'xrostao',
  'χροσταω',
  'χροσταω clothing',
  't-shirts',
  'ρούχα',
  'streetwear',
  'anergia season',
];

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

const URL_LIKE_KEYS = new Set([
  'url',
  'image',
  'logo',
  'item',
  'contentUrl',
  'thumbnailUrl',
  'embedUrl',
  'mainEntityOfPage',
]);

export function getSiteOrigin() {
  if (typeof window !== 'undefined') {
    const winOrigin = (window as unknown as { __XR_SITE_ORIGIN?: unknown }).__XR_SITE_ORIGIN;
    if (typeof winOrigin === 'string' && /^https?:\/\//i.test(winOrigin)) return winOrigin.replace(/\/$/, '');
    if (window.location?.origin) return window.location.origin.replace(/\/$/, '');
  }

  const envOrigin = ((import.meta as unknown as { env?: Record<string, unknown> }).env?.VITE_SITE_ORIGIN as string | undefined);
  if (envOrigin && /^https?:\/\//i.test(envOrigin)) return envOrigin.replace(/\/$/, '');

  return DEFAULT_SITE_ORIGIN;
}

export function toAbsoluteUrl(value?: string | null) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${getSiteOrigin()}${normalizedPath}`;
}

export function normalizeJsonLd<T>(value: T): T {
  function normalizeEntry(entry: unknown, parentKey?: string): unknown {
    if (typeof entry === 'string') {
      if (entry.startsWith('/') && parentKey && URL_LIKE_KEYS.has(parentKey)) {
        return toAbsoluteUrl(entry) ?? entry;
      }

      return entry;
    }

    if (Array.isArray(entry)) {
      return entry.map((item) => normalizeEntry(item, parentKey));
    }

    if (!entry || typeof entry !== 'object') return entry;

    return Object.fromEntries(
      Object.entries(entry).map(([key, val]) => [key, normalizeEntry(val, key)]),
    );
  }

  return normalizeEntry(value) as T;
}

export function toKeywords(value?: string[] | string) {
  if (!value) return DEFAULT_SEO_KEYWORDS.join(', ');
  return Array.isArray(value) ? value.join(', ') : value;
}
