import type { Meta, StoryObj } from '@storybook/nextjs';
import { loremIpsumGenerator } from 'lib/helpers';
import {
  createMockComponent,
  imageFieldArgs,
  linkFieldArgs,
  mockLayoutRoute,
  mockPageCategoryGQL,
  mockPageWithRoute,
  paramsArgs,
  profileFactory,
  stringFieldArgs,
  withDatasourceCheckComponentArgs,
  withFullScreenLayout,
} from 'lib/helpers/storybook';
import { StoryArgsWithLayoutData, getPageFromLoader } from 'lib/types';
import Layout from 'src/Layout';
import { SitecoreProvider, ComponentPropsContext } from '@sitecore-content-sdk/nextjs';
import components from '../../../.sitecore/component-map';
import scConfig from 'sitecore.config';

const meta: Meta<typeof Layout> = {
  title: 'Pages/Article',
  component: Layout,
  argTypes: {
    'page.layout.sitecore.route.fields.heading.value': {
      control: 'text',
      name: 'Heading',
      description: 'Article heading',
    },
    'page.layout.sitecore.route.fields.subheading.value': {
      control: 'text',
      name: 'Subheading',
      description: 'Article subheading',
    },
    'page.layout.sitecore.route.fields.body.value': {
      control: 'text',
      name: 'Body',
      description: 'Article body content',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
};

export default meta;
type Story = StoryObj<typeof meta>;

// Initial route fields - used for both initial values and control defaults
const initialMockRouteFields = {
  pageCategory: [mockPageCategoryGQL('General')],
  profiles: profileFactory(),
  datePublished: stringFieldArgs('2024-10-26T00:00:00Z'),
  lastUpdated: stringFieldArgs('2024-11-06T00:00:00Z'),
  heading: stringFieldArgs(loremIpsumGenerator(20)),
  body: stringFieldArgs(loremIpsumGenerator(1000)),
  subheading: stringFieldArgs(loremIpsumGenerator(200)),
  image: imageFieldArgs(6000, 4000),
  imageMobile: imageFieldArgs(320, 400),
};

export const Default: Story = {
  ...withFullScreenLayout,
  args: {
    ...withDatasourceCheckComponentArgs,
    // Initialize with route fields so controls appear
    'page.layout.sitecore.route.fields.heading.value': initialMockRouteFields.heading.value,
    'page.layout.sitecore.route.fields.body.value': initialMockRouteFields.body.value,
    'page.layout.sitecore.route.fields.subheading.value': initialMockRouteFields.subheading.value,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  globals: {
    paddingTop: '',
    paddingBottom: '',
  },
  parameters: {
    layout: 'fullscreen',
  },
  loaders: [
    async (context) => {
      const { theme } = context.globals;
      const stylesList = [`theme:${theme}`].filter(Boolean);
      const themeStyles = stylesList.join(' ');

      // Create themed components dynamically
      const ArticleHeader = createMockComponent(
        'ArticleHeader',
        {
          publishedLabel: stringFieldArgs('Published:'),
          lastUpdatedLabel: stringFieldArgs('Last Updated:'),
          shareLabel: stringFieldArgs('Share'),
          link: linkFieldArgs('http://#', 'CTA', '_self'),
        },
        undefined,
        { ...paramsArgs(crypto.randomUUID(), 'Default', ''), Styles: themeStyles }
      );

      const ArticleBody = createMockComponent('ArticleBody', {}, undefined, {
        ...paramsArgs(crypto.randomUUID(), 'Default', ''),
        Styles: themeStyles,
      });

      const ArticleFooter = createMockComponent(
        'ArticleFooter',
        {
          shareLabel: stringFieldArgs('Share this article'),
          relatedArticlesLabel: stringFieldArgs('Related Articles'),
        },
        undefined,
        { ...paramsArgs(crypto.randomUUID(), 'Default', ''), Styles: themeStyles }
      );

      const HeadlessMain = [ArticleHeader, ArticleBody, ArticleFooter];

      // Read control values from args (Storybook stores them as flat dotted paths)
      const currentArgs = context.args as StoryArgsWithLayoutData;

      const headingFromFlat = currentArgs?.['page.layout.sitecore.route.fields.heading.value'] as
        | string
        | undefined;
      const bodyFromFlat = currentArgs?.['page.layout.sitecore.route.fields.body.value'] as
        | string
        | undefined;
      const subheadingFromFlat = currentArgs?.[
        'page.layout.sitecore.route.fields.subheading.value'
      ] as string | undefined;

      const heading = headingFromFlat || initialMockRouteFields.heading.value;
      const body = bodyFromFlat || initialMockRouteFields.body.value;
      const subheading = subheadingFromFlat || initialMockRouteFields.subheading.value;

      // Build route fields with current values
      const mockRouteFields = {
        ...initialMockRouteFields,
        heading: stringFieldArgs(heading),
        body: stringFieldArgs(body),
        subheading: stringFieldArgs(subheading),
      };

      // Build route with themed components and updated fields
      const route = {
        ...mockLayoutRoute(HeadlessMain, 'Article Page', heading),
        fields: mockRouteFields,
      };

      // Return the page object for Content SDK
      return mockPageWithRoute(route);
    },
  ],
  render: (_args, context) => {
    const { theme } = context.globals;
    const pageData = getPageFromLoader(context.loaded);

    // If pageData is undefined, provide a fallback
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
