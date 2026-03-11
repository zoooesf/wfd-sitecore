import { createContext, useState, useEffect } from 'react';
import { ComponentProps } from 'lib/component-props';
import { cn, placeholderGenerator } from 'lib/helpers';
import {
  Placeholder,
  useSitecore,
  ComponentRendering,
  RichTextField,
  Field,
} from '@sitecore-content-sdk/nextjs';
import { TabButtons } from '../TabButtons/TabButtons';
import { TAB_LAYOUTS, TabsLayout } from 'lib/helpers/tabs';
import { useTranslation } from 'lib/hooks/useTranslation';

export const TabsContext = createContext<TabsContextType>({ activeTab: '' });

export const TabsContainer: React.FC<TabsContainerProps> = (props: TabsContainerProps) => {
  const { page } = useSitecore();
  const [isVertical, setIsVertical] = useState(false);
  const [tabItems, setTabItems] = useState<TabItemType[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const { t } = useTranslation();
  const phKey = placeholderGenerator(props.params, 'tabscontainer');

  useEffect(() => {
    handleSetVertical();
    window.addEventListener('resize', handleSetVertical);
    return () => window.removeEventListener('resize', handleSetVertical);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!page?.mode.isEditing || !phKey) return;

    const tabItemsToSet =
      props.rendering.placeholders?.[phKey]?.map((tab: ComponentRendering) => {
        return {
          uid: tab.uid || '',
          heading: tab?.fields?.heading as Field<string>,
          body: tab?.fields?.body as RichTextField,
        };
      }) || [];

    setTabItems(tabItemsToSet);

    if (!tabItemsToSet?.[0]?.uid) return;

    setActiveTab(tabItemsToSet[0].uid);
  }, [page?.mode.isEditing, props.rendering.placeholders, phKey]);

  const handleSetVertical = () => {
    if (props.layout === TAB_LAYOUTS.HORIZONTAL || !!page?.mode.isEditing) return;

    if (window?.innerWidth >= 768) {
      setIsVertical(
        props.layout === TAB_LAYOUTS.VERTICAL_LEFT || props.layout === TAB_LAYOUTS.VERTICAL_RIGHT
      );
    } else {
      setIsVertical(false);
    }
  };

  if (!!page?.mode.isEditing) {
    return (
      <div data-component="TabsContainer" className="py-4">
        <div className="mb-4 rounded-lg bg-secondary/50 p-4 text-primary">
          <p className="font-medium">{t('Edit Mode')}</p>
          <p className="text-sm">
            {t(
              'The display you are seeing is not representative of the real finished component. This is to allow editing of all tabs at once. Please add the TabItem components inside the placeholder below.'
            )}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {phKey && <Placeholder name={phKey} rendering={props.rendering} />}
        </div>
      </div>
    );
  }

  return (
    <div
      data-component="TabsContainer"
      className={cn(
        'relative flex py-4',
        (!isVertical || props.layout === TAB_LAYOUTS.HORIZONTAL) && 'flex-col',
        isVertical && props.layout === TAB_LAYOUTS.VERTICAL_LEFT && 'flex-row gap-8',
        isVertical && props.layout === TAB_LAYOUTS.VERTICAL_RIGHT && 'flex-row-reverse gap-8'
      )}
    >
      <TabButtons
        tabItems={tabItems}
        isVertical={isVertical}
        setActiveTab={setActiveTab}
        phKey={phKey}
        activeTab={activeTab}
      />
      <div className={cn('flex-1', isVertical ? 'mt-0' : 'mt-4')}>
        {phKey && (
          <TabsContext.Provider value={{ activeTab }}>
            <Placeholder name={phKey} rendering={props.rendering} />
          </TabsContext.Provider>
        )}
      </div>
    </div>
  );
};

export type TabsContainerProps = ComponentProps & {
  layout: TabsLayout;
};

export type TabItemType = {
  uid: string;
  heading: Field<string>;
  body: RichTextField;
};

type TabsContextType = {
  activeTab: string;
};
