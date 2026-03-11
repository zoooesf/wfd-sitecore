import { JSX } from 'react';
import Frame from 'component-children/Shared/Frame/Frame';
import { TabItem, TabItemProps } from 'component-children/Tabs/TabItem/TabItem';
import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';

const TabItemDefault = (props: TabItemProps): JSX.Element => {
  return (
    <Frame params={props.params}>
      <TabItem {...props} />
    </Frame>
  );
};
export const Default = withDatasourceCheck()<TabItemProps>(TabItemDefault);
