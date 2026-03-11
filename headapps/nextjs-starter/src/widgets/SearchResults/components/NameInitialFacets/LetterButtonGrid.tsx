import { useMemo } from 'react';
import { useSearchResultsActions, useSearchResultsSelectedFilters } from '@sitecore-search/react';
import type { SearchResponseFacet } from '@sitecore-search/react';
import { cn } from 'lib/helpers';
import { useFrame } from 'lib/hooks/useFrame';
import { PRIMARY_THEME, SECONDARY_THEME, TERTIARY_THEME } from 'lib/const';

type LetterButtonGridProps = {
  facet: SearchResponseFacet;
  className?: string;
};

const allAlphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export const LetterButtonGrid = ({ facet, className }: LetterButtonGridProps) => {
  const { onFacetClick } = useSearchResultsActions();
  const selectedFilters = useSearchResultsSelectedFilters();
  const { parentTheme } = useFrame();

  // Smart button styling: light backgrounds get dark buttons, dark backgrounds get yellow buttons
  const isDarkButton =
    parentTheme === PRIMARY_THEME || parentTheme === TERTIARY_THEME || !parentTheme;
  const isYellowButton = parentTheme === SECONDARY_THEME;

  // Generate all letters A-Z plus any non-alphabetic values
  const facetValues = useMemo(() => {
    // Create a map of available facet values for quick lookup
    const availableFacetValues = new Map(
      facet.value.map((facetValue) => [facetValue.text, facetValue])
    );

    // Get all non-alphabetic facet values (numbers, special characters, etc.)
    const nonAlphabetFacetValues = facet.value.filter(
      (facetValue) => !/^[A-Z]$/i.test(facetValue.text)
    );

    // Generate all A-Z letters with their counts if available
    const allLetterValues = allAlphabets.map((letter) => {
      const existingValue = availableFacetValues.get(letter);
      return (
        existingValue || {
          id: letter,
          text: letter,
          count: 0,
        }
      );
    });

    // Combine letters with non-alphabetic values
    return [...allLetterValues, ...nonAlphabetFacetValues];
  }, [facet.value]);

  // Check which letters are selected
  const selectedLetters = useMemo(() => {
    return new Set(
      selectedFilters
        .filter((filter) => filter.facetId === facet.name)
        .map((filter) => filter.valueLabel)
    );
  }, [selectedFilters, facet.name]);

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {facetValues.map((facetValue, index) => {
        const hasResults = facetValue.count > 0;
        const isChecked = selectedLetters.has(facetValue.text);

        const handleClick = () => {
          if (hasResults) {
            onFacetClick({
              type: 'text',
              facetId: facet.name,
              facetIndex: 0,
              facetValueId: facetValue.id,
              facetValueIndex: index,
              checked: !isChecked,
            });
          }
        };

        return (
          <button
            key={facetValue.id}
            onClick={handleClick}
            disabled={!hasResults}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-md font-bold transition-all duration-200 ease-in-out md:h-10 md:w-10',
              'focus:outline-none focus:ring-2 focus:ring-content/50 focus:ring-offset-2',
              // Disabled state
              !hasResults && 'cursor-not-allowed border-content/20 bg-transparent text-content/30',
              // Selected state with smart theming
              hasResults &&
                isChecked &&
                isDarkButton &&
                'cursor-pointer border-secondary bg-secondary text-white',
              hasResults &&
                isChecked &&
                isYellowButton &&
                'cursor-pointer border-tertiary bg-tertiary text-black',
              // Unselected state
              hasResults &&
                !isChecked &&
                'cursor-pointer border-content/30 bg-transparent text-content hover:border-content hover:bg-content/10'
            )}
            aria-label={`Filter by letter ${facetValue.text}${
              hasResults ? ` (${facetValue.count} result(s))` : ' (disabled)'
            }`}
            title={hasResults ? `${facetValue.count} result(s)` : 'No results'}
          >
            <span className="text-sm">{facetValue.text}</span>
          </button>
        );
      })}
    </div>
  );
};
