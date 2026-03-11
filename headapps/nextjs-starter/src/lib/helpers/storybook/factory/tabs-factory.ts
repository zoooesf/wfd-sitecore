import { stringFieldArgs, createMockComponent } from '../mock';

const TabItemFields = (heading = 'Tab Heading', body = '<p>Tab content goes here</p>') => {
  return {
    heading: stringFieldArgs(heading),
    body: stringFieldArgs(body),
  };
};

const mockTabItem = (heading = 'Tab Item Header', body = '<p>Tab Item Body content</p>') => {
  return createMockComponent('TabItem', TabItemFields(heading, body));
};

const generatePlaceholderTabItems = (count = 3) => {
  const defaultTabContents = [
    {
      heading: 'Getting Started',
      body: '<p>Welcome to our comprehensive guide. This section covers the fundamental concepts and basic setup procedures you need to know.</p><ul><li>Installation requirements</li><li>Basic configuration</li><li>Your first project</li></ul>',
    },
    {
      heading: 'Advanced Features',
      body: '<p>Explore powerful advanced capabilities that will enhance your workflow and productivity.</p><ul><li>Custom integrations</li><li>Performance optimization</li><li>Advanced configuration options</li></ul>',
    },
    {
      heading: 'Best Practices',
      body: '<p>Learn industry-standard approaches and proven methodologies for optimal results.</p><ul><li>Security considerations</li><li>Scalability planning</li><li>Maintenance procedures</li></ul>',
    },
    {
      heading: 'API Reference',
      body: '<p>Complete documentation for all available APIs and integration endpoints.</p><ul><li>Authentication methods</li><li>Request/response formats</li><li>Error handling</li></ul>',
    },
    {
      heading: 'Troubleshooting',
      body: '<p>Common issues and their solutions to help you resolve problems quickly.</p><ul><li>Debugging techniques</li><li>Common error messages</li><li>Support resources</li></ul>',
    },
  ];

  return Array.from({ length: count }, (_, index) => {
    const tabData = defaultTabContents[index % defaultTabContents.length];
    return mockTabItem(tabData.heading, tabData.body);
  });
};

export const mockTabsContainer = () => ({
  componentName: 'TabsContainer',
  placeholders: {
    'tabscontainer-1': generatePlaceholderTabItems(5),
  },
});
