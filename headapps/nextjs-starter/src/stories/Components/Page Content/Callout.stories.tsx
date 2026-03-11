import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as Callout } from 'src/components/Page Content/Callout/Callout';
import { loremIpsumGenerator } from 'lib/helpers';
import { linkFieldArgs, withDatasourceCheckComponentArgs } from 'lib/helpers/storybook/mock';
import { stringFieldArgs } from 'lib/helpers/storybook/mock';

const meta = {
  title: 'Components/Page Content/Callout',
  component: Callout,
  decorators: [
    (Story) => (
      <div data-component="Frame" className="relative z-0 overflow-hidden">
        <div className="mx-auto max-w-screen-lg">
          <h1 className="mb-md text-3xl font-bold">Callout Component</h1>
          <div className="flex flex-row gap-4">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCallout = () => {
  return {
    componentName: 'Callout',
    dataSource: '/sitecore',
  };
};

const DefaultFields = {
  heading: stringFieldArgs('Callout Heading'),
  body: stringFieldArgs(loremIpsumGenerator(100)),
  link: linkFieldArgs('/', 'Primary Button', '_self'),
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: DefaultFields,
  rendering: mockCallout(),
  params: {},
};
export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <Callout {...args} params={params} />;
  },
};
