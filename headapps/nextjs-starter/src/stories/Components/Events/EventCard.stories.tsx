import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as EventCard } from 'components/Events/EventCard/EventCard';
import { loremIpsumGenerator } from 'lib/helpers';
import {
  mockLocation,
  mockPageCategoryGQL,
  tileImageFieldArgs,
  withDatasourceCheckComponentArgs,
  jsonValueFieldArgs,
} from 'lib/helpers/storybook';
import { stringFieldArgs } from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Events/Event Card',
  component: EventCard,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-screen-lg">
        <h1 className="mb-md text-3xl font-bold">Event Card Component</h1>
        <div className="flex flex-row gap-4">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof EventCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockEventCardPlaceholder = () => {
  return {
    componentName: 'EventCard',
    dataSource: '/sitecore',
    path: '/event-card',
  };
};

const DefaultFields = {
  startDate: stringFieldArgs('2024-12-24'),
  heading: jsonValueFieldArgs('Event Card Header'),
  location: mockLocation('Calgary'),
  pageCategory: [mockPageCategoryGQL('Annual')],
  endDate: stringFieldArgs('2024-12-25'),
  dateLabel: stringFieldArgs('Date Label'),
  timeLabel: stringFieldArgs('Time Label'),
  locationLabel: stringFieldArgs('Location Label'),
  image: tileImageFieldArgs(),
  imageMobile: tileImageFieldArgs(),
  time: stringFieldArgs('10:00 AM - 11:00 AM'),
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: DefaultFields,
  rendering: mockEventCardPlaceholder(),
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return (
      <>
        <EventCard {...args} params={params} />
        <EventCard
          {...args}
          fields={{ ...args.fields, heading: jsonValueFieldArgs(loremIpsumGenerator(30)) }}
          params={params}
        />
        <EventCard
          {...args}
          fields={{ ...args.fields, heading: jsonValueFieldArgs(loremIpsumGenerator(40)) }}
          params={params}
        />
      </>
    );
  },
};
