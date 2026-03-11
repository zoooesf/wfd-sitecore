import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as FullWidth } from 'components/Containers/FullWidth/FullWidth';
import {
  generatePlaceholderCTABlocks,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';
import { imageFieldArgs } from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Containers/FullWidth',
  component: FullWidth,
} satisfies Meta<typeof FullWidth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...withDatasourceCheckComponentArgs,
    fields: {
      backgroundImage: imageFieldArgs(1400, 800),
      backgroundImageMobile: imageFieldArgs(320, 400),
    },
    rendering: {
      componentName: 'FullWidth',
      dataSource: '/sitecore',
      placeholders: {
        'fullwidth-1': generatePlaceholderCTABlocks(1),
      },
    },
    params: {
      maxWidth: 'w-full',
    },
  },
  render: (args, globals) => {
    const { params } = globals;
    return <FullWidth {...args} params={params} />;
  },
};
