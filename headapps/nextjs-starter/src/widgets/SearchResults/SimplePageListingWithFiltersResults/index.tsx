import { useMemo } from 'react';
import type {
  SearchResponseFacet,
  SearchResponseSortChoice,
  SearchResultsInitialState,
  SearchResultsStoreState,
} from '@sitecore-search/react';
import {
  FilterAnd,
  FilterEqual,
  PageController,
  useSearchResults,
  widget,
  WidgetDataType,
} from '@sitecore-search/react';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { SearchResultsPagination } from '../components/SearchResultsPagination';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { MainLayoutContainer, SidebarContainer, MainContentContainer } from './styled';
import { useTranslation } from 'lib/hooks/useTranslation';
import { LANDING_PAGE_TEMPLATE_ID } from 'lib/graphql/id';
import { removeCurlyBraces } from 'lib/helpers';
import { getValidPageSize, DEFAULT_PAGE_SIZE } from 'lib/helpers/page-size';
import { getFilterByTags } from '../QueryHelpers/filter-by-helpers';
import {
  SearchListingWithFiltersFields,
  SearchListingWithFiltersProps,
} from 'lib/types/components/Search/search-listing-filters';
import { getSitecoreSearchSourceBySite, LOCALE_CONFIG } from 'lib/const/search-const';
import { mainLanguage } from 'lib/i18n/i18n-config';
import SearchFacets from '../components/SearchFacets';
import { useContextPageTags } from 'lib/contexts/page-tags-context';
import DefaultItemCard from '../components/DefaultItemCard';
import { useSearchUrlState } from 'lib/hooks/search/useSearchUrlState';
import { useSearchUrlSync } from 'lib/hooks/search/useSearchUrlSync';
import { useBrowserNavigation } from 'lib/hooks/search/useBrowserNavigation';
import Filters from '../components/Filter';
import { SharedSearchInput } from '../components/SharedSearchInput';
import { SearchResultsToolbar } from '../components/SearchResultsToolbar';
import {
  ListLayoutContainer,
  ResultListContainer,
  SearchResultsContainer,
  NoResultsContainer,
} from '../GlobalSearch/styled';
import { SearchSkeletonTheme, SearchResultsSkeletonLayout } from '../components/skeletons';
import { SKELETON_ITEMS_CONFIG } from 'lib/const';
import { EditModeClickDisabler } from 'component-children/Shared/Containers/EditModeClickDisabler';

type PageModel = {
  id: string;
  m_title?: string;
  name?: string;
  m_description?: string;
  url?: string;
  m_image_url?: string;
  m_og_image_url?: string;
  source_id?: string;
};

type SimplePageListingWithFiltersResultsProps = {
  defaultSortType?: SearchResultsStoreState['sortType'];
  defaultPage?: SearchResultsStoreState['page'];
  defaultItemsPerPage?: SearchResultsStoreState['itemsPerPage'];
  defaultKeyphrase?: SearchResultsStoreState['keyphrase'];
  props: SearchListingWithFiltersProps;
};

type InitialState = SearchResultsInitialState<
  'itemsPerPage' | 'keyphrase' | 'page' | 'sortType' | 'selectedFacets'
>;

const context = PageController.getContext();

