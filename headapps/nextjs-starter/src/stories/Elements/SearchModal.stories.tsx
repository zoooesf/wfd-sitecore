import type { Meta, StoryObj } from '@storybook/nextjs';
import { SearchModal } from 'component-children/Search/SearchModal';

const meta = {
  title: 'Elements/SearchModal',
  component: SearchModal,
  decorators: [
    (Story) => (
      <div data-component="Frame" className="relative z-0 overflow-hidden">
        <div className="mx-auto max-w-screen-lg">
          <h1 className="mb-md text-3xl font-bold">SearchModal Component</h1>
          <div className="flex flex-row gap-4">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof SearchModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultArgs = {
  isOpen: true,
  onClose: () => {
    return;
  },
};

export const Default: Story = {
  args: DefaultArgs,
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  render: (args) => {
    return (
      <>
        <SearchModal {...args} />
      </>
    );
  },
};
