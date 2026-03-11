import { JSX } from 'react';
import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import ContentBanner from 'component-children/Banners/ContentBanner/ContentBanner';
import { ContentBannerProps } from 'lib/types/components/Banners/content-banner';

const ContentBannerDefault = (props: ContentBannerProps): JSX.Element => {
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ContentBanner {...props} />
    </Frame>
  );
};

export const Default = withDatasourceCheck()<ContentBannerProps>(ContentBannerDefault);
