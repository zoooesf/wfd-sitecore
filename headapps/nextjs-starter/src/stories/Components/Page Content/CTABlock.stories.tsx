import type { Meta, StoryObj } from '@storybook/nextjs';
import { loremIpsumGenerator } from 'lib/helpers';
import { withDatasourceCheckComponentArgs, stringFieldArgs } from 'lib/helpers/storybook';
import { linkFieldArgs } from 'lib/helpers/storybook/mock';
import { Default as CTABlock } from 'components/Page Content/CTABlock/CTABlock';

const meta = {
  title: 'Components/Page Content/CTABlock',
  component: CTABlock,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CTABlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCTABlock = () => {
  return {
    componentName: 'CTABlock',
    dataSource: '/sitecore',
  };
};

const DefaultFields = {
  heading: stringFieldArgs('CTA Block Heading'),
  body: stringFieldArgs(loremIpsumGenerator(120)),
  link: linkFieldArgs('/', 'CTA Button', '_self'),
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: DefaultFields,
  rendering: mockCTABlock(),
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const updatedParams = {
      ...globals.params,
      ...args.params,
    };
    return <CTABlock {...args} params={updatedParams} />;
  },
};
