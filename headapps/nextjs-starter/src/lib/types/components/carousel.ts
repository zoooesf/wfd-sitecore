export type CarouselSettingsType = {
  arrows: boolean;
  infinite: boolean;
  draggable: boolean;
  variableWidth: boolean;
  speed: number;
  centerMode: boolean;
  centerPadding: string;
  slidesToShow: number;
  slidesToScroll: number;
  beforeChange: (_: number, nextSlide: number) => void;
  dots: boolean;
  dotsClass: string;
};
