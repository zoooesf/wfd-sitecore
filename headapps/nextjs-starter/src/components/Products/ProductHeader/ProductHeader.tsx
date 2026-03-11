import {
  ProductHeaderFields,
  ProductHeaderProps,
} from 'lib/types/components/Products/product-header';
import Frame from 'component-children/Shared/Frame/Frame';
import ProductHeader from 'component-children/Product/ProductHeader/ProductHeader';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import ProductMetaData from 'component-children/Product/ProductHeader/ProductMetaData';

const ProductHeaderDefault: React.FC<ProductHeaderProps> = (props) => {
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as ProductHeaderFields;

  // Use withDatasourceCheck to validate the route fields
  if (!routeFields) {
    return;
  }

  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ContainedWrapper className="relative">
        <ProductMetaData routeFields={routeFields} />
        <ProductHeader {...props} fields={routeFields} />
      </ContainedWrapper>
    </Frame>
  );
};

export const Default = ProductHeaderDefault;
