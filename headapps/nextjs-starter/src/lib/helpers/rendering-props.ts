import { isTrueSet } from './boolean';
import { mapping } from './rendering-props-mapping';
import { ThemeType } from 'lib/types';
import { PRIMARY_THEME } from 'lib/const';

export type RenderingProps = {
  theme?: ThemeType;
  textColor?: string;
  padding?: string;
  paddingDesktop?: string;
  contentAlignment?: string;
  transparent?: boolean;
  maxWidth?: string;
  gap?: string;
  // Content Banner
  bannerContentAlignment?: string;
  // Split Banner & Article Banner
  bannerImgLeft?: boolean;
  // Video Content Banner
  videoBannerContentLeft?: boolean;
  // Button
  outline?: boolean;
  // Card Grid
  cardGrid?: string;
};

// Function to parse input
const parseRenderingProps = (input: string | undefined, componentName?: string): RenderingProps => {
  const result: RenderingProps = {
    padding: '',
    paddingDesktop: '',
    contentAlignment: '',
    bannerContentAlignment: mapping.bannerContentAlignment.default,
    transparent: false,
    maxWidth: '',
    gap: mapping.gap.none,
  };

  if (!input) {
    return result;
  }

  const properties = input.split(' ');
  properties.forEach((prop) => {
    const [key, value] = prop.split(':');

    // Handle theme with fallback for invalid values
    if (key === 'theme') {
      const mappedTheme = mapping[key]?.[value];
      if (!mappedTheme) {
        console.warn(
          `[Sitecore] Invalid theme value "${value}" provided. Falling back to "${PRIMARY_THEME}".`
        );
      }
      result[key] = (mappedTheme || PRIMARY_THEME) as ThemeType;
      return;
    }

    if (mapping[key] && mapping[key][value]) {
      if (key === 'textColor' || key === 'padding' || key === 'paddingDesktop') {
        result[key] = [result[key], mapping[key][value]].join(' ').trim();
        return;
      }

      if (key === 'transparent') {
        result[key] = isTrueSet(value);
        return;
      }

      if (key === 'gap') {
        result[key] = mapping[key][value];
        return;
      }

      // Split Banner
      if (componentName === 'SplitBanner' || componentName === 'ArticleBanner') {
        if (key === 'bannerImgLeft') {
          result[key] = isTrueSet(value);
          return;
        }
      }

      // Content Banner
      if (componentName === 'ContentBanner') {
        if (key === 'bannerContentAlignment') {
          result[key] = mapping[key][value];
          return;
        }
      }
      //  Video Content Banner
      if (componentName === 'VideoContentBanner') {
        if (key === 'videoBannerContentLeft') {
          result[key] = isTrueSet(value);
          return;
        }
      }

      // Full Width
      if (componentName === 'FullWidth') {
        if (key === 'maxWidth') {
          result[key] = mapping[key][value];
          return;
        }
      }

      // Button
      if (componentName === 'Button') {
        if (key === 'outline') {
          result.outline = isTrueSet(value);
          return;
        }

        if (key === 'contentAlignment') {
          result[key] = [result['contentAlignment'], mapping['buttonContentAlignment'][value]]
            .join(' ')
            .trim();
          return;
        }
      } else {
        if (key === 'contentAlignment') {
          result[key] = [result[key], mapping[key][value]].join(' ').trim();
          return;
        }
      }

      // Card Grid
      if (componentName === 'CardGrid') {
        if (key === 'cardGrid') {
          result[key] = mapping[key][value];
          return;
        }
      }
    }
  });

  return result;
};

export { parseRenderingProps };
