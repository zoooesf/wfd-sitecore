import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';

import { RichText } from '@sitecore-content-sdk/nextjs';
import { HalfWidthImage } from 'component-children/Shared/Image/Image';
import { cn } from 'lib/helpers/classname';
import { placeholderGenerator } from 'lib/helpers/sitecore';
import { SplitBannerProps } from 'lib/types/components/Banners/split-banner';
import { useFrame } from 'lib/hooks/useFrame';
import { useImage } from 'lib/hooks/useImage';
import { useMemo, JSX } from 'react';
import { useTranslation } from 'lib/hooks/useTranslation';

const SplitBanner = ({ fields, variant, params, rendering }: SplitBannerProps): JSX.Element => {
  const { t } = useTranslation();
  const imageSrc = useImage(fields);
  const { contentAlignment, bannerImgLeft, effectiveTheme } = useFrame();
  const componentContentAlignment = !!contentAlignment ? contentAlignment : 'items-start text-left';
  const containerClasses = useMemo(
    () =>
      cn(
        'flex min-h-banner w-full items-center justify-center bg-surface text-content',
        'lg:max-h-155 lg:min-h-125',
        bannerImgLeft ? 'flex-col-reverse lg:flex-row-reverse' : 'flex-col-reverse lg:flex-row',
        effectiveTheme
      ),
    [bannerImgLeft, effectiveTheme]
  );

  const contentWrapperClass = useMemo(
    () =>
      cn(
        'flex flex-col justify-center gap-4',
        !bannerImgLeft && 'lg:pl-16',
        !fields?.image ? 'w-4/5' : 'w-full lg:w-1/2',
        componentContentAlignment
      ),
    [bannerImgLeft, fields?.image, componentContentAlignment]
  );

  const contentClasses = useMemo(
    () =>
      cn(
        'px-6 py-8 2xl:max-w-half-outer-content',
        bannerImgLeft ? 'lg:mr-auto lg:px-16' : 'lg:ml-auto lg:pl-0'
      ),
    [bannerImgLeft]
  );

  const buttonClasses = useMemo(
    () => cn('mt-auto flex w-full gap-4', componentContentAlignment),
    [componentContentAlignment]
  );

  return (
    <div
      data-component="SplitBanner"
      data-variant={variant ?? 'Default'}
      role="region"
      aria-label={fields?.heading?.value}
      className={containerClasses}
    >
      <div className={contentWrapperClass}>
        <div className={contentClasses}>
          <Text className="lg:heading-5xl heading-4xl" field={fields?.heading} tag="h2" />
          <RichText className="copy-2xl" field={fields?.subheading} />
          <RichText className="copy-lg" field={fields?.body} />
          <Placeholder
            name={placeholderGenerator(params, 'buttons')}
            rendering={rendering}
            render={(components) => (
              <div className={buttonClasses} role="group" aria-label={t('Split banner actions')}>
                {components}
              </div>
            )}
          />
        </div>
      </div>
      <HalfWidthImage image={imageSrc} />
    </div>
  );
};

export default SplitBanner;
