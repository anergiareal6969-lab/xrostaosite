import { useEffect } from 'react';
import { getSiteOrigin, normalizeJsonLd, SITE_NAME, toAbsoluteUrl, toKeywords } from '../lib/seo';

type SeoProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  robots?: string;
  ogType?: string;
  imageAlt?: string;
  keywords?: string[] | string;
};

function upsertMetaByName(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLinkRel(rel: string, href: string) {
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

function removeMetaByName(name: string) {
  document.querySelector(`meta[name="${name}"]`)?.remove();
}

function removeMetaByProperty(property: string) {
  document.querySelector(`meta[property="${property}"]`)?.remove();
}

export default function Seo({
  title,
  description,
  canonicalPath,
  image,
  jsonLd,
  robots = 'index,follow',
  ogType = 'website',
  imageAlt,
  keywords,
}: SeoProps) {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = 'el';

    upsertMetaByName('description', description);
    upsertMetaByName('keywords', toKeywords(keywords));
    upsertMetaByName('robots', robots);
    upsertMetaByName('googlebot', robots);
    upsertMetaByName('author', SITE_NAME);
    upsertMetaByName('publisher', SITE_NAME);
    upsertMetaByName('application-name', SITE_NAME);
    upsertMetaByName('apple-mobile-web-app-title', SITE_NAME);
    upsertMetaByName('theme-color', '#000000');
    upsertMetaByName('format-detection', 'telephone=no');

    const origin = getSiteOrigin();
    const canonicalUrl = canonicalPath ? `${origin}${canonicalPath}` : origin;
    upsertLinkRel('canonical', canonicalUrl);

    upsertMetaByProperty('og:type', ogType);
    upsertMetaByProperty('og:site_name', SITE_NAME);
    upsertMetaByProperty('og:locale', 'el_GR');
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:url', canonicalUrl);
    if (image) {
      const ogImage = toAbsoluteUrl(image) ?? `${origin}${image}`;
      upsertMetaByProperty('og:image', ogImage);
      if (imageAlt) upsertMetaByProperty('og:image:alt', imageAlt);
      upsertMetaByName('twitter:image', ogImage);
      if (imageAlt) upsertMetaByName('twitter:image:alt', imageAlt);
    } else {
      removeMetaByProperty('og:image');
      removeMetaByProperty('og:image:alt');
      removeMetaByName('twitter:image');
      removeMetaByName('twitter:image:alt');
    }

    upsertMetaByName('twitter:card', image ? 'summary_large_image' : 'summary');
    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', description);
    upsertMetaByName('twitter:url', canonicalUrl);

    const existing = document.querySelectorAll('script[data-xrostao-jsonld="true"]');
    existing.forEach((el) => el.parentElement?.removeChild(el));

    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-xrostao-jsonld', 'true');
      script.text = JSON.stringify(normalizeJsonLd(jsonLd));
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, image, jsonLd, robots, ogType, imageAlt, keywords]);

  return null;
}
