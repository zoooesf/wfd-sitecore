import { useState, useCallback } from 'react';
import Button from 'component-children/Shared/Button/Button';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { usePersona } from 'lib/hooks/persona';
import { PersonaSelectionPopup } from 'component-children/Persona/PersonaSelectionPopup';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers';

export const PersonaSwitcher: React.FC = () => {
  const { isLoading: personaLoading } = usePersona();
  const { page } = useSitecore();
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();
  const [showPersonaPopup, setShowPersonaPopup] = useState(false);

  // To give room to drag and drop components in the placeholder when editing
  const editingClass = page?.mode.isEditing ? 'lg:py-4' : '';

  const handlePersonaSelected = () => {
    setShowPersonaPopup(false);
  };

  const handlePersonaPopupClose = () => {
    setShowPersonaPopup(false);
  };

  const handleButtonClick = useCallback(() => {
    if (page?.mode.isEditing) return;
    setShowPersonaPopup(true);
  }, [page?.mode.isEditing]);

  // Don't render if personas are loading
  if (personaLoading) {
    return null;
  }

  return (
    <div className={cn('w-full lg:w-auto lg:px-0', effectiveTheme)}>
      <Button
        onClick={handleButtonClick}
        variant="button"
        color={effectiveTheme}
        iconLeft="user"
        iconClasses="mr-1 w-4 h-4"
        className={cn(
          'group flex w-full items-center justify-start rounded-none bg-surface p-0 px-8 text-content/90',
          'lg:w-auto lg:justify-start lg:px-0',
          editingClass
        )}
        aria-label={t('Select Persona')}
      />

      {showPersonaPopup && (
        <PersonaSelectionPopup
          onPersonaSelected={handlePersonaSelected}
          onClose={handlePersonaPopupClose}
        />
      )}
    </div>
  );
};
