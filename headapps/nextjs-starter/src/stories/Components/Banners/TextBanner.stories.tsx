import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as TextBanner } from 'components/Banners/TextBanner/TextBanner';
import { stringFieldArgs, withDatasourceCheckComponentArgs } from 'lib/helpers/storybook';
import { buttonFactory } from 'lib/helpers/storybook/factory/button-factory';

const meta = {
  title: 'Components/Banners/Text Banner',
  component: TextBanner,
  render: (args, globals) => {
    const { params } = globals;
    return <TextBanner {...args} params={params} />;
  },
} satisfies Meta<typeof TextBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultFields = {
  heading: stringFieldArgs('Simple Page Listing'),
  subheading: stringFieldArgs(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  ),
};

const DefaultArgs = {
  fields: DefaultFields,
  ...withDatasourceCheckComponentArgs,
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
};

export const WithButtons: Story = {
  args: {
    ...DefaultArgs,
    rendering: {
      ...DefaultArgs.rendering,
      placeholders: {
        'buttons-1': buttonFactory(),
      },
    },
  },
};
