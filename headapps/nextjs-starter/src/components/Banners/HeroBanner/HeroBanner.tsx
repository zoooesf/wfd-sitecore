import { JSX } from 'react';
import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { HeroBannerProps } from 'lib/types/components/Banners/hero-banner';
import HeroBanner from 'component-children/Banners/HeroBanner/HeroBanner';

const HeroBannerDefault = (props: HeroBannerProps): JSX.Element => {
  return (
    <Frame params={props.params}>
      <HeroBanner {...props} />
    </Frame>
  );
};

export const Default = withDatasourceCheck()<HeroBannerProps>(HeroBannerDefault);
