import type { Meta, StoryObj } from '@storybook/nextjs';
import Layout from '../../Layout';
import {
  stringFieldArgs,
  mockLayoutRoute,
  withFullScreenLayout,
  mockHeroBanner,
  createMockComponent,
  mockPageWithRoute,
  paramsArgs,
} from 'lib/helpers/storybook';
import { recipeFactory } from 'lib/helpers/storybook/factory';
import { getPageFromLoader } from 'lib/types';
import { SitecoreProvider, ComponentPropsContext } from '@sitecore-content-sdk/nextjs';
import components from '../../../.sitecore/component-map';
import scConfig from 'sitecore.config';

const meta = {
  title: 'Pages/RecipeListing',
  component: Layout,
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  ...withFullScreenLayout,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: {} as any,
  globals: {
    paddingTop: '',
    paddingBottom: '',
  },
  loaders: [
    async (context) => {
      const { theme } = context.globals;
      const stylesList = [`theme:${theme}`].filter(Boolean);
      const themeStyles = stylesList.join(' ');

      // Static HeroBanner (no theme)
      const HeroBanner = mockHeroBanner(
        'Discover Our Latest Insights',
        'Stay updated with our expert articles, tips, and industry trends, all in one place.',
        '',
        ''
      );

      const Fields = {
        heading: stringFieldArgs('Simple Page  Posts'),
      };

      // Themed SimplePageListing
      const SimplePageListing = {
        ...createMockComponent('SimplePageListing', Fields, undefined, {
          ...paramsArgs(crypto.randomUUID(), 'Default', ''),
          Styles: themeStyles,
        }),
        data: recipeFactory(),
      };

      const HeadlessMain = [HeroBanner, SimplePageListing];

      return mockPageWithRoute(mockLayoutRoute(HeadlessMain, 'Landing Page', 'Home'));
    },
  ],
  render: (_args, context) => {
    const { theme } = context.globals;
    const pageData = getPageFromLoader(context.loaded);

    if (!pageData) {
      const fallbackPage = mockPageWithRoute(null).page;
      return (
        <ComponentPropsContext value={{}}>
          <SitecoreProvider componentMap={components} api={scConfig.api} page={fallbackPage}>
            <div className={`min-h-screen bg-surface ${theme}`}>
              <Layout page={fallbackPage} />
            </div>
          </SitecoreProvider>
        </ComponentPropsContext>
      );
    }

    return (
      <ComponentPropsContext value={{}}>
        <SitecoreProvider componentMap={components} api={scConfig.api} page={pageData.page}>
          <div className={`min-h-screen bg-surface ${theme}`}>
            <Layout page={pageData.page} />
          </div>
        </SitecoreProvider>
      </ComponentPropsContext>
    );
  },
};
