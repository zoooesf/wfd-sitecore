import type { Meta, StoryObj } from '@storybook/nextjs';
import Badge from 'component-children/Shared/Badge/Badge';

const meta = {
  title: 'Elements/Badge',
  component: Badge,
  decorators: [
    (Story) => (
      <div className="mx-auto my-10 max-w-screen-lg rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col gap-8">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    controls: {
      exclude: ['className', 'theme'],
    },
    docs: {
      description: {
        component:
          'Badge components are used to highlight information or status throughout the application.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The text content of the badge',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  render: () => (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-700">Primary Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge className="primary">NEW</Badge>
          <Badge className="primary">FEATURED</Badge>
          <Badge className="primary">POPULAR</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-700">Secondary Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge className="secondary">IN PROGRESS</Badge>
          <Badge className="secondary">PENDING</Badge>
          <Badge className="secondary">REVIEW</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-700">Tertiary Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge className="tertiary">SALE</Badge>
          <Badge className="tertiary">DISCOUNT</Badge>
          <Badge className="tertiary">LIMITED</Badge>
        </div>
      </div>
    </div>
  ),
};
