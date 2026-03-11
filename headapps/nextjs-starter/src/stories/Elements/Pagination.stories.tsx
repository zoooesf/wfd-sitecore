import type { Meta, StoryObj, StoryContext } from '@storybook/nextjs';
import { Pagination } from 'component-children/Shared/Pagination/Pagination';
import { useState } from 'react';
import { FrameProvider } from 'lib/hooks/useFrame';
import { getTheme } from 'lib/helpers/storybook';

const meta = {
  title: 'Elements/Pagination',
  component: Pagination,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-screen-lg">
        <h1 className="mb-md text-3xl font-bold">Pagination Component</h1>
        <div className="flex flex-col gap-4">
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    length: {
      name: 'Length',
      control: 'number',
    },
    selected: { table: { disable: true } },
    setSelected: { table: { disable: true } },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<PaginationStoryArgs>;

type PaginationStoryArgs = {
  length: number;
  expanded?: boolean;
};

const DefaultArgs: PaginationStoryArgs = {
  length: 6,
  expanded: false,
};

const PaginationWrapper = (args: PaginationStoryArgs, context: StoryContext) => {
  const [selected, setSelected] = useState(1);
  const theme = getTheme(context);
  const params = { Styles: `theme:${theme}` };

  return (
    <FrameProvider params={params}>
      <Pagination {...args} selected={selected} setSelected={setSelected} />
    </FrameProvider>
  );
};

export const Default: Story = {
  args: DefaultArgs,
  globals: {
    paddingTop: '',
    paddingBottom: '',
  },
  render: (args, context) => PaginationWrapper(args, context),
};

export const Expanded: Story = {
  args: {
    ...DefaultArgs,
    expanded: true,
    length: 5,
  },
  globals: {
    paddingTop: '',
    paddingBottom: '',
  },
  render: (args, context) => PaginationWrapper(args, context),
};

export const ShortList: Story = {
  args: {
    ...DefaultArgs,
    length: 3,
  },
  globals: {
    paddingTop: '',
    paddingBottom: '',
  },
  render: (args, context) => PaginationWrapper(args, context),
};
