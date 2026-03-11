import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as Accordion } from 'src/components/Accordions/Accordion/Accordion';
import { AccordionProvider } from 'lib/hooks/useAccordion';
import { linkFieldArgs, linkFieldArgsEmpty, stringFieldArgs } from 'lib/helpers/storybook/mock';
import {
  generatePlaceholderAccordionDrawers,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Accordions/Accordion',
  component: Accordion,
  decorators: [
    (Story) => (
      <AccordionProvider>
        <Story />
      </AccordionProvider>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  fields: {
    heading: stringFieldArgs('Accordion Heading'),
    subheading: stringFieldArgs('Accordion Subheading'),
    link: linkFieldArgs('/', 'Primary Button', '_self'),
  },
  rendering: {
    componentName: 'Accordion',
    dataSource: '/sitecore',
    placeholders: {
      'accordion-1': generatePlaceholderAccordionDrawers(),
    },
  },
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <Accordion {...args} params={params} />;
  },
};

export const NoButtons: Story = {
  args: {
    ...DefaultArgs,
    fields: {
      ...DefaultArgs.fields,
      link: linkFieldArgsEmpty,
    },
  },
  render: (args, globals) => {
    const { params } = globals;
    return <Accordion {...args} params={params} />;
  },
};
