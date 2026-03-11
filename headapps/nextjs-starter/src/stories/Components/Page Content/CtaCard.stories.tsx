import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as CTACard } from 'components/Page Content/CTACard/CTACard';
import { loremIpsumGenerator } from 'lib/helpers';
import {
  stringFieldArgs,
  tileImageFieldArgs,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';
import { buttonFactory } from 'lib/helpers/storybook/factory/button-factory';

const meta = {
  title: 'Components/Page Content/CTACard',
  component: CTACard,
  decorators: [
    (Story) => (
      <div className="mx-auto my-10 max-w-screen-xl">
        <div className="flex flex-col gap-4">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof CTACard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCTACardPlaceholder = (cardCount?: number) => {
  return {
    componentName: 'CTACard',
    dataSource: '/sitecore',
    placeholders: {
      'buttons-1': buttonFactory(cardCount),
    },
  };
};
const DefaultFields = {
  heading: stringFieldArgs('CTACard Header'),
  body: stringFieldArgs(loremIpsumGenerator(120)),
  image: tileImageFieldArgs(),
  imageMobile: tileImageFieldArgs(),
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: DefaultFields,
  rendering: mockCTACardPlaceholder(),
  params: {},
};

export const Stacked: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return (
      <div className="flex flex-col gap-8">
        <CTACard {...args} params={params} />
        <CTACard
          {...args}
          fields={{
            ...args.fields,
            heading: stringFieldArgs(loremIpsumGenerator(80)),
          }}
          params={params}
        />
      </div>
    );
  },
};

export const Grid: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return (
      <div className="grid grid-cols-2">
        <CTACard {...args} params={params} />
        <CTACard
          {...args}
          fields={{
            ...args.fields,
            heading: stringFieldArgs(loremIpsumGenerator(80)),
          }}
          params={params}
        />
      </div>
    );
  },
};
