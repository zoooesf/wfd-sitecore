import { Field, LinkField, RichTextField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { IconFieldType } from 'lib/types';
import IconFeatureCard from 'component-children/IconFeatureCards/IconFeatureCard/IconFeatureCard';

const IconFeatureCardDefault: React.FC<IconFeatureCardProps> = (props) => {
  return (
    <Frame params={props.params} className="w-full" containerClassName="h-full">
      <IconFeatureCard {...props} />
    </Frame>
  );
};

type IconFeatureCardFields = {
  heading: Field<string>;
  subheading: RichTextField;
  imageIcon: IconFieldType;
  link: LinkField;
};

export type IconFeatureCardFieldsProps = {
  fields: IconFeatureCardFields;
};

export type IconFeatureCardProps = ComponentProps &
  IconFeatureCardFieldsProps & {
    parent?: boolean;
  };

export const Default = withDatasourceCheck()<IconFeatureCardProps>(IconFeatureCardDefault);
