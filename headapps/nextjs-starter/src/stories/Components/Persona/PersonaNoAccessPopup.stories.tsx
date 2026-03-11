import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { PersonaNoAccessPopup } from 'component-children/Persona/PersonaNoAccessPopup';
import { getTheme } from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Persona/PersonaNoAccessPopup',
  component: PersonaNoAccessPopup,
  decorators: [
    (Story) => {
      useEffect(() => {
        if (!document.getElementById('modal-root')) {
          const modalRoot = document.createElement('div');
          modalRoot.id = 'modal-root';
          document.body.appendChild(modalRoot);
        }
      }, []);

      return (
        <div data-component="Frame" className="relative z-0 overflow-hidden">
          <div className="mx-auto max-w-screen-lg">
            <h1 className="mb-md text-3xl font-bold">Persona No Access Popup Component</h1>
            <div className="flex flex-row gap-4">
              <Story />
            </div>
          </div>
        </div>
      );
    },
  ],
} satisfies Meta<typeof PersonaNoAccessPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultArgs = {
  allowedPersonas: [
    { id: '1', name: 'Administrator' },
    { id: '2', name: 'Premium Member' },
    { id: '3', name: 'Content Editor' },
    { id: '4', name: 'Developer' },
    { id: '5', name: 'Marketing Manager' },
    { id: '6', name: 'Sales Representative' },
  ],
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, context) => {
    const theme = getTheme(context);
    return <PersonaNoAccessPopup {...args} theme={theme} />;
  },
};
