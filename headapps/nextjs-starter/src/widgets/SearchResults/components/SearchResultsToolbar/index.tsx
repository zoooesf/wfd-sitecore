import type { SearchResponseFacet, SearchResponseSortChoice } from '@sitecore-search/react';
import MobileFacetsDrawer from '../MobileFacetsDrawer/MobileFacetsDrawer';
import QueryResultsSummary from '../QueryResultsSummary';
import SortOptions from '../SortOrder';
import type { DateRange } from 'lib/types/date-range';

type SearchResultsToolbarProps = {
  facets: SearchResponseFacet[];
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalItemsReturned: number;
  sortChoices: SearchResponseSortChoice[];
  sortType: string;
  showPastEvents?: boolean;
  onPastEventsChange?: (checked: boolean) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (start: Date | undefined, end: Date | undefined) => void;
};

export const SearchResultsToolbar: React.FC<SearchResultsToolbarProps> = ({
  facets,
  page,
  itemsPerPage,
  totalItems,
  totalItemsReturned,
  sortChoices,
  sortType,
  showPastEvents,
  onPastEventsChange,
  dateRange,
  onDateRangeChange,
}) => {
  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Mobile facets button - always show on mobile/tablet, hide on desktop */}
        <MobileFacetsDrawer
          facets={facets}
          showPastEvents={showPastEvents}
          onPastEventsChange={onPastEventsChange}
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />

        {/* Results Summary - hidden on mobile/tablet, show on desktop */}
        {totalItems > 0 && (
          <QueryResultsSummary
            currentPage={page}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            totalItemsReturned={totalItemsReturned}
            className="hidden md:block"
          />
        )}

        {totalItems > 0 && sortChoices.length > 0 && (
          <SortOptions options={sortChoices} selected={sortType} />
        )}
      </div>

      {/* Results Summary on mobile - show below sort on mobile/tablet */}
      {totalItems > 0 && (
        <div className="flex md:hidden">
          <QueryResultsSummary
            currentPage={page}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            totalItemsReturned={totalItemsReturned}
          />
        </div>
      )}
    </>
  );
};
