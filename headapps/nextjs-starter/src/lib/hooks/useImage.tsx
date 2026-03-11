import { ImageField } from '@sitecore-content-sdk/nextjs';
import { useEffect, useState } from 'react';

export const useImage = (fields: ImageProps) => {
  const imageUrl = fields?.image;
  const imageUrlMobile = fields?.imageMobile?.value?.src ? fields?.imageMobile : imageUrl;
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

export type ImageProps = {
  image: ImageField;
  imageMobile: ImageField;
};
