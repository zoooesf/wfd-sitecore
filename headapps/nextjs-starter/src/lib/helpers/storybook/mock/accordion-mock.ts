import { stringFieldArgs, createMockComponent } from './field-mock';

const AccordionFields = (heading = 'Fast Performance', body = 'body Text') => {
  return {
    heading: stringFieldArgs(heading),
    body: stringFieldArgs(body),
  };
};

export const mockAccordionDrawer = (
  heading = 'Accordion Drawer Header',
  body = 'Accordion Drawer Body'
) => {
  return createMockComponent('AccordionDrawer', AccordionFields(heading, body));
};
