import { createContext, useContext } from 'react';
import { ProfileGQL } from 'lib/types/page/profile';

// Create a context for the people profile data
export const PersonContext = createContext<ProfileGQL | null>(null);

// Hook for using the people context
export const usePerson = () => useContext(PersonContext);
