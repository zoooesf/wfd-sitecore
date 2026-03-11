import { useSearchResultsActions, useSearchResultsSelectedFilters } from '@sitecore-search/react';
import { FiltersStyled } from './styled';
import router from 'next/router';
import { buildUrlWithHash, extractHashParamsWithoutFacets } from 'lib/helpers';
import { useCallback } from 'react';
import { useTranslation } from 'lib/hooks/useTranslation';
import { SelectedFilterButton } from '../SelectedFilterButton';

const Filters = () => {
  const selectedFacetsFromApi = useSearchResultsSelectedFilters();
  const { onRemoveFilter, onClearFilters } = useSearchResultsActions();
  const { t } = useTranslation();

  const handleRemoveFilter = (selectedFacet: Record<string, unknown>) => {
    onRemoveFilter({
      type: 'text',
      facetId: selectedFacet.facetId as string,
      facetValueId: selectedFacet.facetValueId as string,
      facetValueText: selectedFacet.facetValueText as string,
    });
  };

  const updateURLOnClearFilters = useCallback(() => {
    if (router.isReady) {
      const hashParams = extractHashParamsWithoutFacets(router);
      const asUrl = buildUrlWithHash(hashParams);
      router.push(asUrl);
    }
  }, []);

  return (
    <FiltersStyled.Container>
      <FiltersStyled.HeaderContainer>
        <FiltersStyled.Header className="heading-xl">{t('Filters')}</FiltersStyled.Header>
        {selectedFacetsFromApi.length > 0 && (
          <FiltersStyled.ClearFilters
            onClick={() => {
              onClearFilters();
              updateURLOnClearFilters();
            }}
          >
            {t('Clear All Filters')}
          </FiltersStyled.ClearFilters>
        )}
      </FiltersStyled.HeaderContainer>
      {selectedFacetsFromApi.length > 0 && (
        <div className="flex flex-wrap gap-2 py-3">
          {selectedFacetsFromApi.map((selectedFacet) => {
            const filterRecord = selectedFacet as Record<string, unknown>;
            return (
              <SelectedFilterButton
                key={`${filterRecord.facetId}-${filterRecord.facetValueId}`}
                filter={filterRecord}
                onRemove={handleRemoveFilter}
              />
            );
          })}
        </div>
      )}
    </FiltersStyled.Container>
  );
};

export default Filters;
