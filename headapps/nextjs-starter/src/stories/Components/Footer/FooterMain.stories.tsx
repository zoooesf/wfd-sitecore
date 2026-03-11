import { PlaceholdersData } from '@sitecore-content-sdk/nextjs';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as FooterMain } from 'components/Footer/FooterMain/FooterMain';
import {
  excludeLinkArgs,
  imageFieldArgs,
  linkArgTypes,
  linkFieldArgs,
  mockFooterCol,
  paramsArgs,
  stringFieldArgs,
  textFieldArgTypes,
} from 'lib/helpers/storybook';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof FooterMain> = {
  title: 'Components/Navigation/Footer/FooterMain',
  component: FooterMain,
  tags: ['autodocs'],
  argTypes: {
    ...linkArgTypes('newsletterLink', 'Newsletter Link'),
    ...textFieldArgTypes('newsletterHeading', 'Newsletter Heading'),
    ...textFieldArgTypes('newsletterBody', 'Newsletter Body'),
  },
  parameters: {
    controls: {
      exclude: [
        ...excludeLinkArgs('newsletterLink'),
        'rendering.componentName',
        'rendering.dataSource',
        'params',
        'rendering.placeholders.footermenu-1',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ComponentArgs = {
  rendering: {
    componentName: 'FooterMain',
    dataSource: '/sitecore',
    placeholders: {
      'footermenu-1': [mockFooterCol('Company', 4)],
    } as unknown as PlaceholdersData,
  },
  fields: {
    newsletterHeading: stringFieldArgs('Newsletter Heading'),
    newsletterBody: stringFieldArgs('Newsletter Body'),
    newsletterLink: linkFieldArgs('/', 'Newsletter Link', '_self'),
    logo: imageFieldArgs(100, 100, 1),
    demo: { value: false },
  },
  params: {},
};

export const Default: Story = {
  args: ComponentArgs,
  globals: {
    theme: '',
  },
  render: (args) => <FooterMain {...(args as typeof ComponentArgs)} params={paramsArgs('1')} />,
};
