import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as CardCarousel } from 'components/Cards/CardCarousel/CardCarousel';
import {
  generatePlaceholderCards,
  stringFieldArgs,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Cards/Card Carousel',
  component: CardCarousel,
} satisfies Meta<typeof CardCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCardCarousel = (cardComponent?: string) => {
  return {
    componentName: 'CardCarousel',
    dataSource: '/sitecore',
    placeholders: {
      'cardcarousel-1': generatePlaceholderCards(cardComponent, 10),
    },
  };
};

const DefaultFields = {
  heading: stringFieldArgs('Discover news and updates'),
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: DefaultFields,
  rendering: mockCardCarousel(),
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <CardCarousel {...args} params={params} />;
  },
};
