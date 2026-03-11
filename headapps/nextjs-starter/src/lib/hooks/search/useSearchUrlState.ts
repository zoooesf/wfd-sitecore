import { useRouter } from 'next/router';
import { extractHashParams } from 'lib/helpers';
import { useFacetUrlSync } from '../useFacetUrlSync';
import type { DateRange } from 'lib/types/date-range';

/**
 * Return type for useSearchUrlState hook
 */
export interface UseSearchUrlStateReturn {
  sortType: string | null;
  page: number;
  itemsPerPage: number;
  searchQuery: string;
  initialFacets: ReturnType<typeof useFacetUrlSync>;
  pastEvents: boolean;
  dateRange: DateRange;
}

/**
 * Configuration options for useSearchUrlState hook
 */
export interface UseSearchUrlStateConfig {
  defaultSortType?: string;
  defaultPage?: number;
  defaultItemsPerPage?: number;
  defaultKeyphrase?: string;
  pageSizeFromFields?: number;
}

/**
 * Hook to extract and parse initial search state from URL hash parameters.
 * This hook handles URL state initialization including pagination, sorting, search query, and facets.
 *
 * Features:
 * - Extracts hash parameters (sort, page, itemsPerPage, searchQuery)
 * - Safely decodes search query with fallback for malformed encoding
 * - Syncs facets from URL using useFacetUrlSync
 * - Provides sensible defaults when URL params are missing
 *
 * @param config Configuration object with default values
 * @returns Structured object containing all URL state parameters
 *
 * @example
 * const { sortType, page, itemsPerPage, searchQuery, initialFacets } = useSearchUrlState({
 *   defaultSortType: 'm_relevancy',
 *   defaultPage: 1,
 *   defaultItemsPerPage: 10,
 * });
 */
export const useSearchUrlState = (
  config: UseSearchUrlStateConfig = {}
): UseSearchUrlStateReturn => {
  const {
    defaultSortType = 'm_relevancy',
    defaultPage = 1,
    defaultItemsPerPage = 10,
    defaultKeyphrase = '',
    pageSizeFromFields,
  } = config;

  const router = useRouter();

  // Sync facets between URL and component state (bidirectional)
  const initialFacetsFromUrl = useFacetUrlSync();

  // Extract search parameters from URL hash for state initialization
  const hashParams = extractHashParams(router);

  // Safely decode search query from URL, with fallback for malformed encoding
  const searchQueryFromUrl = hashParams?.searchQuery
    ? (() => {
        try {
          return decodeURIComponent(hashParams.searchQuery);
        } catch (e) {
          console.warn('Failed to decode search query:', hashParams.searchQuery);
          return hashParams.searchQuery; // Use raw value if decoding fails
        }
      })()
    : undefined;

  // Parse pastEvents from URL
  const pastEvents = hashParams?.pastEvents === 'true';

  // Parse dateRange from URL (format: YYYY-MM-DD|YYYY-MM-DD)
  const dateRange: DateRange = (() => {
    if (hashParams?.dateRange) {
      const [startStr, endStr] = hashParams.dateRange.split('|');
      if (startStr && endStr) {
        try {
          const start = new Date(startStr);
          const end = new Date(endStr);
          // Validate dates are valid
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            return { start, end };
          }
        } catch (e) {
          console.warn('Failed to parse date range:', hashParams.dateRange);
        }
      }
    }
    return { start: undefined, end: undefined };
  })();

  return {
    sortType: hashParams?.sortType || defaultSortType,
    page: hashParams?.page ? Number(hashParams.page) || defaultPage : defaultPage,
    itemsPerPage: Number(hashParams?.itemsPerPage) || pageSizeFromFields || defaultItemsPerPage,
    searchQuery: searchQueryFromUrl || defaultKeyphrase || '',
    initialFacets: initialFacetsFromUrl,
    pastEvents,
    dateRange,
  };
};
