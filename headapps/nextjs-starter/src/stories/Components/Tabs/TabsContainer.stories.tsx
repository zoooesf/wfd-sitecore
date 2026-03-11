import { Meta, StoryObj } from '@storybook/nextjs';
import {
  Default as TabsContainerDefault,
  VerticalLeft as TabsContainerVerticalLeft,
  VerticalRight as TabsContainerVerticalRight,
} from 'components/Tabs/TabsContainer/TabsContainer';
import { mockTabsContainer } from 'lib/helpers/storybook';
import { TAB_LAYOUTS, TabsLayout } from 'lib/helpers/tabs';

const meta: Meta<typeof TabsContainerDefault> = {
  title: 'Components/Tabs/TabsContainer',
  component: TabsContainerDefault,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    rendering: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabsContainerDefault>;

const DefaultArgs = {
  params: { DynamicPlaceholderId: '1' },
  rendering: mockTabsContainer(),
};

const getCommonStory = (layout: TabsLayout): Story => {
  const componentOptions = {
    [TAB_LAYOUTS.HORIZONTAL]: TabsContainerDefault,
    [TAB_LAYOUTS.VERTICAL_LEFT]: TabsContainerVerticalLeft,
    [TAB_LAYOUTS.VERTICAL_RIGHT]: TabsContainerVerticalRight,
  };
  const TabsContainerComponent = componentOptions[layout];
  return {
    args: {
      ...DefaultArgs,
    },
    render: (args, globals) => {
      const { params } = globals;
      return <TabsContainerComponent {...args} params={params} />;
    },
  } as Story;
};

export const Horizontal: Story = getCommonStory(TAB_LAYOUTS.HORIZONTAL);
export const VerticalLeft: Story = getCommonStory(TAB_LAYOUTS.VERTICAL_LEFT);
export const VerticalRight: Story = getCommonStory(TAB_LAYOUTS.VERTICAL_RIGHT);
