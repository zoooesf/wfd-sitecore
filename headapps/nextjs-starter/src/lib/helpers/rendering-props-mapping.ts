import { PRIMARY_THEME, SECONDARY_THEME, TERTIARY_THEME } from '../const';

type SimplePropsMappingType = { [subKey: string]: string };

export type RenderingPropsMapping = {
  [key: string]: { [subKey: string]: string };
  theme: SimplePropsMappingType;
  padding: SimplePropsMappingType;
  paddingDesktop: SimplePropsMappingType;
  contentAlignment: SimplePropsMappingType;
  bannerContentAlignment: SimplePropsMappingType;
  transparent: SimplePropsMappingType;
  maxWidth: SimplePropsMappingType;
  cardGrid: SimplePropsMappingType;
  gap: SimplePropsMappingType;
  outline: SimplePropsMappingType;
  buttonContentAlignment: SimplePropsMappingType;
};

const booleanMapping = {
  true: 'true',
};

export const mapping: RenderingPropsMapping = {
  theme: {
    primary: PRIMARY_THEME,
    secondary: SECONDARY_THEME,
    tertiary: TERTIARY_THEME,
  },
  textColor: {
    black: 'text-black',
    white: 'text-white',
  },
  // Video Content Banner Rendering Props
  outline: booleanMapping,
  padding: {
    //Top Padding
    'top-none': 'pt-0',
    'top-xs': 'pt-xs',
    'top-sm': 'pt-sm',
    'top-md': 'pt-md',
    'top-lg': 'pt-lg',
    'top-xl': 'pt-xl',
    //Bottom Padding
    'bottom-none': 'pb-0',
    'bottom-xs': 'pb-xs',
    'bottom-sm': 'pb-sm',
    'bottom-md': 'pb-md',
    'bottom-lg': 'pb-lg',
    'bottom-xl': 'pb-xl',
  },
  paddingDesktop: {
    //Top Padding
    'top-none': 'lg:pt-0',
    'top-xs': 'lg:pt-xs',
    'top-sm': 'lg:pt-sm',
    'top-md': 'lg:pt-md',
    'top-lg': 'lg:pt-lg',
    'top-xl': 'lg:pt-xl',
    //Bottom Padding
    'bottom-none': 'lg:pb-0',
    'bottom-xs': 'lg:pb-xs',
    'bottom-sm': 'lg:pb-sm',
    'bottom-md': 'lg:pb-md',
    'bottom-lg': 'lg:pb-lg',
    'bottom-xl': 'lg:pb-xl',
  },
  // Rest
  transparent: booleanMapping,
  gap: {
    none: 'none',
    md: 'md',
    lg: 'lg',
  },
  maxWidth: {
    tablet: 'max-w-screen-sm',
    desktop: 'max-w-inner-content',
    'desktop-lg': 'max-w-outer-content',
  },
  // Card Grid
  cardGrid: {
    'two-card': 'md:grid-cols-2',
    'three-card': 'md:grid-cols-3',
  },
  // Content Banner Rendering Props
  bannerContentAlignment: {
    default: 'md:ml-auto',
    left: 'md:mr-auto',
  },
  contentAlignment: {
    left: 'items-start justify-start text-left',
    center: 'items-center justify-center text-center',
    right: 'items-end justify-end text-right',
  },
  buttonContentAlignment: {
    left: 'ml-auto',
    center: 'mx-auto',
    right: 'mr-auto',
  },
  // Split Banner Rendering Props
  bannerImgLeft: booleanMapping,
  // Video Content Banner Rendering Props
  videoBannerContentLeft: booleanMapping,
};
