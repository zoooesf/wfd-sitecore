import type { Meta, StoryObj } from '@storybook/nextjs';
import Layout from '../../Layout';
import {
  accordionFactory,
  mockCardGrid,
  mockHeroBanner,
  mockLayoutRoute,
  mockPageWithRoute,
  paramsArgs,
  withDatasourceCheckComponentArgs,
  withFullScreenLayout,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Pages/Home Page',
  component: Layout,
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPageAccordionBanner = {
  uid: '4e4f1d54-d466-4e48-9d1f-c6652e219dba',
  componentName: 'FullWidth',
  dataSource: '/sitecore',
  placeholders: {
    'fullwidth-15': [accordionFactory],
  },
  params: { ...paramsArgs('15'), _topPadding: 'Medium', _bottomPadding: 'Large' },
};

const HeadlessMain = [mockHeroBanner(), mockCardGrid, mockPageAccordionBanner];

export const Default: Story = {
  ...withFullScreenLayout,
  args: {
    ...withDatasourceCheckComponentArgs,
    ...mockPageWithRoute(mockLayoutRoute(HeadlessMain, 'Home Page', 'Home')),
  },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  render: (args) => {
    return <Layout {...args} />;
  },
};
