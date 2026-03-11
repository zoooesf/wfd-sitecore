import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  PropsWithChildren,
} from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { useRouter } from 'next/router';
import { Persona, PersonaCookie, PersonaContextType, AccessIssueDetails } from 'lib/types/persona';
import { PERSONA_COOKIE_NAME, PERSONA_COOKIE_EXPIRY } from 'lib/const/persona';
import { getJsonCookie, setJsonCookie, deleteCookie } from 'lib/helpers/handle-cookie';
import { useTranslation } from 'lib/hooks/useTranslation';
import { setPersonaContext } from 'lib/hooks/persona';

// Create the context
const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

// Initialize the context for the hooks
setPersonaContext(PersonaContext);

// Type for persona service (matches the return type of usePersonaService)
export type PersonaServiceType = {
  fetchPersonas: () => Promise<Persona[]>;
  isLoading: boolean;
  error: string | null;
};

// Create a context for persona service dependency injection
const PersonaServiceContext = createContext<PersonaServiceType | null>(null);

/**
 * Hook to get persona service.
 * This should be used instead of directly importing usePersonaService.
 */
export function usePersonaServiceContext(): PersonaServiceType | null {
  return useContext(PersonaServiceContext);
}

/**
 * PersonaProvider component that manages persona state and cookie handling
 * Provides persona context throughout the application
 */
export function PersonaProvider({
  children,
  personaService,
}: PropsWithChildren<{
  personaService?: PersonaServiceType;
}>) {
  const [persona, setPersonaState] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [hasAccessIssue, setHasAccessIssue] = useState(false);
  const [accessIssueType, setAccessIssueType] = useState<'error' | 'noAccess' | null>(null);
  const [accessIssueDetails, setAccessIssueDetails] = useState<AccessIssueDetails | undefined>(
    undefined
  );
  const { page } = useSitecore();
  const router = useRouter();
  const { t } = useTranslation();

  // Check if we should skip persona logic
  const shouldSkipPersonaLogic = useCallback(() => {
    return page?.mode.isEditing || router.isPreview;
  }, [page?.mode.isEditing, router.isPreview]);

  /**
   * Initialize persona from cookie on mount
   */
  useEffect(() => {
    if (shouldSkipPersonaLogic()) {
      setIsLoading(false);
      return;
    }

    try {
      // Try to load persona from cookie
      const savedPersona = getJsonCookie<PersonaCookie>(PERSONA_COOKIE_NAME);

      if (savedPersona) {
        // Convert cookie data back to full persona object
        const fullPersona: Persona = {
          id: savedPersona.id,
          name: savedPersona.name, // Use localized name
          description: undefined, // Will be loaded separately if needed
        };
        setPersonaState(fullPersona);
      }
    } catch (cookieError) {
      console.error('Error reading persona cookie:', cookieError);
      setError(t('Failed to load persona data'));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSkipPersonaLogic]);

  /**
   * Set persona and save to cookie
   */
  const setPersona = useCallback(
    (newPersona: Persona) => {
      setPersonaState(newPersona);

      try {
        // Save minimal data to cookie
        const personaCookie: PersonaCookie = {
          id: newPersona.id,
          name: newPersona.name, // Save localized name to cookie
        };

        setJsonCookie(PERSONA_COOKIE_NAME, personaCookie, {
          maxAge: PERSONA_COOKIE_EXPIRY,
          path: '/',
          sameSite: 'lax',
        });
      } catch (cookieError) {
        console.error('Error saving persona cookie:', cookieError);
        setError(t('Failed to save persona data'));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Reset persona and clear cookie
   */
  const resetPersona = useCallback(() => {
    setPersonaState(null);
    setError(undefined);

    try {
      deleteCookie(PERSONA_COOKIE_NAME, { path: '/' });
    } catch (cookieError) {
      console.error('Error deleting persona cookie:', cookieError);
    }
  }, []);

  /**
   * Set access issue state (triggers blur)
   */
  const setAccessIssue = useCallback((type: 'error' | 'noAccess', details?: AccessIssueDetails) => {
    setHasAccessIssue(true);
    setAccessIssueType(type);
    setAccessIssueDetails(details);
  }, []);

  /**
   * Clear access issue state (removes blur)
   */
  const clearAccessIssue = useCallback(() => {
    setHasAccessIssue(false);
    setAccessIssueType(null);
    setAccessIssueDetails(undefined);
  }, []);

  /**
   * Clear access issues when navigating to a different page
   */
  useEffect(() => {
    clearAccessIssue();
  }, [router.pathname, clearAccessIssue]);

  // Context value
  const contextValue: PersonaContextType = {
    persona,
    setPersona,
    resetPersona,
    isLoading,
    error,
    hasAccessIssue,
    accessIssueType,
    accessIssueDetails,
    setAccessIssue,
    clearAccessIssue,
  };

  return (
    <PersonaServiceContext.Provider value={personaService || null}>
      <PersonaContext.Provider value={contextValue}>{children}</PersonaContext.Provider>
    </PersonaServiceContext.Provider>
  );
}
