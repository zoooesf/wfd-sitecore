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
  profileFactory,
  sponsorFactory,
  stringFieldArgs,
  withFullScreenLayout,
} from 'lib/helpers/storybook';
import { StoryArgsWithLayoutData, getPageFromLoader } from 'lib/types';
import Layout from 'src/Layout';
import { SitecoreProvider, ComponentPropsContext } from '@sitecore-content-sdk/nextjs';
import components from '../../../.sitecore/component-map';
import scConfig from 'sitecore.config';

const meta: Meta<typeof Layout> = {
  title: 'Pages/Event',
  component: Layout,
  argTypes: {
    'page.layout.sitecore.route.fields.heading.value': {
      control: 'text',
      name: 'Heading',
      description: 'Event heading',
    },
    'page.layout.sitecore.route.fields.subheading.value': {
      control: 'text',
      name: 'Subheading',
      description: 'Event subheading',
    },
    'page.layout.sitecore.route.fields.body.value': {
      control: 'text',
      name: 'Body',
      description: 'Event body content',
    },
    'page.layout.sitecore.route.fields.startDate.value': {
      control: 'text',
      name: 'Start Date',
      description: 'Event start date (YYYY-MM-DD)',
    },
    'page.layout.sitecore.route.fields.endDate.value': {
      control: 'text',
      name: 'End Date',
      description: 'Event end date (YYYY-MM-DD)',
    },
    'page.layout.sitecore.route.fields.eventTime.value': {
      control: 'text',
      name: 'Event Time',
      description: 'Event time range',
    },
    'page.layout.sitecore.route.fields.eventCost.value': {
      control: 'text',
      name: 'Event Cost',
      description: 'Event cost',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockEventDetailsFields = {
  shareLabel: stringFieldArgs('Share'),
  link: linkFieldArgs('http://#', 'Register for the event', '_blank'),
};

const initialMockRouteFields = {
  startDate: stringFieldArgs('2024-12-24'),
  location: mockLocation('North Pole'),
  pageCategory: [mockPageCategoryGQL('Annual')],
  eventTime: stringFieldArgs('10:00 AM - 11:00 AM'),
  eventCost: stringFieldArgs('$200'),
  endDate: stringFieldArgs('2024-12-25'),
  datePublished: stringFieldArgs('2024-11-06T00:00:00Z'),
  lastUpdated: stringFieldArgs('2024-11-06T00:00:00Z'),
  profiles: profileFactory(),
  sponsors: sponsorFactory(4),
  eventLinkTitle: stringFieldArgs('How do I join the Industry Associate and Affiliate program?'),
  eventLink: linkFieldArgs('http://#', 'CTA', '_self'),
  heading: stringFieldArgs(loremIpsumGenerator(20)),
  subheading: stringFieldArgs(loremIpsumGenerator(200)),
  image: imageFieldArgs(1920, 1080),
  imageMobile: imageFieldArgs(320, 400),
  body: stringFieldArgs(
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sodales vitae velit ut semper. Sed a nibh fermentum, faucibus turpis vitae, malesuada quam. Ut lobortis venenatis leo sed iaculis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta diam diam, at pulvinar ex molestie sed. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed ac mollis nisl. Nulla vel tempor libero. Duis mollis neque quis justo pellentesque, et mollis est placerat. Integer cursus diam lectus, non imperdiet purus pellentesque tincidunt. Curabitur et egestas velit. Proin tempor, ligula et iaculis accumsan, leo sem tincidunt dui, eu luctus quam nunc ac lacus. Maecenas fringilla augue id magna porta malesuada.</p>\n<p>Sed bibendum, velit eget ultricies efficitur, tortor mi aliquam augue, in aliquet neque nisl ut enim. Curabitur varius metus in nisi hendrerit iaculis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia imperdiet bibendum. Curabitur eget rhoncus sapien. Mauris eu elementum nunc. Suspendisse in odio erat. Mauris porta auctor pellentesque. In non ipsum orci. Morbi varius lacinia neque, eu hendrerit nibh venenatis ac.</p>\n<p>Duis ullamcorper elit in justo facilisis malesuada. Aliquam neque est, elementum eget fermentum sollicitudin, hendrerit et quam. Nulla quis placerat libero. Donec leo nibh, pulvinar a lacinia et, consectetur sit amet elit. Curabitur luctus ipsum in augue tempor condimentum. Nulla dignissim consectetur nulla, eget fermentum risus dignissim nec. Vivamus dignissim lorem justo, ac rutrum nunc vulputate vel. Suspendisse cursus justo in ante pulvinar, a dapibus ante porta.</p>\n<p>Proin eget libero arcu. Sed et commodo erat. Etiam diam ante, vestibulum id ipsum id, sodales fermentum ligula. Cras convallis diam ac mi scelerisque fermentum. Nullam diam orci, ultrices quis mollis in, lacinia in dui. Donec non purus quis diam eleifend fringilla. Aenean accumsan posuere felis ut rutrum. Sed sit amet tincidunt risus, in mattis ante. Aliquam vulputate posuere massa, a egestas nisi. Donec lacinia sapien lacus, sit amet venenatis odio efficitur vitae. Integer convallis felis convallis quam pretium, eu fermentum est malesuada. Praesent nec est rutrum, pulvinar velit a, fermentum nunc. Ut a nisl et nibh hendrerit mollis. Morbi malesuada erat sit amet interdum convallis.</p>\n<p>Vivamus vitae sollicitudin nibh. Vivamus eu sapien dapibus, mollis dui vitae, ultricies purus. Nulla euismod posuere suscipit. Donec quis magna neque. Mauris fermentum orci a aliquam malesuada. Cras vel ex congue, congue sem eget, tristique magna. Pellentesque vel eros quis nisi facilisis dapibus. Integer in magna eros. Donec fringilla vitae nulla in feugiat. Sed et mattis dolor, eu luctus erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>'
  ),
};

export const Default: Story = {
  ...withFullScreenLayout,
  args: {
    // Initialize with route fields so controls appear
    'page.layout.sitecore.route.fields.heading.value': initialMockRouteFields.heading.value,
    'page.layout.sitecore.route.fields.subheading.value': initialMockRouteFields.subheading.value,
    'page.layout.sitecore.route.fields.body.value': initialMockRouteFields.body.value,
    'page.layout.sitecore.route.fields.startDate.value': initialMockRouteFields.startDate.value,
    'page.layout.sitecore.route.fields.endDate.value': initialMockRouteFields.endDate.value,
    'page.layout.sitecore.route.fields.eventTime.value': initialMockRouteFields.eventTime.value,
    'page.layout.sitecore.route.fields.eventCost.value': initialMockRouteFields.eventCost.value,
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

      // Create themed EventDetails component
      const EventDetails = createMockComponent('EventDetails', mockEventDetailsFields, undefined, {
        ...paramsArgs(crypto.randomUUID(), 'Default', ''),
        Styles: themeStyles,
      });

      const HeadlessMain = [EventDetails];

      // Read control values from args
      const currentArgs = context.args as StoryArgsWithLayoutData;

      // Extract all field values (with type assertions for flat paths)
      const heading =
        (currentArgs?.['page.layout.sitecore.route.fields.heading.value'] as string | undefined) ||
        initialMockRouteFields.heading.value;
      const subheading =
        (currentArgs?.['page.layout.sitecore.route.fields.subheading.value'] as
          | string
          | undefined) || initialMockRouteFields.subheading.value;
      const body =
        (currentArgs?.['page.layout.sitecore.route.fields.body.value'] as string | undefined) ||
        initialMockRouteFields.body.value;
      const startDate =
        (currentArgs?.['page.layout.sitecore.route.fields.startDate.value'] as
          | string
          | undefined) || initialMockRouteFields.startDate.value;
      const endDate =
        (currentArgs?.['page.layout.sitecore.route.fields.endDate.value'] as string | undefined) ||
        initialMockRouteFields.endDate.value;
      const eventTime =
        (currentArgs?.['page.layout.sitecore.route.fields.eventTime.value'] as
          | string
          | undefined) || initialMockRouteFields.eventTime.value;
      const eventCost =
        (currentArgs?.['page.layout.sitecore.route.fields.eventCost.value'] as
          | string
          | undefined) || initialMockRouteFields.eventCost.value;

      // Build route fields with current values
      const mockRouteFields = {
        ...initialMockRouteFields,
        heading: stringFieldArgs(heading),
        subheading: stringFieldArgs(subheading),
        body: stringFieldArgs(body),
        startDate: stringFieldArgs(startDate),
        endDate: stringFieldArgs(endDate),
        eventTime: stringFieldArgs(eventTime),
        eventCost: stringFieldArgs(eventCost),
      };

      const route = {
        ...mockLayoutRoute(HeadlessMain, 'Event Page', heading),
        fields: mockRouteFields,
      };

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
