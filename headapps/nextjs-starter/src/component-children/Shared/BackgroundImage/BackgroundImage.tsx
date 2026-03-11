import { NextImage, useSitecore } from '@sitecore-content-sdk/nextjs';
import { pageEditCheck } from 'lib/helpers/page-edit-check';
import { BackgroundImageProps } from 'lib/hooks/useBackgroundImage';
import { useBackgroundImage } from 'lib/hooks/useBackgroundImage';

export const BackgroundImage: React.FC<{ fields: BackgroundImageProps }> = ({ fields }) => {
  const { page } = useSitecore();
  const imageSrc = useBackgroundImage(fields);

  return pageEditCheck(
    page,
    <NextImage
      field={imageSrc}
      priority
      width={1900}
      height={620}
      sizes="(max-width: 768px) 100vw, 1900px"
      className="absolute inset-0 -z-20 h-full w-full bg-center object-cover"
      fetchpriority="high"
      editable={false}
      loading="eager"
    />,
    !!imageSrc?.value?.src
  );
};
