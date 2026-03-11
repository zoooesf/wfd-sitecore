import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  eventFactory,
  mockTagCategories,
  imageGQLFieldArgs,
  jsonValueFieldArgs,
} from 'lib/helpers/storybook';
import { EventDataType } from 'lib/types';
import { Default as EventListing } from 'src/components/Events/EventListing/EventListing';
import { ContextPageTagsProvider } from 'lib/contexts/page-tags-context';
import { Page } from '@sitecore-content-sdk/nextjs';

const meta: Meta<typeof EventListing> = {
  title: 'Components/Events/Event Listing',
  component: EventListing,
  tags: ['autodocs'],
};

export default meta;

// Create proper location object
const createLocationObject = (locationName: string) => ({
  id: `location-${locationName.toLowerCase().replace(/\s+/g, '-')}`,
  url: `/locations/${locationName.toLowerCase().replace(/\s+/g, '-')}`,
  name: locationName,
  displayName: locationName,
  fields: {
    contentName: { value: locationName },
  },
});

// Create standard events with proper location data
const eventsWithProperLocation = eventFactory().map((event) => {
  // Extract the location string from the event
  const locationValue = event.location?.value || 'Default Location';

  // Create a proper location object array (wrapped in jsonValue for the expected format)
  const properLocation = {
    jsonValue: [createLocationObject(locationValue)],
  };

  return {
    ...event,
    // Replace the below fields with proper objects
    location: properLocation,
    image: imageGQLFieldArgs(),
    imageMobile: imageGQLFieldArgs(),
    subheading: jsonValueFieldArgs(event.subheading?.value),
  };
});

const mockRendering = {
  componentName: 'EventListing',
  dataSource: '/sitecore',
  uid: 'sitecore-uid',
  data: eventsWithProperLocation as unknown as EventDataType[],
};

// Default story
export const Default: StoryObj<typeof EventListing> = {
  args: {
    fields: {
      heading: { value: 'Upcoming Events' },
    },
    rendering: mockRendering,
    params: { name: 'event-listing' },
  },
  render: (args, globals) => {
    const { params } = globals;
    return <EventListing {...args} params={params} />;
  },
};

// With tag filtering enabled
export const WithTagFiltering: StoryObj<typeof EventListing> = {
  args: {
    fields: {
      heading: { value: 'Events with Tag Filtering' },
      filterByTags: { value: true },
      tagsHeading: { value: 'Events related to:' },
      noResultsText: { value: 'No events match the selected tags. Showing all results instead.' },
    },
    rendering: {
      ...mockRendering,
      params: { tagFilteringEnabled: 'true' },
      fields: { filterByTags: { value: true } },
    },
    params: { name: 'event-listing-filtered', tagFilteringEnabled: 'true' },
  },
  render: (args, globals) => {
    const { params } = globals;

    // Use the first tag from our standard mock tags
    const mockTag = mockTagCategories[0];

    // Create a mock Page with tags
    const mockPage = {
      layout: {
        sitecore: {
          route: {
            itemId: 'mock-page-id',
            name: 'Mock Event Page',
            placeholders: {},
            fields: {
              // Add the tag to SxaTags field for the provider to find
              SxaTags: [mockTag],
            },
          },
        },
      },
    } as unknown as Page;

    return (
      <ContextPageTagsProvider pageOverride={mockPage}>
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', marginBottom: '20px' }}>
          <h3 className="heading-sm">Page Tag Context</h3>
          <p>
            Page is tagged with: <strong>{mockTag.displayName}</strong>
          </p>
          <p>This will filter the events that have matching tags.</p>
        </div>
        <EventListing {...args} params={params} />
      </ContextPageTagsProvider>
    );
  },
};
