import type { Meta, StoryObj } from '@storybook/nextjs';
import Layout from '../../Layout';
import {
  stringFieldArgs,
  mockLayoutRoute,
  withFullScreenLayout,
  createMockComponent,
  articleFactory,
  mockPageCategoryGQL,
  mockPageWithRoute,
  paramsArgs,
  backgroundFieldArgs,
  linkFieldArgs,
} from 'lib/helpers/storybook';
import { getPageFromLoader } from 'lib/types';
import { SitecoreProvider, ComponentPropsContext } from '@sitecore-content-sdk/nextjs';
import components from '../../../.sitecore/component-map';
import scConfig from 'sitecore.config';

const meta = {
  title: 'Pages/Articles',
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

      // Create HeroBanner with theme
      const HeroBanner = createMockComponent(
        'HeroBanner',
        {
          heading: stringFieldArgs('Discover Our Latest Article Posts'),
          backgroundImage: backgroundFieldArgs('black'),
          backgroundImageMobile: backgroundFieldArgs('black'),
          subheading: stringFieldArgs(
            'Stay updated with our expert articles, tips, and industry trends, all in one place.'
          ),
          link: linkFieldArgs('/', '', '_self'),
          link2: linkFieldArgs('/', '', '_self'),
        },
        {},
        { ...paramsArgs(crypto.randomUUID(), 'Default', ''), Styles: 'theme:secondary' }
      );

      const Fields = {
        heading: stringFieldArgs('Article Posts'),
        pageCategory: [mockPageCategoryGQL('General')],
      };

      // Create ArticleListing with theme
      const ArticleListing = {
        ...createMockComponent('ArticleListing', Fields, undefined, {
          ...paramsArgs(crypto.randomUUID(), 'Default', ''),
          Styles: themeStyles,
        }),
        data: articleFactory(),
      };

      const HeadlessMain = [HeroBanner, ArticleListing];

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
