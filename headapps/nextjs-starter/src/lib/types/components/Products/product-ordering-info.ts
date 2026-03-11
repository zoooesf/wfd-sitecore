import { RichTextField } from '@sitecore-content-sdk/nextjs';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export type ProductOrderingInfoFields = {
  productOrderingInfo?: Array<{
    fields?: {
      partNumber?: Field<string>;
      description?: RichTextField;
      partLeadTime?: Field<string>;
    };
  }>;
};

export type ProductOrderingInfoProps = ComponentProps & {
  fields?: ProductOrderingInfoFields;
};

export type ProductOrderingInfoItemTableRowProps = {
  item?: NonNullable<ProductOrderingInfoFields['productOrderingInfo']>[number];
  index?: number;
  tableRowClasses?: string;
  tableCellClasses?: string;
};
