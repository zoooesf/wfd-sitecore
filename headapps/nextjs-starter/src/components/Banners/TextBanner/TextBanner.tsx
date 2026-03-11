import { JSX } from 'react';
import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import TextBanner from 'component-children/Banners/TextBanner/TextBanner';
import { TextBannerProps } from 'lib/types/components/Banners/text-banner';

const TextBannerDefault = (props: TextBannerProps): JSX.Element => {
  return (
    <Frame params={props.params}>
      <TextBanner {...props} />
    </Frame>
  );
};

export const Default = withDatasourceCheck()<TextBannerProps>(TextBannerDefault);
