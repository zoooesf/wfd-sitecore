import { ImageField } from '@sitecore-content-sdk/nextjs';
import { useEffect, useState } from 'react';

export const useBackgroundImage = (fields: BackgroundImageProps) => {
  const imageUrl = fields?.backgroundImage;
  const imageUrlMobile = fields?.backgroundImageMobile?.value?.src
    ? fields?.backgroundImageMobile
    : imageUrl;
  const [imageSrc, setImageSrc] = useState<ImageField>();

  const debounce = (fn: () => void, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: unknown) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.call(this), ms);
    };
  };

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => {
        setImageSrc(window.innerWidth < 1024 ? imageUrlMobile || imageUrl : imageUrl);
      });
    };

    const debouncedResize = debounce(handleResize, 300);
    handleResize();
    window.addEventListener('resize', debouncedResize);

    return () => window.removeEventListener('resize', debouncedResize);
  }, [imageUrl, imageUrlMobile]);

  return imageSrc;
};

export type BackgroundImageProps = {
  backgroundImage: ImageField;
  backgroundImageMobile: ImageField;
};
