import React from 'react';
import type {
  SearchResponseFacet,
  SearchResponseSortChoice,
  SearchResultsInitialState,
} from '@sitecore-search/react';
import {
  FilterAnd,
  FilterEqual,
  WidgetDataType,
  useSearchResults,
  widget,
} from '@sitecore-search/react';

import KnowledgeCenterHorizontalCard from '../components/KnowledgeCenterHorizontalCard';
import Filters from '../components/Filter';
import SearchFacets from '../components/SearchFacets';
import { SearchResultsPagination } from '../components/SearchResultsPagination';
import { SearchResultsToolbar } from '../components/SearchResultsToolbar';
import { SharedSearchInput } from '../components/SharedSearchInput';
import { useTranslation } from 'lib/hooks/useTranslation';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import {
  SearchResultsGlobalStyles,
  SearchResultsContainer,
  ResultListContainer,
  ListLayoutContainer,
  MainLayoutContainer,
  SidebarContainer,
  MainContentContainer,
  NoResultsContainer,
} from './styled';
import { KnowledgeCenterModel, KnowledgeCenterSearchResultsProps } from './types';
import { PageController } from '@sitecore-search/react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { LOCALE_CONFIG } from 'lib/const/search-const';
import { mainLanguage } from 'lib/i18n/i18n-config';
import { SearchSkeletonTheme, SearchResultsSkeletonLayout } from '../components/skeletons';
import { SKELETON_ITEMS_CONFIG } from 'lib/const';
import { EditModeClickDisabler } from 'component-children/Shared/Containers/EditModeClickDisabler';

type InitialState = SearchResultsInitialState<
  'itemsPerPage' | 'keyphrase' | 'page' | 'sortType' | 'selectedFacets'
>;

const context = PageController.getContext();

export const KnowledgeCenterSearchComponent = ({
  defaultSortType = 'm_relevancy',
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = 10,
  globalSearchFields,
}: KnowledgeCenterSearchResultsProps) => {
  const { page: sitecorePage } = useSitecore();
  const currentLocale = sitecorePage?.locale || mainLanguage;
  const languageAndCountry = LOCALE_CONFIG[currentLocale] ?? LOCALE_CONFIG['default'];

  const {
    widgetRef,
    actions: { onItemClick, onKeyphraseChange },
    state: { sortType, page, itemsPerPage, keyphrase, selectedFacets },
    queryResult: {
      isLoading,
      isFetching,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] } = {},
        facet: facets = [],
        content: knowledgeCenterItems = [],
      } = {},
    },
  } = useSearchResults<KnowledgeCenterModel, InitialState>({
    query: (query) => {
      context.setLocaleLanguage(languageAndCountry.language);
      context.setLocaleCountry(languageAndCountry.country);
      const lang = sitecorePage?.locale;
      const siteName = sitecorePage?.siteName;
      const allFilters = [];

      // Language filter
      const languageFilter = new FilterEqual('m_language', lang);
      allFilters.push(languageFilter);

      // Site filter
      const siteFilter = new FilterEqual('site', siteName);
      allFilters.push(siteFilter);

      query
        .getRequest()
        .setSearchFilter(new FilterAnd(allFilters))
        .setSources([process.env.NEXT_PUBLIC_SITECORE_SEARCH_KNOWLEDGE_CENTER_SOURCE as string]) // Only Knowledge Center source
        .setSearchQueryHighlightFragmentSize(500)
        .setSearchQueryHighlightFields(['description'])
        .setSearchQueryHighlightPreTag('<mark>')
        .setSearchQueryHighlightPostTag('</mark>');
    },
    state: {
      sortType: defaultSortType,
      page: defaultPage,
      itemsPerPage: defaultItemsPerPage,
      keyphrase: defaultKeyphrase,
      selectedFacets: [],
    },
  });
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { t } = useTranslation();

  return (
    <ContainedWrapper className="pb-md pt-sm lg:pb-md lg:pt-sm">
      <SearchResultsGlobalStyles />
      <SearchResultsContainer ref={widgetRef} data-component="KnowledgeCenterSearchResults">
        {isLoading ? (
          <SearchSkeletonTheme>
            <SearchResultsSkeletonLayout
              itemsPerPage={SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE}
              showSidebar={true}
              gridCols="grid-cols-1"
              showImage={false}
            />
          </SearchSkeletonTheme>
        ) : (
          <EditModeClickDisabler>
            <SharedSearchInput
              currentKeyphrase={keyphrase}
              testId="knowledgeCenterSRInput"
              className="mb-8"
              inputClassName="mb-2 flex-1 border border-content/30 px-4 py-2 sm:mb-0 bg-surface"
              onKeyphraseChange={onKeyphraseChange}
            />
            {totalItems > 0 && (
              <SearchResultsGrid
                knowledgeCenterItems={knowledgeCenterItems}
                facets={facets}
                page={page}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                sortChoices={sortChoices}
                sortType={sortType}
                totalPages={totalPages}
                defaultItemsPerPage={defaultItemsPerPage}
                onItemClick={onItemClick}
                globalSearchFields={globalSearchFields}
              />
            )}
            {(totalItems || 0) <= 0 && !isFetching && (
              <MainLayoutContainer>
                {selectedFacets.length > 0 && (
                  <SidebarContainer>
                    <Filters />
                    <SearchFacets facets={facets as SearchResponseFacet[]} />
                  </SidebarContainer>
                )}

                {/* Right Content Area */}
                <MainContentContainer>
                  <NoResultsContainer>
                    <h3>{t('SearchNoResults')}</h3>
                  </NoResultsContainer>
                </MainContentContainer>
              </MainLayoutContainer>
            )}
          </EditModeClickDisabler>
        )}
      </SearchResultsContainer>
    </ContainedWrapper>
  );
};

