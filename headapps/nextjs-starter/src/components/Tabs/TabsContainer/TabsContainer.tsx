import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import Frame from 'component-children/Shared/Frame/Frame';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import {
  TabsContainer,
  TabsContainerProps,
} from 'component-children/Tabs/TabsContainer/TabsContainer';
import { TAB_LAYOUTS } from 'lib/helpers/tabs';

const TabsContainerComponent = (props: TabsContainerProps): JSX.Element => {
  return (
    <Frame params={props.params}>
      <ContainedWrapper>
        <TabsContainer {...props} />
      </ContainedWrapper>
    </Frame>
  );
};

export const Default = (props: ComponentProps): JSX.Element => (
  <TabsContainerComponent {...props} layout={TAB_LAYOUTS.HORIZONTAL} />
);
export const VerticalLeft = (props: ComponentProps): JSX.Element => (
  <TabsContainerComponent {...props} layout={TAB_LAYOUTS.VERTICAL_LEFT} />
);
export const VerticalRight = (props: ComponentProps): JSX.Element => (
  <TabsContainerComponent {...props} layout={TAB_LAYOUTS.VERTICAL_RIGHT} />
);
