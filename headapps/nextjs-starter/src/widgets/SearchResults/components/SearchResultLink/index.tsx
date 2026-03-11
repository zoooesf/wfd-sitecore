import type { PropsWithChildren } from 'react';
import type { ActionProp, ItemClickedAction } from '@sitecore-search/core';
import Link from 'next/link';
import { useSearchResultLink } from 'lib/hooks/useSearchResultLink';

export type SearchResultLinkProps = PropsWithChildren<{
  result: Record<string, unknown>;
  onItemClick: ActionProp<ItemClickedAction>;
  index: number;
  className?: string;
  ariaLabel?: string;
  openInNewWindow?: boolean;
}>;

/**
 * Component for rendering clickable search result elements with analytics tracking.
 *
 * Features:
 * - Tracks analytics on every click and Enter key press
 * - Supports opening in new tabs (Ctrl+click, middle-click, right-click)
 * - Supports keyboard navigation (Enter key)
 * - Optional flag to always open in new window (e.g., for Knowledge Center documents)
 * - Can be used multiple times per card (image, title, read more, etc.)
 *
 * @example
 * // Normal link
 * <SearchResultLink result={item} onItemClick={onItemClick} index={index}>
 *   <img src={imageUrl} alt="Article" />
 * </SearchResultLink>
 *
 * @example
 * // Knowledge Center link (opens in new window)
 * <SearchResultLink result={item} onItemClick={onItemClick} index={index} openInNewWindow>
 *   <img src={imageUrl} alt="Document" />
 * </SearchResultLink>
 */
const SearchResultLink = ({
  result,
  onItemClick,
  index,
  className,
  ariaLabel,
  openInNewWindow = false,
  children,
}: SearchResultLinkProps) => {
  const { href, handleClick, handleKeyDown } = useSearchResultLink({
    result,
    onItemClick,
    index,
    openInNewWindow,
  });

  // Combine no-link-style with any additional className
  const combinedClassName = className ? `no-link-style ${className}` : 'no-link-style';

  return (
    <Link
      href={href}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={combinedClassName}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
};

export default SearchResultLink;
