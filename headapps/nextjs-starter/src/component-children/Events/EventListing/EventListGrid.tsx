import React, { useState, useRef, useEffect, useMemo } from 'react';
import { EventDataType } from 'lib/types';
import { useTranslation } from 'lib/hooks/useTranslation';
import { Pagination } from 'component-children/Shared/Pagination/Pagination';
import { isNullishDateTime } from 'lib/helpers/time-date-helper';
import { Toggle } from 'component-children/Shared/Button/Toggle';
import moment from 'moment';
import EventCard from 'component-children/Shared/Event/EventCard';
import { getValidPageSize } from 'lib/helpers/page-size';

export type EventResultsType = {
  results: EventDataType[];
  searchRef?: React.RefObject<HTMLDivElement | null>; // Optional - only scrolls when provided
  showToggle?: boolean;
  initialShowCurrent?: boolean;
  itemsPerPage?: number;
};

const EventListGrid: React.FC<EventResultsType> = ({
  results,
  searchRef,
  showToggle = true, // Show toggle by default
  initialShowCurrent = true, // Show current events by default
  itemsPerPage: itemsPerPageProp,
}) => {
  const itemsPerPage = getValidPageSize(itemsPerPageProp);
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCurrentEvents, setShowCurrentEvents] = useState(initialShowCurrent);
  const isInitialMount = useRef(true);

  // Helper function to filter events based on show current state
  const getFilteredEvents = (
    events: EventDataType[],
    showCurrent: boolean,
    enableToggle: boolean
  ) => {
    if (!events || events.length === 0) return [];

    if (!enableToggle) {
      // If toggle is disabled, return all events
      return events;
    }

    // Get current date in UTC at start of day
    const currentDate = moment.utc().startOf('day');

    return events.filter((event: EventDataType) => {
      if (
        !event ||
        (isNullishDateTime(event.endDate?.formattedDateValue) &&
          isNullishDateTime(event.startDate?.formattedDateValue))
      )
        return true;

      // Use endDate if available, otherwise fallback to startDate
      const eventDate = event.endDate?.formattedDateValue || event.startDate?.formattedDateValue;
      if (isNullishDateTime(eventDate)) return true;

      // Parse event date as UTC with format and set to end of day
      const eventEndDate = moment.utc(eventDate!, 'MM/DD/YYYY').endOf('day');

      if (showCurrent) {
        // Show only future/ongoing events when toggle is on
        return eventEndDate.isSameOrAfter(currentDate);
      } else {
        // Show only past events when toggle is off
        return eventEndDate.isBefore(currentDate);
      }
    });
  };

  // Initialize displayResults with correctly filtered events to prevent blinking
  const [displayResults, setDisplayResults] = useState(() =>
    getFilteredEvents(results, initialShowCurrent, showToggle)
  );

  // Filter events based on the toggle state
  const filteredEvents = useMemo(() => {
    return getFilteredEvents(results, showCurrentEvents, showToggle);
  }, [results, showCurrentEvents, showToggle]);

  // Handle toggle change
  const handleToggleChange = (checked: boolean) => {
    setShowCurrentEvents(checked);
  };

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  // Compute paginated results
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = displayResults.slice(startIndex, startIndex + itemsPerPage);

  // Handle smooth transitions when filtered events change
  useEffect(() => {
    if (JSON.stringify(filteredEvents) !== JSON.stringify(displayResults)) {
      setIsTransitioning(true);

      // Delay the content update to allow fade-out animation
      const timer = setTimeout(() => {
        setDisplayResults(filteredEvents);
        setCurrentPage(1); // Reset to first page when filtering changes
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [filteredEvents, displayResults]);

  // Handle scrolling when page changes (if searchRef provided)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only scroll if searchRef was provided
    if (typeof window !== 'undefined' && searchRef?.current) {
      searchRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [currentPage, searchRef]);

  // Check if we have any events at all (either current or previous)
  const hasCurrentEvents = useMemo(() => {
    if (!results || results.length === 0) return false;

    // Get current date in UTC at start of day
    const currentDate = moment.utc().startOf('day');

    return results.some((event: EventDataType) => {
      if (!event) return false;
      const eventDate = event.endDate?.formattedDateValue || event.startDate?.formattedDateValue;
      if (isNullishDateTime(eventDate)) return true;

      // Parse event date as UTC with format and set to end of day
      const eventEndDate = moment.utc(eventDate!, 'MM/DD/YYYY').endOf('day');
      return eventEndDate.isSameOrAfter(currentDate);
    });
  }, [results]);

  const hasPreviousEvents = useMemo(() => {
    if (!results || results.length === 0) return false;

    // Get current date in UTC at start of day
    const currentDate = moment.utc().startOf('day');

    return results.some((event: EventDataType) => {
      if (!event) return false;
      const eventDate = event.endDate?.formattedDateValue || event.startDate?.formattedDateValue;
      if (isNullishDateTime(eventDate)) return false;

      // Parse event date as UTC with format and set to end of day
      const eventEndDate = moment.utc(eventDate!, 'MM/DD/YYYY').endOf('day');
      return eventEndDate.isBefore(currentDate);
    });
  }, [results]);

  // Only hide the toggle if there are no events at all
  const shouldShowToggle = showToggle && (hasCurrentEvents || hasPreviousEvents);

  // If there are no events at all, show "No events found"
  if (results.length === 0) {
    return <p className="py-8 text-center">{t('No event pages found.')}</p>;
  }

  // Display message when filtered events are empty but we have events
  const showEmptyFilterMessage = filteredEvents.length === 0;

  return (
    <>
      {/* Toggle Switch - only hide if there are no events at all */}
      {shouldShowToggle && (
        <Toggle
          showToggle={showCurrentEvents}
          handleFunction={handleToggleChange}
          onState={t('Event Listing Toggle On')}
          offState={t('Event Listing Toggle Off')}
          showAnnouncement={true}
        />
      )}

      <div
        data-component="EventListGrid"
        className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {showEmptyFilterMessage ? (
          <p className="py-8 text-center">{t('No event pages found.')}</p>
        ) : (
          paginatedResults.map((event, index) => {
            if (!event) return null;

            return (
              <EventCard
                key={`${event.id || index}-${isTransitioning ? 'old' : 'new'}`}
                event={event}
                isTransitioning={isTransitioning}
                transitionIndex={index}
              />
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div
          className={`mt-8 flex justify-center transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-50' : 'opacity-100'} `}
        >
          <Pagination length={totalPages} selected={currentPage} setSelected={setCurrentPage} />
        </div>
      )}
    </>
  );
};

export default EventListGrid;
