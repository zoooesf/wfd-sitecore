import { JSX } from 'react';
import { Placeholder, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { BackgroundImage } from 'component-children/Shared/BackgroundImage/BackgroundImage';
import { FullWidthWrapper } from 'component-children/Shared/Containers/FullWidthWrapper';
import { placeholderGenerator } from 'lib/helpers';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import { CardBannerProps } from 'lib/types';
import { useTranslation } from 'lib/hooks/useTranslation';
import { PRIMARY_THEME, TERTIARY_THEME } from 'lib/const';

export const CardBannerDefault = ({ fields, rendering, params }: CardBannerProps): JSX.Element => {
  const { effectiveTheme } = useFrame();
  const isBlackOverlay = effectiveTheme === PRIMARY_THEME || effectiveTheme === TERTIARY_THEME;
  const { t } = useTranslation();

  return (
    <FullWidthWrapper>
      <section
        data-component="CardBannerDefault"
        className={cn('relative bg-surface py-10 text-content', effectiveTheme)}
        role="region"
        aria-label={fields?.heading?.value}
      >
        <BackgroundImage fields={fields} />
        <div
          className={cn('absolute inset-0 -z-0', isBlackOverlay ? 'bg-black/20' : 'bg-white/20')}
        />
        <div className="container relative mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Text field={fields.heading} tag="h2" className="copy-2xl md:copy-4xl mb-2" />
            <RichText field={fields.subheading} className="richtext copy-md md:copy-lg" />
          </div>
          <div
            className="mx-auto flex max-w-lg flex-col justify-center gap-6 lg:max-w-6xl lg:flex-row"
            role="group"
            aria-label={t('Spotlight content')}
          >
            <Placeholder
              name={placeholderGenerator(params, 'cards')}
              rendering={rendering}
              renderEach={(component, idx) => (
                <div key={idx} className="basis-60" role="group" aria-label={t('Card')}>
                  {component}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </FullWidthWrapper>
  );
};

export default CardBannerDefault;
