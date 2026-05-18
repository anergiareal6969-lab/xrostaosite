const LOCAL_API_ORIGIN = 'http://localhost:5000';

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

export function getApiBaseUrl() {
  const envBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (envBaseUrl) return trimTrailingSlash(envBaseUrl);

  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return LOCAL_API_ORIGIN;
    return trimTrailingSlash(origin);
  }

  return '';
}

export function toApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
