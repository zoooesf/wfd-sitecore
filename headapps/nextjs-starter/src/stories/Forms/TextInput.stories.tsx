import type { Meta, StoryObj } from '@storybook/nextjs';
import { TextInput } from 'component-children/Shared/Form Field/TextInput';
import { ComponentProps, useState } from 'react';

const meta: Meta<typeof TextInput> = {
  title: 'Forms/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['label', 'error', 'disabled', 'placeholder'],
      exclude: ['value', 'onChange', 'isActive', 'className'],
    },
  },
  argTypes: {
    label: {
      description: 'The label text for the Text Input',
      type: { name: 'string', required: false },
    },
    placeholder: {
      description: 'Placeholder text for the Text Input',
      type: { name: 'string', required: false },
    },
    error: {
      description: 'Error message to display below the Text Input',
      type: { name: 'string', required: false },
    },
    disabled: {
      description: 'Whether the Text Input is Disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

const defaultArgs = {
  label: 'Label',
  error: '',
  disabled: false,
  placeholder: 'Type here...',
};

const StoryTextInput = (args: ComponentProps<typeof TextInput>) => {
  const [value, setValue] = useState('');
  return (
    <TextInput {...args} value={value} onChange={(newValue) => setValue(newValue as string)} />
  );
};

export const AllVariants: Story = {
  render: function AllVariantsStory(args) {
    const [defaultValue, setDefaultValue] = useState('');
    const [prefilledValue, setPrefilledValue] = useState('Prefilled text');
    const [errorValue, setErrorValue] = useState('');
    const [disabledValue, setDisabledValue] = useState('Disabled input');
    const [noLabelValue, setNoLabelValue] = useState('');

    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        <TextInput
          {...args}
          label="Default Input"
          value={defaultValue}
          onChange={(newValue) => setDefaultValue(newValue as string)}
          placeholder="Type here..."
        />

        <TextInput
          {...args}
          label="Prefilled Input"
          value={prefilledValue}
          onChange={(newValue) => setPrefilledValue(newValue as string)}
          placeholder="Type here..."
        />

        <TextInput
          {...args}
          label="Input with Error"
          value={errorValue}
          onChange={(newValue) => setErrorValue(newValue as string)}
          placeholder="Type here..."
          error="*This field is required"
        />

        <TextInput
          {...args}
          label="Disabled Input"
          value={disabledValue}
          onChange={(newValue) => setDisabledValue(newValue as string)}
          placeholder="Type here..."
          disabled
        />

        <TextInput
          {...args}
          label={undefined}
          value={noLabelValue}
          onChange={(newValue) => setNoLabelValue(newValue as string)}
          placeholder="Input without label"
        />
      </div>
    );
  },
  args: defaultArgs,
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};

export const Default: Story = {
  render: StoryTextInput,
  args: defaultArgs,
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};

export const WithError: Story = {
  render: (args) => {
    return <StoryTextInput {...args} />;
  },
  args: {
    ...defaultArgs,
    error: '*This field is required',
  },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};

export const Disabled: Story = {
  render: (args) => {
    return <StoryTextInput {...args} />;
  },
  args: {
    ...defaultArgs,
    disabled: true,
  },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};

export const WithoutLabel: Story = {
  render: (args) => {
    return <StoryTextInput {...args} />;
  },
  args: {
    ...defaultArgs,
    label: undefined,
  },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};
