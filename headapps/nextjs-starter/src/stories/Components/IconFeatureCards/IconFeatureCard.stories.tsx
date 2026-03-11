import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as IconFeatureCard } from 'components/IconFeatureCards/IconFeatureCard/IconFeatureCard';
import { loremIpsumGenerator } from 'lib/helpers';
import {
  linkFieldArgs,
  stringFieldArgs,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';
import { IconFieldType, IconType } from 'lib/types';

const meta = {
  title: 'Components/IconFeatureCards/IconFeatureCard',
  component: IconFeatureCard,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-screen-lg">
        <h1 className="mb-md text-3xl font-bold">Icon Feature Card Component</h1>
        <div className="flex flex-col gap-8 md:flex-row md:gap-4">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof IconFeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultFields = {
  heading: stringFieldArgs('Heading'),
  subheading: stringFieldArgs('Subheading'),
  imageIcon: { name: 'calendar-days' as IconType } as IconFieldType,
  link: linkFieldArgs('https://www.google.com'),
};

const DefaultArgs = {
  fields: DefaultFields,
  ...withDatasourceCheckComponentArgs,
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    const { fields } = args;

    return (
      <>
        <IconFeatureCard {...args} fields={fields} params={params} />
        <IconFeatureCard
          {...args}
          fields={{
            ...fields,
            heading: stringFieldArgs(loremIpsumGenerator(60)),
            subheading: stringFieldArgs(loremIpsumGenerator(60)),
          }}
          params={params}
        />
        <IconFeatureCard
          {...args}
          fields={{
            ...fields,
            heading: stringFieldArgs(loremIpsumGenerator(40)),
            subheading: stringFieldArgs(loremIpsumGenerator(160)),
          }}
          params={params}
        />
      </>
    );
  },
};
