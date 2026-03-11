import { GetEventListingQuery, GetEventById } from 'graphql/generated/graphql-documents';
import { getGraphQlClient } from 'lib/graphql-client';
import { EventDataType } from 'lib/types';
import { TagItem } from 'lib/helpers/merge-page-tags';
import { EVENT_TEMPLATE_ID } from 'lib/graphql/id';

// Define response types to match the GraphQL responses
type EventListingResponse = {
  search: {
    results: EventBasicData[];
    pageInfo: {
      endCursor: string;
      hasNext: boolean;
    };
    total: number;
  };
};

type EventDetailResponse = {
  item: EventDataType;
};

type EventBasicData = {
  id: string;
  sxaTags?: { targetItems?: TagItem[] };
};

/**
 * Result type for the event listing function
 */
type EventListingResult = {
  results: EventDataType[];
  pageInfo: {
    endCursor: string;
    hasNext: boolean;
  };
  total: number;
};

/**
 * Fetches event listing data using a two-step approach:
 * 1. First gets IDs and tags using GetEventListingQuery
 * 2. Then fetches full details for each event using GetEventById
 * 3. Merges the data to create complete event objects with tags
 */
export async function getEventListingWithDetails(
  pageId: string,
  language: string,
  initialEndCursor?: string,
  first: number = 10
): Promise<EventListingResult> {
  const client = getGraphQlClient();

  try {
    if (!pageId || pageId.trim() === '') {
      console.error('Error in getEventListingWithDetails: pageId is empty');
      return {
        results: [],
        pageInfo: {
          endCursor: '',
          hasNext: false,
        },
        total: 0,
      };
    }

    // Initialize collection of all events across pages
    let allBasicEvents: EventBasicData[] = [];
    let endCursor = initialEndCursor || '';
    let hasNextPage = true;
    let totalEvents = 0;
    let finalPageInfo = { endCursor: '', hasNext: false };

    // Fetch all pages of events
    while (hasNextPage) {
      // Step 1: Get basic event data with IDs and tags for current page
      const basicListingResult = await client.request<EventListingResponse>(
        GetEventListingQuery.loc?.source.body || '',
        {
          pageId,
          language,
          endCursor: endCursor || null, // Pass null if empty string
          first,
          templateId: EVENT_TEMPLATE_ID,
        }
      );

      // Check if we have search results
      if (!basicListingResult?.search?.results?.length) {
        console.log('No event results found on this page');
        break;
      }

      // Add this page's events to our collection
      allBasicEvents = [...allBasicEvents, ...basicListingResult.search.results];

      // Update pagination info for next iteration
      endCursor = basicListingResult.search.pageInfo.endCursor;
      hasNextPage = basicListingResult.search.pageInfo.hasNext;
      totalEvents = basicListingResult.search.total;
      finalPageInfo = basicListingResult.search.pageInfo;

      // Break if we reached the last page
      if (!hasNextPage) break;
    }

    // If no events were found across all pages
    if (allBasicEvents.length === 0) {
      console.log('No event results found across all pages');
      return {
        results: [],
        pageInfo: {
          endCursor: '',
          hasNext: false,
        },
        total: 0,
      };
    }

    const basicEvents = allBasicEvents;

    // Step 2: Fetch detailed data for each event in parallel
    const detailedEventsPromises = basicEvents.map(async (basicEvent) => {
      try {
        const detailResult = await client.request<EventDetailResponse>(
          GetEventById.loc?.source.body || '',
          {
            itemId: basicEvent.id,
            language,
          }
        );
        return detailResult?.item;
      } catch (error) {
        console.error(`Error fetching details for event ${basicEvent.id}:`, error);
        // Return basic data if detail fetch fails
        return null;
      }
    });

    // Wait for all detailed event queries to complete
    const detailedEvents = await Promise.all(detailedEventsPromises);

    // Step 3: Merge data (basic event tags with detailed event data)
    const mergedEvents = basicEvents
      .map((basicEvent, index) => {
        const detailedEvent = detailedEvents[index];

        if (!detailedEvent) {
          return null;
        }

        return {
          ...detailedEvent,
          sxaTags: basicEvent.sxaTags,
        } as EventDataType;
      })
      .filter(Boolean) as EventDataType[]; // Remove any null entries from failed detail fetches

    return {
      results: mergedEvents,
      pageInfo: finalPageInfo,
      total: totalEvents,
    };
  } catch (error) {
    console.error('Error in getEventListingWithDetails:', error);
    return {
      results: [],
      pageInfo: {
        endCursor: '',
        hasNext: false,
      },
      total: 0,
    };
  }
}

/**
 * Filters events by person name
 * @param events - Array of events to filter
 * @param personName - The full name of the person to filter by
 * @returns Array of events where the person is listed in profiles
 */
export function filterEventsByPerson(events: EventDataType[], personName: string): EventDataType[] {
  if (!events || events.length === 0 || !personName) {
    return [];
  }

  return events.filter((event: EventDataType) => {
    if (!event?.profiles) return false;
    const profiles = event.profiles as { targetItems?: { name: string }[] };
    const targetItems = profiles?.targetItems || [];
    return targetItems.some((item) => {
      const personItemName = item?.name;
      if (!personItemName) return false;
      return personItemName.toLowerCase() === personName.toLowerCase();
    });
  });
}