const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  knowledgeCenterItems,
  facets,
  page,
  itemsPerPage,
  totalItems,
  sortChoices,
  sortType,
  totalPages,
  onItemClick,
  globalSearchFields,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Sidebar and Main Content Layout */}
      <MainLayoutContainer>
        {/* Left Sidebar - Filters - hidden on mobile */}
        <SidebarContainer>
          <Filters />
          <SearchFacets
            facets={facets as SearchResponseFacet[]}
            expandedAccordions={globalSearchFields?.fields?.facetsToExpand?.value}
          />
        </SidebarContainer>

        {/* Right Content Area */}
        <MainContentContainer>
          {/* Top Controls */}
          <SearchResultsToolbar
            facets={facets as SearchResponseFacet[]}
            page={page}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            totalItemsReturned={knowledgeCenterItems.length}
            sortChoices={sortChoices as SearchResponseSortChoice[]}
            sortType={sortType}
          />

          {/* Results List */}
          <ResultListContainer data-component="SearchResultsGrid">
            <ListLayoutContainer>
              {knowledgeCenterItems.map((media, index) => {
                if (!media) return null;

                return (
                  <React.Fragment key={media.id || index}>
                    <KnowledgeCenterHorizontalCard
                      resource={media}
                      index={index}
                      onItemClick={onItemClick}
                    />
                  </React.Fragment>
                );
              })}
            </ListLayoutContainer>
          </ResultListContainer>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <SearchResultsPagination
              currentPage={page}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              pageSizeText={t('Results Per Page')}
              PageSizeCount={globalSearchFields?.fields?.PageSizeCount?.value}
            />
          )}
        </MainContentContainer>
      </MainLayoutContainer>
    </>
  );
};

type SearchResultsGridProps = {
  knowledgeCenterItems: KnowledgeCenterModel[];
  facets: Record<string, unknown>[];
  page: number;
  itemsPerPage: number;
  totalItems: number;
  sortChoices: Record<string, unknown>[];
  sortType: string;
  totalPages: number;
  defaultItemsPerPage: number;
  onItemClick: (item: Record<string, unknown>) => void;
  globalSearchFields?: KnowledgeCenterSearchResultsProps['globalSearchFields'];
};

const KnowledgeCenterSearchWidget = widget(
  KnowledgeCenterSearchComponent,
  WidgetDataType.SEARCH_RESULTS,
  'content'
);

export default KnowledgeCenterSearchWidget;
