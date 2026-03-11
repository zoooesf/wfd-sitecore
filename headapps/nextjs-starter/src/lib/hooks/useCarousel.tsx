import React, { createContext, useContext, useState } from 'react';
import Slider from 'react-slick';

type CarouselContextType = {
  disableNext: boolean;
  setDisableNext: (value: boolean) => void;
  currentSlide: number;
  setCurrentSlide: (value: number) => void;
  carouselNext: (isDisabled: boolean) => void;
  carouselPrev: () => void;
  slidesToShow: number;
  setSlidesToShow: (value: number) => void;
  length: number;
};

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

export const CarouselProvider: React.FC<UseCarouselProps> = ({
  children,
  carouselRef,
  initialSlidesToShow = 3,
  length,
}) => {
  const [disableNext, setDisableNext] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slidesToShow, setSlidesToShow] = useState(initialSlidesToShow);

  const carouselNext = (isDisabled: boolean) => {
    if (!isDisabled) {
      carouselRef.current?.slickNext();
    }
  };

  const carouselPrev = () => {
    carouselRef.current?.slickPrev();
  };

  const value = {
    carouselNext,
    carouselPrev,
    disableNext,
    currentSlide,
    setDisableNext,
    setCurrentSlide,
    slidesToShow,
    setSlidesToShow,
    length,
  };

  return <CarouselContext.Provider value={value}>{children}</CarouselContext.Provider>;
};

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within an CarouselProvider');
  }

  return context;
};

type UseCarouselProps = {
  children: React.ReactNode;
  carouselRef: React.RefObject<Slider | null>;
  initialSlidesToShow?: number;
  length: number;
};
