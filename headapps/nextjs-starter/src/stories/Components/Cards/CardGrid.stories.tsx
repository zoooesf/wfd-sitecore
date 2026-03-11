import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as CardGrid } from 'components/Cards/CardGrid/CardGrid';
import {
  generatePlaceholderCards,
  stringFieldArgs,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Cards/Card Grid',
  component: CardGrid,
} satisfies Meta<typeof CardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCardGrid = (cardComponent?: string) => {
  return {
    componentName: 'CardGrid',
    dataSource: '/sitecore',
    placeholders: {
      'cardgrid-1': generatePlaceholderCards(cardComponent),
    },
  };
};

const DefaultFields = {
  heading: stringFieldArgs('Discover news and updates'),
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: DefaultFields,
  rendering: mockCardGrid(),
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <CardGrid {...args} params={params} />;
  },
};
