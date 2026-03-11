import {
  Default as LatestArticleGrid,
  VerticalList as VerticalListLatestArticleGrid,
  Insights as InsightsLatestArticleGrid,
  News as NewsLatestArticleGrid,
} from 'components/Articles/LatestArticleGrid/LatestArticleGrid';
import { Meta, StoryObj } from '@storybook/nextjs';
import { articleFactory, getTheme, stringFieldArgs } from 'lib/helpers/storybook';
import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ArticleDataType } from 'lib/types';
import { ARTICLE_VARIANTS } from 'lib/helpers/article-variants';
import { FrameProvider } from 'lib/hooks/useFrame';

const meta: Meta<typeof LatestArticleGrid> = {
  title: 'Components/Articles/LatestArticleGrid',
  component: LatestArticleGrid,
};

export default meta;
type Story = StoryObj<typeof LatestArticleGrid>;

// Create properly typed article data without extended fields that cause type issues
const articleData = articleFactory(false);

// Create rendering object with type assertion to resolve type incompatibility
const mockRendering = {
  componentName: 'LatestArticleGrid',
  dataSource: '/sitecore',
  uid: 'sitecore-uid',
  fields: {},
  params: { FieldNames: ARTICLE_VARIANTS.DEFAULT },
  data: articleData as unknown as ArticleDataType[],
} as ComponentRendering & { data: ArticleDataType[] };

export const Default: Story = {
  args: {
    fields: {
      heading: stringFieldArgs('Latest Article Posts'),
    },
    rendering: mockRendering,
    params: {},
  },
  render: (args, context) => {
    const theme = getTheme(context);
    const params = { ...context.params, Styles: `theme:${theme}` };
    return (
      <FrameProvider params={params}>
        <LatestArticleGrid {...args} params={params} />
      </FrameProvider>
    );
  },
};

// VerticalList Layout Variant (existing)
export const VerticalList: StoryObj<typeof VerticalListLatestArticleGrid> = {
  args: {
    fields: {
      heading: stringFieldArgs('Latest Articles - Vertical Layout'),
    },
    rendering: { ...mockRendering, params: { FieldNames: ARTICLE_VARIANTS.DEFAULT } },
    params: {},
  },
  render: (args, context) => {
    const theme = getTheme(context);
    const params = { ...context.params, Styles: `theme:${theme}` };
    return (
      <FrameProvider params={params}>
        <VerticalListLatestArticleGrid {...args} params={params} />
      </FrameProvider>
    );
  },
};

// Content Variant Stories
export const News: StoryObj<typeof NewsLatestArticleGrid> = {
  args: {
    fields: {
      heading: stringFieldArgs('Latest News'),
    },
    rendering: { ...mockRendering, params: { FieldNames: ARTICLE_VARIANTS.NEWS } },
    params: {},
  },
  render: (args, context) => {
    const theme = getTheme(context);
    const params = { ...context.params, Styles: `theme:${theme}` };
    return (
      <FrameProvider params={params}>
        <div className="bg-surface p-4">
          <h3 className="heading-sm">News Variant</h3>
          <p className="copy-sm">Displaying latest news articles from the news section.</p>
        </div>
        <NewsLatestArticleGrid {...args} params={params} />
      </FrameProvider>
    );
  },
};

export const Insights: StoryObj<typeof InsightsLatestArticleGrid> = {
  args: {
    fields: {
      heading: stringFieldArgs('Latest Insights'),
    },
    rendering: { ...mockRendering, params: { FieldNames: ARTICLE_VARIANTS.INSIGHTS } },
    params: {},
  },
  render: (args, context) => {
    const theme = getTheme(context);
    const params = { ...context.params, Styles: `theme:${theme}` };
    return (
      <FrameProvider params={params}>
        <div className="bg-surface p-4">
          <h3 className="heading-sm">Insights Variant</h3>
          <p className="copy-sm">Displaying latest insight articles from the insights section.</p>
        </div>
        <InsightsLatestArticleGrid {...args} params={params} />
      </FrameProvider>
    );
  },
};
