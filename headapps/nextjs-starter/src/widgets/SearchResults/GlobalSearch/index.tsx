import { processEventDates } from 'lib/helpers/time-date-helper';
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
import ArticleItemCard from '../components/ArticleItemCard';
import PersonItemCard from '../components/PersonItemCard';
import DefaultItemCard from '../components/DefaultItemCard';
import EventItemCard from '../components/EventItemCard';
import KnowledgeCenterHorizontalCard from '../components/KnowledgeCenterHorizontalCard';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filter';
import SearchFacets from '../components/SearchFacets';
import { SearchResultsPagination } from '../components/SearchResultsPagination';
import { SearchResultsToolbar } from '../components/SearchResultsToolbar';
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
import { GlobalSearchProps } from 'lib/types/components/Search/global-search';
import { removeCurlyBraces } from 'lib/helpers';
import {
  ARTICLE_TEMPLATE_ID,
  EVENT_TEMPLATE_ID,
  PEOPLE_PAGE_TEMPLATE_ID,
  NEWS_TEMPLATE_ID,
  INSIGHTS_TEMPLATE_ID,
  PRODUCT_PAGE_TEMPLATE_ID,
} from 'lib/graphql/id';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import {
  getSitecoreSearchSourceBySite,
  KNOWLEDGE_CENTER_RESOURCE,
  LANGUAGE_ATTRIBUTE_NAME,
  LOCALE_CONFIG,
  SITE_ATTRIBUTE_NAME,
} from 'lib/const/search-const';
import { mainLanguage } from 'lib/i18n/i18n-config';
import { KnowledgeCenterModel } from '../KnowledgeCenterSearch/types';
import { useFrame } from 'lib/hooks/useFrame';
import { useSearchUrlState } from 'lib/hooks/search/useSearchUrlState';
import { useSearchUrlSync } from 'lib/hooks/search/useSearchUrlSync';
import { useBrowserNavigation } from 'lib/hooks/search/useBrowserNavigation';
import { SharedSearchInput } from '../components/SharedSearchInput';
import { OnKeyphraseChangeAction } from 'lib/hooks/search/useSearchInput';
import { SearchSkeletonTheme, SearchResultsSkeletonLayout } from '../components/skeletons';
import { SKELETON_ITEMS_CONFIG } from 'lib/const';
import { EditModeClickDisabler } from 'component-children/Shared/Containers/EditModeClickDisabler';

type SearchResultModel = {
  id: string;
  type?: string;
  title?: string;
  name?: string;
  subtitle?: string;
  url?: string;
  description?: string;
  content_text?: string;
  image_url?: string;
  m_featured_image_url?: string;
  source_id?: string;
  m_description?: string;
  m_lastupdated?: string;
  m_publisheddate?: string;
  m_templateid?: string;
  m_content_type?: string;
  m_event_startdate?: string;
  m_event_enddate?: string;
  event_starttime?: string;
  event_endtime?: string;
  formattedStartDate?: string;
  formattedEndDate?: string;
  m_language?: string;
  site?: string;
  m_product_name?: string;
  m_product_subheading?: string;
  m_productcategory?: string[];
  highlight?: {
    description?: string[];
    m_profile_description?: string[];
    m_product_subheading?: string[];
  };
} & KnowledgeCenterModel;

type GlobalSearchComponentProps = {
  defaultSortType?: SearchResultsStoreState['sortType'];
  defaultPage?: SearchResultsStoreState['page'];
  defaultItemsPerPage?: SearchResultsStoreState['itemsPerPage'];
  defaultKeyphrase?: SearchResultsStoreState['keyphrase'];
  globalSearchFields?: GlobalSearchProps;
};

type InitialState = SearchResultsInitialState<
  'itemsPerPage' | 'keyphrase' | 'page' | 'sortType' | 'selectedFacets'
>;

const context = PageController.getContext();

/**
 * Main search results component that handles search functionality, faceting, pagination, and sorting.
 * Uses URL hash parameters to maintain state for bookmarking and sharing search results.
 *
 * Key features:
 * - Hash-based URL state management (facets, pagination, sorting in URL hash)
 * - Sitecore Search integration with language and site filtering
 * - Real-time facet synchronization with URL
 * - Responsive grid/list view switching
 *
 * @param props Component configuration including defaults and global search settings
 */
