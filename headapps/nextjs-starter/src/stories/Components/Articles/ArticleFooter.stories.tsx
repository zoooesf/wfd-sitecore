import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Default as ArticleFooter,
  Insights as InsightsArticleFooter,
  News as NewsArticleFooter,
} from 'components/Articles/ArticleFooter/ArticleFooter';
import {
  mockLayoutRoute,
  mockPageWithRoute,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';
import { stringFieldArgs } from 'lib/helpers/storybook/mock/field-mock';

const meta = {
  title: 'Components/Articles/Article Footer',
  component: ArticleFooter,
} satisfies Meta<typeof ArticleFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTags = [
  {
    name: 'Technology',
    id: 'tag-1',
    displayName: 'Technology',
    fields: {
      Title: stringFieldArgs('Technology'),
    },
  },
  {
    name: 'Marketing',
    id: 'tag-2',
    displayName: 'Marketing',
    fields: {
      Title: stringFieldArgs('Marketing'),
    },
  },
  {
    name: 'Design',
    id: 'tag-3',
    displayName: 'Design',
    fields: {
      Title: stringFieldArgs('Design'),
    },
  },
];

const samplePerson = {
  name: 'John Smith',
  id: 'person-1',
  displayName: 'John Smith',
  fields: {
    name: stringFieldArgs('John Smith'),
    role: stringFieldArgs('Content Writer'),
    description: {
      value:
        '<p>John is a seasoned content writer with over 10 years of experience in technology writing.</p>',
      editable:
        '<p>John is a seasoned content writer with over 10 years of experience in technology writing.</p>',
    },
    image: {
      value: {
        src: '/tile-1.jpg',
        alt: 'Person Photo',
      },
    },
  },
};

const mockRouteFields = {
  profiles: [samplePerson],
  SxaTags: sampleTags,
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  ...mockPageWithRoute({
    ...mockLayoutRoute([], 'Article Page', 'Article Page'),
    fields: mockRouteFields,
  }),
  params: {},
  fields: {
    tagsLabel: stringFieldArgs('Tags'),
  },
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, context) => <ArticleFooter {...args} params={context.params} />,
};

export const Insights: Story = {
  args: DefaultArgs,
  render: (args, context) => <InsightsArticleFooter {...args} params={context.params} />,
};

export const News: Story = {
  args: DefaultArgs,
  render: (args, context) => <NewsArticleFooter {...args} params={context.params} />,
};
