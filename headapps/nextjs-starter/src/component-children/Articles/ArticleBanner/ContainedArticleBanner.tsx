import { JSX } from 'react';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import ArticleBanner from 'component-children/Articles/ArticleBanner/ArticleBanner';
import { ArticleBannerProps } from 'lib/types/components/Articles/article-banner';

const ContainedArticleBanner = (props: ArticleBannerProps): JSX.Element => {
  return (
    <ContainedWrapper>
      <ArticleBanner {...props} variant="Contained" />
    </ContainedWrapper>
  );
};

export default ContainedArticleBanner;