const GlobalSearchComponent = ({
  defaultSortType = 'm_relevancy',
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = 10,
  globalSearchFields,
}: GlobalSearchComponentProps) => {
  const { effectiveTheme } = useFrame();
  const { page: sitecorePage } = useSitecore();
  const currentLocale = sitecorePage?.locale || mainLanguage;
  const languageAndCountry = LOCALE_CONFIG[currentLocale] ?? LOCALE_CONFIG['default'];

  // Extract URL state (pagination, sorting, search query, facets) from hash parameters
  const urlState = useSearchUrlState({
    defaultSortType,
    defaultPage,
    defaultItemsPerPage,
    defaultKeyphrase,
    pageSizeFromFields: globalSearchFields?.fields?.PageSizeCount?.value,
  });

  // Initialize Sitecore Search with URL-based state and custom query configuration
  const {
    widgetRef,
    actions: { onItemClick, onKeyphraseChange },
    state: { keyphrase, itemsPerPage, page, sortType },
    queryResult: {
      isLoading,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] } = {},
        facet: facets = [],
        content: rawSearchResults = [],
      } = {},
    },
  } = useSearchResults<SearchResultModel, InitialState>({
    query: (query) => {
      context.setLocaleLanguage(languageAndCountry.language);
      context.setLocaleCountry(languageAndCountry.country);

      const allFilters = [];

      const lang = sitecorePage?.locale;
      const languageFilter = new FilterEqual(LANGUAGE_ATTRIBUTE_NAME, lang);
      allFilters.push(languageFilter);

      const siteName = sitecorePage?.siteName;
      const siteFilter = new FilterEqual(SITE_ATTRIBUTE_NAME, siteName);
      allFilters.push(siteFilter);

      query
        .getRequest()
        .setSearchFilter(new FilterAnd(allFilters))
        .setSources([
          getSitecoreSearchSourceBySite(sitecorePage?.siteName as string),
          process.env.NEXT_PUBLIC_SITECORE_SEARCH_KNOWLEDGE_CENTER_SOURCE as string,
        ])
        .setSearchQueryHighlightFragmentSize(500)
        .setSearchQueryHighlightFields(['description', 'm_profile_description'])
        .setSearchQueryHighlightPreTag('<mark>')
        .setSearchQueryHighlightPostTag('</mark>');
    },
    config: {
      defaultFacetType: 'text', // Use text-based facets for filtering
    },
    // Initialize search state from URL hash parameters
    state: {
      sortType: urlState.sortType || defaultSortType,
      page: urlState.page,
      itemsPerPage: urlState.itemsPerPage,
      keyphrase: urlState.searchQuery,
      selectedFacets: urlState.initialFacets || [], // Facets from URL hash
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
    defaultItemsPerPage: globalSearchFields?.fields?.PageSizeCount?.value || defaultItemsPerPage,
  });

  // Process search results to add formatted event dates and times
  const searchResults = rawSearchResults.map((result) => processEventDates(result));

  return (
    <ContainedWrapper theme={effectiveTheme}>
      <SearchResultsGlobalStyles />
      <SearchResultsContainer ref={widgetRef} data-component="GlobalSearchResults">
        {isLoading ? (
          <SearchSkeletonTheme>
            <SearchResultsSkeletonLayout
              itemsPerPage={SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE}
              showSidebar={true}
              gridCols="grid-cols-1"
              horizontalBreakpoint="sm"
              showImage={true}
            />
          </SearchSkeletonTheme>
        ) : (
          <EditModeClickDisabler>
            <SearchResultsGrid
              searchResults={searchResults}
              facets={facets || []}
              page={page}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              sortChoices={sortChoices || []}
              sortType={sortType}
              totalPages={totalPages}
              onItemClick={onItemClick}
              globalSearchFields={globalSearchFields}
              keyphrase={keyphrase}
              onKeyphraseChange={onKeyphraseChange}
            />
          </EditModeClickDisabler>
        )}
      </SearchResultsContainer>
    </ContainedWrapper>
  );
};

