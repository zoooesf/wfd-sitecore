import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProductResources } from 'component-children/Product/ProductResources/ProductResources';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';

const meta = {
  title: 'Components/Products/ProductResources',
  component: ProductResources,
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
} satisfies Meta<typeof ProductResources>;

export default meta;
type Story = StoryObj<typeof ProductResources>;

const DefaultFields = {
  productResources: [
    {
      name: 'Advocacy Group Launches Campaign for Enhanced Public Safety Measures',
      url: '#',
      fields: {
        SxaTags: [{ id: '1', name: 'Whitepaper', displayName: 'Whitepaper' }],
      },
    },
    {
      name: 'Aerospace Sector Adopts New Quality Assurance Protocols After Industry Review',
      url: '#',
      fields: {
        SxaTags: [{ id: '2', name: 'Case Study', displayName: 'Case Study' }],
      },
    },
    {
      name: 'Agile Supply Chains Business Analysis for Electronics Resilience',
      url: '#',
      fields: {
        SxaTags: [{ id: '3', name: 'Application Note', displayName: 'Application Note' }],
      },
    },
  ],
};

export const Default: Story = {
  args: {
    fields: DefaultFields,
  },
};
