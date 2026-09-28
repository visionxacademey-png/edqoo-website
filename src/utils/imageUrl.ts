/**
 * Utility to generate cache-busted image URLs safely and deterministically.
 * 
 * - Ensures browser/CDN cache invalidation occurs whenever an image is updated in the admin panel.
 * - Does NOT use Date.now() on every render, keeping browser caching efficient when images have not changed.
 * - Leaves base64 data: URIs and blob: URIs intact without mutating them.
 */

export function getCacheBustedImageUrl(
  url?: string | null,
  version?: string | number | null,
  fallback: string = ''
): string {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return fallback;
  }

  // Base64 data URLs or blob URLs must never have query strings appended
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // If no version provided, return original trimmed URL
  if (!version && version !== 0) {
    return trimmed;
  }

  // Parse version into a clean string or timestamp
  let vString: string;
  if (typeof version === 'number') {
    vString = version.toString();
  } else if (typeof version === 'string') {
    const trimmedV = version.trim();
    if (!trimmedV) return trimmed;
    // If ISO date string, convert to unix epoch timestamp for clean URL parameter
    if (trimmedV.includes('T') && !isNaN(Date.parse(trimmedV))) {
      vString = new Date(trimmedV).getTime().toString();
    } else {
      vString = encodeURIComponent(trimmedV);
    }
  } else {
    return trimmed;
  }

  // Check if URL already has query parameters
  const [base, queryString] = trimmed.split('?');
  if (!queryString) {
    return `${base}?v=${vString}`;
  }

  // If URL has query string, update or set v parameter
  const params = new URLSearchParams(queryString);
  params.set('v', vString);
  return `${base}?${params.toString()}`;
}
