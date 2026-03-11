import { ComponentProps } from 'lib/component-props';

export type PDFFileFields = {
  url?: string;
  extension?: string;
  title?: string;
  size?: string;
};

export type PDFFileType = {
  name?: string;
  fields?: PDFFileFields[];
};

export type ProductDocumentsFields = {
  productDocumetation?: { name: string }[];
  fields?: PDFFileType[];
};

export type ProductDocumentsProps = ComponentProps & {
  fields?: ProductDocumentsFields;
  buttonVariant?: string;
};
