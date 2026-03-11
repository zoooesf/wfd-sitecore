import { useState, useCallback } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { Persona } from 'lib/types/persona';
import { usePersonaServiceContext } from 'lib/contexts/persona-context';
import { getPageLanguage } from 'lib/helpers/language';
import { getPageSiteName } from 'lib/helpers/site';

// Type definitions for API response
type PersonaApiResponse = {
  personas: Persona[];
};

// Module-level cache that persists across all hook instances and component lifecycles
// This ensures the cache is shared and not lost when components unmount/remount
const personaCache: Record<string, Persona[]> = {};

/**
 * Custom hook for fetching personas from Sitecore
 * Provides centralized persona fetching logic with localization support and caching
 */
export const usePersonaService = () => {
  const injectedService = usePersonaServiceContext();
  const { page } = useSitecore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all personas with localized names (with caching)
   */
  const fetchPersonas = useCallback(async (): Promise<Persona[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const language = getPageLanguage(page);
      const siteName = getPageSiteName(page);

      // Check cache first
      const cacheKey = `${siteName}-${language}`;
      if (personaCache[cacheKey]) {
        return personaCache[cacheKey];
      }

      const apiUrl = `/api/v1/persona-service?siteName=${encodeURIComponent(
        siteName
      )}&language=${encodeURIComponent(language)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(
          `persona-service API request for site ${siteName} and language ${language} failed with status ${response.status}`
        );
      }

      const data = (await response.json()) as PersonaApiResponse;
      const personas = data.personas || [];

      // Cache the results
      personaCache[cacheKey] = personas;

      return personas;
    } catch (err) {
      console.error('Error fetching personas:', err);
      setError('Failed to load personas');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  // If a service is injected (e.g., in Storybook), return that instead of the real implementation
  if (injectedService) {
    return injectedService;
  }

  // Otherwise, return the real implementation
  return {
    fetchPersonas,
    isLoading,
    error,
  };
};
