import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  SearchSkeletonTheme,
  SearchResultsSkeletonLayout,
} from 'src/widgets/SearchResults/components/skeletons';
import { SKELETON_ITEMS_CONFIG } from 'lib/const';
import { getTheme } from 'lib/helpers/storybook';

const meta = {
  title: 'Widgets/Search Loading Skeleton',
  component: SearchResultsSkeletonLayout,
  decorators: [
    (Story, context) => {
      // Use the global theme from Storybook toolbar
      const theme = getTheme(context);
      return (
        <div className={`${theme} min-h-screen bg-surface p-8`}>
          <div className="mx-auto">
            <SearchSkeletonTheme>
              <Story />
            </SearchSkeletonTheme>
          </div>
        </div>
      );
    },
  ],
  argTypes: {
    itemsPerPage: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Number of skeleton cards to display',
    },
    showSidebar: {
      control: 'boolean',
      description: 'Show/hide sidebar filters skeleton',
    },
    gridCols: {
      control: 'text',
      description: 'Tailwind grid column classes',
    },
    horizontalBreakpoint: {
      control: { type: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', undefined] },
      description: 'Breakpoint for horizontal card layout',
    },
    showImage: {
      control: 'boolean',
      description: 'Show/hide image skeleton in cards',
    },
  },
} satisfies Meta<typeof SearchResultsSkeletonLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// Global Search
// Single column with horizontal cards (breakpoint at sm), includes images
export const GlobalSearch: Story = {
  args: {
    itemsPerPage: SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE,
    showSidebar: true,
    gridCols: 'grid-cols-1',
    horizontalBreakpoint: 'sm',
    showImage: true,
  },
};

// Product Search
// Single column with horizontal cards (breakpoint at sm), includes images
export const ProductSearch: Story = {
  args: {
    itemsPerPage: SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE,
    showSidebar: true,
    gridCols: 'grid-cols-1',
    horizontalBreakpoint: 'sm',
    showImage: true,
  },
};

// Event Listing
// 3-column responsive grid with vertical cards, includes images
export const EventListing: Story = {
  args: {
    itemsPerPage: SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE,
    showSidebar: true,
    gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    showImage: true,
  },
};

// Authors Search
// 3-column responsive grid with vertical cards, includes images
export const AuthorsSearch: Story = {
  args: {
    itemsPerPage: SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE,
    showSidebar: true,
    gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    showImage: true,
  },
};

// Knowledge Center
// Single column with vertical cards, no images
export const KnowledgeCenter: Story = {
  args: {
    itemsPerPage: SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE,
    showSidebar: true,
    gridCols: 'grid-cols-1',
    showImage: false,
  },
};

// Article Listing
// Single column with vertical cards, no images
export const ArticleListing: Story = {
  args: {
    itemsPerPage: SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE,
    showSidebar: true,
    gridCols: 'grid-cols-1',
    showImage: false,
  },
};

// Insight and News Listing
// Single column with vertical cards, no images
export const InsightAndNewsListing: Story = {
  args: {
    itemsPerPage: SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE,
    showSidebar: true,
    gridCols: 'grid-cols-1',
    showImage: false,
  },
};

// Simple Page Listing
// Single column with vertical cards, no images
export const SimplePageListing: Story = {
  args: {
    itemsPerPage: SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE,
    showSidebar: true,
    gridCols: 'grid-cols-1',
    showImage: false,
  },
};
