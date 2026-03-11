import Frame from 'component-children/Shared/Frame/Frame';
import {
  ProductOverviewFields,
  ProductOverviewProps,
} from 'lib/types/components/Products/product-overview';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ProductOverview } from 'component-children/Product/ProductOverview/ProductOverview';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';

const ProductOverviewDefault: React.FC<ProductOverviewProps> = (props) => {
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as ProductOverviewFields;

  if (
    !routeFields ||
    !routeFields?.productApplications ||
    !routeFields?.productFeatures ||
    !routeFields?.productKeyBenefits
  ) {
    return;
  }

  return (
    <Frame params={props.params}>
      <ContainedWrapper>
        <ProductOverview {...props} fields={routeFields} />
      </ContainedWrapper>
    </Frame>
  );
};

export const Default = ProductOverviewDefault;
