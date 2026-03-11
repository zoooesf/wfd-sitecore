import {
  Text,
  Placeholder,
  NextImage,
  RichText,
  useSitecore,
  Field,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { placeholderGenerator } from 'lib/helpers';
import { ImageProps, useImage } from 'lib/hooks/useImage';
import { ComponentProps } from 'lib/component-props';
import { Wrapper } from 'component-children/Shared/Containers/Wrapper';

const CTACardDefault: React.FC<CTACardProps> = (props) => {
  return (
    <Frame params={props.params} className="w-full" containerClassName="h-full">
      <CTACard {...props} />
    </Frame>
  );
};

const CTACard: React.FC<CTACardProps> = ({ fields, params, rendering }) => {
  const imageSrc = useImage(fields);

  return (
    <Wrapper>
      <div data-component="CTACard" className="h-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="aspect-square w-full shrink-0 overflow-hidden md:w-50">
            <NextImage
              field={imageSrc}
              width={640}
              height={360}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-grow flex-col gap-4">
            <CTACardContent fields={fields} />
            <Placeholder
              name={placeholderGenerator(params, 'buttons')}
              rendering={rendering}
              render={(components) => <div className="mt-auto flex w-full gap-4">{components}</div>}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const CTACardContent: React.FC<CTACardFieldsProps> = ({ fields }) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;

  return (
    <>
      <Text
        field={fields.heading}
        tag="h4"
        className={`heading-lg ${isEditing ? '' : 'line-clamp-2'}`}
      />
      <RichText field={fields.body} className={`richtext ${isEditing ? '' : 'line-clamp-4'}`} />
    </>
  );
};

type CTACardFields = ImageProps & {
  heading: Field<string>;
  body: Field<string>;
};

type CTACardFieldsProps = {
  fields: CTACardFields;
};

type CTACardProps = ComponentProps & CTACardFieldsProps;

export const Default = withDatasourceCheck()<CTACardProps>(CTACardDefault);
