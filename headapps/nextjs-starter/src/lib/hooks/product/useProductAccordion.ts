import { useState, useEffect, useCallback } from 'react';

export const ACCORDION_IDS = {
  DOCUMENTS: 'documents',
  OVERVIEW: 'overview',
  RESOURCES: 'resources',
  TECH_SPECS: 'techspecs',
  ORDERING_INFO: 'orderinginfo',
};

type AccordionIdValue = (typeof ACCORDION_IDS)[keyof typeof ACCORDION_IDS];

const ACCORDION_EVENT = 'product-accordion-toggle';

export const useProductAccordion = (accordionId: AccordionIdValue, editing?: boolean) => {
  const [isOpen, setIsOpen] = useState(false || editing);

  useEffect(() => {
    if (editing) {
      setIsOpen(true);
      return;
    }

    const handleAccordionToggle = (event: CustomEvent<{ id: AccordionIdValue }>) => {
      if (event.detail.id === accordionId) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener(ACCORDION_EVENT, handleAccordionToggle as EventListener);

    return () => {
      window.removeEventListener(ACCORDION_EVENT, handleAccordionToggle as EventListener);
    };
  }, [accordionId, editing]);

  const toggleAccordion = useCallback(() => {
    const newState = !isOpen;

    if (newState) {
      // Opening this accordion - notify other accordions to close
      const event = new CustomEvent(ACCORDION_EVENT, {
        detail: { id: accordionId },
      });
      window.dispatchEvent(event);
    } else {
      // Closing this accordion
      setIsOpen(false);
    }
  }, [accordionId, isOpen]);

  return { isOpen, toggleAccordion };
};
