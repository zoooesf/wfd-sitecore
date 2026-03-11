import { ImageField, NextImage } from '@sitecore-content-sdk/nextjs';

export const HalfWidthImage: React.FC<HalfWidthImageProps> = ({ image }) => {
  if (!image) return null;

  return (
    <div className="relative h-full min-h-banner w-full lg:min-h-split-banner lg:w-1/2">
      <NextImage
        field={image}
        width={1000}
        height={500}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
};

type HalfWidthImageProps = {
  image?: ImageField;
};
