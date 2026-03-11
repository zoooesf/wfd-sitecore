import { mockAccordionDrawer, paramsArgs, stringFieldArgs, linkFieldArgs } from '../mock';

export const generatePlaceholderAccordionDrawers = (count = 3) => {
  return Array.from({ length: count }, () => mockAccordionDrawer());
};

export const accordionFactory = {
  uid: '4e4f1d54-d466-4e48-9d1f-c6652e219dba',
  componentName: 'Accordion',
  dataSource: '/sitecore',
  fields: {
    heading: stringFieldArgs('Frequently Asked Questions'),
    link: linkFieldArgs('/', 'Read more', '_self'),
  },
  placeholders: {
    'accordion-1': [
      mockAccordionDrawer(
        'How long does shipping take?',
        'Standard shipping typically takes 3-5 business days within the continental US. Expedited shipping options are available for faster delivery.'
      ),
      mockAccordionDrawer(
        ' What is your refund policy?',
        'We offer a 30-day money-back guarantee on all unopened products. Opened items may be eligible for store credit or exchange, subject to inspection.'
      ),
      mockAccordionDrawer(
        'How do I change my account password?',
        'To change your password, log into your account, go to "Settings," select "Security," and click on "Change Password." Follow the prompts to enter your current password and set a new one.'
      ),
    ],
  },
  params: paramsArgs('1', 'Default', 'padding:top-md padding:bottom-md'),
};
