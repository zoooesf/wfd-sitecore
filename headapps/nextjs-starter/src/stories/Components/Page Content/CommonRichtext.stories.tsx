import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as CommonRichtext } from 'src/components/Page Content/CommonRichtext/CommonRichtext';
import { stringFieldArgs, withDatasourceCheckComponentArgs } from 'lib/helpers/storybook/mock';

const meta = {
  title: 'Components/Page Content/CommonRichText',
  component: CommonRichtext,
  decorators: [
    (Story) => (
      <div data-component="Frame" className="relative z-0 overflow-hidden">
        <div className="mx-auto max-w-screen-lg">
          <h1 className="mb-md text-3xl font-bold">CommonRichText Component</h1>
          <div className="flex flex-row gap-4">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof CommonRichtext>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCommonRichText = () => {
  return {
    componentName: 'CommonRichtext',
    dataSource: '/sitecore',
  };
};

const DefaultFields = {
  body: stringFieldArgs('Common Rich Text Body'),
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: DefaultFields,
  rendering: mockCommonRichText(),
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return (
      <>
        <CommonRichtext {...args} params={params} />
      </>
    );
  },
};
