import type { Meta, StoryObj } from '@storybook/nextjs';
import { PhoneInput } from 'component-children/Shared/Form Field/PhoneInput';
import { ComponentProps, useState } from 'react';

const meta: Meta<typeof PhoneInput> = {
  title: 'Forms/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['label', 'disabled', 'placeholder', 'required'],
      exclude: ['value', 'onChange', 'isActive', 'className'],
    },
  },
  argTypes: {
    label: {
      description: 'The label text for the Phone Number Input',
      type: { name: 'string', required: false },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

const defaultArgs = {
  label: 'Label',
  error: '',
  disabled: false,
  placeholder: 'Type here...',
  required: false,
};

const StoryTextInput = (args: ComponentProps<typeof PhoneInput>) => {
  const [value, setValue] = useState(args.value || '');
  return <PhoneInput {...args} value={value} onChange={(newValue) => setValue(newValue)} />;
};

export const AllVariants: Story = {
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  render: function AllVariantsStory(args) {
    const [defaultValue, setDefaultValue] = useState('');
    const [prefilledValue, setPrefilledValue] = useState('(555) 123-4567');
    const [disabledValue, setDisabledValue] = useState('(555) 987-6543');

    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        <PhoneInput
          {...args}
          label="Default Input"
          value={defaultValue}
          onChange={(newValue) => setDefaultValue(newValue as string)}
          placeholder="(555) 555-5555"
        />

        <PhoneInput
          {...args}
          label="Prefilled Input"
          value={prefilledValue}
          onChange={(newValue) => setPrefilledValue(newValue as string)}
          placeholder="(555) 555-5555"
        />

        <PhoneInput
          {...args}
          label="Disabled Input"
          value={disabledValue}
          onChange={(newValue) => setDisabledValue(newValue)}
          placeholder="(555) 555-5555"
          disabled
        />

        <PhoneInput
          {...args}
          label="Required Input"
          value={defaultValue}
          onChange={(newValue) => setDefaultValue(newValue as string)}
          placeholder="(555) 555-5555"
          required
        />
      </div>
    );
  },
  args: defaultArgs,
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
