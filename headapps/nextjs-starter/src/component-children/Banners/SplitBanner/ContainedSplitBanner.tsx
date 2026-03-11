import { JSX } from 'react';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import SplitBanner from 'component-children/Banners/SplitBanner/SplitBanner';
import { SplitBannerProps } from 'lib/types/components/Banners/split-banner';

const ContainedSplitBanner = (props: SplitBannerProps): JSX.Element => {
  return (
    <ContainedWrapper>
      <SplitBanner {...props} variant="Contained" />
    </ContainedWrapper>
  );
};

export default ContainedSplitBanner;