const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  searchResults,
  facets,
  page,
  itemsPerPage,
  totalItems,
  sortChoices,
  sortType,
  totalPages,
  onItemClick,
  globalSearchFields,
  keyphrase,
  onKeyphraseChange,
}) => {
  const { t } = useTranslation();

  return (
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
        <SharedSearchInput
          currentKeyphrase={keyphrase}
          placeholder={t('Find activities, events, places, and more')}
          ariaLabel={t('Search site content')}
          testId="contentSRInput"
          buttonText={t('Search')}
          onKeyphraseChange={onKeyphraseChange}
        />
        {totalItems > 0 && (
          <SearchResultsToolbar
            facets={facets as SearchResponseFacet[]}
            page={page}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            totalItemsReturned={searchResults.length}
            sortChoices={sortChoices as SearchResponseSortChoice[]}
            sortType={sortType}
          />
        )}

        {/* Results List */}
        <ResultListContainer data-component="SearchResultsList">
          {(searchResults.length || 0) <= 0 && (
            <NoResultsContainer>
              <p>{t('SearchNoResults')}</p>
            </NoResultsContainer>
          )}
          <ListLayoutContainer>
            {searchResults.map((result, index) => {
              if (!result) return null;

              if (result.type === KNOWLEDGE_CENTER_RESOURCE) {
                return (
                  <KnowledgeCenterHorizontalCard
                    resource={result}
                    index={index}
                    onItemClick={onItemClick}
                    key={result.id || index}
                  />
                );
              } else if (
                result.m_templateid === removeCurlyBraces(EVENT_TEMPLATE_ID).toLowerCase()
              ) {
                return (
                  <EventItemCard
                    event={result}
                    index={index}
                    onItemClick={onItemClick}
                    horizontalBreakpoint="sm"
                    key={result.id || index}
                  />
                );
              } else if (
                result.m_templateid === removeCurlyBraces(PEOPLE_PAGE_TEMPLATE_ID).toLowerCase()
              ) {
                return (
                  <PersonItemCard
                    person={result}
                    index={index}
                    onItemClick={onItemClick}
                    horizontalBreakpoint="sm"
                    key={result.id || index}
                  />
                );
              } else if (
                result.m_templateid === removeCurlyBraces(ARTICLE_TEMPLATE_ID).toLowerCase() ||
                result.m_templateid === removeCurlyBraces(NEWS_TEMPLATE_ID).toLowerCase() ||
                result.m_templateid === removeCurlyBraces(INSIGHTS_TEMPLATE_ID).toLowerCase()
              ) {
                return (
                  <ArticleItemCard
                    article={result}
                    index={index}
                    onItemClick={onItemClick}
                    key={result.id || index}
                  />
                );
              } else if (
                result.m_templateid === removeCurlyBraces(PRODUCT_PAGE_TEMPLATE_ID).toLowerCase()
              ) {
                return (
                  <ProductCard
                    product={result}
                    index={index}
                    onItemClick={onItemClick}
                    key={result.id || index}
                    horizontalBreakpoint="sm"
                  />
                );
              } else {
                return (
                  <DefaultItemCard
                    result={result}
                    index={index}
                    onItemClick={onItemClick}
                    key={result.id || index}
                  />
                );
              }
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
  );
};

type SearchResultsGridProps = {
  searchResults: SearchResultModel[];
  facets: Record<string, unknown>[];
  page: number;
  itemsPerPage: number;
  totalItems: number;
  sortChoices: Record<string, unknown>[];
  sortType: string;
  totalPages: number;
  onItemClick: (item: Record<string, unknown>) => void;
  globalSearchFields?: GlobalSearchProps;
  keyphrase?: string;
  onKeyphraseChange?: OnKeyphraseChangeAction;
};

const GlobalSearchComponentWidget = widget(
  GlobalSearchComponent,
  WidgetDataType.SEARCH_RESULTS,
  'content'
);

export default GlobalSearchComponentWidget;
