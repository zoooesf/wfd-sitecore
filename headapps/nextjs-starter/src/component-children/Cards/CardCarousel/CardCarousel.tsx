import { Field, Placeholder, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { useCallback, useEffect, useRef } from 'react';
import { CarouselWrapper } from 'component-children/Shared/Containers/CarouselWrapper';
import { CarouselProvider, useCarousel } from 'lib/hooks/useCarousel';
import { ArrowButton } from 'component-children/Shared/ArrowButton/ArrowButton';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useFrame } from 'lib/hooks/useFrame';
import { SECONDARY_THEME } from 'lib/const';

export const CardCarousel: React.FC<CardCarouselProps> = (props) => {
  const phKey = `cardcarousel-${props.params.DynamicPlaceholderId}`;
  const { page } = useSitecore();
  const carouselRef = useRef<Slider>(null);
  const { fields } = props;

  if (page?.mode.isEditing) return <EditRendering {...props} />;

  return (
    <Placeholder
      name={phKey}
      rendering={props.rendering}
      render={(components) => (
        <CarouselProvider carouselRef={carouselRef} length={components.length}>
          <CarouselWrapper>
            <CarouselHeader fields={fields} />
            <CarouselContent components={components} carouselRef={carouselRef} />
          </CarouselWrapper>
        </CarouselProvider>
      )}
    />
  );
};

const CarouselHeader: React.FC<{ fields: CardCarouselFields }> = ({ fields }) => {
  const { carouselPrev, carouselNext, currentSlide, length, slidesToShow } = useCarousel();
  const disabledNext = currentSlide === length - slidesToShow;
  const showButtons = length > slidesToShow;
  const { t } = useTranslation();

  return (
    <div
      data-component="CarouselHeader"
      className="flex flex-col items-center justify-between gap-6 px-3 sm:flex-row"
    >
      <Text field={fields?.heading} tag="h3" className="heading-4xl" />
      <div className="flex gap-4">
        {showButtons && (
          <>
            <ArrowButton
              onClick={carouselPrev}
              ariaLabel={t('Previous Card')}
              disabled={currentSlide === 0}
            />
            <ArrowButton
              direction="right"
              onClick={() => carouselNext(disabledNext)}
              ariaLabel={t('Next Card')}
              disabled={disabledNext}
            />
          </>
        )}
      </div>
    </div>
  );
};

const CarouselContent: React.FC<CarouselContentProps> = ({ components, carouselRef }) => {
  const { setCurrentSlide, slidesToShow, setSlidesToShow, currentSlide } = useCarousel();
  const handleBeforeChange = useCallback(
    (_: number, nextSlide: number) => {
      setCurrentSlide(nextSlide);
    },
    [setCurrentSlide]
  );
  const { effectiveTheme } = useFrame();

  const settings: Settings = {
    arrows: false,
    infinite: false,
    draggable: true,
    variableWidth: false,
    speed: 500,
    centerMode: false,
    centerPadding: '0px',
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    beforeChange: handleBeforeChange,
    dots: true,
    dotsClass: `slick-dots ${
      effectiveTheme !== SECONDARY_THEME ? 'slick-dots-secondary' : 'slick-dots-primary'
    }`,
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSlidesToShow]);

  // Handle accessibility for hidden slides
  useEffect(() => {
    const handleTabFocus = () => {
      const slides = document.querySelectorAll('.card-carousel .slick-slide');
      slides.forEach((slide, index) => {
        const isVisible = index >= currentSlide && index < currentSlide + slidesToShow;
        const focusableElements = slide.querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach((element) => {
          if (!isVisible) {
            // Set tabindex to -1 for hidden slides to prevent focus
            element.setAttribute('tabindex', '-1');
            element.setAttribute('aria-hidden', 'true');
          } else {
            // Reset tabindex for visible slides
            element.removeAttribute('tabindex');
            element.removeAttribute('aria-hidden');
          }
        });
      });
    };

    handleTabFocus();
    // Add MutationObserver to handle dynamic content changes
    const observer = new MutationObserver(handleTabFocus);
    const carousel = document.querySelector('.card-carousel');
    if (carousel) {
      observer.observe(carousel, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [currentSlide, slidesToShow]);

  return (
    <Slider
      data-component="CarouselContent"
      className="card-carousel"
      {...settings}
      ref={carouselRef}
      aria-roledescription="carousel"
    >
      {components}
    </Slider>
  );
};

const EditRendering: React.FC<CardCarouselProps> = ({ fields, params, rendering }) => {
  const phKey = `cardcarousel-${params.DynamicPlaceholderId}`;

  return (
    <ContainedWrapper>
      <div className="flex flex-row items-center justify-between gap-6 pb-6">
        <Text field={fields?.heading} tag="h3" className="heading-2xl" />
      </div>
      <Placeholder
        name={phKey}
        rendering={rendering}
        render={(components) => (
          <div className="card-carousel edit-mode flex w-full flex-row flex-wrap gap-4">
            {components}
          </div>
        )}
      />
    </ContainedWrapper>
  );
};

type CarouselContentProps = {
  components: React.ReactNode[];
  carouselRef: React.RefObject<Slider | null>;
};

type CardCarouselFields = {
  heading: Field<string>;
};

export type CardCarouselProps = ComponentProps & {
  fields: CardCarouselFields;
};

export default CardCarousel;
