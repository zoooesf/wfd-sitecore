import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as Image } from 'src/components/Page Content/Image/Image';
import { imageFieldArgs, withDatasourceCheckComponentArgs } from 'lib/helpers/storybook/mock';

const meta = {
  title: 'Components/Page Content/Image',
  component: Image,
  decorators: [
    (Story) => (
      <div data-component="Frame" className="relative z-0 overflow-hidden">
        <div className="mx-auto max-w-screen-lg">
          <h1 className="mb-md text-3xl font-bold">Image Component</h1>
          <div className="flex flex-row gap-4">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockImage = () => {
  return {
    componentName: 'Image',
    dataSource: '/sitecore',
  };
};

const DefaultFields = {
  image: {
    value: {
      ...imageFieldArgs(1024, 700).value,
      width: 1024,
      height: 700,
    },
  },
  imageMobile: {
    value: {
      ...imageFieldArgs(1024, 700).value,
      width: 1024,
      height: 700,
    },
  },
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: DefaultFields,
  rendering: mockImage(),
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return (
      <>
        <Image {...args} params={params} />
      </>
    );
  },
};
