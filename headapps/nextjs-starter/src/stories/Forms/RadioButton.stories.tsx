import type { Meta, StoryObj } from '@storybook/nextjs';
import { RadioButton } from 'component-children/Shared/Form Field/RadioButton';

const meta: Meta<typeof RadioButton> = {
  title: 'Forms/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['label', 'error', 'required', 'stacked'],
    },
  },
  argTypes: {
    label: {
      description: 'The label text for the RadioButton',
      type: { name: 'string', required: false },
    },
    required: {
      description: 'Whether the RadioButton is Required',
    },
    stacked: {
      description: 'Whether the RadioButton is Stacked or inline',
    },
    error: {
      description: 'Error message to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

const defaultArgs = {
  label: 'Accept terms and conditions',
  error: '',
  options: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ],
  name: 'terms',
  stacked: false,
};

export const AllVariants: Story = {
  render: function AllVariantsStory(args) {
    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        <RadioButton {...args} />
        <RadioButton {...args} label="Required Example" required />
        <RadioButton {...args} label="Stacked Example" stacked />
        <RadioButton {...args} label="Error Message Example" error="Please select an option" />
      </div>
    );
  },
  args: defaultArgs,
  globals: {
    theme: '',
  },
};

export const Default: Story = {
  args: { ...defaultArgs },
  globals: {
    theme: '',
  },
};

export const Required: Story = {
  args: {
    ...defaultArgs,
    required: true,
  },
  globals: {
    theme: '',
  },
};
export const Error: Story = {
  args: {
    ...defaultArgs,
    error: 'This field is required',
  },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};

export const Stacked: Story = {
  args: { ...defaultArgs, stacked: true },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};
