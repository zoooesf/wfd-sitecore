import { Field, ImageField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { ContentBlockImageLeft } from 'component-children/Page Content/ContentBlock/ContentBlockImageLeft';
import ContentBlock from 'component-children/Page Content/ContentBlock/ContentBlock';

const ContentBlockDefault: React.FC<ContentBlockProps> = (props) => {
  return (
    <Frame className="h-full" containerClassName="h-full" params={props.params}>
      <ContentBlock {...props} />
    </Frame>
  );
};

const ContentBlockImageLeftRendering: React.FC<ContentBlockProps> = (props) => {
  return (
    <Frame className="h-full" containerClassName="h-full" params={props.params}>
      <ContentBlockImageLeft {...props} />
    </Frame>
  );
};

type ContentBlockFields = {
  image?: ImageField;
  mobileImage?: ImageField;
  heading: Field<string>;
  body?: Field<string>;
};

export type ContentBlockProps = ComponentProps & {
  fields: ContentBlockFields;
};

export const Default = withDatasourceCheck()<ContentBlockProps>(ContentBlockDefault);
export const ImageLeft = withDatasourceCheck()<ContentBlockProps>(ContentBlockImageLeftRendering);
