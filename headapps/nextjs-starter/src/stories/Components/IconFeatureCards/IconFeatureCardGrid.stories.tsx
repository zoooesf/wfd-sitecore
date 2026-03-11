import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as IconFeatureCardGrid } from 'components/IconFeatureCards/IconFeatureCardGrid/IconFeatureCardGrid';
import { loremIpsumGenerator } from 'lib/helpers';
import {
  iconFeatureCardFactory,
  stringFieldArgs,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/IconFeatureCards/Icon Feature Card Grid',
  component: IconFeatureCardGrid,
} satisfies Meta<typeof IconFeatureCardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockIconFeatureCardGrid = (cardCount?: number) => {
  return {
    componentName: 'IconFeatureCardGrid',
    dataSource: '/sitecore',
    placeholders: {
      'iconfeaturecardgrid-1': iconFeatureCardFactory(cardCount),
    },
  };
};

const DefaultFields = {
  heading: stringFieldArgs('Discover news and updates'),
  subheading: stringFieldArgs(loremIpsumGenerator(120)),
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: DefaultFields,
  rendering: mockIconFeatureCardGrid(),
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <IconFeatureCardGrid {...args} params={params} />;
  },
};
