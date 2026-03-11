import {
  ProductTechSpecsFields,
  ProductTechSpecsProps,
} from 'lib/types/components/Products/product-tech-specs';
import Frame from 'component-children/Shared/Frame/Frame';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ProductTechSpecs } from 'component-children/Product/ProductTechSpecs/ProductTechSpecs';

const ProductTechSpecsDefault: React.FC<ProductTechSpecsProps> = (props) => {
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as ProductTechSpecsFields;

  if (!routeFields || !routeFields?.productTechnicalSpecs) {
    return;
  }

  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ContainedWrapper>
        <ProductTechSpecs {...props} fields={routeFields} />
      </ContainedWrapper>
    </Frame>
  );
};

export const Default = ProductTechSpecsDefault;
