import type { Meta, StoryObj } from '@storybook/nextjs';
import { PersonaSwitcher } from 'component-children/Navigation/PersonaSwitcher/PersonaSwitcher';
import { PersonaProvider, PersonaServiceType } from 'lib/contexts/persona-context';
import { Persona } from 'lib/types/persona';
import { useEffect, PropsWithChildren } from 'react';
import { usePersona } from 'lib/hooks/persona';
import { FrameProvider } from 'lib/hooks/useFrame';
import { getTheme } from 'lib/helpers/storybook';

/**
 * Creates mock persona data for Storybook stories
 */
const createMockPersona = (id: string, name: string, description?: string): Persona => {
  return {
    id,
    name,
    ...(description && { description: { value: description } }),
  };
};

/**
 * Mock continents in alphabetical order (English)
 */
const mockContinentPersonas: Persona[] = [
  createMockPersona(
    '{123E4567-E89B-12D3-A456-426614174001}',
    'Africa',
    'African countries and regions'
  ),
  createMockPersona(
    '{123E4567-E89B-12D3-A456-426614174002}',
    'Antarctica',
    'Antarctic region and research stations'
  ),
  createMockPersona(
    '{123E4567-E89B-12D3-A456-426614174003}',
    'Asia',
    'Asian countries and regions'
  ),
  createMockPersona(
    '{123E4567-E89B-12D3-A456-426614174006}',
    'Australia',
    'Australia, New Zealand, and Pacific Islands'
  ),
  createMockPersona(
    '{123E4567-E89B-12D3-A456-426614174004}',
    'Europe',
    'European countries and regions'
  ),
  createMockPersona(
    '{123E4567-E89B-12D3-A456-426614174005}',
    'North America',
    'United States, Canada, and Mexico'
  ),
  createMockPersona(
    '{123E4567-E89B-12D3-A456-426614174007}',
    'South America',
    'South American countries and regions'
  ),
];

const meta: Meta<typeof PersonaSwitcher> = {
  title: 'Components/Navigation/Persona Switcher',
  component: PersonaSwitcher,
  decorators: [
    (Story, context) => {
      const theme = getTheme(context);
      const params = { Styles: `theme:${theme}` };

      return (
        <div className="w-full p-8">
          <FrameProvider params={params}>
            <div className={`${theme} flex w-full items-center justify-end bg-surface p-4`}>
              <PersonaProvider personaService={mockPersonaService}>
                <Story />
                <div id="modal-root" className="font-ppmori" />
              </PersonaProvider>
            </div>
          </FrameProvider>
        </div>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Mock persona service for Storybook
const mockPersonaService: PersonaServiceType = {
  fetchPersonas: async () => mockContinentPersonas,
  isLoading: false,
  error: null,
};

// Helper component to set initial persona
const PersonaInitializer = ({
  children,
  initialPersona,
  clearPersona = false,
}: PropsWithChildren & {
  initialPersona?: Persona;
  clearPersona?: boolean;
}) => {
  const { setPersona, resetPersona } = usePersona();

  useEffect(() => {
    if (clearPersona) {
      resetPersona();
    } else if (initialPersona) {
      setPersona(initialPersona);
    }
  }, [initialPersona, clearPersona, setPersona, resetPersona]);

  return <>{children}</>;
};

// Story: No Persona Selected
export const NoPersonaSelected: Story = {
  decorators: [
    (Story) => {
      return (
        <PersonaInitializer clearPersona={true}>
          <Story />
        </PersonaInitializer>
      );
    },
  ],
};

// Story: With Persona Selected
export const WithPersonaSelected: Story = {
  decorators: [
    (Story) => {
      return (
        <PersonaInitializer initialPersona={mockContinentPersonas[0]}>
          <Story />
        </PersonaInitializer>
      );
    },
  ],
};
