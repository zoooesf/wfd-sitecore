import { Field, LinkField, RichTextField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { useFrame } from 'lib/hooks/useFrame';
import { ImageProps } from 'lib/hooks/useImage';
import { RecipeFields } from 'lib/types';
import Card from 'component-children/Cards/Card/Card';

const CardDefault: React.FC<CardProps> = (props) => {
  const { textColor: parentTextColor } = useFrame();
  const { params } = props;

  return (
    <Frame params={params} className="w-full" containerClassName="h-full">
      <Card {...props} textColor={parentTextColor} />
    </Frame>
  );
};

export type CardBadgeProps = {
  badge?: Field<string>;
};

export type CardFields = CardBadgeProps &
  ImageProps &
  RecipeFields & {
    heading: Field<string>;
    body: RichTextField;
    link: LinkField;
  };

export type CardFieldsProps = {
  fields: CardFields;
  textColor?: string;
};

export type CardProps = ComponentProps & CardFieldsProps;

export const Default = withDatasourceCheck()<CardProps>(CardDefault);
