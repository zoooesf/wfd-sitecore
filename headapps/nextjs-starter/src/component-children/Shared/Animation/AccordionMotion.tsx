import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AccordionMotionProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

export const AccordionMotion: React.FC<AccordionMotionProps> = ({ children, isOpen }) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.section
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          {children}
        </motion.section>
      )}
    </AnimatePresence>
  );
};
