import React from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import { useAccordion } from 'lib/hooks/useAccordion';
import ButtonIcon from 'component-children/Shared/Button/ButtonIcon';
import { AccordionMotion } from 'component-children/Shared/Animation/AccordionMotion';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { AccordionDrawerProps } from 'components/Accordions/AccordionDrawer/AccordionDrawer';
import { placeholderGenerator } from 'lib/helpers';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useFrame, FrameProvider } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers/classname';

const AccordionDrawer: React.FC<AccordionDrawerProps> = (props) => {
  const { fields, params } = props;
  const accordionId = `drawer-${params.id}-${params.renderingId}-${params.DynamicPlaceholderId}`;
  const { isOpen } = useAccordion();
  const { page } = useSitecore();
  const { effectiveTheme } = useFrame();
  const isEditing = page?.mode.isEditing;
  const isAccordionOpen = isEditing || isOpen(accordionId);

  return (
    <FrameProvider params={{ Styles: `theme:${effectiveTheme}` }}>
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-md border border-content/50 bg-surface text-content focus-within:ring-2 focus-within:ring-[rgb(var(--focus-ring))] focus-within:ring-offset-2',
          effectiveTheme
        )}
        data-component="AccordionDrawer"
        data-accordion-id={accordionId}
      >
        <AccordionDrawerButton {...props} id={accordionId} />
        <AccordionMotion isOpen={isAccordionOpen}>
          <div className="flex flex-col gap-4 bg-surface p-4 pr-12">
            <RichText className="richtext" field={fields?.body} />

            <Placeholder
              name={placeholderGenerator(params, 'buttons')}
              rendering={props.rendering}
              render={(components) => (
                <div className="flex flex-wrap items-center gap-8">{components}</div>
              )}
            />
          </div>
        </AccordionMotion>
      </div>
    </FrameProvider>
  );
};

const AccordionDrawerButton: React.FC<AccordionDrawerProps> = ({ fields, params, id }) => {
  const { toggleAccordion, isOpen } = useAccordion();
  const { page } = useSitecore();
  const { t } = useTranslation();

  if (!id) return null;

  const isEditing = page?.mode.isEditing;
  const isAccordionOpen = isEditing || isOpen(id);

  const handleInteraction = () => {
    toggleAccordion(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleInteraction();
    }
  };

  return (
    <button
      data-component="AccordionDrawerButton"
      className="flex w-full cursor-pointer items-center justify-between gap-6 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--focus-ring))] focus-visible:ring-offset-2"
      onClick={handleInteraction}
      onKeyDown={handleKeyDown}
      aria-expanded={isAccordionOpen}
      aria-controls={`accordion-content-${params.id}`}
    >
      <Text field={fields?.heading} tag="h3" className="heading-base text-start text-content" />
      <ButtonIcon
        icon={isAccordionOpen ? 'chevron-up' : 'chevron-down'}
        label={isAccordionOpen ? t('Close') : t('Open')}
        iconPrefix="fas"
        className="reverse"
        withBackground={false}
      />
    </button>
  );
};

export default AccordionDrawer;
