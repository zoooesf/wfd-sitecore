import Frame from 'component-children/Shared/Frame/Frame';
import {
  ProductResourcesFields,
  ProductResourcesProps,
} from 'lib/types/components/Products/product-resources';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { ProductResources } from 'component-children/Product/ProductResources/ProductResources';

const ProductResourcesDefault: React.FC<ProductResourcesProps> = (props) => {
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as ProductResourcesFields;

  if (
    !routeFields ||
    !routeFields?.productResources ||
    routeFields?.productResources?.length === 0
  ) {
    return;
  }

  return (
    <Frame params={props.params}>
      <ContainedWrapper>
        <ProductResources {...props} fields={routeFields} />
      </ContainedWrapper>
    </Frame>
  );
};

export const Default = ProductResourcesDefault;
