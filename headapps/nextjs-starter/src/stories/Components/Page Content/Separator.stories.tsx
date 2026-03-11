import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as Separator } from 'src/components/Page Content/Separator/Separator';
import { withDatasourceCheckComponentArgs } from 'lib/helpers/storybook/mock';

const meta = {
  title: 'Components/Page Content/Separator',
  component: Separator,
  decorators: [
    (Story) => (
      <div data-component="Frame" className="relative z-0 w-full overflow-hidden">
        <div className="mx-auto w-full max-w-screen-lg">
          <h1 className="mb-md w-full text-3xl font-bold">Separator Component</h1>
          <div className="flex w-full flex-row gap-4">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSeparator = () => {
  return {
    componentName: 'Separator',
    dataSource: '/sitecore',
  };
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: {},
  rendering: mockSeparator(),
  params: {},
};
export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <Separator {...args} params={params} />;
  },
};
