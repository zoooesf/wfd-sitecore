import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProductOverview } from 'component-children/Product/ProductOverview/ProductOverview';
import { stringFieldArgs } from 'lib/helpers/storybook';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';

const meta = {
  title: 'Components/Products/ProductOverview',
  component: ProductOverview,
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
} satisfies Meta<typeof ProductOverview>;

export default meta;
type Story = StoryObj<typeof ProductOverview>;

const DefaultFields = {
  productKeyBenefits: stringFieldArgs(`
    <ul style="list-style-type: square">
        <li>High-precision torque control with 0.01% accuracy</li>
        <li>Energy-efficient design reduces power consumption by 30%</li>
        <li>Built-in safety features meet IEC 61508 SIL 3 standards</li>
        <li>Compatible with all major fieldbus protocols</li>
    </ul>
    `),
  productFeatures: stringFieldArgs(`
    <ul style="list-style-type: square">
        <li>Advanced servo algorithm for smooth motion</li>
        <li>Integrated encoder with 23-bit resolution</li>
        <li>Overload protection and thermal monitoring</li>
        <li>IP65-rated housing for harsh environments</li>
    </ul>
    `),
  productApplications: stringFieldArgs(`
    <ul style="list-style-type: square">
        <li>CNC machining centers</li>
        <li>Pick-and-place robotics</li>
        <li>Packaging automation</li>
        <li>Material handling systems</li>
    </ul>
    `),
};

export const Default: Story = {
  args: {
    fields: DefaultFields,
  },
};
