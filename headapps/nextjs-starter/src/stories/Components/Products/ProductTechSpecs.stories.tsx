import type { Meta, StoryObj } from '@storybook/nextjs';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';
import { ProductTechSpecs } from 'component-children/Product/ProductTechSpecs/ProductTechSpecs';
import { stringFieldArgs } from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Products/ProductTechSpecs',
  component: ProductTechSpecs,
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
} satisfies Meta<typeof ProductTechSpecs>;

export default meta;

type Story = StoryObj<typeof ProductTechSpecs>;

const DefaultFields = {
  productTechnicalSpecs: stringFieldArgs(
    'Sensing Range=8mm%20%28flush%20mount%29&Output Type=NPN%2C%20NO%2FNC&Operating Voltage=10-30V%20DC&Current Consumption=%E2%89%A415mA&Output Current=200mA&Response Time=%3C0.5ms&Protection Rating=IP67%2FIP69K&Housing Material=Stainless%20steel%20%28V4A%29&Operating Temperature=-25%C2%B0C%20to%20%2B70%C2%B0C&Connection Type=M12%20connector%2C%204-pin'
  ),
};

export const Default: Story = {
  args: {
    fields: DefaultFields,
  },
};
