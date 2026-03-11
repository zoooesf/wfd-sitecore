import { HASH_SEPARATOR } from 'lib/const/search-const';
import { useRouter } from 'next/router';

// Prefix for facet parameters in URL hash to avoid conflicts with other hash parameters
// Example: "f-category", "f-people", etc.
const FACET_PREFIX = 'f-';

/**
 * Extracts and parses hash parameters from the Next.js router.
 *
 * @param router Next.js router instance
 * @returns URLSearchParams object containing all hash parameters
 */
export const parseHashFromRouter = (router: ReturnType<typeof useRouter>): URLSearchParams => {
  const hash = router.asPath.split(/#(.*)/)[1] ?? '';
  return new URLSearchParams(hash);
};

/**
 * Extracts all search-related parameters from URL hash into a structured object.
 * This provides easy access to pagination, sorting, and search query parameters.
 *
 * @param router Next.js router instance
 * @returns Object containing extracted parameters (sortType, page, itemsPerPage, searchQuery, pastEvents, dateRange)
 */
export const extractHashParams = (router: ReturnType<typeof useRouter>) => {
  const hashParams = parseHashFromRouter(router);
  return {
    sortType: hashParams.get('sort'),
    page: hashParams.get('page'),
    itemsPerPage: hashParams.get('pagesizecount'),
    searchQuery: hashParams.get('searchQuery'),
    pastEvents: hashParams.get('pastEvents'),
    dateRange: hashParams.get('dateRange'),
  };
};

/**
 * Extracts all search-related parameters from URL hash into a structured object without facets.
 * This provides easy access to pagination, sorting, and search query parameters.
 *
 * @param router Next.js router instance
 * @returns Object containing extracted parameters (sortType, page, itemsPerPage, searchQuery)
 */
export const extractHashParamsWithoutFacets = (router: ReturnType<typeof useRouter>) => {
  const currentHash = parseHashFromRouter(router);
  const existingHashParams = new URLSearchParams(currentHash);
  const hashParams = new URLSearchParams();
  for (const [key, value] of existingHashParams.entries()) {
    if (!key.startsWith(FACET_PREFIX)) {
      hashParams.set(key, value);
    }
  }
  return hashParams;
};

/**
 * Merges new hash parameters with existing ones from the URL.
 * Preserves all existing URL hash parameters and overlays new parameters on top.
 * This is crucial for maintaining complete state (facets, pagination, sorting, search query)
 * when updating the URL during user interactions or browser navigation.
 *
 * @param router Next.js router instance
 * @param newParams Object containing new parameters to add/update (will override existing values)
 * @returns URLSearchParams with all existing parameters preserved and new parameters merged in
 *
 * @example
 * // Current URL: #f-m_topic=Tech&page=1&sort=relevancy
 * // Merge in page=2:
 * const merged = mergeHashParams(router, { page: '2' });
 * // Result: #f-m_topic=Tech&page=2&sort=relevancy
 */
export const mergeHashParams = (
  router: ReturnType<typeof useRouter>,
  newParams: Record<string, string>
): URLSearchParams => {
  const hashParams = new URLSearchParams();
  const existingHashParams = parseHashFromRouter(router);

  // First, preserve ALL existing parameters (facets, page, sort, pagesizecount, searchQuery, etc.)
  // This ensures complete state is maintained during browser back/forward navigation
  for (const [key, value] of existingHashParams.entries()) {
    hashParams.set(key, value);
  }

  // Then add/update the new parameters (this overlays new values on existing ones)
  Object.entries(newParams).forEach(([key, value]) => {
    if (value) {
      hashParams.set(key, value);
    }
  });
  return hashParams;
};

/**
 * Updates a specific hash parameter while preserving all other parameters.
 * Useful for updating individual values like page number or sort order.
 *
 * @param router Next.js router instance
 * @param paramName Name of the parameter to update
 * @param paramValue New value for the parameter
 * @returns URLSearchParams with the specified parameter updated
 */
export const updateHashParam = (
  router: ReturnType<typeof useRouter>,
  paramName: string,
  paramValue: string
): URLSearchParams => {
  const hashParams = new URLSearchParams();
  const existingHashParams = parseHashFromRouter(router);

  // Copy all existing parameters, updating the specified one
  for (const [key, value] of existingHashParams.entries()) {
    if (key === paramName) {
      hashParams.set(key, paramValue); // Update the target parameter
    } else {
      hashParams.set(key, value); // Preserve other parameters
    }
  }

  // If paramName doesn't exist in existing params, add it
  if (!existingHashParams.has(paramName)) {
    hashParams.set(paramName, paramValue);
  }

  return hashParams;
};

/**
 * Normalizes hash parameters by sorting keys alphabetically.
 * This ensures consistent URL generation regardless of parameter insertion order.
 *
 * @param hashParams URLSearchParams to normalize
 * @returns New URLSearchParams with keys sorted alphabetically
 */
export const normalizeHashParams = (hashParams: URLSearchParams): URLSearchParams => {
  const entries = Array.from(hashParams.entries());
  // Sort entries alphabetically by key for consistent ordering
  entries.sort((a, b) => a[0].localeCompare(b[0]));

  const normalized = new URLSearchParams();
  entries.forEach(([key, value]) => {
    // Normalize pipe characters by replacing %7C with | for consistent comparison
    const normalizedValue = value.replace(/%7C/g, '|');
    normalized.set(key, normalizedValue);
  });

  return normalized;
};

/**
 * Constructs a complete URL with the provided hash parameters.
 * Handles URL encoding and ensures proper formatting.
 *
 * @param hashParams URLSearchParams containing hash parameters
 * @returns Complete URL string with hash fragment
 */
export const buildUrlWithHash = (hashParams: URLSearchParams): string => {
  // Normalize parameter order for consistency
  const normalized = normalizeHashParams(hashParams);
  // Use toString() directly without decodeURIComponent to maintain consistent encoding
  // URLSearchParams.toString() produces properly encoded output with + for spaces
  let hashString = normalized.toString();
  // Replace encoded pipe characters (%7C) with actual pipe (|) for better readability
  // Pipes are used to separate multiple values for the same facet
  hashString = hashString.replace(/%7C/g, '|');
  return window.location.pathname + (hashString ? HASH_SEPARATOR + hashString : '');
};
