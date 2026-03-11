import { useCallback } from 'react';
import { useRouter } from 'next/router';
import type { ActionProp, ItemClickedAction } from '@sitecore-search/core';
import { convertToRelativeURL } from 'lib/helpers';

export type UseSearchResultLinkParams = {
  result: Record<string, unknown>;
  onItemClick: ActionProp<ItemClickedAction>;
  index: number;
  openInNewWindow?: boolean;
};

export type UseSearchResultLinkReturn = {
  href: string;
  handleClick: (e: React.MouseEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
};

/**
 * Hook for creating consistent search result links with analytics tracking.
 *
 * Features:
 * - Tracks analytics on every click and Enter key press
 * - Supports native browser behaviors (Ctrl+click, middle-click, right-click for new tabs)
 * - Supports keyboard navigation (Enter key)
 * - Optional flag to always open in new window (e.g., for Knowledge Center documents)
 *
 * @param params - Configuration object containing result, onItemClick callback, index, and optional openInNewWindow flag
 * @returns Object with href, click handler, and keyboard handler
 */
export const useSearchResultLink = ({
  result,
  onItemClick,
  index,
  openInNewWindow = false,
}: UseSearchResultLinkParams): UseSearchResultLinkReturn => {
  const router = useRouter();

  const href = result.url ? convertToRelativeURL(result.url as string) : '#';

  const trackAnalytics = useCallback(() => {
    onItemClick({
      id: result.id as string,
      index,
      sourceId: result.source_id as string,
    });
  }, [result.id, result.source_id, index, onItemClick]);

  const navigateToUrl = useCallback(() => {
    if (result.url) {
      if (openInNewWindow) {
        window.open(result.url as string, '_blank', 'noopener,noreferrer');
      } else {
        router.push(convertToRelativeURL(result.url as string));
      }
    }
  }, [result.url, openInNewWindow, router]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Always track analytics
      trackAnalytics();

      // If openInNewWindow flag is set, always open in new window
      if (openInNewWindow) {
        e.preventDefault();
        navigateToUrl();
        return;
      }

      // For normal links, check if user wants to open in new tab
      // (Ctrl+click, Cmd+click, middle-click)
      const isNewTabIntent = e.ctrlKey || e.metaKey || e.button === 1;

      if (!isNewTabIntent) {
        // Normal click - use Next.js router for client-side navigation
        e.preventDefault();
        navigateToUrl();
      }
      // If isNewTabIntent is true, we don't prevent default
      // This allows the browser's native "open in new tab" behavior
    },
    [trackAnalytics, navigateToUrl, openInNewWindow]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Track analytics
        trackAnalytics();
        // Navigate
        navigateToUrl();
      }
    },
    [trackAnalytics, navigateToUrl]
  );

  return {
    href,
    handleClick,
    handleKeyDown,
  };
};
