import type { Meta, StoryObj } from '@storybook/nextjs';
import { EmailInput } from 'component-children/Shared/Form Field/EmailInput';
import { ComponentProps, useState } from 'react';

const meta: Meta<typeof EmailInput> = {
  title: 'Forms/EmailInput',
  component: EmailInput,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['label', 'disabled', 'placeholder', 'required'],
      exclude: ['value', 'onChange', 'isActive', 'className'],
    },
  },
  argTypes: {
    label: {
      description: 'The label text for the Email Input',
      type: { name: 'string', required: false },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmailInput>;

const defaultArgs = {
  label: 'Label',
  error: '',
  disabled: false,
  placeholder: 'Type here...',
  required: false,
};

const StoryTextInput = (args: ComponentProps<typeof EmailInput>) => {
  const [value, setValue] = useState(args.value || '');
  return <EmailInput {...args} value={value} onEmailChange={(newValue) => setValue(newValue)} />;
};

export const AllVariants: Story = {
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  render: function AllVariantsStory(args) {
    const [defaultValue, setDefaultValue] = useState('');
    const [prefilledValue, setPrefilledValue] = useState('name@email.com');
    const [disabledValue, setDisabledValue] = useState('name@email.com');

    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        <EmailInput
          {...args}
          label="Default Input"
          value={defaultValue}
          onEmailChange={(newValue) => setDefaultValue(newValue as string)}
        />

        <EmailInput
          {...args}
          label="Prefilled Input"
          value={prefilledValue}
          onEmailChange={(newValue) => setPrefilledValue(newValue as string)}
        />

        <EmailInput
          {...args}
          label="Disabled Input"
          value={disabledValue}
          onEmailChange={(newValue) => setDisabledValue(newValue)}
          disabled
        />
        <EmailInput
          {...args}
          label="Required Input"
          value={defaultValue}
          onEmailChange={(newValue) => setDefaultValue(newValue as string)}
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
