import type { Meta, StoryObj } from '@storybook/nextjs';
import { stringFieldArgs, articleFactory, mockTagCategories } from 'lib/helpers/storybook';
import {
  Default as RecipePageListing,
  ImageLeft as RecipePageListingImageLeft,
} from 'components/Page Content/RecipePageListing/RecipePageListing';
import { ComponentRendering, Page } from '@sitecore-content-sdk/nextjs';
import { ContextPageTagsProvider } from 'lib/contexts/page-tags-context';
import { PageDataType } from 'lib/types';
import { mainLanguage } from 'lib/i18n/i18n-config';

const meta: Meta<typeof RecipePageListing> = {
  title: 'Components/Page Content/RecipePageListing',
  component: RecipePageListing,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RecipePageListing>;

const prepTimes = ['10 mins', '15 mins', '20 mins', '5 mins', '30 mins', '25 mins'];
const cookTimes = ['20 mins', '45 mins', '60 mins', '15 mins', '30 mins', '35 mins'];

// Generate mock recipe page data with recipe-specific fields in GQL format
const pageData = articleFactory(false).map((post, index) => ({
  ...post,
  datePublished: post.datePublished.formattedDateValue,
  title: { jsonValue: stringFieldArgs(post.heading.jsonValue.value || '') },
  prepTime: { jsonValue: stringFieldArgs(prepTimes[index % prepTimes.length]) },
  cookTime: { jsonValue: stringFieldArgs(cookTimes[index % cookTimes.length]) },
}));

// Create a subset of pages with specific tags that will be filtered
const createTaggedPageData = () => {
  const allPages = [...pageData];

  const taggedPages = allPages.map((page, index) => {
    // Only add tags to first 50% of the pages to show filtering effect
    if (index < allPages.length / 2) {
      return {
        ...page,
        sxaTags: {
          targetItems: [mockTagCategories[0]],
        },
      };
    }
    return page;
  });

  return taggedPages;
};

// Mock a selected page for the component
const mockSelectedPage = {
  id: 'mock-page-id-123',
  url: '/en/mock-page',
  name: 'Mock Page',
  displayName: 'Mock Page Display Name',
  fields: {
    heading: { value: 'Mock Page Heading' },
    subheading: { value: 'Mock Page Subheading' },
  },
};

// Create standard rendering object with all pages
const mockRendering = {
  componentName: 'RecipePageListing',
  dataSource: '/sitecore',
  uid: 'sitecore-uid',
  fields: {},
  params: {},
  data: pageData as unknown as PageDataType[],
} as ComponentRendering & { data: PageDataType[] };

// Create rendering object with tagged pages (for filtering)
const mockRenderingWithTags = {
  componentName: 'RecipePageListing',
  dataSource: '/sitecore',
  uid: 'sitecore-uid-tags',
  fields: { filterByTags: { value: true } },
  params: { tagFilteringEnabled: 'true' },
  data: createTaggedPageData() as unknown as PageDataType[],
} as ComponentRendering & { data: PageDataType[] };

export const Default: Story = {
  args: {
    fields: {
      heading: stringFieldArgs('Discover more pages'),
      selectedPage: mockSelectedPage,
      filterByTags: { value: false },
      tagsHeading: { value: '' },
      noResultsText: { value: '' },
    },
    rendering: mockRendering,
    params: { name: 'simple-page-listing' },
  },
  render: (args, globals) => {
    const { params } = globals;
    return <RecipePageListing {...args} params={params} />;
  },
};
export const ImageLeft: Story = {
  args: {
    fields: {
      heading: stringFieldArgs('Discover more pages'),
      selectedPage: mockSelectedPage,
      filterByTags: { value: false },
      tagsHeading: { value: '' },
      noResultsText: { value: '' },
    },
    rendering: mockRendering,
    params: { name: 'simple-page-listing' },
  },
  render: (args, globals) => {
    const { params } = globals;
    return <RecipePageListingImageLeft {...args} params={params} />;
  },
};

// With tag filtering enabled
export const WithTagFiltering: Story = {
  args: {
    fields: {
      heading: stringFieldArgs('Pages with Tag Filtering'),
      selectedPage: mockSelectedPage,
      filterByTags: { value: true },
      tagsHeading: stringFieldArgs('Content filtered by tags:'),
      noResultsText: stringFieldArgs(
        'No pages match the selected tags. Showing all results instead.'
      ),
    },
    rendering: mockRenderingWithTags,
    params: { name: 'simple-page-listing', tagFilteringEnabled: 'true' },
  },
  render: (args, globals) => {
    const { params } = globals;

    // Use the first tag from our standard mock tags
    const mockTag = mockTagCategories[0];

    // Create a mock Page with properly typed fields structure
    const mockPage = {
      layout: {
        sitecore: {
          route: {
            itemId: 'mock-page-id',
            name: 'Mock Page',
            placeholders: {},
            fields: {
              // Add the tag to SxaTags field for the provider to find
              SxaTags: [mockTag],
            },
          },
        },
      },
      locale: mainLanguage,
      mode: {
        isEditing: false,
        isNormal: true,
      },
      siteName: 'Fishtank TIDAL',
    } as unknown as Page;

    return (
      <ContextPageTagsProvider pageOverride={mockPage}>
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', marginBottom: '20px' }}>
          <h3 className="heading-sm">Page Tag Context Active</h3>
          <p>
            Page is tagged with: <strong>{mockTag.displayName}</strong>
          </p>
          <p>Only showing pages that have this tag (approximately half of the total pages).</p>
        </div>
        <RecipePageListing {...args} params={params} />
      </ContextPageTagsProvider>
    );
  },
};
