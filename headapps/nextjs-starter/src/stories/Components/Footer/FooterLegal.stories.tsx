import { PlaceholdersData } from '@sitecore-content-sdk/nextjs';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as FooterLegal } from 'components/Footer/FooterLegal/FooterLegal';
import {
  excludeLinkArgs,
  linkArgTypes,
  linkGQLArgs,
  mockFooterCol,
  mockFooterLegalFields,
  paramsArgs,
  textFieldArgTypes,
} from 'lib/helpers/storybook';
import { IconSocialType } from 'lib/types';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof FooterLegal> = {
  title: 'Components/Navigation/Footer/FooterLegal',
  component: FooterLegal,
  tags: ['autodocs'],
  argTypes: {
    ...linkArgTypes('cookiePolicyLink', 'Cookie Policy'),
    ...linkArgTypes('privacyPolicyLink', 'Privacy Policy'),
    ...linkArgTypes('tosLink', 'Terms of Service'),
    ...textFieldArgTypes('copyright', 'Copyright'),
    ...textFieldArgTypes('landAcknowledgement', 'Land Acknowledgement'),
  },
  parameters: {
    controls: {
      exclude: [
        ...excludeLinkArgs('cookiePolicyLink'),
        ...excludeLinkArgs('privacyPolicyLink'),
        ...excludeLinkArgs('tosLink'),
        'rendering.componentName',
        'rendering.dataSource',
        'params',
        'rendering.placeholders.FooterLegal-1',
        'rendering.socialLinks',
        'className',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ComponentArgs = {
  rendering: {
    componentName: 'FooterLegal',
    dataSource: '/sitecore',
    placeholders: {
      'FooterLegal-1': [
        mockFooterCol('Heading1', 4),
        mockFooterCol('Heading2', 1),
        mockFooterCol('Heading3', 2),
      ],
    } as unknown as PlaceholdersData,
    socialLinks: [
      {
        socialIcon: { value: 'instagram' as IconSocialType },
        link: linkGQLArgs(),
      },
    ],
  },
  fields: mockFooterLegalFields,
  params: {},
};

export const Default: Story = {
  args: ComponentArgs,
  globals: {
    theme: '',
  },
  render: (args) => <FooterLegal {...(args as typeof ComponentArgs)} params={paramsArgs('1')} />,
};
