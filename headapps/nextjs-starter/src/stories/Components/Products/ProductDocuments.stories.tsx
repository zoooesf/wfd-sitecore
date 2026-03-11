import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProductDocuments } from 'component-children/Product/ProductDocuments/ProductDocuments';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';
import { PDFFileType } from 'lib/types/components/Products/product-documents';

const meta = {
  title: 'Components/Products/ProductDocuments',
  component: ProductDocuments,
  decorators: [
    (Story, context) => {
      const { theme } = context.globals;
      const params = {
        Styles: theme ? `theme:${theme}` : '',
      };

      return (
        <Frame params={params}>
          <ContainedWrapper>
            <Story />
          </ContainedWrapper>
        </Frame>
      );
    },
  ],
} satisfies Meta<typeof ProductDocuments>;

export default meta;
type Story = StoryObj<typeof ProductDocuments>;

const DefaultFields: PDFFileType[] = [
  {
    fields: [
      {
        url: '#',
        extension: 'pdf',
        title: 'Installation Guide',
        size: '204800',
      },
    ],
  },
  {
    fields: [
      {
        url: '#',
        extension: 'jpg',
        title: 'Quick Start Guide',
        size: '15360020',
      },
    ],
  },
  {
    fields: [
      {
        url: '#',
        extension: 'file',
        title: 'Safety Information',
        size: '803434803434',
      },
    ],
  },
];

export const Default: Story = {
  args: {
    fields: DefaultFields,
  },
};
