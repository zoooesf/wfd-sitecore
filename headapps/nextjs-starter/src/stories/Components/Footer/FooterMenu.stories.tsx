import { PlaceholdersData } from '@sitecore-content-sdk/nextjs';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as FooterMenu } from 'components/Footer/FooterMenu/FooterMenu';
import { paramsArgs } from 'lib/helpers/storybook';
import { mockFooterCol } from 'lib/helpers/storybook';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof FooterMenu> = {
  title: 'Components/Navigation/Footer/FooterMenu',
  component: FooterMenu,
  tags: ['autodocs'],
  parameters: {
    controls: {
      exclude: [
        'rendering.componentName',
        'rendering.dataSource',
        'params',
        'rendering.placeholders.footermenu-1',
        'fields',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ComponentArgs = {
  rendering: {
    componentName: 'FooterMenu',
    dataSource: '/sitecore',
    placeholders: {
      'footermenu-1': [
        mockFooterCol('Company', 4),
        mockFooterCol('Publications', 2),
        mockFooterCol('Resources', 3),
        mockFooterCol('Get in touch', 4),
      ],
    } as unknown as PlaceholdersData,
  },
  fields: {
    demo: { value: false },
  },
  params: {},
};

export const Default: Story = {
  args: ComponentArgs,
  globals: {
    theme: '',
  },
  render: (args) => <FooterMenu {...(args as typeof ComponentArgs)} params={paramsArgs('1')} />,
};
