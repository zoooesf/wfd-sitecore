import { useEffect } from 'react';
import { useSearchResultsSelectedFilters } from '@sitecore-search/react';
import { useRouter } from 'next/router';
import { parseHashFromRouter, normalizeHashParams } from 'lib/helpers';
import {
  AMPERSAND_SEPARATOR,
  EQUAL_SEPARATOR,
  FACET_PREFIX,
  PIPE_SEPARATOR,
} from 'lib/const/search-const';

type SearchResultsSelectedFilters = ReturnType<typeof useSearchResultsSelectedFilters>;

/**
 * Synchronizes facets between the URL hash and the search component state.
 * This hook ensures bidirectional sync: URL changes update facets, and facet changes update URL.
 *
 * @returns The current selected facets parsed from the URL hash
 */
export const useFacetUrlSync = () => {
  // Update URL when facets change
  useEnsureFacetUrl();
  // Parse facets from current URL
  return useFacetsFromUrl();
};

/**
 * Monitors facet changes and updates the URL hash accordingly.
 * This ensures that when users select/deselect facets, the URL is updated
 * so the state can be shared and bookmarked.
 */
const useEnsureFacetUrl = () => {
  const router = useRouter();

  // Get currently selected facets from Sitecore Search hook
  const selectedFacets = useSearchResultsSelectedFilters();

  // Convert current facet state to URL-safe string format
  const rawFacetUrlFragment = facetToUrlFragment(selectedFacets);

  // Decode any escaped characters (spaces, special chars) in the URL fragment
  const decodedFacetUrlFragment = decodeURI(rawFacetUrlFragment);

  // Extract current hash from URL and decode it
  const currentHash = router?.asPath ? decodeURI(router.asPath.split(/#(.*)/)[1] ?? '') : '';

  // Extract only facet parameters from current hash for comparison
  const facetString = currentHash
    ? currentHash
        .split(AMPERSAND_SEPARATOR)
        .filter((item) => item && item.startsWith(FACET_PREFIX))
        .join(AMPERSAND_SEPARATOR)
    : '';

  // Parse existing hash parameters to preserve non-facet params (pagination, sorting, etc.)
  const existingHashParams = new URLSearchParams(currentHash);
  let nonFacetParams = '';

  // Build string of non-facet parameters to preserve in URL
  for (const [key, value] of existingHashParams.entries()) {
    if (key && key !== 'undefined' && !key.startsWith(FACET_PREFIX) && value) {
      nonFacetParams += `${key}${EQUAL_SEPARATOR}${value}${AMPERSAND_SEPARATOR}`;
    }
  }

  useEffect(() => {
    // Only update URL when:
    // 1. Facet state has actually changed (not just initial load)
    // 2. Router is ready to prevent race conditions
    if (facetString !== decodedFacetUrlFragment && router.isReady) {
      // Build the combined hash string
      const combinedHash =
        nonFacetParams !== '' && nonFacetParams !== 'undefined'
          ? decodedFacetUrlFragment
            ? `${nonFacetParams}${decodedFacetUrlFragment}`
            : nonFacetParams.replace(/&$/, '') // Remove trailing ampersand when no facets
          : decodedFacetUrlFragment;

      // Normalize the hash to ensure consistent parameter ordering
      let normalizedHash = normalizeHashParams(new URLSearchParams(combinedHash)).toString();
      // Replace encoded pipe characters (%7C) with actual pipe (|) for better readability
      normalizedHash = normalizedHash.replace(/%7C/g, '|');

      // Get current hash for comparison
      const currentHash = window.location.hash.substring(1);
      let normalizedCurrentHash = normalizeHashParams(new URLSearchParams(currentHash)).toString();
      // Also replace encoded pipes in current hash for consistent comparison
      normalizedCurrentHash = normalizedCurrentHash.replace(/%7C/g, '|');

      // Check if this is browser navigation (back/forward button)
      // The flag persists in sessionStorage across page reloads
      // Note: Flag is cleared by the main component after all effects have checked it
      const isBrowserNav =
        typeof window !== 'undefined' && sessionStorage.getItem('__isBrowserNavigation') === 'true';

      // Only push if the normalized hashes are actually different AND this is not browser navigation
      if (normalizedHash !== normalizedCurrentHash && !isBrowserNav) {
        // Mark as programmatic change for back/forward detection
        if (typeof window !== 'undefined') {
          (
            window as Window & { __isSearchProgrammaticChange?: boolean }
          ).__isSearchProgrammaticChange = true;
        }

        router
          .push(
            {
              pathname: window.location.pathname,
              // Preserve existing query parameters, removing leading '?' to avoid duplication
              // window.location.search includes the '?' prefix, so we strip it
              query: window.location.search.replace(/^\?/, ''),
              // Use normalized hash with readable pipe characters
              hash: normalizedHash,
            },
            undefined,
            {
              shallow: true, // Don't trigger full page reload
              scroll: false, // Don't scroll to top when URL changes
            }
          )
          .catch((e) => {
            // Handle Next.js router cancellation (when rapid navigation occurs)
            // This is a known issue: https://github.com/vercel/next.js/issues/37362
            if (!e.cancelled) {
              throw e;
            }
          });
      }
    }
  }, [
    router,
    decodedFacetUrlFragment,
    currentHash,
    selectedFacets.length,
    nonFacetParams,
    facetString,
  ]);
};

/**
 * Converts selected facets array into a URL-safe query string fragment.
 * Handles multiple values for the same facet by joining with pipe (|) separator.
 *
 * @param selectedFacets Array of currently selected facet filters
 * @returns URL-encoded string like "f-category=news%7Csports&f-people=john"
 */
function facetToUrlFragment(selectedFacets: SearchResultsSelectedFilters): string {
  if (!selectedFacets.length) {
    return '';
  }

  const facets: Record<string, string> = {};

  selectedFacets.forEach((facet) => {
    // Sitecore Search provides facet values in different properties depending on context
    // valueLabel is typically available, facetValueText is fallback
    const value = facet.valueLabel; // ?? facet.facetValueText;
    if (!value) {
      return; // Skip facets without values
    }

    // Create prefixed key to identify this as a facet parameter
    // Example: "color" becomes "f-color"
    const key = FACET_PREFIX + facet.facetId;

    // Handle multiple values for same facet by joining with pipe separator
    // Example: f-color=red|green|blue for multiple color selections
    if (!facets[key]) {
      facets[key] = '';
    } else {
      facets[key] += PIPE_SEPARATOR; // Add separator for additional values
    }
    facets[key] += value;
  });

  // Convert to URL-encoded query string format
  const params = new URLSearchParams(facets);
  return params.toString();
}

/**
 * Parses facet parameters from the current URL hash and converts them back
 * to the format expected by Sitecore Search hooks.
 *
 * @returns Array of facet filter objects that can be passed to useSearchResults
 */
function useFacetsFromUrl(): SearchResultsSelectedFilters {
  const router = useRouter();

  // Extract hash parameters from current URL
  const hashAsQuery = parseHashFromRouter(router);

  const facets: SearchResultsSelectedFilters = [];

  // Process each hash parameter
  for (const [key, value] of hashAsQuery.entries()) {
    // Only process parameters that are facets (start with our prefix)
    if (!key.startsWith(FACET_PREFIX)) {
      continue;
    }

    // Extract the actual facet ID by removing the prefix
    // Example: "f-color" becomes "color"
    const facetId = key.split(FACET_PREFIX)[1];

    // Handle multiple values separated by pipe character
    // Example: "red|green|blue" becomes ["red", "green", "blue"]
    const valueArray = value.split('|');

    // Convert each value back to the Sitecore Search facet format
    valueArray.forEach((facetValue) => {
      facets.push({
        type: 'text',
        facetId,
        facetValueText: facetValue,
      });
    });
  }

  return facets;
}
