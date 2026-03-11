import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { parseHashFromRouter, buildUrlWithHash, mergeHashParams } from 'lib/helpers';

/**
 * Return type for useSearchInput hook
 */
export interface UseSearchInputReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Sitecore Search action to update keyphrase
 */
export type OnKeyphraseChangeAction = (params: { keyphrase: string }) => void;

/**
 * Hook to manage search input state and behavior.
 * Handles local search query state, synchronization with URL, and search submission.
 *
 * Features:
 * - Manages local search query state
 * - Syncs input field with URL-based keyphrase changes (for browser back/forward)
 * - Handles search submission via button click or Enter key
 * - Updates URL hash with new search query and resets pagination
 * - Preserves facets and other parameters during search operations
 * - Uses Sitecore Search action (if provided) to refetch without page reload
 * - Falls back to page reload if action not provided (for backward compatibility)
 *
 * @param currentKeyphrase The current search keyphrase from Sitecore Search state
 * @param onKeyphraseChange Optional Sitecore Search action to update keyphrase without reload
 * @returns Object containing search query state and handlers
 *
 * @example
 * // With Sitecore Search action (no page reload)
 * const { searchQuery, setSearchQuery, handleSearch, handleKeyDown } = useSearchInput(
 *   keyphrase,
 *   onKeyphraseChange
 * );
 *
 * @example
 * // Without action (falls back to page reload)
 * const { searchQuery, setSearchQuery, handleSearch, handleKeyDown } = useSearchInput(keyphrase);
 */
export const useSearchInput = (
  currentKeyphrase?: string,
  onKeyphraseChange?: OnKeyphraseChangeAction
): UseSearchInputReturn => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(currentKeyphrase || '');

  /**
   * Synchronizes input field with URL-based keyphrase changes.
   * This ensures the search input reflects the current URL state
   * when users navigate with browser back/forward buttons.
   * Note: currentKeyphrase is already decoded by useSearchResults, no need to decode again
   */
  useEffect(() => {
    if (currentKeyphrase) {
      // Use the keyphrase directly - it's already decoded from URL by useSearchResults
      setSearchQuery(currentKeyphrase || '');
    } else {
      setSearchQuery(''); // Clear input when no search query in URL
    }
  }, [currentKeyphrase]);

  /**
   * Handles search execution when user submits a query.
   * If onKeyphraseChange action is provided, uses it to update Sitecore Search directly (no reload).
   * Otherwise, falls back to page reload for backward compatibility.
   */
  const handleSearch = () => {
    try {
      const trimmedQuery = searchQuery.trim();

      // Prepare new parameters for URL hash
      const newParams: Record<string, string> = {
        page: '1', // Reset to first page for new search results
      };

      // Only add searchQuery if it's not empty
      if (trimmedQuery) {
        newParams.searchQuery = trimmedQuery;
      }

      // Preserve existing hash parameters (facets, sorting, page size)
      // but exclude old search query and page number
      const existingHashParams = parseHashFromRouter(router);
      for (const [key, value] of existingHashParams.entries()) {
        if (
          // Keep all params except searchQuery and page, but preserve pagesizecount
          (!key.startsWith('searchQuery') && !key.startsWith('page')) ||
          key.startsWith('pagesizecount')
        ) {
          newParams[key] = value;
        }
      }

      // If Sitecore Search action is provided, use it (no page reload)
      if (onKeyphraseChange) {
        // Update Sitecore Search state directly - this triggers refetch automatically
        onKeyphraseChange({ keyphrase: trimmedQuery });

        // Update URL for bookmarking/sharing using shallow routing
        const updatedHashParams = mergeHashParams(router, newParams);
        const asUrl = buildUrlWithHash(updatedHashParams);
        let hashString = updatedHashParams.toString();
        // Replace encoded pipe characters (%7C) with actual pipe (|) for better readability
        hashString = hashString.replace(/%7C/g, '|');

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
            if (!e.cancelled) {
              throw e;
            }
          });
      } else {
        // Fallback: Use page reload for widgets not providing the action
        const updatedHashParams = new URLSearchParams(newParams);
        const newUrl = buildUrlWithHash(updatedHashParams);

        if (newUrl && window?.location) {
          window.location.href = newUrl;
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  /**
   * Handles Enter key press to trigger search
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleKeyDown,
  };
};
