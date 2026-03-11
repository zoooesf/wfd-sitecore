import type { Meta, StoryFn, StoryObj } from '@storybook/nextjs';
import { CheckboxGroup } from 'component-children/Shared/Form Field/CheckboxGroup';
import { useState } from 'react';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Forms/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['label', 'options', 'value', 'stack', 'required', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

const defaultArgs = {
  label: 'Select options',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  value: [],
  stack: false,
  required: false,
  error: '',
};

const CheckboxGroupWrapper: StoryFn<typeof CheckboxGroup> = (args) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(args.value || []);

  return <CheckboxGroup {...args} value={selectedValues} onChange={setSelectedValues} />;
};

export const AllVariants: Story = {
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  render: function AllVariantsStory(args) {
    const [defaultValues, setDefaultValues] = useState<string[]>([]);
    const [preselectedValues, setPreselectedValues] = useState<string[]>(['option1', 'option2']);
    const [errorValues, setErrorValues] = useState<string[]>([]);
    const [stackedValues, setStackedValues] = useState<string[]>(['option3']);
    const [requiredValues, setRequiredValues] = useState<string[]>([]);

    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 p-4">
        <CheckboxGroup
          {...args}
          label="Default Checkbox Group"
          value={defaultValues}
          onChange={setDefaultValues}
          options={defaultArgs.options}
        />

        <CheckboxGroup
          {...args}
          label="Pre-selected Options"
          value={preselectedValues}
          onChange={setPreselectedValues}
          options={defaultArgs.options}
        />

        <CheckboxGroup
          {...args}
          label="With Error"
          value={errorValues}
          onChange={setErrorValues}
          options={defaultArgs.options}
          error="Please select at least one option"
        />

        <CheckboxGroup
          {...args}
          label="Stacked Layout"
          value={stackedValues}
          onChange={setStackedValues}
          options={defaultArgs.options}
          stack={true}
        />

        <CheckboxGroup
          {...args}
          label="Required Selection"
          value={requiredValues}
          onChange={setRequiredValues}
          options={defaultArgs.options}
          required={true}
        />
      </div>
    );
  },
  args: defaultArgs,
};

export const Default: Story = {
  render: CheckboxGroupWrapper,
  args: { ...defaultArgs },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};

export const WithError: Story = {
  render: CheckboxGroupWrapper,
  args: {
    ...defaultArgs,
    error: 'Please select at least one option',
  },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};

export const Stacked: Story = {
  render: CheckboxGroupWrapper,
  args: {
    ...defaultArgs,
    stack: true,
  },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};

export const Required: Story = {
  render: CheckboxGroupWrapper,
  args: {
    ...defaultArgs,
    required: true,
  },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
};
