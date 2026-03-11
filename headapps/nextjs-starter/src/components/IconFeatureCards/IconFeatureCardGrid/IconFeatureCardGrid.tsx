import {
  Field,
  Placeholder,
  RichText,
  RichTextField,
  Text,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { placeholderGenerator } from 'lib/helpers';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';

const IconFeatureCardGridDefault: React.FC<IconFeatureCardGridProps> = (props) => {
  return (
    <Frame params={props.params}>
      <IconFeatureCardGridRendering {...props} />
    </Frame>
  );
};

const IconFeatureCardGridRendering: React.FC<IconFeatureCardGridProps> = ({
  fields,
  params,
  rendering,
}) => {
  return (
    <ContainedWrapper>
      <div data-component="IconFeatureCardGrid" className="flex w-full flex-col">
        <Text field={fields?.heading} tag="h2" className="heading-4xl mb-6 leading-none" />
        <RichText field={fields?.subheading} className="richtext copy-lg leading-none" />
        <Placeholder
          name={placeholderGenerator(params, 'iconfeaturecardgrid')}
          rendering={rendering}
          render={(components) => (
            <div className="mt-12 grid w-full grid-cols-1 gap-x-8 gap-y-8 pb-12 first:mt-0 md:grid-cols-2 lg:grid-cols-4">
              {components}
            </div>
          )}
        />
      </div>
    </ContainedWrapper>
  );
};

type IconFeatureCardGridFields = {
  heading: Field<string>;
  subheading: RichTextField;
};

type IconFeatureCardGridProps = ComponentProps & {
  fields: IconFeatureCardGridFields;
};

export const Default = withDatasourceCheck()<IconFeatureCardGridProps>(IconFeatureCardGridDefault);
