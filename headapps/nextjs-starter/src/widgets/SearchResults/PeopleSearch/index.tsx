import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
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
import PersonItemCard from '../components/PersonItemCard';
import Filters from '../components/Filter';
import SearchInitialsFacets from '../components/NameInitialFacets';
import SearchFacets from '../components/SearchFacets';
import { SearchResultsPagination } from '../components/SearchResultsPagination';
import { SearchResultsToolbar } from '../components/SearchResultsToolbar';
import { SharedSearchInput } from '../components/SharedSearchInput';
import { useTranslation } from 'lib/hooks/useTranslation';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { useFrame } from 'lib/hooks/useFrame';
import {
  SearchResultsGlobalStyles,
  SearchResultsContainer,
  ResultsGridContainer,
  MainLayoutContainer,
  SidebarContainer,
  MainContentContainer,
  NoResultsContainer,
  ListLayoutContainer,
} from './styled';
import { GlobalSearchProps } from 'lib/types/components/Search/global-search';
import { removeCurlyBraces } from 'lib/helpers';
import { PEOPLE_PAGE_TEMPLATE_ID } from 'lib/graphql/id';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import {
  getSitecoreSearchSourceBySite,
  LOCALE_CONFIG,
  PROFILE_LAST_NAME_INITIAL_FACET_NAME,
} from 'lib/const/search-const';
import { mainLanguage } from 'lib/i18n/i18n-config';
import {
  extractHashParams,
  mergeHashParams,
  buildUrlWithHash,
  normalizeHashParams,
} from 'lib/helpers';
import { useFacetUrlSync } from 'lib/hooks/useFacetUrlSync';
import { OnKeyphraseChangeAction } from 'lib/hooks/search/useSearchInput';
import { SearchSkeletonTheme, SearchResultsSkeletonLayout } from '../components/skeletons';
import { SKELETON_ITEMS_CONFIG } from 'lib/const';
import { EditModeClickDisabler } from 'component-children/Shared/Containers/EditModeClickDisabler';

type PersonModel = {
  id: string;
  source_id?: string;
  image_url?: string;
  url?: string;
  title?: string;
  m_profile_full_name?: string;
  m_profile_description?: string;
  m_profile_location?: string[];
  m_profile_role?: string;
  m_profile_expertise?: string[];
  highlight?: {
    m_profile_description?: string[];
  };
};

