import { JSX, useRef, useEffect } from 'react';
import { Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { useFrame } from 'lib/hooks/useFrame';
import { FullWidthWrapper } from 'component-children/Shared/Containers/FullWidthWrapper';
import { cn } from 'lib/helpers/classname';
import { placeholderGenerator } from 'lib/helpers/sitecore';
import { VideoBannerProps } from 'lib/types/components/Banners/video-banner';
import { useTranslation } from 'lib/hooks/useTranslation';

const VideoBanner = ({ fields, params, rendering }: VideoBannerProps): JSX.Element => {
  const { t } = useTranslation();
  const { textColor, contentAlignment } = useFrame();
  const videoRef = useRef<HTMLVideoElement>(null);
  const componentContentAlignment = contentAlignment || 'items-center justify-center text-center';
  const containerClasses = cn(
    'relative flex min-h-hero w-full',
    'md:min-h-hero-lg',
    componentContentAlignment
  );

  // Lazy load video and handle errors
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleError = () => {
      console.error('Error loading video');
    };

    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('error', handleError);
    };
  }, []);

  const videoSrc = fields?.backgroundVideo?.value?.src;
  const headingText = fields?.heading?.value;

  return (
    <FullWidthWrapper>
      <section
        data-component="VideoBanner"
        className={containerClasses}
        role="region"
        aria-label={headingText || t('Video banner')}
      >
        {videoSrc && (
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              aria-hidden="true"
            >
              <source src={videoSrc} type="video/mp4" />
              <p className="sr-only">{t('Your browser does not support the video tag.')}</p>
            </video>

            <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          </div>
        )}
        <div className="relative z-10 flex w-full flex-col items-center justify-center gap-8 px-8 py-20 lg:px-16">
          <Text
            field={fields?.heading}
            tag="h1"
            className={cn('md:heading-5xl heading-4xl text-center', textColor)}
          />
          <Placeholder
            name={placeholderGenerator(params, 'buttons')}
            rendering={rendering}
            render={(components) => (
              <div className="mt-auto flex w-full justify-center gap-4">{components}</div>
            )}
            editable={false}
          />
        </div>
      </section>
    </FullWidthWrapper>
  );
};

export default VideoBanner;
