import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  extractHashParams,
  mergeHashParams,
  buildUrlWithHash,
  normalizeHashParams,
} from 'lib/helpers';
import type { DateRange } from 'lib/types/date-range';
import moment from 'moment';
import { DATE_FORMAT_ISO } from 'lib/const/search-const';

/**
 * Configuration parameters for useSearchUrlSync hook
 */
export interface UseSearchUrlSyncParams {
  page: number;
  itemsPerPage: number;
  sortType: string;
  totalPages: number;
  isLoading: boolean;
  defaultPage?: number;
  defaultSortType?: string;
  defaultItemsPerPage?: number;
  pastEvents?: boolean;
  dateRange?: DateRange;
}

/**
 * Hook to synchronize pagination and sorting state with URL hash parameters.
 * This ensures that search state is reflected in the URL for bookmarking and sharing.
 *
 * Features:
 * - Updates URL when pagination or sorting changes
 * - Preserves existing facets and search query
 * - Prevents duplicate history entries
 * - Handles browser navigation detection
 * - Normalizes hash parameters for consistent URLs
 *
 * The hook uses shallow routing to avoid full page reloads and disables scroll
 * to maintain the user's current position when state changes.
 *
 * @param params Configuration object containing current state and defaults
 *
 * @example
 * useSearchUrlSync({
 *   page: 2,
 *   itemsPerPage: 10,
 *   sortType: 'm_relevancy',
 *   totalPages: 5,
 *   isLoading: false,
 *   defaultPage: 1,
 *   defaultSortType: 'm_relevancy',
 *   defaultItemsPerPage: 10,
 * });
 */
export const useSearchUrlSync = (params: UseSearchUrlSyncParams): void => {
  const {
    page,
    itemsPerPage,
    sortType,
    totalPages,
    isLoading,
    defaultPage = 1,
    defaultSortType = 'm_relevancy',
    defaultItemsPerPage = 10,
    pastEvents,
    dateRange,
  } = params;

  const router = useRouter();

  useEffect(() => {
    if (!router?.isReady) {
      return;
    }

    // Don't update URL until we have valid data from the query
    // This prevents resetting page to 1 when totalPages is still 0 during initial load
    if (isLoading || (totalPages === 0 && page > 1)) {
      return;
    }

    // Extract current search query from hash to preserve it
    const currentHashParams = extractHashParams(router);
    const searchQuery = currentHashParams?.searchQuery || '';

    // Build object with parameters that need to be updated in URL
    const newParams: Record<string, string> = {};

    // Always include pagination, sort, and page size parameters
    // This ensures consistent URLs and proper back/forward navigation
    if (itemsPerPage) {
      newParams.pagesizecount = itemsPerPage.toString();
    }

    // Ensure page is at least 1 (never 0) and at most totalPages
    const validPage = Math.max(1, Math.min(page || 1, totalPages || 1));
    newParams.page = validPage.toString();

    if (sortType) {
      newParams.sort = sortType;
    }

    // Preserve search query in hash
    if (searchQuery) {
      newParams.searchQuery = searchQuery;
    }

    // Add past events toggle state
    if (pastEvents !== undefined) {
      newParams.pastEvents = pastEvents.toString();
    }

    // Add date range filter (format: YYYY-MM-DD|YYYY-MM-DD)
    if (dateRange?.start && dateRange?.end) {
      const startStr = moment(dateRange.start).format(DATE_FORMAT_ISO);
      const endStr = moment(dateRange.end).format(DATE_FORMAT_ISO);
      newParams.dateRange = `${startStr}|${endStr}`;
    }

    // Include any additional query parameters from Next.js router
    // Exclude our hash-based params and Next.js internal params
    Object.entries(router.query).forEach(([key, value]) => {
      if (
        key !== 'searchQuery' &&
        key !== 'pagesizecount' &&
        key !== 'path' && // Next.js dynamic route parameter
        key !== 'sort' &&
        key !== 'page' &&
        value
      ) {
        newParams[key] = Array.isArray(value) ? value[0] : (value as string);
      }
    });

    // Build new hash by merging new params with existing ones (preserves facets, etc.)
    const updatedHashParams = mergeHashParams(router, newParams);
    const asUrl = buildUrlWithHash(updatedHashParams);
    // Use toString() directly for consistent encoding and replace encoded pipes
    let hashString = updatedHashParams.toString();
    // Replace encoded pipe characters (%7C) with actual pipe (|) for better readability
    hashString = hashString.replace(/%7C/g, '|');

    // Get current hash from URL for comparison
    const currentHash = window.location.hash.substring(1); // Remove leading #

    // Normalize both hashes for comparison by parsing, sorting params, and re-encoding
    // This handles both encoding differences (%20 vs +) and parameter order differences
    let normalizedCurrentHash = normalizeHashParams(new URLSearchParams(currentHash)).toString();
    let normalizedNewHash = normalizeHashParams(new URLSearchParams(hashString)).toString();
    // Replace encoded pipes in both for consistent comparison
    normalizedCurrentHash = normalizedCurrentHash.replace(/%7C/g, '|');
    normalizedNewHash = normalizedNewHash.replace(/%7C/g, '|');

    // Check if this is browser navigation (back/forward button)
    // The flag persists in sessionStorage across page reloads
    // Note: Flag is cleared by a separate useEffect after all components have checked it
    const isBrowserNav =
      typeof window !== 'undefined' && sessionStorage.getItem('__isBrowserNavigation') === 'true';

    // Only update URL if:
    // 1. The hash has actually changed (prevents duplicate history entries)
    // 2. This is NOT browser navigation (prevents overwriting back/forward URLs)
    if (router.isReady && normalizedCurrentHash !== normalizedNewHash && !isBrowserNav) {
      // Mark this as a programmatic change before pushing
      if (typeof window !== 'undefined') {
        (
          window as Window & { __isSearchProgrammaticChange?: boolean }
        ).__isSearchProgrammaticChange = true;
      }

      router
        .push(
          {
            pathname: router.pathname,
            hash: hashString,
          },
          asUrl,
          {
            shallow: true, // Don't trigger full page reload
            scroll: false, // Prevent auto-scroll on hash changes
          }
        )
        .catch((e) => {
          // Handle Next.js router cancellation gracefully
          // This occurs when multiple navigation events happen rapidly
          if (!e.cancelled) {
            throw e;
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultPage,
    defaultSortType,
    defaultItemsPerPage,
    itemsPerPage,
    page,
    sortType,
    pastEvents,
    dateRange,
  ]);
  // Note: router and totalPages are intentionally excluded from dependencies
  // - router: excluded to prevent infinite loops
  // - totalPages: excluded because it changes as side effect of facet filtering, not user action
  // This prevents duplicate history entries when facets change
};
