import {
  ComponentRendering,
  Field,
  RichText,
  RichTextField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { cn } from 'lib/helpers';
import { useContext, JSX } from 'react';
import { TabsContext } from '../TabsContainer/TabsContainer';

export const TabItem = (props: TabItemProps): JSX.Element => {
  const { page } = useSitecore();
  const { fields } = props.rendering;
  const isEditing = !!page?.mode.isEditing;
  const { activeTab } = useContext(TabsContext);
  const thisTabIsActive = activeTab === props.rendering.uid;

  const TabItemHeading = () => {
    if (!isEditing) return <></>;
    return (
      <span className="border-b-3 border-secondary font-bold text-content">
        <Text field={fields?.heading} />
      </span>
    );
  };

  const TabItemBody = () => (
    <div className="max-w-none">
      <RichText field={fields?.body} className="richtext" />
    </div>
  );

  return (
    <div
      className={cn(
        'flex flex-col items-start justify-start gap-4',
        isEditing && 'rounded-lg border border-secondary p-4',
        !isEditing && thisTabIsActive && 'block',
        !isEditing && !thisTabIsActive && 'hidden'
      )}
      role="tabpanel"
      id={`tabpanel-${props.rendering.uid}`}
    >
      <TabItemHeading />
      <TabItemBody />
    </div>
  );
};

export type TabItemProps = ComponentProps & {
  rendering: ComponentRendering & {
    fields: {
      heading: Field<string>;
      body: RichTextField;
    };
  };
};
