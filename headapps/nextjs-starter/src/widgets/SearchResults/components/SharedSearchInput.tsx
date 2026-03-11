import React from 'react';
import { useSearchInput, OnKeyphraseChangeAction } from 'lib/hooks/search/useSearchInput';
import { useTranslation } from 'lib/hooks/useTranslation';
import { Button } from 'component-children/Shared/Button/Button';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import { SECONDARY_THEME, TERTIARY_THEME } from 'lib/const';

/**
 * Props for SharedSearchInput component
 */
export interface SharedSearchInputProps {
  /** Current search keyphrase from Sitecore Search state */
  currentKeyphrase?: string;
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Test ID for testing purposes */
  testId?: string;
  /** Text for the search button */
  buttonText?: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** Custom styling for the input field */
  inputClassName?: string;
  /** Additional wrapper props for special cases (like dialog role) */
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  /** Optional Sitecore Search action to update keyphrase without page reload */
  onKeyphraseChange?: OnKeyphraseChangeAction;
}

/**
 * Reusable search input component for search widgets.
 * Handles user search queries, updates URL hash with search query, and resets pagination to first page.
 * Preserves facets and other parameters during search operations.
 *
 * Features:
 * - Manages search query state using useSearchInput hook
 * - Supports both button click and Enter key for search submission
 * - Automatically syncs with URL state for browser back/forward support
 * - Uses Sitecore Search action (if provided) to refetch without page reload
 * - Fully accessible with ARIA labels
 * - Customizable styling and labels
 *
 * @example
 * // With Sitecore Search action (no page reload)
 * <SharedSearchInput
 *   currentKeyphrase={keyphrase}
 *   onKeyphraseChange={onKeyphraseChange}
 * />
 *
 * @example
 * // With custom props
 * <SharedSearchInput
 *   currentKeyphrase={keyphrase}
 *   onKeyphraseChange={onKeyphraseChange}
 *   placeholder="Search articles..."
 *   ariaLabel="Search articles"
 *   testId="articleSearchInput"
 *   buttonText="Search"
 *   className="mb-6"
 * />
 */
export const SharedSearchInput: React.FC<SharedSearchInputProps> = ({
  currentKeyphrase,
  placeholder,
  ariaLabel,
  testId = 'searchInput',
  buttonText,
  className,
  inputClassName,
  wrapperProps,
  onKeyphraseChange,
}) => {
  const { t } = useTranslation();
  const { searchQuery, setSearchQuery, handleSearch, handleKeyDown } = useSearchInput(
    currentKeyphrase,
    onKeyphraseChange
  );
  const { effectiveTheme } = useFrame();
  const buttonColor = effectiveTheme === TERTIARY_THEME ? SECONDARY_THEME : TERTIARY_THEME;
  return (
    <div className={className} {...wrapperProps}>
      <div className="flex flex-col sm:flex-row">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          data-testid={testId}
          type="search"
          aria-label={ariaLabel || t('Search content')}
          placeholder={placeholder || t('Search content...')}
          className={cn(
            'mb-2 flex-1 border border-content/30 bg-surface px-4 py-2 placeholder:text-content/70 sm:mb-0',
            inputClassName
          )}
        />
        <Button
          onClick={handleSearch}
          variant="button"
          className="flex w-full justify-center rounded-none sm:w-auto"
          aria-label={t('Submit search')}
          iconRight="magnifying-glass"
          color={buttonColor}
        >
          {buttonText || t('Search')}
        </Button>
      </div>
    </div>
  );
};
