import { useState, useCallback, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { useSitecore, Field } from '@sitecore-content-sdk/nextjs';
import { useRouter } from 'next/router';
import { usePersona } from 'lib/hooks/persona';
import { PersonaNoAccessPopup } from './PersonaNoAccessPopup';
import { Persona } from 'lib/types/persona';
import { useTranslation } from 'lib/hooks/useTranslation';
import { PersonaSelectionPopup } from './PersonaSelectionPopup';
import { PersonaErrorPopup } from './PersonaErrorPopup';
import { normalizeIdLowercase } from 'lib/helpers';

// Type for the layout service persona data structure
interface LayoutPersonaItem {
  id: string;
  fields?: {
    contentName?: Field<string>;
    description?: Field<string>;
  };
}

/**
 * PersonaAuthenticationCheck component enforces persona-based access control
 * Shows blurred page with popup if user doesn't have required persona access
 */
export const PersonaAuthenticationCheck: React.FC<PropsWithChildren> = ({ children }) => {
  const { persona, isLoading: personaLoading, setAccessIssue, clearAccessIssue } = usePersona();
  const { page } = useSitecore();
  const router = useRouter();
  const [allowedPersonas, setAllowedPersonas] = useState<Persona[]>([]);
  const [hasAccess, setHasAccess] = useState(true);
  const [needsPersonaSelection, setNeedsPersonaSelection] = useState(false);
  const [showPersonaUpdate, setShowPersonaUpdate] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [userDismissedSelection, setUserDismissedSelection] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const shouldBypassCheck = () => {
    return (
      !page?.mode.isNormal ||
      router.isPreview ||
      (typeof navigator !== 'undefined' && /bot|crawl|spider/i.test(navigator.userAgent))
    );
  };

  const fetchAllowedPersonas = (): Persona[] => {
    try {
      const personasField = page?.layout?.sitecore?.route?.fields?.personas;

      if (!personasField) {
        return [];
      }

      let personaItems: LayoutPersonaItem[] = [];

      if (personasField && typeof personasField === 'object' && 'targetItems' in personasField) {
        personaItems = Array.isArray(personasField.targetItems)
          ? (personasField.targetItems as LayoutPersonaItem[])
          : [];
      } else if (Array.isArray(personasField)) {
        personaItems = personasField as LayoutPersonaItem[];
      }

      const mappedPersonas: Persona[] = personaItems.map((item) => ({
        id: normalizeIdLowercase(item.id),
        name: item.fields?.contentName?.value || '',
        description: item.fields?.description || undefined,
      }));

      return mappedPersonas;
    } catch (error) {
      console.error(
        '[PersonaAuthenticationCheck] Error getting allowed personas from layout data:',
        error
      );
      return [];
    }
  };

  const checkPersonaAccess = () => {
    try {
      setError(null);
      setNeedsPersonaSelection(false);
      setShowPersonaUpdate(false);
      setUserDismissedSelection(false);
      const allowedPersona = fetchAllowedPersonas();
      setAllowedPersonas(allowedPersona);

      if (!allowedPersona || allowedPersona.length === 0) {
        setHasAccess(true);
        clearAccessIssue();
        return;
      }

      if (!persona) {
        setNeedsPersonaSelection(true);
        setHasAccess(false);
        setAccessIssue('noAccess', { allowedPersonas: allowedPersona });
        return;
      }

      // IDs are already normalized when personas are mapped from layout data
      const allowedPersonaIds = allowedPersona.map((persona) => persona.id);
      const normalizedPersonaId = normalizeIdLowercase(persona.id);

      const userHasAccess = allowedPersonaIds.includes(normalizedPersonaId);
      setHasAccess(userHasAccess);

      if (userHasAccess) {
        clearAccessIssue();
      } else {
        setAccessIssue('noAccess', { allowedPersonas: allowedPersona });
      }
    } catch (error) {
      console.error('[PersonaAuthenticationCheck] Error checking persona access:', error);
      const errorMessage = t('Failed to verify persona access permissions');
      setError(errorMessage);
      setAccessIssue('error', { error: errorMessage });
      setHasAccess(true);
    }
  };

  /**
   * Handle when user selects a persona
   */
  const handlePersonaSelected = useCallback(() => {
    // Reset the show persona update flag since user is selecting a new persona
    setShowPersonaUpdate(false);
    setUserDismissedSelection(false);
    // The useEffect that watches persona?.id will handle the access check
    // No need to call checkPersonaAccess here to avoid race conditions
  }, []);

  /**
   * Handle when user dismisses persona selection without choosing
   */
  const handleSelectionDismissed = useCallback(() => {
    setUserDismissedSelection(true);
  }, []);

  /**
   * Re-check access when persona changes
   */
  useEffect(() => {
    if (shouldBypassCheck()) {
      return;
    }

    const isReadyToCheckAccess = !personaLoading && router.isReady;
    if (isReadyToCheckAccess) {
      checkPersonaAccess();
    }
    // Note: checkPersonaAccess, personaLoading, router.isReady, and shouldBypassCheck are
    // intentionally excluded from dependencies. We only want to re-run when the persona
    // ID changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona?.id]);

  /**
   * Initialize persona access check
   */
  useEffect(() => {
    if (shouldBypassCheck()) {
      setHasAccess(true);
      setShowSpinner(false);
      clearAccessIssue();
      return;
    }

    const isReadyToCheckAccess = !personaLoading && router.isReady;
    setShowSpinner(!isReadyToCheckAccess);

    if (isReadyToCheckAccess) {
      checkPersonaAccess();
    }
    // Note: clearAccessIssue, checkPersonaAccess, and shouldBypassCheck are intentionally
    // excluded from dependencies to prevent infinite loops where the page object may not be
    // stable. We only want to re-run when persona loading state changes, router ready state
    // changes, or the Sitecore page changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaLoading, router.isReady, page]);

  if (showSpinner) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center transition-opacity duration-200 ease-in-out">
        <div className="h-8 w-8 animate-spin rounded-loader border-b-2 border-content"></div>
      </div>
    );
  }

  const showSelectionPopup =
    (needsPersonaSelection && !userDismissedSelection) || showPersonaUpdate;
  const showNoAccessPopup = !error && !hasAccess && !showSelectionPopup;
  const showErrorPopup = !!error;
  const useEmptyPersonaList = needsPersonaSelection && userDismissedSelection;

  return (
    <>
      {children}
      {showErrorPopup && <PersonaErrorPopup error={error} onClick={checkPersonaAccess} />}
      {showNoAccessPopup && (
        <PersonaNoAccessPopup allowedPersonas={useEmptyPersonaList ? [] : allowedPersonas} />
      )}
      {showSelectionPopup && (
        <PersonaSelectionPopup
          onPersonaSelected={handlePersonaSelected}
          onClose={handleSelectionDismissed}
        />
      )}
    </>
  );
};
