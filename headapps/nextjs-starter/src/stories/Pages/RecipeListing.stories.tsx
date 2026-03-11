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
  articleFactory,
} from 'lib/helpers/storybook';
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
        'Searching for dinner inspiration?',
        'Browse our collection of recipes and find the perfect meal for your family.',
        '',
        ''
      );

      const Fields = {
        heading: stringFieldArgs('Dinner Options'),
      };

      const prepTimes = ['10 mins', '15 mins', '20 mins', '5 mins', '30 mins', '25 mins'];
      const cookTimes = ['20 mins', '45 mins', '60 mins', '15 mins', '30 mins', '35 mins'];

      const pageData = articleFactory(false).map((post, index) => ({
        ...post,
        datePublished: post.datePublished.formattedDateValue,
        title: { jsonValue: stringFieldArgs(post.heading.jsonValue.value || '') },
        prepTime: { jsonValue: stringFieldArgs(prepTimes[index % prepTimes.length]) },
        cookTime: { jsonValue: stringFieldArgs(cookTimes[index % cookTimes.length]) },
      }));

      // Themed RecipePageListing
      const RecipePageListing = {
        ...createMockComponent('RecipePageListing', Fields, undefined, {
          ...paramsArgs(crypto.randomUUID(), 'Default', ''),
          Styles: themeStyles,
        }),
        data: pageData,
      };

      const HeadlessMain = [HeroBanner, RecipePageListing];

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
