import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProductOrderingInfo } from 'component-children/Product/ProductOrderingInfo/ProductOrderingInfo';
import { stringFieldArgs } from 'lib/helpers/storybook';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';

const meta = {
  title: 'Components/Products/ProductOrderingInfo',
  component: ProductOrderingInfo,
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
} satisfies Meta<typeof ProductOrderingInfo>;

export default meta;
type Story = StoryObj<typeof ProductOrderingInfo>;

const DefaultFields = {
  productOrderingInfo: [
    {
      fields: {
        partNumber: stringFieldArgs('ISM-X500-5K-STD'),
        partLeadTime: stringFieldArgs('1-2 weeks'),
        description: stringFieldArgs('Industrial Servo Motor X500'),
      },
    },
    {
      fields: {
        partNumber: stringFieldArgs('X5000-5K-400-BR'),
        partLeadTime: stringFieldArgs('6 weeks'),
        description: stringFieldArgs('With brake option'),
      },
    },
  ],
};

export const Default: Story = {
  args: {
    fields: DefaultFields,
  },
};
