import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
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

function getSiteOrigin() {
  const winOrigin = (window as unknown as { __XR_SITE_ORIGIN?: unknown }).__XR_SITE_ORIGIN;
  if (typeof winOrigin === 'string' && /^https?:\/\//i.test(winOrigin)) return winOrigin.replace(/\/$/, '');

  const envOrigin = ((import.meta as unknown as { env?: Record<string, unknown> }).env?.VITE_SITE_ORIGIN as string | undefined);
  if (envOrigin && /^https?:\/\//i.test(envOrigin)) return envOrigin.replace(/\/$/, '');
  return window.location.origin;
}

export default function Seo({ title, description, canonicalPath, image, jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title;

    upsertMetaByName('description', description);

    const origin = getSiteOrigin();
    const canonicalUrl = canonicalPath ? `${origin}${canonicalPath}` : origin;
    upsertLinkRel('canonical', canonicalUrl);

    upsertMetaByProperty('og:type', 'website');
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:url', canonicalUrl);
    if (image) {
      const ogImage = image.startsWith('http') ? image : `${origin}${image}`;
      upsertMetaByProperty('og:image', ogImage);
    }

    upsertMetaByName('twitter:card', image ? 'summary_large_image' : 'summary');
    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', description);

    const existing = document.querySelectorAll('script[data-xrostao-jsonld="true"]');
    existing.forEach((el) => el.parentElement?.removeChild(el));

    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-xrostao-jsonld', 'true');
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, image, jsonLd]);

  return null;
}
