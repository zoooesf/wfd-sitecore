import { CheckIcon } from '@radix-ui/react-icons';
import { useSearchResultsActions, useSearchResultsSelectedFilters } from '@sitecore-search/react';
import type { SearchResponseFacet } from '@sitecore-search/react';
import { useState, useRef } from 'react';

import { DropdownFacetsStyled } from './styled';
import { useClickOutside } from 'lib/hooks/useClickOutside';

type SearchFacetsProps = {
  facets: SearchResponseFacet[];
};

const DropdownFacets = ({ facets }: SearchFacetsProps) => {
  const { onFacetClick, onClearFilters } = useSearchResultsActions();
  const selectedFilters = useSearchResultsSelectedFilters();
  const [expandedFacets, setExpandedFacets] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useClickOutside([containerRef], () => setExpandedFacets([]), expandedFacets.length > 0);

  // Handle dropdown state changes - ensure only one dropdown can be open at a time
  const handleFacetTypesExpandedListChange = (newExpandedList: string[]) => {
    // If a new facet is being opened and we already have one open, keep only the newest one
    if (newExpandedList.length > 1) {
      const lastOpened = newExpandedList[newExpandedList.length - 1];
      setExpandedFacets([lastOpened]);
    } else {
      setExpandedFacets(newExpandedList);
    }
  };

  return (
    <div>
      <DropdownFacetsStyled.Root
        ref={containerRef}
        facetTypesExpandedList={expandedFacets}
        onFacetTypesExpandedListChange={handleFacetTypesExpandedListChange}
        onFacetValueClick={onFacetClick}
      >
        {facets.map((facet) => (
          <DropdownFacetsStyled.Facet facetId={facet.name} key={facet.name}>
            <DropdownFacetsStyled.Trigger>{facet.label}</DropdownFacetsStyled.Trigger>
            <DropdownFacetsStyled.Content>
              <DropdownFacetsStyled.ValueList>
                {facet.value.map((facetValue, index) => (
                  <DropdownFacetsStyled.Item
                    {...{ index, facetValueId: facetValue.id }}
                    key={facetValue.id}
                  >
                    <DropdownFacetsStyled.ItemCheckbox
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          (e.currentTarget as HTMLElement).click();
                        }
                      }}
                    >
                      <DropdownFacetsStyled.ItemCheckboxIndicator>
                        <CheckIcon />
                      </DropdownFacetsStyled.ItemCheckboxIndicator>
                    </DropdownFacetsStyled.ItemCheckbox>
                    <DropdownFacetsStyled.ItemCheckboxLabel>
                      {facetValue.text} {facetValue.count && `(${facetValue.count})`}
                    </DropdownFacetsStyled.ItemCheckboxLabel>
                  </DropdownFacetsStyled.Item>
                ))}
              </DropdownFacetsStyled.ValueList>
            </DropdownFacetsStyled.Content>
          </DropdownFacetsStyled.Facet>
        ))}
      </DropdownFacetsStyled.Root>

      {/* Clear Filters Button - Desktop */}
      {selectedFilters.length > 0 && (
        <div className="my-4">
          <button
            onClick={onClearFilters}
            className="hover:text-primary-600 text-sm text-gray-600 underline transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownFacets;
