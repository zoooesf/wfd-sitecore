import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as Card } from 'components/Cards/Card/Card';
import { loremIpsumGenerator } from 'lib/helpers';
import {
  linkFieldArgs,
  tileImageFieldArgs,
  withDatasourceCheckComponentArgs,
  stringFieldArgs,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Cards/Card',
  component: Card,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-screen-lg">
        <h1 className="mb-md text-3xl font-bold">Card Component</h1>
        <div className="flex flex-row gap-4">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultFields = {
  heading: stringFieldArgs('Card Header'),
  body: stringFieldArgs('Card Body'),
  image: tileImageFieldArgs(),
  imageMobile: tileImageFieldArgs(),
  link: linkFieldArgs('/', 'Read more', '_self'),
  badge: stringFieldArgs('Badge Text here'),
};

const DefaultArgs = {
  fields: DefaultFields,
  ...withDatasourceCheckComponentArgs,
  params: {},
};

const DefaultNoBadgeArgs = {
  fields: { ...DefaultFields, badge: stringFieldArgs('') },
  ...withDatasourceCheckComponentArgs,
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return (
      <>
        <Card {...args} params={params} />
        <Card
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(100)) }}
          params={params}
        />
        <Card
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(60)) }}
          params={params}
        />
      </>
    );
  },
};

export const NoBadge: Story = {
  args: DefaultNoBadgeArgs,
  render: (args, globals) => {
    const { params } = globals;
    return (
      <>
        <Card {...args} params={params} />
        <Card
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(120)) }}
          params={params}
        />
        <Card
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(60)) }}
          params={params}
        />
      </>
    );
  },
};
