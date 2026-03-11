import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Default as ArticleBody,
  Insights as InsightsArticleBody,
  News as NewsArticleBody,
} from 'components/Articles/ArticleBody/ArticleBody';
import {
  mockLayoutRoute,
  mockPageWithRoute,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Articles/Article Body',
  component: ArticleBody,
} satisfies Meta<typeof ArticleBody>;

export default meta;
type Story = StoryObj<typeof meta>;

const bodyContent = `<div>
<h1>The Comprehensive Guide to Modern Web Development: Building Scalable Applications with Advanced Technologies and Best Practices</h1>
<h2>Understanding the Fundamentals of Frontend Development: From HTML Semantics to Advanced JavaScript Patterns</h2>
<h3>Mastering Responsive Design Principles: Creating Mobile-First Applications That Work Across All Devices</h3>
<h4>Implementing CSS Grid and Flexbox: Advanced Layout Techniques for Modern Web Applications</h4>
<h5>Optimizing Performance and Accessibility: Ensuring Your Web Applications Meet Industry Standards</h5>
<h6>Debugging and Testing Strategies: Comprehensive Approaches to Quality Assurance in Web Development</h6>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt urna, nec tincidunt nunc nunc id nunc. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt urna, nec tincidunt nunc nunc id nunc.</p>
<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p></div>`;

const mockRouteFields = {
  body: {
    value: bodyContent,
  },
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  ...mockPageWithRoute({
    ...mockLayoutRoute([], 'Article Page', 'Article Page'),
    fields: mockRouteFields,
  }),
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, context) => <ArticleBody {...args} params={context.params} />,
};

export const Insights: Story = {
  args: DefaultArgs,
  render: (args, context) => <InsightsArticleBody {...args} params={context.params} />,
};

export const News: Story = {
  args: DefaultArgs,
  render: (args, context) => <NewsArticleBody {...args} params={context.params} />,
};