export const SimplePageListingWithFiltersResults = ({
  defaultSortType = 'm_relevancy',
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = DEFAULT_PAGE_SIZE,
  props,
}: SimplePageListingWithFiltersResultsProps) => {
  const { page: sitecorePage } = useSitecore();
  const { pageTags } = useContextPageTags();
  const { t } = useTranslation();
  const currentLocale = sitecorePage?.locale || mainLanguage;
  const languageAndCountry = LOCALE_CONFIG[currentLocale] ?? LOCALE_CONFIG['default'];

  // Get validated page size from Sitecore field
  const validatedPageSize = getValidPageSize(props?.fields?.PageSizeCount?.value);

  // Check if filtering is enabled via fields
  const filterEnabled = useMemo(() => {
    // Check in fields (fields.filterByTags.value)
    const renderingFields = props?.rendering?.fields || {};
    const filterByTagsField =
      renderingFields.filterByTags &&
      typeof renderingFields.filterByTags === 'object' &&
      'value' in renderingFields.filterByTags
        ? renderingFields.filterByTags.value
        : undefined;

    return filterByTagsField;
  }, [props?.rendering?.fields]);

  // Extract URL state for initialization
  const urlState = useSearchUrlState({
    defaultSortType,
    defaultPage,
    defaultItemsPerPage,
    defaultKeyphrase,
    pageSizeFromFields: validatedPageSize,
  });

  const {
    widgetRef,
    actions: { onItemClick, onKeyphraseChange },
    state: { page, itemsPerPage, sortType, keyphrase },
    queryResult: {
      isLoading,
      data: {
        total_item: totalItems = 0,
        content: pages = [],
        facet: facets = [],
        sort: { choices: sortChoices = [] } = {},
      } = {},
    },
  } = useSearchResults<PageModel, InitialState>({
    config: {
      defaultFacetType: 'text', // Use text-based facets for filtering
    },
    query: (query) => {
      context.setLocaleLanguage(languageAndCountry.language);
      context.setLocaleCountry(languageAndCountry.country);
      const allFilters = [];

      const templateIdFilter = new FilterEqual(
        'm_templateid',
        removeCurlyBraces(LANDING_PAGE_TEMPLATE_ID).toLowerCase()
      );
      allFilters.push(templateIdFilter);

      // If filterEnabled or pageTags.length is true, ignore all other filtering logic
      if (!filterEnabled && pageTags.length === 0) {
        const filterByTags = getFilterByTags({ fields: props?.fields });
        if (filterByTags.length > 0) {
          allFilters.push(...filterByTags);
        }
      }

      if (filterEnabled || pageTags.length > 0) {
        const filterByTags = getFilterByTags({
          fields: sitecorePage?.layout?.sitecore?.route?.fields as SearchListingWithFiltersFields,
        });
        allFilters.push(...filterByTags);
      }
      const lang = sitecorePage?.locale;

      const languageFilter = new FilterEqual('m_language', lang);
      allFilters.push(languageFilter);

      query
        .getRequest()
        .setSearchFilter(new FilterAnd(allFilters))
        .setSources([getSitecoreSearchSourceBySite(sitecorePage?.siteName as string)]);
    },
    state: {
      sortType: urlState.sortType || defaultSortType,
      page: urlState.page,
      itemsPerPage: urlState.itemsPerPage,
      keyphrase: urlState.searchQuery,
      selectedFacets: urlState.initialFacets || [],
    },
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle browser back/forward navigation
  useBrowserNavigation();

  // Sync pagination and sorting state with URL hash
  useSearchUrlSync({
    page,
    itemsPerPage,
    sortType,
    totalPages,
    isLoading,
    defaultPage,
    defaultSortType,
    defaultItemsPerPage: validatedPageSize,
  });

  // Use all facets directly from Sitecore Search without filtering
  const filteredFacets = useMemo(() => {
    return (facets as SearchResponseFacet[]) || [];
  }, [facets]);

  return (
    <>
      {isLoading ? (
        <ContainedWrapper>
          <SearchResultsContainer
            ref={widgetRef}
            data-component="SimplePageListingWithFiltersResults"
          >
            <SearchSkeletonTheme>
              <SearchResultsSkeletonLayout
                itemsPerPage={SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE}
                showSidebar={true}
                gridCols="grid-cols-1"
                showImage={false}
              />
            </SearchSkeletonTheme>
          </SearchResultsContainer>
        </ContainedWrapper>
      ) : (
        <ContainedWrapper>
          <SearchResultsContainer
            ref={widgetRef}
            data-component="SimplePageListingWithFiltersResults"
          >
            <div className="w-full">
              <Text tag="h2" field={props?.fields?.heading} className="heading-lg mb-6" />
              {filterEnabled && pageTags.length > 0 && (
                <div className="mb-4 text-sm">
                  <span className="font-semibold">{props?.fields?.tagsHeading?.value}</span>{' '}
                  {pageTags.map((tag) => tag.displayName || tag.name).join(', ')}
                </div>
              )}
              <EditModeClickDisabler>
                <MainLayoutContainer>
                  {/* Left Sidebar - Filters - hidden on mobile */}
                  <SidebarContainer>
                    <Filters />
                    <SearchFacets facets={filteredFacets} />
                  </SidebarContainer>

                  {/* Right Content Area */}
                  <MainContentContainer>
                    {/* Top Controls - Search Input and Results Summary and Sort Options */}
                    <SharedSearchInput
                      currentKeyphrase={keyphrase}
                      testId="simplePageListingSRInput"
                      buttonText={t('Search')}
                      onKeyphraseChange={onKeyphraseChange}
                    />
                    {totalItems > 0 && (
                      <SearchResultsToolbar
                        facets={filteredFacets}
                        page={page}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        totalItemsReturned={pages.length}
                        sortChoices={sortChoices as SearchResponseSortChoice[]}
                        sortType={sortType}
                      />
                    )}

                    <ResultListContainer>
                      {(pages.length || 0) <= 0 && (
                        <NoResultsContainer>
                          <p>{props?.fields?.noResultsText?.value}</p>
                        </NoResultsContainer>
                      )}
                      <ListLayoutContainer>
                        <div className="flex flex-col gap-4">
                          {pages.map((page, index) => (
                            <DefaultItemCard
                              result={page}
                              index={index}
                              onItemClick={onItemClick}
                              key={page.id || index}
                            />
                          ))}
                        </div>
                      </ListLayoutContainer>
                    </ResultListContainer>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <SearchResultsPagination
                        currentPage={page}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        pageSizeText={t('Results Per Page')}
                        PageSizeCount={validatedPageSize}
                      />
                    )}
                  </MainContentContainer>
                </MainLayoutContainer>
              </EditModeClickDisabler>
            </div>
          </SearchResultsContainer>
        </ContainedWrapper>
      )}
    </>
  );
};

const SimplePageListingWithFiltersWidget = widget(
  SimplePageListingWithFiltersResults,
  WidgetDataType.SEARCH_RESULTS,
  'content'
);

export default SimplePageListingWithFiltersWidget;
