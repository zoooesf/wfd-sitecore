import { Field } from '@sitecore-content-sdk/nextjs';

// Persona Types for Attestation Access Control

export interface Persona {
  id: string;
  name: string; // Localized name field
  description?: Field<string>;
}

export interface PersonaCookie {
  id: string;
  name: string; // Localized name field
}

// Access issue details for blur state management
export interface AccessIssueDetails {
  error?: string;
  allowedPersonas?: Persona[];
}

// Context types
export interface PersonaContextType {
  persona: Persona | null;
  setPersona: (persona: Persona) => void;
  resetPersona: () => void;
  isLoading: boolean;
  error?: string;
  // Blur state management
  hasAccessIssue: boolean;
  accessIssueType: 'error' | 'noAccess' | null;
  accessIssueDetails?: AccessIssueDetails;
  setAccessIssue: (type: 'error' | 'noAccess', details?: AccessIssueDetails) => void;
  clearAccessIssue: () => void;
}