type PeopleSearchComponentProps = {
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

const PeopleSearchComponent = ({
  defaultSortType = 'm_profile_last_name_asc',
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = 10,
  globalSearchFields,
}: PeopleSearchComponentProps) => {
  const { effectiveTheme } = useFrame();
  const { page: sitecorePage } = useSitecore();
  const currentLocale = sitecorePage?.locale || mainLanguage;
  const languageAndCountry = LOCALE_CONFIG[currentLocale] ?? LOCALE_CONFIG['default'];
  const router = useRouter();

  // Sync facets between URL and component state (bidirectional)
  const initialFacetsFromUrl = useFacetUrlSync();

  // Extract search parameters from URL hash for state initialization
  const hashParams = extractHashParams(router);

  // Safely decode search query from URL, with fallback for malformed encoding
  const searchQueryFromUrl = hashParams?.searchQuery
    ? (() => {
        try {
          return decodeURIComponent(hashParams.searchQuery);
        } catch (e) {
          console.warn('Failed to decode search query:', hashParams.searchQuery);
          return hashParams.searchQuery; // Use raw value if decoding fails
        }
      })()
    : undefined;

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
        content: people = [],
      } = {},
    },
  } = useSearchResults<PersonModel, InitialState>({
    query: (query) => {
      context.setLocaleLanguage(languageAndCountry.language);
      context.setLocaleCountry(languageAndCountry.country);

      const allFilters = [];

      const lang = sitecorePage?.locale;
      const languageFilter = new FilterEqual('m_language', lang);
      allFilters.push(languageFilter);

      const templateIdFilter = new FilterEqual(
        'm_templateid',
        removeCurlyBraces(PEOPLE_PAGE_TEMPLATE_ID).toLowerCase()
      );
      allFilters.push(templateIdFilter);

      query
        .getRequest()
        .setSearchFilter(new FilterAnd(allFilters))
        .setSources([getSitecoreSearchSourceBySite(sitecorePage?.siteName as string)])
        .setSearchQueryHighlightFragmentSize(500)
        .setSearchQueryHighlightFields(['m_profile_description'])
        .setSearchQueryHighlightPreTag('<mark>')
        .setSearchQueryHighlightPostTag('</mark>')
        .addSearchFacetType({
          name: PROFILE_LAST_NAME_INITIAL_FACET_NAME,
          max: 100,
        });
    },
    config: {
      defaultFacetType: 'text', // Use text-based facets for filtering
    },
    // Initialize search state from URL hash parameters with fallbacks to defaults
    state: {
      sortType: hashParams?.sortType || defaultSortType,
      page: hashParams?.page ? Number(hashParams.page) || defaultPage : defaultPage,
      itemsPerPage:
        Number(hashParams?.itemsPerPage) ||
        globalSearchFields?.fields?.PageSizeCount?.value ||
        defaultItemsPerPage,
      keyphrase: searchQueryFromUrl || defaultKeyphrase || '',
      selectedFacets: initialFacetsFromUrl || [], // Facets from URL hash
    },
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  /**
   * Effect to clear the browser navigation flag after all effects have checked it.
   * This runs once on mount and clears the flag after a delay to ensure all useEffects
   * in this component and in useFacetUrlSync have had a chance to check it.
   */
  useEffect(() => {
    const isBrowserNav =
      typeof window !== 'undefined' && sessionStorage.getItem('__isBrowserNavigation') === 'true';

    if (isBrowserNav) {
      // Clear the flag after all effects have had a chance to check it
      // This delay ensures both this component's useEffect and useFacetUrlSync have run
      const timeoutId = setTimeout(() => {
        sessionStorage.removeItem('__isBrowserNavigation');
      }, 500); // Increased to 500ms to be safe

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, []); // Run once on mount

  /**
   * Effect to handle browser back/forward navigation.
   * When the user presses back/forward buttons, we need to reload the page to reinitialize
   * the Sitecore Search state with the new URL parameters.
   *
   * We use sessionStorage to persist a flag across the reload that prevents both the main
   * component and useFacetUrlSync from pushing duplicate URL entries during the reload process.
   *
   * Note: window.location.reload() does NOT clear browser forward/back history.
   * It only reloads the current URL that the browser navigated to.
   */
  useEffect(() => {
    const handlePopState = () => {
      // Set a flag in sessionStorage that persists across page reload
      // This prevents URL pushing during the reload cycle
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('__isBrowserNavigation', 'true');
      }

      // Reload the page to reinitialize search state with new URL
      window.location.reload();
    };

    // Listen for popstate which fires for browser back/forward
    window.addEventListener('popstate', handlePopState);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  /**
   * Effect to update URL hash when pagination or sorting changes.
   * This ensures that page state is reflected in the URL for bookmarking and sharing.
   * Preserves existing facets and search query while updating pagination/sorting parameters.
   */
  useEffect(() => {
    if (!router?.isReady) {
      return;
    }

    // Don't update URL until we have valid data from the query
    // This prevents resetting page to 1 when totalPages is still 0 during initial load
    if (isLoading || (totalPages === 0 && page > 1)) {
      return;
    }

    // Extract current search query from hash to preserve it
    const currentHashParams = extractHashParams(router);
    const searchQuery = currentHashParams?.searchQuery || '';

    // Build object with parameters that need to be updated in URL
    const newParams: Record<string, string> = {};

    // Always include pagination, sort, and page size parameters
    // This ensures consistent URLs and proper back/forward navigation
    if (itemsPerPage) {
      newParams.pagesizecount = itemsPerPage.toString();
    }

    // Ensure page is at least 1 (never 0) and at most totalPages
    const validPage = Math.max(1, Math.min(page || 1, totalPages || 1));
    newParams.page = validPage.toString();

    if (sortType) {
      newParams.sort = sortType;
    }

    // Preserve search query in hash
    if (searchQuery) {
      newParams.searchQuery = searchQuery;
    }

    // Include any additional query parameters from Next.js router
    // Exclude our hash-based params and Next.js internal params
    Object.entries(router.query).forEach(([key, value]) => {
      if (
        key !== 'searchQuery' &&
        key !== 'pagesizecount' &&
        key !== 'path' && // Next.js dynamic route parameter
        key !== 'sort' &&
        key !== 'page' &&
        value
      ) {
        newParams[key] = Array.isArray(value) ? value[0] : (value as string);
      }
    });

    // Build new hash by merging new params with existing ones (preserves facets, etc.)
    const updatedHashParams = mergeHashParams(router, newParams);
    const asUrl = buildUrlWithHash(updatedHashParams);
    // Use toString() directly for consistent encoding and replace encoded pipes
    let hashString = updatedHashParams.toString();
    // Replace encoded pipe characters (%7C) with actual pipe (|) for better readability
    hashString = hashString.replace(/%7C/g, '|');

    // Get current hash from URL for comparison
    const currentHash = window.location.hash.substring(1); // Remove leading #

    // Normalize both hashes for comparison by parsing, sorting params, and re-encoding
    // This handles both encoding differences (%20 vs +) and parameter order differences
    let normalizedCurrentHash = normalizeHashParams(new URLSearchParams(currentHash)).toString();
    let normalizedNewHash = normalizeHashParams(new URLSearchParams(hashString)).toString();
    // Replace encoded pipes in both for consistent comparison
    normalizedCurrentHash = normalizedCurrentHash.replace(/%7C/g, '|');
    normalizedNewHash = normalizedNewHash.replace(/%7C/g, '|');

    // Check if this is browser navigation (back/forward button)
    // The flag persists in sessionStorage across page reloads
    // Note: Flag is cleared by a separate useEffect after all components have checked it
    const isBrowserNav =
      typeof window !== 'undefined' && sessionStorage.getItem('__isBrowserNavigation') === 'true';

    // Only update URL if:
    // 1. The hash has actually changed (prevents duplicate history entries)
    // 2. This is NOT browser navigation (prevents overwriting back/forward URLs)
    if (router.isReady && normalizedCurrentHash !== normalizedNewHash && !isBrowserNav) {
      // Mark this as a programmatic change before pushing
      if (typeof window !== 'undefined') {
        (
          window as Window & { __isSearchProgrammaticChange?: boolean }
        ).__isSearchProgrammaticChange = true;
      }

      router
        .push(
          {
            pathname: router.pathname,
            hash: hashString,
          },
          asUrl,
          {
            shallow: true, // Don't trigger full page reload
            scroll: false, // Prevent auto-scroll on hash changes
          }
        )
        .catch((e) => {
          // Handle Next.js router cancellation gracefully
          // This occurs when multiple navigation events happen rapidly
          if (!e.cancelled) {
            throw e;
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultPage,
    defaultSortType,
    globalSearchFields?.fields?.PageSizeCount?.value,
    itemsPerPage,
    page,
    sortType,
  ]); // Re-run when pagination/sorting changes
  // Note: router and totalPages are intentionally excluded from dependencies
  // - router: excluded to prevent infinite loops
  // - totalPages: excluded because it changes as side effect of facet filtering, not user action
  // This prevents duplicate history entries when facets change

  const filteredFacets = useMemo(() => {
    return (facets as SearchResponseFacet[]) || [];
  }, [facets]);

  return (
    <ContainedWrapper theme={effectiveTheme}>
      <SearchResultsGlobalStyles />
      <SearchResultsContainer ref={widgetRef} data-component="AuthorsSearchResults">
        {isLoading ? (
          <SearchSkeletonTheme>
            <SearchResultsSkeletonLayout
              itemsPerPage={SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE}
              showSidebar={true}
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              horizontalBreakpoint={undefined}
              showImage={true}
            />
          </SearchSkeletonTheme>
        ) : (
          <EditModeClickDisabler>
            <SearchResultsGrid
              people={people}
              facets={filteredFacets}
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
  people,
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
    <div>
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
        <MainContentContainer className="gap-3">
          <SharedSearchInput
            currentKeyphrase={keyphrase}
            testId="contentSRInput"
            onKeyphraseChange={onKeyphraseChange}
          />
          {totalItems > 0 && (
            <SearchResultsToolbar
              facets={facets as SearchResponseFacet[]}
              page={page}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              totalItemsReturned={people.length}
              sortChoices={sortChoices as SearchResponseSortChoice[]}
              sortType={sortType}
            />
          )}

          {/* Last name initial filters */}
          <SearchInitialsFacets facets={facets as SearchResponseFacet[]} />

          {/* Results Grid/List */}
          <ResultsGridContainer data-component="SearchResultsGrid">
            {(people.length || 0) <= 0 && (
              <NoResultsContainer>
                <p>{t('SearchNoResults')}</p>
              </NoResultsContainer>
            )}
            <ListLayoutContainer>
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {people.map((person, index) => {
                  if (!person) return null;
                  return (
                    <PersonItemCard
                      person={person}
                      index={index}
                      onItemClick={onItemClick}
                      key={person.id || index}
                    />
                  );
                })}
              </div>
            </ListLayoutContainer>
          </ResultsGridContainer>

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
    </div>
  );
};

type SearchResultsGridProps = {
  people: PersonModel[];
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

const PeopleSearchComponentWidget = widget(
  PeopleSearchComponent,
  WidgetDataType.SEARCH_RESULTS,
  'content'
);

export default PeopleSearchComponentWidget;
