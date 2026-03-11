import type { Meta, StoryObj, StoryContext } from '@storybook/nextjs';
import { AlertBanner } from 'component-children/Page Content/AlertBanner/AlertBanner';
import { Field } from '@sitecore-content-sdk/nextjs';
import { FrameProvider } from 'lib/hooks/useFrame';
import { getTheme } from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Page Content/AlertBanner',
  component: AlertBanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    fields: {
      control: 'object',
      description: 'Banner field data including heading, body, and alert category',
      table: { disable: true },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<AlertBannerStoryArgs>;

type AlertBannerStoryArgs = {
  alertCategory?: 'Warning' | 'Information';
  heading: string;
  body: string;
};

const DefaultArgs: AlertBannerStoryArgs = {
  heading: 'Alert Banner Heading',
  body: 'This is the alert banner message content.',
};

const AlertBannerWrapper = (args: AlertBannerStoryArgs, context: StoryContext) => {
  const theme = getTheme(context);
  const params = { Styles: `theme:${theme}` };

  const fields = {
    id: 'mock-id',
    heading: { jsonValue: { value: args.heading } },
    body: { jsonValue: { value: args.body } },
    ...(args.alertCategory && {
      alertCategory: { value: args.alertCategory.toLowerCase() } as Field<
        'warning' | 'information'
      >,
    }),
  };

  return (
    <FrameProvider params={params}>
      <AlertBanner fields={fields} />
    </FrameProvider>
  );
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, context) => AlertBannerWrapper(args, context),
  argTypes: {
    heading: {
      name: 'Heading',
      control: 'text',
      description: 'Heading of the alert',
    },
    body: {
      name: 'Body',
      control: 'text',
      description: 'Body of the alert',
    },
  },
};

export const Warning: Story = {
  args: {
    ...DefaultArgs,
    alertCategory: 'Warning',
    heading: 'Warning Alert Banner',
    body: 'This is how the warning alert banner appears.',
  },
  render: (args, context) => AlertBannerWrapper(args, context),
  globals: {
    theme: '',
  },
  argTypes: {
    alertCategory: { table: { disable: true } },
    heading: {
      name: 'Heading',
      control: 'text',
      description: 'Heading of the alert',
    },
    body: {
      name: 'Body',
      control: 'text',
      description: 'Body of the alert',
    },
  },
};

export const Information: Story = {
  args: {
    ...DefaultArgs,
    alertCategory: 'Information',
    heading: 'Information Alert Banner',
    body: 'This is how the information alert banner appears.',
  },
  render: (args, context) => AlertBannerWrapper(args, context),
  globals: {
    theme: '',
  },
  argTypes: {
    alertCategory: { table: { disable: true } },
    heading: {
      name: 'Heading',
      control: 'text',
      description: 'Heading of the alert',
    },
    body: {
      name: 'Body',
      control: 'text',
      description: 'Body of the alert',
    },
  },
};
