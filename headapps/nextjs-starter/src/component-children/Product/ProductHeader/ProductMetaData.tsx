import { ProductHeaderFields } from 'lib/types/components/Products/product-header';
import Head from 'next/head';

export const ProductMetaData: React.FC<ProductMetaDataProps> = ({ routeFields }) => {
  return (
    <Head>
      {routeFields?.productName && (
        <meta property="product:name" content={routeFields.productName?.value} />
      )}
      {routeFields?.productSubheading && (
        <meta property="product:subheading" content={routeFields.productSubheading?.value} />
      )}
      {routeFields?.productSku && (
        <meta property="product:sku" content={routeFields.productSku?.value} />
      )}
    </Head>
  );
};

type ProductMetaDataProps = {
  routeFields: ProductHeaderFields;
};

export default ProductMetaData;
