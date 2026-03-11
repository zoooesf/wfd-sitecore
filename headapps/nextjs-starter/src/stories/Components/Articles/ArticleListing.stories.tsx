import type { Meta, StoryObj } from '@storybook/nextjs';
import { articleFactory, mockTagCategories } from 'lib/helpers/storybook';
import {
  Default as ArticleListing,
  Insights as InsightsArticleListing,
  News as NewsArticleListing,
} from 'components/Articles/ArticleListing/ArticleListing';
import { ContextPageTagsProvider } from 'lib/contexts/page-tags-context';
import { Page, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ArticleDataType } from 'lib/types';
import { ARTICLE_VARIANTS } from 'lib/helpers/article-variants';
import { mainLanguage } from 'lib/i18n/i18n-config';

// Define type for mock rendering with article data
type MockArticleRendering = ComponentRendering & {
  data: ArticleDataType[];
};

const meta: Meta<typeof ArticleListing> = {
  title: 'Components/Articles/Article Listing',
  component: ArticleListing,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ArticleListing>;

// Standard mock rendering
const mockRendering = {
  componentName: 'ArticleListing',
  dataSource: '/sitecore',
  uid: 'sitecore-uid',
  params: { FieldNames: ARTICLE_VARIANTS.DEFAULT },
  data: articleFactory(), // Type casting is handled in the args below
};

// Mock rendering with tagged articles for filtering demo
const mockRenderingWithTags = {
  componentName: 'ArticleListing',
  dataSource: '/sitecore',
  uid: 'sitecore-uid',
  params: { tagFilteringEnabled: 'true', FieldNames: ARTICLE_VARIANTS.DEFAULT },
  fields: { filterByTags: { value: true } },
  data: articleFactory(), // Now the factory already includes tags
};

// Default story
export const Default: Story = {
  args: {
    fields: {
      heading: { value: 'Exploring Nature' },
      // Include empty fields to demonstrate default fallbacks
      tagsHeading: { value: '' },
      noResultsText: { value: '' },
    },
    rendering: mockRendering as MockArticleRendering,
    params: { name: 'article-listing', FieldNames: ARTICLE_VARIANTS.DEFAULT },
  },
  render: (args, context) => <ArticleListing {...args} params={context.params} />,
};

// PageTagsFiltered story to showcase tag filtering
export const PageTagsFiltered: Story = {
  args: {
    fields: {
      heading: { value: 'Tag Filtered Article Posts' },
      filterByTags: { value: true },
      tagsHeading: { value: 'Article posts related to:' },
      noResultsText: {
        value: 'No article posts match the selected tags. Showing all results instead.',
      },
    },
    rendering: mockRenderingWithTags as MockArticleRendering,
    params: { name: 'article-listing-filtered', tagFilteringEnabled: 'true' },
  },
  render: (args, context) => {
    // Use the first tag from our standard mock tags
    const mockTag = mockTagCategories[0];

    // Create a mock context with properly typed fields structure
    // We're using type assertions here to match the expected structure while avoiding
    // complex type definitions that might cause TypeScript errors
    const mockContext = {
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
      <ContextPageTagsProvider pageOverride={mockContext}>
        {/* Force the page tags context to use our mock tags */}
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', marginBottom: '20px' }}>
          <h3 className="heading-sm">Page Tag Context</h3>
          <p>
            Page is tagged with: <strong>{mockTag.displayName}</strong>
          </p>
          <p>This will filter the article posts that have matching tags.</p>
        </div>
        <ArticleListing {...args} params={context.params} />
      </ContextPageTagsProvider>
    );
  },
};

// Variant-specific stories
export const News: Story = {
  args: {
    fields: {
      heading: { value: 'Latest News' },
      tagsHeading: { value: '' },
      noResultsText: { value: '' },
    },
    rendering: {
      ...mockRendering,
      params: { FieldNames: ARTICLE_VARIANTS.NEWS },
    } as MockArticleRendering,
    params: { name: 'article-listing-news' },
  },
  render: (args, context) => {
    return (
      <div>
        <div className="bg-surface p-4">
          <h3 className="heading-sm">News Variant</h3>
          <p className="copy-sm">
            Displaying news articles with the &apos;News&apos; variant styling and data source.
          </p>
        </div>
        <NewsArticleListing {...args} params={context.params} />
      </div>
    );
  },
};

export const Insights: Story = {
  args: {
    fields: {
      heading: { value: 'Latest Insights' },
      tagsHeading: { value: '' },
      noResultsText: { value: '' },
    },
    rendering: {
      ...mockRendering,
      params: { FieldNames: ARTICLE_VARIANTS.INSIGHTS },
    } as MockArticleRendering,
    params: { name: 'article-listing-insights' },
  },
  render: (args, context) => {
    return (
      <div>
        <div className="bg-surface p-4">
          <h3 className="heading-sm">Insights Variant</h3>
          <p className="copy-sm">
            Displaying insight articles with the &apos;Insights&apos; variant styling and data
            source.
          </p>
        </div>
        <InsightsArticleListing {...args} params={context.params} />
      </div>
    );
  },
};
