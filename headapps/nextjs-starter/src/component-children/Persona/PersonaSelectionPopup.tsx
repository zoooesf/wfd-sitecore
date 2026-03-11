import { useState, useRef, useEffect, useCallback } from 'react';
import { usePersona } from 'lib/hooks/persona';
import { Persona } from 'lib/types/persona';
import { useTranslation } from 'lib/hooks/useTranslation';
import Icon from 'component-children/Shared/Icon/Icon';
import { usePersonaService } from 'lib/hooks/persona';
import { PersonaModalWrapper } from './PersonaModalWrapper';
import { FrameProvider } from 'lib/hooks/useFrame';
import { Button } from 'component-children/Shared/Button/Button';
import { useClickOutside } from 'lib/hooks/useClickOutside';
import { PRIMARY_THEME } from 'lib/const';

interface PersonaSelectionPopupProps {
  onPersonaSelected?: () => void;
  onClose?: () => void;
}

/**
 * PersonaSelectionPopup component shows available personas for user selection
 * Blur is managed at Layout level
 */
export const PersonaSelectionPopup: React.FC<PersonaSelectionPopupProps> = ({
  onPersonaSelected,
  onClose,
}) => {
  const { persona: currentPersona, setPersona } = usePersona();
  const { t } = useTranslation();
  const { fetchPersonas, isLoading, error } = usePersonaService();

  const [allAvailablePersonas, setAllAvailablePersonas] = useState<Persona[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPersonas = async () => {
      const personas = await fetchPersonas();
      setAllAvailablePersonas(personas);
    };

    loadPersonas();
  }, [fetchPersonas]);

  const handlePersonaSelect = useCallback(
    async (selectedPersona: Persona) => {
      try {
        setIsSelecting(true);
        setPersona(selectedPersona);
        onPersonaSelected?.();
      } catch (err) {
        console.error('[PersonaSelectionPopup] Error setting persona:', err);
      } finally {
        setIsSelecting(false);
      }
    },
    [setPersona, onPersonaSelected]
  );

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      window.history.back();
    }
  }, [onClose]);

  // Close modal when clicking outside
  useClickOutside([modalContentRef], handleClose, !!onClose);

  return (
    <FrameProvider params={{ Styles: 'theme:primary' }}>
      <PersonaModalWrapper
        titleId="persona-selection-title"
        descriptionId="persona-selection-description"
        maxWidth="lg"
        scrollableContent={false}
        theme={PRIMARY_THEME}
        wrapperClassName="z-70"
        contentRef={modalContentRef}
      >
        <div className="flex h-full max-h-modal flex-col px-6 pb-4">
          <div className="flex-shrink-0 py-4">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg p-2 text-content/50 transition-colors hover:bg-surface/90 hover:text-content focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))]"
              disabled={isSelecting}
              aria-label={t('Close modal')}
            >
              <Icon icon="xmark" prefix="fas" className="h-5 w-5" />
            </button>
            <p id="persona-selection-title" className="heading-2xl mb-2 text-center">
              {t('Select Your Persona')}
            </p>
            <p id="persona-selection-description" className="copy-base text-center text-content/70">
              {t('Choose a profile that best describes you to access personalized content')}
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {isLoading && (
              <div className="flex h-32 items-center justify-center">
                <div className="spinner h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            )}

            {!isLoading && !error && allAvailablePersonas.length > 0 && (
              <div className="space-y-2">
                {allAvailablePersonas.map((persona) => {
                  const isCurrentlySelected = currentPersona?.id === persona.id;
                  return (
                    <Button
                      color={isCurrentlySelected ? 'tertiary' : 'secondary'}
                      variant="button"
                      key={persona.id}
                      onClick={() => handlePersonaSelect(persona)}
                      disabled={isSelecting}
                      className="w-full p-4 text-left disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="heading-base">{persona.name}</p>
                          {persona.description?.value && (
                            <p className="copy-sm mt-1 text-content/70">
                              {persona.description.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            )}

            {!isLoading && !error && allAvailablePersonas.length === 0 && (
              <div className="py-8 text-center text-content/70">
                <p className="copy-base">{t('No persona are currently available.')}</p>
              </div>
            )}
          </div>
        </div>
      </PersonaModalWrapper>
    </FrameProvider>
  );
};
