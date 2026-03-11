import type { Meta, StoryObj } from '@storybook/nextjs';
import { imageFieldArgs, linkFieldArgs, stringFieldArgs } from 'lib/helpers/storybook';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';
import ProductHeader from 'component-children/Product/ProductHeader/ProductHeader';

const meta = {
  title: 'Components/Products/ProductHeader',
  component: ProductHeader,
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
} satisfies Meta<typeof ProductHeader>;

export default meta;

type Story = StoryObj<typeof ProductHeader>;

const DefaultFields = {
  productName: stringFieldArgs('Industrial Servo Motor X500'),
  productDescription: stringFieldArgs(
    'High-precision servo motor designed for demanding industrial automation applications. Features advanced torque control and energy-efficient operation.'
  ),
  link: linkFieldArgs('#', 'Request a Quote'),
  link2: linkFieldArgs('#', 'Contact Sales'),
  image: imageFieldArgs(),
  productSku: stringFieldArgs('ISM-X500-5K-STD'),
  SxaTags: [
    { id: '1', name: 'Utilities and Energy', displayName: 'Utilities and Energy' },
    { id: '2', name: 'Engineering', displayName: 'Engineering' },
    { id: '3', name: 'Technology', displayName: 'Technology' },
  ],
  imageMobile: imageFieldArgs(),
};

export const Default: Story = {
  args: {
    fields: DefaultFields,
  },
};
