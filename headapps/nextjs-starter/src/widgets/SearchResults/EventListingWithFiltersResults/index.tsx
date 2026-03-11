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
  FilterGreaterOrEqualThan,
  FilterLessOrEqualThan,
  PageController,
  useSearchResults,
  widget,
  WidgetDataType,
} from '@sitecore-search/react';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { MainLayoutContainer, SidebarContainer, MainContentContainer } from './styled';
import { useTranslation } from 'lib/hooks/useTranslation';
import { EVENT_TEMPLATE_ID } from 'lib/graphql/id';
import { removeCurlyBraces } from 'lib/helpers';
import { getValidPageSize, DEFAULT_PAGE_SIZE } from 'lib/helpers/page-size';
import { processEventDates } from 'lib/helpers/time-date-helper';
import {
  SearchListingWithFiltersFields,
  SearchListingWithFiltersProps,
} from 'lib/types/components/Search/search-listing-filters';
import { getFilterByTags } from '../QueryHelpers/filter-by-helpers';
import {
  getSitecoreSearchSourceBySite,
  EVENT_START_DATE_ASC_SORT_TYPE,
  EVENT_START_DATE_DESC_SORT_TYPE,
  LOCALE_CONFIG,
  DATE_FORMAT_ISO,
} from 'lib/const/search-const';
import { mainLanguage } from 'lib/i18n/i18n-config';
import Filters from '../components/Filter';
import SearchFacets from '../components/SearchFacets';
import { SearchResultsToolbar } from '../components/SearchResultsToolbar';
import { useContextPageTags } from 'lib/contexts/page-tags-context';
import { useSearchUrlState } from 'lib/hooks/search/useSearchUrlState';
import { useSearchUrlSync } from 'lib/hooks/search/useSearchUrlSync';
import { useBrowserNavigation } from 'lib/hooks/search/useBrowserNavigation';
import { SharedSearchInput } from '../components/SharedSearchInput';
import EventsItemCard from '../components/EventItemCard';
import { SearchResultsPagination } from '../components/SearchResultsPagination';
import { PastEventsCheckbox } from '../components/PastEventsCheckbox';
import { useFrame } from 'lib/hooks/useFrame';
import { SearchSkeletonTheme, SearchResultsSkeletonLayout } from '../components/skeletons';
import { SKELETON_ITEMS_CONFIG } from 'lib/const';
import moment from 'moment';
import { DesktopDateRangeFilter } from '../components/DateRangeFilter';
import type { DateRange } from 'lib/types/date-range';
import {
  ListLayoutContainer,
  ResultListContainer,
  SearchResultsContainer,
  NoResultsContainer,
} from '../GlobalSearch/styled';
import { EditModeClickDisabler } from 'component-children/Shared/Containers/EditModeClickDisabler';

type EventModel = {
  id: string;
  type?: string;
  m_title?: string;
  name?: string;
  m_subheading?: string;
  m_description?: string;
  url?: string;
  content_text?: string;
  m_image_url?: string;
  m_og_image_url?: string;
  source_id?: string;
  m_event_startdate?: string;
  m_event_enddate?: string;
  m_startdatetime?: string;
  m_enddatetime?: string;
  m_event_location?: string | string[];
  m_category?: string[];
  // Formatted date fields added by processEventDates
  formattedStartDate?: string;
  formattedEndDate?: string;
  event_starttime?: string;
  event_endtime?: string;
};

type EventListingWithFiltersResultsProps = {
  defaultPage?: SearchResultsStoreState['page'];
  defaultItemsPerPage?: SearchResultsStoreState['itemsPerPage'];
  defaultKeyphrase?: SearchResultsStoreState['keyphrase'];
  props: SearchListingWithFiltersProps;
  showPastEvents: boolean;
  onPastEventsChange: (checked: boolean) => void;
  dateRange: DateRange;
  onDateRangeChange: (start: Date | undefined, end: Date | undefined) => void;
};

type InitialState = SearchResultsInitialState<
  'itemsPerPage' | 'keyphrase' | 'page' | 'sortType' | 'selectedFacets'
>;

const context = PageController.getContext();

