import { useContext } from 'react';
import { PersonaContextType } from 'lib/types/persona';

let PersonaContext: React.Context<PersonaContextType | undefined>;
export const setPersonaContext = (context: React.Context<PersonaContextType | undefined>) => {
  PersonaContext = context;
};

/**
 * Custom hook for using the persona context
 * Throws error if used outside of PersonaProvider
 */
export function usePersona(): PersonaContextType {
  if (!PersonaContext) {
    throw new Error(
      'PersonaContext not initialized. Make sure to call setPersonaContext from persona-context.tsx'
    );
  }

  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
