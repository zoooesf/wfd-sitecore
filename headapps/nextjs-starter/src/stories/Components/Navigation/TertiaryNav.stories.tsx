import { Meta, StoryObj } from '@storybook/nextjs';
import { Default as TertiaryNav } from 'components/Navigation/TertiaryNav/TertiaryNav';
import { paramsArgs } from 'lib/helpers/storybook';
import { linkFieldArgs } from 'lib/helpers/storybook';
import { mockHeaderLinks } from 'lib/helpers/storybook/mock/layout-mock';
import { mockButton } from 'lib/helpers/storybook/mock/button-mock';

const meta: Meta<typeof TertiaryNav> = {
  title: 'Components/Navigation/TertiaryNav',
  component: TertiaryNav,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ComponentArgs = {
  rendering: {
    componentName: 'Header',
    dataSource: '/sitecore',
    data: {
      item: {
        links: {
          results: mockHeaderLinks,
        },
      },
    },
    placeholders: {},
  },
  fields: {
    searchLink: linkFieldArgs('Search'),
    demo: { value: false },
  },
  globals: {
    theme: '',
    paddingTop: 'top-none',
    paddingBottom: 'bottom-none',
  },
  params: {},
};

export const Default: Story = {
  args: ComponentArgs,
  globals: {
    theme: '',
  },
  render: (args) => <TertiaryNav {...(args as typeof ComponentArgs)} params={paramsArgs('1')} />,
};

export const WithPlaceholders: Story = {
  args: {
    ...ComponentArgs,
    rendering: {
      ...ComponentArgs.rendering,
      placeholders: {
        // update when language selector and sign in button are implemented
        'tertiarynavcomponents-1': [mockButton('Sign In'), mockButton('Language')],
      },
    },
  },
  globals: {
    theme: '',
  },
  render: (args) => <TertiaryNav {...(args as typeof ComponentArgs)} params={paramsArgs('1')} />,
};
