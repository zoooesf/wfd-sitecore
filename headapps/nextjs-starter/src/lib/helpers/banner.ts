import { RenderingProps } from './rendering-props';

/**
 * Determines if banner content should be displayed on the left side
 * @param props - The rendering props containing alignment settings
 * @returns Boolean indicating if content should be on the left
 */
export const isBannerContentLeft = (props: RenderingProps): boolean => {
  return !!props.bannerImgLeft || !!props.videoBannerContentLeft;
};

/**
 * Gets the appropriate content alignment classes for a banner
 * @param props - The rendering props containing alignment settings
 * @param defaultAlignment - Default alignment to use if not specified
 * @returns String of CSS classes for content alignment
 */
export const getBannerContentAlignment = (
  props: RenderingProps,
  defaultAlignment = 'items-start justify-start text-left'
): string => {
  return props.contentAlignment || defaultAlignment;
};
