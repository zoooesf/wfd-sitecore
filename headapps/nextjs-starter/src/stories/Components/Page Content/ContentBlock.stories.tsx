import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as ContentBlock } from 'src/components/Page Content/ContentBlock/ContentBlock';
import { withDatasourceCheckComponentArgs } from 'lib/helpers/storybook/mock';
import { stringFieldArgs } from 'lib/helpers/storybook/mock/field-mock';
import { imageFieldArgs } from 'lib/helpers/storybook/mock';
import { buttonFactory } from 'lib/helpers/storybook/factory/button-factory';

const meta = {
  title: 'Components/Page Content/ContentBlock',
  component: ContentBlock,
  decorators: [
    (Story) => (
      <div data-component="Frame" className="relative z-0 overflow-hidden">
        <div className="relative z-10">
          <div data-component="ContainedWrapper" className="relative w-full px-8 lg:px-16">
            <div className="m-auto w-full max-w-outer-content">
              <div className="grid grid-cols-12">
                <div className="col-span-12 col-start-1 flex flex-col gap-y-10 lg:col-span-6">
                  <Story />
                </div>
                <div className="bg-red-500 col-span-12 flex flex-col gap-y-10 opacity-10 lg:col-span-6 lg:col-start-7"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ContentBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockContentBlock = () => {
  return {
    componentName: 'ContentBlock',
    dataSource: '/sitecore',
    placeholders: {
      'buttons-1': buttonFactory(),
    },
  };
};

const DefaultFields = {
  heading: stringFieldArgs('Content Block Heading'),
  image: imageFieldArgs(1400, 1800),
  mobileImage: imageFieldArgs(768, 1024),
  body: stringFieldArgs('Content Block Body'),
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: DefaultFields,
  rendering: mockContentBlock(),
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <ContentBlock {...args} params={params} />;
  },
};
