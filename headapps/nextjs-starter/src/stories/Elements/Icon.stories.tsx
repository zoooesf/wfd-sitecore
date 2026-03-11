import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Icon, { IconFas } from 'component-children/Shared/Icon/Icon';
import IconSocialComponent from 'component-children/Shared/Icon/IconSocial';
import { cn } from 'lib/helpers/classname';

const meta = {
  title: 'Elements/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Icon components for displaying various icons throughout the application.',
      },
    },
  },
  argTypes: {
    className: { control: 'text' },
    icon: { control: 'text' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

const IconDisplay: React.FC<{ name: string; children: React.ReactNode }> = ({ name, children }) => (
  <div className="m-2 flex flex-col items-center justify-center rounded-md border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-md">
    <div className="mb-4">{children}</div>
    <span className="text-sm text-gray-600">{name}</span>
  </div>
);

const baseIconClasses = 'text-3xl';

export const StandardIcons: Story = {
  args: {
    prefix: 'fas',
    icon: 'magnifying-glass',
  },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
      <IconDisplay name="magnifying-glass">
        <IconFas icon="magnifying-glass" className={cn(baseIconClasses, 'text-primary')} />
      </IconDisplay>
      <IconDisplay name="bars">
        <IconFas icon="bars" className={cn(baseIconClasses, 'text-secondary')} />
      </IconDisplay>
      <IconDisplay name="xmark">
        <IconFas icon="xmark" className={cn(baseIconClasses, 'text-error')} />
      </IconDisplay>
      <IconDisplay name="chevron-right">
        <IconFas icon="chevron-right" className={cn(baseIconClasses, 'text-success')} />
      </IconDisplay>
    </div>
  ),
};

export const SocialIcons: Story = {
  args: {
    prefix: 'fab',
    icon: 'twitter',
  },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
      <IconDisplay name="twitter">
        <IconSocialComponent icon="twitter" className={cn(baseIconClasses, 'text-blue-400')} />
      </IconDisplay>
      <IconDisplay name="facebook">
        <IconSocialComponent icon="facebook" className={cn(baseIconClasses, 'text-blue-600')} />
      </IconDisplay>
      <IconDisplay name="instagram">
        <IconSocialComponent icon="instagram" className={cn(baseIconClasses, 'text-pink-500')} />
      </IconDisplay>
    </div>
  ),
};

export const SizeVariants: Story = {
  args: {
    prefix: 'fas',
    icon: 'magnifying-glass',
  },
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  render: () => (
    <div className="flex flex-col space-y-10 p-4">
      <div className="flex items-end space-x-8">
        <IconDisplay name="Small">
          <IconFas icon="magnifying-glass" className="text-xl text-primary" />
        </IconDisplay>
        <IconDisplay name="Medium">
          <IconFas icon="magnifying-glass" className="text-2xl text-primary" />
        </IconDisplay>
        <IconDisplay name="Large">
          <IconFas icon="magnifying-glass" className="text-3xl text-primary" />
        </IconDisplay>
        <IconDisplay name="Extra Large">
          <IconFas icon="magnifying-glass" className="text-4xl text-primary" />
        </IconDisplay>
      </div>
    </div>
  ),
};
