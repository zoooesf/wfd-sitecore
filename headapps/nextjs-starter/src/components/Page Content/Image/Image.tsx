import { NextImage, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { FullWidthWrapper } from 'component-children/Shared/Containers/FullWidthWrapper';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { ImageProps as ImageFields, useImage } from 'lib/hooks/useImage';

const ImageDefault: React.FC<ImageProps> = (props) => {
  return (
    <Frame params={props.params} className="w-full">
      <ImageRendering {...props} />
    </Frame>
  );
};

const ImageRendering: React.FC<ImageProps> = ({ fields }) => {
  const image = useImage(fields);
  return (
    <FullWidthWrapper innerClassName="flex flex-col gap-4">
      <div data-component="Image" className="aspect-video w-full">
        <NextImage className="h-full w-full object-cover" field={image} />
      </div>
      <div className="mx-auto flex w-full max-w-inner-content flex-col px-8 lg:px-16">
        <p className="heading-sm">{image?.value?.alt as string}</p>
      </div>
    </FullWidthWrapper>
  );
};

type ImageComponentFields = {
  fields: ImageFields;
};
type ImageProps = ComponentProps & ImageComponentFields;

export const Default = withDatasourceCheck()<ImageProps>(ImageDefault);
