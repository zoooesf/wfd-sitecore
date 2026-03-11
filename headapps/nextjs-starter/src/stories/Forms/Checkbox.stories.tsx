import type { Meta, StoryObj } from '@storybook/nextjs';
import { Checkbox } from 'component-children/Shared/Form Field/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['label', 'error', 'disabled'],
    },
  },
  argTypes: {
    label: {
      description: 'The label text for the checkbox',
      type: { name: 'string', required: false },
    },
    error: {
      description: 'Error message to display below the checkbox',
      type: { name: 'string', required: false },
    },
    disabled: {
      description: 'Whether the checkbox is Disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

const defaultArgs = {
  label: 'Accept terms and conditions',
  error: '',
  disabled: false,
};

export const Default: Story = {
  args: { ...defaultArgs },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};

export const WithError: Story = {
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  args: {
    ...defaultArgs,
    error: 'This field is required',
  },
};

export const Disabled: Story = {
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  args: {
    ...defaultArgs,
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  args: {},
};
