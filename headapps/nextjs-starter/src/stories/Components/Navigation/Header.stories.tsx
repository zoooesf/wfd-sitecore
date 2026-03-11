import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as Header } from 'components/Navigation/Header/Header';
import { imageFieldArgs, linkGQLArgs, paramsArgs } from 'lib/helpers/storybook';
import { linkFieldArgs } from 'lib/helpers/storybook';
import { mockLink } from 'lib/helpers/storybook/mock/link-mock';

const meta: Meta<typeof Header> = {
  title: 'Components/Navigation/Header',
  component: Header,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockSimpleLink = (text: string) => mockLink(text);

const mockMegaMenuLink = (text: string, columns: { columnName: string; items: string[] }[]) => ({
  link: linkGQLArgs(text, '#'),
  linkGroup: {
    results: columns.map((column) => ({
      link: linkGQLArgs(column.columnName, '#'),
      displayName: column.columnName,
      links: {
        results: column.items.map((item) => ({
          link: linkGQLArgs(item, `/${item.toLowerCase().replace(/\s+/g, '-')}`),
        })),
      },
    })),
  },
});

const mockHeaderLinks = [
  mockSimpleLink('Home'),
  mockMegaMenuLink('Services', [
    {
      columnName: 'Development Services',
      items: ['Web Apps', 'Mobile Apps', 'Cloud Solutions', 'APIs'],
    },
    { columnName: 'Design Services', items: ['UX Design', 'UI Design', 'Branding', 'Prototyping'] },
  ]),
  mockMegaMenuLink('Resources', [
    { columnName: 'Documentation', items: ['Tutorials', 'FAQs', 'Support'] },
  ]),
  mockMegaMenuLink('About', [
    { columnName: 'Company Overview', items: ['Our Story', 'Mission', 'Values', 'Leadership'] },
    { columnName: 'News & Media', items: ['Press Releases', 'Blog', 'Events', 'Awards'] },
    {
      columnName: 'Testimonials',
      items: ['Client Reviews', 'Success Stories', 'Testimonials', 'Case Studies'],
    },
  ]),
];

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
  },
  fields: {
    searchLink: linkFieldArgs('Search'),
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
  render: (args) => <Header {...(args as typeof ComponentArgs)} params={paramsArgs('1')} />,
};
