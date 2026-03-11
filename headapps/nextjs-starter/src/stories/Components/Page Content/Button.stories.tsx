import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as Button } from 'src/components/Page Content/Button/Button';
import { linkFieldArgs, withDatasourceCheckComponentArgs } from 'lib/helpers/storybook/mock';
import { PRIMARY_THEME, SECONDARY_THEME, TERTIARY_THEME } from 'lib/const';

const meta = {
  title: 'Components/Page Content/Button',
  component: Button,
  decorators: [
    (Story) => (
      <div data-component="Frame" className="relative z-0 overflow-hidden">
        <div className="mx-auto max-w-screen-lg">
          <h1 className="mb-md text-3xl font-bold">Button Component</h1>
          <div className="flex flex-row gap-4">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockButton = () => {
  return {
    componentName: 'Button',
    dataSource: '/sitecore',
  };
};

const DefaultFields = {
  link: linkFieldArgs('/', 'Primary Button', '_self'),
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: DefaultFields,
  rendering: mockButton(),
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  globals: {
    theme: '',
  },
  render: (args, globals) => {
    const { params } = globals;
    return (
      <>
        <Button {...args} params={{ ...params, Styles: `theme:${PRIMARY_THEME}` }} />
        <Button {...args} params={{ ...params, Styles: `theme:${SECONDARY_THEME}` }} />
        <Button {...args} params={{ ...params, Styles: `theme:${TERTIARY_THEME}` }} />
      </>
    );
  },
};
