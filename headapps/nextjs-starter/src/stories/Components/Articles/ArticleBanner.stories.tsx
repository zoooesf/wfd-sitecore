import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Default as ArticleBanner,
  Contained as ContainedArticleBanner,
  Insights as InsightsArticleBanner,
  News as NewsArticleBanner,
} from 'components/Articles/ArticleBanner/ArticleBanner';
import {
  stringFieldArgs,
  tileImageFieldArgs,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Articles/Article Banner',
  component: ArticleBanner,
} satisfies Meta<typeof ArticleBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base fields shared across variants
const baseFields = {
  heading: stringFieldArgs('Article Banner Header'),
  subheading: stringFieldArgs(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt urna, nec tincidunt nunc nunc id nunce.'
  ),
  image: tileImageFieldArgs('2'),
  imageMobile: tileImageFieldArgs('2'),
};

// Specific fields for each variant
const DefaultFields = {
  ...baseFields,
  pageCategory: [
    {
      displayName: 'Article',
      fields: {
        pageCategory: stringFieldArgs('Article'),
      },
    },
  ],
};

const InsightsFields = {
  ...baseFields,
  pageCategory: [
    {
      displayName: 'Insights',
      fields: {
        pageCategory: stringFieldArgs('Insights'),
      },
    },
  ],
};

const NewsFields = {
  ...baseFields,
  pageCategory: [
    {
      displayName: 'News',
      fields: {
        pageCategory: stringFieldArgs('News'),
      },
    },
  ],
};

// Create args for each variant
const DefaultArgs = {
  fields: DefaultFields,
  ...withDatasourceCheckComponentArgs,
  params: {},
};

const InsightsArgs = {
  fields: InsightsFields,
  ...withDatasourceCheckComponentArgs,
  params: {},
};

const NewsArgs = {
  fields: NewsFields,
  ...withDatasourceCheckComponentArgs,
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <ArticleBanner {...args} params={params} />;
  },
};

export const Contained: Story = {
  args: DefaultArgs, // Using the same args as Default for Contained
  render: (args, globals) => {
    const { params } = globals;
    return <ContainedArticleBanner {...args} params={params} />;
  },
};

export const Insights: Story = {
  args: InsightsArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <InsightsArticleBanner {...args} params={params} />;
  },
};

export const News: Story = {
  args: NewsArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <NewsArticleBanner {...args} params={params} />;
  },
};