export const EventListingWithFiltersResults = ({
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = DEFAULT_PAGE_SIZE,
  props,
  showPastEvents,
  onPastEventsChange,
  dateRange,
  onDateRangeChange,
}: EventListingWithFiltersResultsProps) => {
  const { effectiveTheme } = useFrame();

  const { page: sitecorePage } = useSitecore();
  const { pageTags } = useContextPageTags();
  const { t } = useTranslation();

  const currentLocale = sitecorePage?.locale || mainLanguage;
  const languageAndCountry = LOCALE_CONFIG[currentLocale] ?? LOCALE_CONFIG['default'];

  // Calculate current date string for search filtering (using UTC to prevent timezone shifts)
  const currentDateString = moment.utc().startOf('day').format(DATE_FORMAT_ISO);

  // Compute sort type based on past events checkbox state
  // Future/current events: descending (soonest first)
  // Past events: ascending (oldest to newest)
  const defaultSortType = showPastEvents
    ? EVENT_START_DATE_DESC_SORT_TYPE
    : EVENT_START_DATE_ASC_SORT_TYPE;

  // Get validated page size from Sitecore field
  const validatedPageSize = getValidPageSize(props?.fields?.PageSizeCount?.value);

  // Extract URL state (pagination, sorting, search query, facets) from hash parameters
  const urlState = useSearchUrlState({
    defaultSortType,
    defaultPage,
    defaultItemsPerPage,
    defaultKeyphrase,
    pageSizeFromFields: validatedPageSize,
  });

  // Check if filtering is enabled via params or fields
  const filterEnabled = useMemo(() => {
    // Check in params first
    const params = props?.rendering?.params || {};
    const filterParam = params.filter || params.tagFilteringEnabled;

    // Check in fields (fields.filterByTags.value)
    const renderingFields = props?.rendering?.fields || {};
    const filterByTagsField =
      renderingFields.filterByTags &&
      typeof renderingFields.filterByTags === 'object' &&
      'value' in renderingFields.filterByTags
        ? renderingFields.filterByTags.value
        : undefined;

    return (
      filterParam === '1' ||
      filterParam === 'true' ||
      filterByTagsField === true ||
      filterByTagsField === 'true' ||
      filterByTagsField === '1'
    );
  }, [props?.rendering?.params, props?.rendering?.fields]);

  const {
    widgetRef,
    actions: { onItemClick, onKeyphraseChange },
    state: { page, itemsPerPage, sortType, keyphrase },
    queryResult: {
      isLoading,
      data: {
        total_item: totalItems = 0,
        content: events = [],
        facet: facets = [],
        sort: { choices: sortChoices = [] } = {},
      } = {},
    },
  } = useSearchResults<EventModel, InitialState>({
    config: {
      defaultFacetType: 'text', // Use text-based facets for filtering
    },
    query: (query) => {
      context.setLocaleLanguage(languageAndCountry.language);
      context.setLocaleCountry(languageAndCountry.country);
      const allFilters = [];

      const templateIdFilter = new FilterEqual(
        'm_templateid',
        removeCurlyBraces(EVENT_TEMPLATE_ID).toLowerCase()
      );
      allFilters.push(templateIdFilter);

      // Apply tag-based filtering using component fields (not route context)
      // This prevents stale data from event detail pages affecting the listing
      if (!filterEnabled && pageTags.length === 0) {
        // When filtering is disabled and no page tags, use component-level filters
        const filterByTags = getFilterByTags({ fields: props?.fields });
        if (filterByTags.length > 0) {
          allFilters.push(...filterByTags);
        }
      }

      if (filterEnabled || pageTags.length > 0) {
        // When filtering is enabled or page tags exist, use page-level context
        const filterByTags = getFilterByTags({
          fields: sitecorePage?.layout?.sitecore?.route?.fields as SearchListingWithFiltersFields,
        });
        allFilters.push(...filterByTags);
      }

      // Add date range filter if selected
      if (dateRange.start && dateRange.end) {
        const rangeStart = moment(dateRange.start).format(DATE_FORMAT_ISO);
        const rangeEnd = moment(dateRange.end).format(DATE_FORMAT_ISO);

        // Event overlaps if: event_start <= rangeEnd AND event_end >= rangeStart
        const startFilter = new FilterLessOrEqualThan('m_event_startdate', rangeEnd);
        const endFilter = new FilterGreaterOrEqualThan('m_event_enddate', rangeStart);

        allFilters.push(startFilter);
        allFilters.push(endFilter);
      }

      // Add date filter based on past events checkbox state
      // This applies AFTER date range to respect showPastEvents
      if (!showPastEvents) {
        // Only show current/future events (events that haven't ended yet)
        const todayFilter = new FilterGreaterOrEqualThan('m_event_enddate', currentDateString);
        allFilters.push(todayFilter);
      } else {
        // Show past events (events that have ended)
        const pastFilter = new FilterLessOrEqualThan('m_event_enddate', currentDateString);
        allFilters.push(pastFilter);
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
    defaultItemsPerPage: validatedPageSize,
    pastEvents: showPastEvents,
    dateRange: dateRange,
  });

  // Process events to add formatted date and time fields
  const processedEvents = events.map((event) => processEventDates(event));

  // Use all facets directly from Sitecore Search without filtering
  const filteredFacets = useMemo(() => {
    return (facets as SearchResponseFacet[]) || [];
  }, [facets]);

  const handlePastEventsChange = (checked: boolean) => {
    // Call parent's handler to update state
    onPastEventsChange(checked);
  };

  return (
    <>
      {isLoading ? (
        <ContainedWrapper className="mx-auto flex flex-col gap-10" theme={effectiveTheme}>
          <SearchResultsContainer ref={widgetRef} data-component="EventListingWithFiltersResults">
            <SearchSkeletonTheme>
              <SearchResultsSkeletonLayout
                itemsPerPage={SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE}
                showSidebar={true}
                gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                showImage={true}
              />
            </SearchSkeletonTheme>
          </SearchResultsContainer>
        </ContainedWrapper>
      ) : (
        <ContainedWrapper className="mx-auto flex flex-col gap-10" theme={effectiveTheme}>
          <SearchResultsContainer ref={widgetRef} data-component="EventListingWithFiltersResults">
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
                  <DesktopDateRangeFilter
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                  />
                  <SearchFacets facets={filteredFacets as SearchResponseFacet[]} />
                  <PastEventsCheckbox checked={showPastEvents} onChange={handlePastEventsChange} />
                </SidebarContainer>

                {/* Right Content Area */}
                <MainContentContainer>
                  {/* Top Controls */}
                  <SharedSearchInput
                    currentKeyphrase={keyphrase}
                    placeholder={t('Search events')}
                    ariaLabel={t('Search events')}
                    testId="eventListingSRInput"
                    buttonText={t('Search')}
                    onKeyphraseChange={onKeyphraseChange}
                  />
                  <SearchResultsToolbar
                    facets={filteredFacets as SearchResponseFacet[]}
                    page={page}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    totalItemsReturned={events.length}
                    sortChoices={sortChoices as SearchResponseSortChoice[]}
                    sortType={sortType}
                    showPastEvents={showPastEvents}
                    onPastEventsChange={handlePastEventsChange}
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                  />

                  {/* Results Grid */}
                  <ResultListContainer data-component="SearchResultsGrid">
                    {(processedEvents.length || 0) <= 0 && (
                      <NoResultsContainer>
                        <p>{props?.fields?.noResultsText?.value}</p>
                      </NoResultsContainer>
                    )}
                    <ListLayoutContainer>
                      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {processedEvents.map((event, index) => (
                          <div
                            key={`${event.id || index}-${showPastEvents ? 'past' : 'current'}`}
                            className="h-full"
                          >
                            <EventsItemCard event={event} index={index} onItemClick={onItemClick} />
                          </div>
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
          </SearchResultsContainer>
        </ContainedWrapper>
      )}
    </>
  );
};

const EventListingWithFiltersWidget = widget(
  EventListingWithFiltersResults,
  WidgetDataType.SEARCH_RESULTS,
  'content'
);

export default EventListingWithFiltersWidget;
