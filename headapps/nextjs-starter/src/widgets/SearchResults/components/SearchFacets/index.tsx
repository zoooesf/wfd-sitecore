import { CheckIcon } from '@radix-ui/react-icons';
import { SearchResponseFacet, useSearchResultsActions } from '@sitecore-search/react';
import { AccordionFacetsStyled, RangeFacetStyled } from './styled';
import { PROFILE_LAST_NAME_INITIAL_FACET_NAME } from 'lib/const';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

type SearchFacetsProps = {
  facets: SearchResponseFacet[];
  expandedAccordions?: number;
};

type PriceFacetProps = {
  min: number;
  max: number;
};

const PriceFacet = ({ min, max }: PriceFacetProps) => {
  return (
    <RangeFacetStyled.Root max={max} min={min} autoAdjustValues={false}>
      <RangeFacetStyled.Track>
        <RangeFacetStyled.Range />
      </RangeFacetStyled.Track>
      <RangeFacetStyled.Start>{(value) => <span>${value}</span>}</RangeFacetStyled.Start>
      <RangeFacetStyled.End>{(value) => <span>${value}</span>}</RangeFacetStyled.End>
    </RangeFacetStyled.Root>
  );
};

const Facets = ({ facets, expandedAccordions }: SearchFacetsProps) => {
  const { onFacetClick } = useSearchResultsActions();
  const [expandedFacets, setExpandedFacets] = useState<string[]>([]);

  // Filter out Last Name Initial facet
  const filteredFacets = useMemo(
    () => facets.filter((facet) => facet.name !== PROFILE_LAST_NAME_INITIAL_FACET_NAME),
    [facets]
  );

  // Expand first facets on load
  useEffect(() => {
    if (filteredFacets.length > 0 && expandedAccordions && expandedAccordions > 0) {
      const firstExpandedFacets = filteredFacets
        .slice(0, expandedAccordions)
        .map((facet) => facet.name);
      setExpandedFacets(firstExpandedFacets);
    }
    // We do not want "filteredFacets" in the dependency array as this object changes to the new 5 first returned facets as the user selects facets values. We want to preserve the facets the user explicitely expanded and not override them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedAccordions]);

  const handleFacetTypesExpandedListChange = useCallback((newExpandedList: string[]) => {
    setExpandedFacets(newExpandedList);
  }, []);

  return (
    <AccordionFacetsStyled.Root
      defaultFacetTypesExpandedList={[]}
      facetTypesExpandedList={expandedFacets}
      onFacetTypesExpandedListChange={handleFacetTypesExpandedListChange}
      onFacetValueClick={onFacetClick}
      data-component="search-facets"
    >
      {filteredFacets.map((facet) => (
        <AccordionFacetsStyled.Facet facetId={facet.name} key={facet.name}>
          <div className="relative">
            <AccordionFacetsStyled.Trigger className="flex w-full items-center justify-between">
              <span>{facet.label}</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-4 transition-transform duration-200 ${
                  expandedFacets.includes(facet.name) ? 'rotate-180' : ''
                }`}
              />
            </AccordionFacetsStyled.Trigger>
          </div>
          <AccordionFacetsStyled.Content>
            <AccordionFacetsStyled.ValueList>
              {facet.name !== 'price' ? (
                facet.value.map((facetValue, index) => (
                  <AccordionFacetsStyled.Item
                    {...{ index, facetValueId: facetValue.id }}
                    key={facetValue.id}
                  >
                    <AccordionFacetsStyled.ItemCheckbox>
                      <AccordionFacetsStyled.ItemCheckboxIndicator>
                        <CheckIcon />
                      </AccordionFacetsStyled.ItemCheckboxIndicator>
                    </AccordionFacetsStyled.ItemCheckbox>
                    <AccordionFacetsStyled.ItemCheckboxLabel>
                      {facetValue.text} {facetValue.count && `(${facetValue.count})`}
                    </AccordionFacetsStyled.ItemCheckboxLabel>
                  </AccordionFacetsStyled.Item>
                ))
              ) : (
                <PriceFacet
                  min={Math.floor(facet.value[0].min)}
                  max={Math.floor(facet.value[facet.value.length - 1].max)}
                />
              )}
            </AccordionFacetsStyled.ValueList>
          </AccordionFacetsStyled.Content>
        </AccordionFacetsStyled.Facet>
      ))}
    </AccordionFacetsStyled.Root>
  );
};

export default Facets;
