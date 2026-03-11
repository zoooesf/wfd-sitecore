import { useState } from 'react';
import { WidgetsProvider } from '@sitecore-search/react';
import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import EventListingWithFiltersWidget from 'src/widgets/SearchResults/EventListingWithFiltersResults';
import Frame from 'component-children/Shared/Frame/Frame';
import { SEARCH_CONFIG } from 'lib/const/search-const';
import { SearchListingWithFiltersProps } from 'lib/types/components/Search/search-listing-filters';
import { NoWidgetIdError } from './NoWidgetIdError';
import { useRouter } from 'next/router';
import type { DateRange } from 'lib/types/date-range';
import { extractHashParams, mergeHashParams } from 'lib/helpers';

/**
 * Format a Date object to ISO string in local timezone (YYYY-MM-DD)
 * Avoids timezone shifts by using local date components
 */
const formatLocalDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse ISO date string (YYYY-MM-DD) as local date with validation
 * Returns null if invalid format or invalid date values
 */
const parseDateStringLocal = (dateStr: string): Date | null => {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const [year, month, day] = parts.map(Number);
  // Validate numeric conversion
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  // Validate ranges
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  // Validate date is valid (handles Feb 31, etc.)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
};

/**
 * Parse date range from URL format (YYYY-MM-DD|YYYY-MM-DD)
 * Returns DateRange with undefined values if invalid
 */
const parseDateRangeFromUrl = (dateRangeStr: string | null | undefined): DateRange => {
  if (!dateRangeStr) {
    return { start: undefined, end: undefined };
  }

  const [startStr, endStr] = dateRangeStr.split('|');
  if (!startStr || !endStr) {
    return { start: undefined, end: undefined };
  }

  const start = parseDateStringLocal(startStr);
  const end = parseDateStringLocal(endStr);

  if (!start || !end) {
    return { start: undefined, end: undefined };
  }

  return { start, end };
};

const EventListingWithFiltersDefault: React.FC<SearchListingWithFiltersProps> = (props) => {
  const router = useRouter();

  // Initialize state from URL
  const hashParams = extractHashParams(router);
  const initialPastEvents = hashParams?.pastEvents === 'true';
  const initialDateRange: DateRange = parseDateRangeFromUrl(hashParams?.dateRange);

  const [showPastEvents, setShowPastEvents] = useState(initialPastEvents);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

  const handlePastEventsChange = (checked: boolean) => {
    // Update URL synchronously before state change triggers remount
    if (router.isReady) {
      const newParams: Record<string, string> = { pastEvents: checked.toString() };
      const updatedHashParams = mergeHashParams(router, newParams);
      const hashString = updatedHashParams.toString().replace(/%7C/g, '|');

      router
        .push(
          {
            pathname: router.pathname,
            query: router.query,
            hash: hashString,
          },
          undefined,
          { shallow: true, scroll: false }
        )
        .catch((e) => {
          if (!e.cancelled) throw e;
        });
    }

    setShowPastEvents(checked);
  };

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    // Update URL synchronously before state change triggers remount
    if (router.isReady) {
      const currentHashParams = new URLSearchParams(router.asPath.split('#')[1] || '');

      if (start && end) {
        const startStr = formatLocalDateToISO(start);
        const endStr = formatLocalDateToISO(end);
        currentHashParams.set('dateRange', `${startStr}|${endStr}`);
      } else {
        // Remove dateRange param if cleared
        currentHashParams.delete('dateRange');
      }

      const hashString = currentHashParams.toString().replace(/%7C/g, '|');

      router
        .push(
          {
            pathname: router.pathname,
            query: router.query,
            hash: hashString,
          },
          undefined,
          { shallow: true, scroll: false }
        )
        .catch((e) => {
          if (!e.cancelled) throw e;
        });
    }

    setDateRange({ start, end });
  };

  const rfkId = props.fields?.widgetId?.value;

  if (!rfkId) {
    return <NoWidgetIdError params={props.params} />;
  }

  return (
    <Frame params={props.params} className="z-10">
      <WidgetsProvider
        key={`event-listing-${showPastEvents ? 'past' : 'current'}-${
          dateRange.start?.getTime() || 'no-start'
        }-${dateRange.end?.getTime() || 'no-end'}`}
        env={SEARCH_CONFIG.env}
        customerKey={SEARCH_CONFIG.customerKey}
        apiKey={SEARCH_CONFIG.apiKey}
        publicSuffix={false}
        debug={true}
      >
        <EventListingWithFiltersWidget
          props={props}
          rfkId={rfkId}
          showPastEvents={showPastEvents}
          onPastEventsChange={handlePastEventsChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
      </WidgetsProvider>
    </Frame>
  );
};

export const Default = withDatasourceCheck()<SearchListingWithFiltersProps>(
  EventListingWithFiltersDefault
);
