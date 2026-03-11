import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as CardBanner } from 'components/Cards/CardBanner/CardBanner';
import { loremIpsumGenerator } from 'lib/helpers';
import {
  backgroundFieldArgs,
  mockCard,
  stringFieldArgs,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Cards/Card Banner',
  component: CardBanner,
} satisfies Meta<typeof CardBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCardBanner = () => {
  return {
    componentName: 'CardBanner',
    dataSource: '/sitecore',
    placeholders: {
      'cards-1': [
        mockCard('Card', 'Fast Performance'),
        mockCard('Card', 'Tailor-Made Designs for Every Style'),
        mockCard('Card', 'Round-the-Clock Support for Uninterrupted Service'),
      ],
    },
  };
};

const DefaultFields = {
  heading: stringFieldArgs('Discover Featured Content'),
  subheading: stringFieldArgs(loremIpsumGenerator(120)),
  backgroundImage: backgroundFieldArgs(),
  backgroundImageMobile: backgroundFieldArgs(),
};

const StoryArgs = (fields = DefaultFields) => {
  return {
    ...withDatasourceCheckComponentArgs,
    fields: fields,
    rendering: mockCardBanner(),
    params: {},
  };
};

// Stories
export const Default: Story = {
  args: StoryArgs(),
  render: (args, globals) => {
    const { params } = globals;
    return <CardBanner {...args} params={params} />;
  },
};
