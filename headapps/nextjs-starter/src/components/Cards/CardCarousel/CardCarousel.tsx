import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { CardCarouselProps } from 'component-children/Cards/CardCarousel/CardCarousel';
import Frame from 'component-children/Shared/Frame/Frame';
import CardCarousel from 'component-children/Cards/CardCarousel/CardCarousel';

const CardCarouselDefault: React.FC<CardCarouselProps> = (props) => {
  return (
    <Frame params={props.params}>
      <CardCarousel {...props} />
    </Frame>
  );
};

export const Default = withDatasourceCheck()<CardCarouselProps>(CardCarouselDefault);
