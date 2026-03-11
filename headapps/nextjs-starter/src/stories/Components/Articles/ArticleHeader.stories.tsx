import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Default as ArticleHeader,
  Insights as InsightsArticleHeader,
  News as NewsArticleHeader,
} from 'components/Articles/ArticleHeader/ArticleHeader';
import {
  mockLayoutRoute,
  mockPageWithRoute,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';
import { linkFieldArgs, stringFieldArgs } from 'lib/helpers/storybook/mock/field-mock';

const meta = {
  title: 'Components/Articles/Article Header',
  component: ArticleHeader,
} satisfies Meta<typeof ArticleHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockRouteFields = {
  heading: {
    value: 'Article Title Goes Here',
  },
  subheading: {
    value: 'This is a subheading that provides more context about the article.',
    editable: 'This is a subheading that provides more context about the article.',
  },
  datePublished: {
    value: '2023-12-01',
  },
  lastUpdated: {
    value: '2023-12-15',
  },
  pageCategory: [
    {
      id: 'category-1',
      name: 'Technology',
      displayName: 'Technology',
      fields: {
        pageCategory: stringFieldArgs('Technology'),
      },
    },
  ],
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  ...mockPageWithRoute({
    ...mockLayoutRoute([], 'Article Page', 'Article Page'),
    fields: mockRouteFields,
  }),
  params: {},
  fields: {
    publishedLabel: stringFieldArgs('Published on'),
    lastUpdatedLabel: stringFieldArgs('Last updated'),
    link: linkFieldArgs('#', 'Learn More'),
  },
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, context) => <ArticleHeader {...args} params={context.params} />,
};

export const Insights: Story = {
  args: DefaultArgs,
  render: (args, context) => <InsightsArticleHeader {...args} params={context.params} />,
};

export const News: Story = {
  args: DefaultArgs,
  render: (args, context) => <NewsArticleHeader {...args} params={context.params} />,
};
