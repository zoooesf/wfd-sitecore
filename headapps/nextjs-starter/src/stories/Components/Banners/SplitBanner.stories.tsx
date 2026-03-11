import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Default as SplitBanner,
  Contained as ContainedSplitBanner,
} from 'components/Banners/SplitBanner/SplitBanner';
import {
  imageFieldArgs,
  stringFieldArgs,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';
import { buttonFactory } from 'lib/helpers/storybook/factory/button-factory';

const meta = {
  title: 'Components/Banners/Split Banner',
  component: SplitBanner,
} satisfies Meta<typeof SplitBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSplitBannerPlaceholder = () => {
  return {
    componentName: 'SplitBanner',
    dataSource: '/sitecore',
    placeholders: {
      'buttons-1': buttonFactory(),
    },
  };
};

const DefaultFields = {
  heading: stringFieldArgs('Split Banner Header'),
  body: stringFieldArgs(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt urna, nec tincidunt nunc nunc id nunc.'
  ),
  subheading: stringFieldArgs('Discover Amazing Content'),
  image: imageFieldArgs(1400, 800),
  imageMobile: imageFieldArgs(320, 400),
};

const DefaultArgs = {
  fields: DefaultFields,
  ...withDatasourceCheckComponentArgs,
  params: {},
  rendering: mockSplitBannerPlaceholder(),
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <SplitBanner {...args} params={params} />;
  },
};

export const Contained: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <ContainedSplitBanner {...args} params={params} />;
  },
};
