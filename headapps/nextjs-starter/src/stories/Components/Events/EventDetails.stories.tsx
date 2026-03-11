import type { Meta, StoryObj } from '@storybook/nextjs';
import { loremIpsumGenerator } from 'lib/helpers';
import {
  createMockComponent,
  imageFieldArgs,
  linkFieldArgs,
  mockLayoutRoute,
  mockLocation,
  mockPageCategoryGQL,
  mockPageWithRoute,
  paramsArgs,
  stringFieldArgs,
  withFullScreenLayout,
} from 'lib/helpers/storybook';
import { profileFactory } from 'lib/helpers/storybook/factory/profile-factory';
import { sponsorFactory } from 'lib/helpers/storybook/factory/sponsor-factory';
import { getPageFromLoader } from 'lib/types';
import Layout from 'src/Layout';
import { SitecoreProvider, ComponentPropsContext } from '@sitecore-content-sdk/nextjs';
import components from '../../../../.sitecore/component-map';
import scConfig from 'sitecore.config';

const meta = {
  title: 'Components/Events/EventDetails',
  component: Layout,
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

// Component fields (for EventDetails props)
const mockEventDetailsFields = {
  link: linkFieldArgs('http://#', 'Register for the event', '_blank'),
  publishedLabel: stringFieldArgs('Published'),
  lastUpdatedLabel: stringFieldArgs('Last Updated'),
};

// Route fields (for SitecoreContext)
const mockRouteFields = {
  heading: stringFieldArgs('Annual Winter Conference 2024'),
  subheading: stringFieldArgs(loremIpsumGenerator(150)),
  body: stringFieldArgs(
    '<p style="margin-right: 0px; margin-bottom: 15px; margin-left: 0px; padding: 0px; text-align: justify;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sodales vitae velit ut semper. Sed a nibh fermentum, faucibus turpis vitae, malesuada quam. Ut lobortis venenatis leo sed iaculis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta diam diam, at pulvinar ex molestie sed. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed ac mollis nisl. Nulla vel tempor libero. Duis mollis neque quis justo pellentesque, et mollis est placerat. Integer cursus diam lectus, non imperdiet purus pellentesque tincidunt. Curabitur et egestas velit. Proin tempor, ligula et iaculis accumsan, leo sem tincidunt dui, eu luctus quam nunc ac lacus. Maecenas fringilla augue id magna porta malesuada.</p>\n<p style="margin: 0px 0px 15px; padding: 0px; text-align: justify;">Sed bibendum, velit eget ultricies efficitur, tortor mi aliquam augue, in aliquet neque nisl ut enim. Curabitur varius metus in nisi hendrerit iaculis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia imperdiet bibendum. Curabitur eget rhoncus sapien. Mauris eu elementum nunc. Suspendisse in odio erat. Mauris porta auctor pellentesque. In non ipsum orci. Morbi varius lacinia neque, eu hendrerit nibh venenatis ac.</p>\n<p style="margin: 0px 0px 15px; padding: 0px; text-align: justify;">Duis ullamcorper elit in justo facilisis malesuada. Aliquam neque est, elementum eget fermentum sollicitudin, hendrerit et quam. Nulla quis placerat libero. Donec leo nibh, pulvinar a lacinia et, consectetur sit amet elit. Curabitur luctus ipsum in augue tempor condimentum. Nulla dignissim consectetur nulla, eget fermentum risus dignissim nec. Vivamus dignissim lorem justo, ac rutrum nunc vulputate vel. Suspendisse cursus justo in ante pulvinar, a dapibus ante porta.</p>'
  ),
  startDate: stringFieldArgs('2024-12-24'),
  endDate: stringFieldArgs('2024-12-25'),
  eventTime: stringFieldArgs('10:00 AM - 11:00 AM'),
  eventCost: stringFieldArgs('$200'),
  location: mockLocation('Conference Center, Downtown'),
  image: imageFieldArgs(1920, 1080),
  profiles: profileFactory(),
  sponsors: sponsorFactory(4),
  pageCategory: [mockPageCategoryGQL('Annual')],
  datePublished: stringFieldArgs('2024-11-06T00:00:00Z'),
  lastUpdated: stringFieldArgs('2024-11-06T00:00:00Z'),
};

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

      // Create EventDetails component with theme styles
      const EventDetails = createMockComponent('EventDetails', mockEventDetailsFields, undefined, {
        ...paramsArgs(crypto.randomUUID(), 'Default', ''),
        Styles: themeStyles,
      });

      const HeadlessMain = [EventDetails];

      // Build route with themed component
      const baseRoute = mockLayoutRoute(
        HeadlessMain,
        'Event Details',
        mockRouteFields.heading.value
      );

      // Merge route fields into the base route
      const route = {
        ...baseRoute,
        fields: {
          ...baseRoute.fields,
          ...mockRouteFields,
        },
      };

      // Return the page object for Content SDK
      return mockPageWithRoute(route);
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
