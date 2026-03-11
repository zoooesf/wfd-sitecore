import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as ContentBanner } from 'components/Banners/ContentBanner/ContentBanner';
import { loremIpsumGenerator } from 'lib/helpers';
import {
  backgroundFieldArgs,
  linkFieldArgs,
  stringFieldArgs,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Banners/Content Banner',
  component: ContentBanner,
} satisfies Meta<typeof ContentBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: {
    heading: stringFieldArgs('Discover Featured Content'),
    body: stringFieldArgs(loremIpsumGenerator(120)),
    link: linkFieldArgs('/', 'Me First', '_self'),
    backgroundImage: backgroundFieldArgs('black'),
    backgroundImageMobile: backgroundFieldArgs('black'),
  },
  rendering: {
    componentName: 'ContentBanner',
    dataSource: '/sitecore',
  },
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <ContentBanner {...args} params={params} />;
  },
};

export const ContentLeft: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return (
      <ContentBanner
        {...args}
        params={{
          ...params,
          Styles: `${params.Styles} bannerContentAlignment:left`,
        }}
      />
    );
  },
};
