import { JSX } from 'react';
import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import SplitBanner from 'component-children/Banners/SplitBanner/SplitBanner';
import { SplitBannerProps } from 'lib/types/components/Banners/split-banner';
import ContainedSplitBanner from 'component-children/Banners/SplitBanner/ContainedSplitBanner';

const SplitBannerDefault = (props: SplitBannerProps): JSX.Element => {
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <SplitBanner {...props} />
    </Frame>
  );
};

const SplitBannerContained = (props: SplitBannerProps): JSX.Element => {
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ContainedSplitBanner {...props} />
    </Frame>
  );
};

export const Default = withDatasourceCheck()<SplitBannerProps>(SplitBannerDefault);
export const Contained = withDatasourceCheck()<SplitBannerProps>(SplitBannerContained);
