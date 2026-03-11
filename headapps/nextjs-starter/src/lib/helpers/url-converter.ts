/**
 * Known external domain hostnames
 */
const EXTERNAL_HOSTNAMES = [
  // TODO: Tech debt - Convert this list to an environment variable. It is a smell to store the application URL in the application code.
  'tidal-xmcloud-dev.vercel.app', // DEV
  'tidal-xmcloud.vercel.app', // PROD
];

/**
 * Converts a URL to a relative URL if it is from a known external domain.
 *
 * @param url - The URL to convert
 * @returns Relative URL or the original URL if it is not from a known external domain
 */
export function convertToRelativeURL(url: string | undefined | null): string {
  if (!url || typeof url !== 'string' || url.startsWith('/')) {
    return url || '#';
  }

  try {
    const urlObj = new URL(url);

    const isExternal = EXTERNAL_HOSTNAMES.some(
      (host) => urlObj.hostname === host || urlObj.hostname.endsWith(`.${host}`)
    );

    if (isExternal) {
      return urlObj.pathname + urlObj.search + urlObj.hash;
    }

    return url;
  } catch {
    return url;
  }
}
