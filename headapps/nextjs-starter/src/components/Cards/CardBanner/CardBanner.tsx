import { JSX } from 'react';
import Frame from 'component-children/Shared/Frame/Frame';
import { CardBannerProps } from 'lib/types';
import CardBanner from 'component-children/Cards/CardBanner/CardBanner';
import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';

const CardBannerDefault = (props: CardBannerProps): JSX.Element => {
  return (
    <Frame params={props.params}>
      <CardBanner {...props} />
    </Frame>
  );
};

export const Default = withDatasourceCheck()<CardBannerProps>(CardBannerDefault);
