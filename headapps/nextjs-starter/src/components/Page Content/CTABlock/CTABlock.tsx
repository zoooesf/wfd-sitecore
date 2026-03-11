import { Field, LinkField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import CTABlock from 'component-children/Page Content/CTABlock/CTABlock';

const CTABlockDefault: React.FC<CTABlockProps> = (props) => {
  return (
    <Frame params={props.params}>
      <CTABlock {...props} />
    </Frame>
  );
};

type CTABlockFields = {
  heading: Field<string>;
  body?: Field<string>;
  link?: LinkField;
};

export type CTABlockProps = ComponentProps & {
  fields: CTABlockFields;
};

export const Default = withDatasourceCheck()<CTABlockProps>(CTABlockDefault);
