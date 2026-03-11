import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as HeroBanner } from 'components/Banners/HeroBanner/HeroBanner';
import { backgroundFieldArgs, withDatasourceCheckComponentArgs } from 'lib/helpers/storybook';
import { stringFieldArgs } from 'lib/helpers/storybook';
import { buttonFactory } from 'lib/helpers/storybook/factory/button-factory';

const meta = {
  title: 'Components/Banners/Hero Banner',
  component: HeroBanner,
} satisfies Meta<typeof HeroBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultFields = {
  heading: stringFieldArgs('Hero Banner Header'),
  subheading: stringFieldArgs('Hero Banner Subheader'),
  backgroundImage: backgroundFieldArgs(),
  backgroundImageMobile: backgroundFieldArgs(),
};

const HeroBannerArgs = (fields = DefaultFields) => {
  return {
    fields: fields,
    ...withDatasourceCheckComponentArgs,
    params: {},
    rendering: {
      componentName: 'HeroBanner',
      dataSource: '/sitecore',
      placeholders: {
        'buttons-1': buttonFactory(),
      },
    },
  };
};

export const Default: Story = {
  args: HeroBannerArgs(),
  render: (args, globals) => {
    const { params } = globals;
    return <HeroBanner {...args} params={params} />;
  },
};

const SingleButtonArgs = {
  fields: DefaultFields,
  ...withDatasourceCheckComponentArgs,
  params: {},
  rendering: {
    componentName: 'HeroBanner',
    dataSource: '/sitecore',
    placeholders: {
      'buttons-1': buttonFactory(1),
    },
  },
};

export const SingleButton: Story = {
  args: SingleButtonArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <HeroBanner {...args} params={params} />;
  },
};
