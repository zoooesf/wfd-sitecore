import { JSX } from 'react';
import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import VideoBanner from 'component-children/Banners/VideoBanner/VideoBanner';
import { VideoBannerProps } from 'lib/types/components/Banners/video-banner';

const VideoBannerDefault = (props: VideoBannerProps): JSX.Element => {
  return (
    <Frame params={props.params}>
      <VideoBanner {...props} />
    </Frame>
  );
};

export const Default = withDatasourceCheck()<VideoBannerProps>(VideoBannerDefault);
