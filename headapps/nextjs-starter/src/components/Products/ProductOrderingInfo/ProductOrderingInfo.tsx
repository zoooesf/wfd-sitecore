import Frame from 'component-children/Shared/Frame/Frame';
import {
  ProductOrderingInfoFields,
  ProductOrderingInfoProps,
} from 'lib/types/components/Products/product-ordering-info';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ProductOrderingInfo } from 'component-children/Product/ProductOrderingInfo/ProductOrderingInfo';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';

const ProductOrderingInfoDefault: React.FC<ProductOrderingInfoProps> = (props) => {
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as ProductOrderingInfoFields;

  if (!routeFields || !routeFields?.productOrderingInfo) {
    return;
  }

  return (
    <Frame params={props.params}>
      <ContainedWrapper>
        <ProductOrderingInfo {...props} fields={routeFields} />
      </ContainedWrapper>
    </Frame>
  );
};

export const Default = ProductOrderingInfoDefault;
