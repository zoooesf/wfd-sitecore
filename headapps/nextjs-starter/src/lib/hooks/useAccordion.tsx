import React, { createContext, useContext, useState } from 'react';

type AccordionContextType = {
  openId: string | null;
  toggleAccordion: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export const AccordionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  const value = {
    openId,
    toggleAccordion,
  };

  return <AccordionContext.Provider value={value}>{children}</AccordionContext.Provider>;
};

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    // Provide fallback functions when context is not available
    return {
      noContext: true,
      toggleAccordion: () => console.warn('AccordionProvider not found'),
      isOpen: () => false,
    };
  }

  return {
    toggleAccordion: context.toggleAccordion,
    isOpen: (id: string) => context.openId === id,
  };
};
