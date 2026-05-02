import { headers } from 'next/headers';

function normalizeSiteUrl(siteUrl: string) {
  return siteUrl.replace(/\/+$/, '');
}

function isLocalSiteUrl(siteUrl: string) {
  try {
    const { hostname } = new URL(siteUrl);
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]'
    );
  } catch {
    return false;
  }
}

export async function getSiteUrl() {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;

  if (
    configuredSiteUrl &&
    (process.env.NODE_ENV !== 'production' ||
      !isLocalSiteUrl(configuredSiteUrl))
  ) {
    return normalizeSiteUrl(configuredSiteUrl);
  }

  const requestHeaders = await headers();
  const forwardedHost = requestHeaders
    .get('x-forwarded-host')
    ?.split(',')[0]
    .trim();
  const host = forwardedHost || requestHeaders.get('host');

  if (host) {
    const forwardedProto = requestHeaders
      .get('x-forwarded-proto')
      ?.split(',')[0]
      .trim();
    const protocol =
      forwardedProto || (host.startsWith('localhost') ? 'http' : 'https');
    return normalizeSiteUrl(`${protocol}://${host}`);
  }

  return normalizeSiteUrl(
    configuredSiteUrl ?? `http://localhost:${process.env.PORT || 3000}`,
  );
}
