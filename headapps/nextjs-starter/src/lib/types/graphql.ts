import { LinkField } from '@sitecore-content-sdk/nextjs';

export type JSONValueType<T> = {
  jsonValue: T;
};

export type LinkGQLType = {
  jsonValue: LinkField;
};

export type ImageGQLType = {
  src: string;
  alt: string;
  jsonValue?: {
    value: {
      src: string;
      alt: string;
      width: string;
      height: string;
    };
  };
};

export type CategoryGQLType = {
  jsonValue?: {
    id: string;
    url: string;
    name: string;
    displayName: string;
  };
};

export type DateGQLType = {
  formattedDateValue: string;
};
