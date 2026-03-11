import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import { CustomField } from '../fields';
import { CommonPageRouteMetaDataFieldsType } from './page';

export type TwitterCardFieldType = {
  fields: {
    Value: {
      value: string;
    };
  };
};

export type ConfigType = {
  name: string;
  displayName: string;
};

export type TagType = {
  id: string;
  displayName: string;
  name: string;
  title?: Field<string>;
  fields?: {
    Title?: Field<string>;
  };
};

type MetaFieldTypes =
  | CustomField
  | Field<string>
  | ImageField
  | TwitterCardFieldType
  | ConfigType
  | TagType[];

export type CustomPageMetaFieldsType = CommonPageRouteMetaDataFieldsType & {
  fields: {
    [key: string]: MetaFieldTypes;

    //OG Tags
    OpenGraphTitle: Field<string>;
    OpenGraphDescription: Field<string>;
    OpenGraphImageUrl: ImageField;
    OpenGraphType: Field<string>;
    OpenGraphSiteName: Field<string>;
    OpenGraphAdmins: Field<string>;
    OpenGraphAppId: Field<string>;

    // Twitter Tags
    TwitterTitle: Field<string>;
    TwitterSite: Field<string>;
    TwitterDescription: Field<string>;
    TwitterImage: ImageField;
    TwitterCardType: TwitterCardFieldType;

    // Tags
    SxaTags: TagType[];
  };
  templateName?: string;
};
