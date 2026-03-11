import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Default as SideNav,
  SideNavDropdownFields,
  SideNavLinkDataType,
} from 'components/Navigation/SideNav/SideNav';
import { linkFieldArgs, paramsArgs, stringFieldArgs } from 'lib/helpers/storybook';
import { LinkGQLType } from 'lib/types';

const meta: Meta<typeof SideNav> = {
  title: 'Components/Navigation/SideNav',
  component: SideNav,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Reusable function to create mock navigation links
const createMockLinks = (count: number, isJsonValue = true) => {
  return Array(count)
    .fill(null)
    .map((_, i) => {
      const jsonValue = {
        jsonValue: linkFieldArgs(`#link${i + 1}`, `Link ${i + 1}`, '', `#link${i + 1}`),
      };
      return isJsonValue ? jsonValue : { link: jsonValue };
    });
};

const mockSideNavGroup = (heading: string, numLinks: number): SideNavDropdownFields => ({
  heading: stringFieldArgs(heading),
  links: createMockLinks(numLinks) as LinkGQLType[],
});

const ComponentArgs = {
  rendering: {
    componentName: 'SideNav',
    dataSource: '/sitecore',
    data: {
      item: {
        children: {
          results: [
            {
              heading: { value: 'Personal Information' },
              children: {
                results: createMockLinks(3, false) as SideNavLinkDataType[],
              },
            },
            {
              heading: { value: 'Organization Details' },
              children: {
                results: createMockLinks(4, false) as SideNavLinkDataType[],
              },
            },
            {
              heading: { value: 'Quick Links' },
              children: {
                results: createMockLinks(2, false) as SideNavLinkDataType[],
              },
            },
          ],
        },
      },
    },
  },
  fields: {
    heading: stringFieldArgs('Navigation'),
    navigationGroups: [
      mockSideNavGroup('Personal Information', 3),
      mockSideNavGroup('Organization Details', 4),
      mockSideNavGroup('Quick Links', 2),
    ],
  },
  params: paramsArgs('1'),
};

export const Default: Story = {
  args: ComponentArgs,
};
