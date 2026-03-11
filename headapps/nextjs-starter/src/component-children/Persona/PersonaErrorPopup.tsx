import { useState } from 'react';
import { useTranslation } from 'lib/hooks/useTranslation';
import { Button } from 'component-children/Shared/Button/Button';
import Icon from 'component-children/Shared/Icon/Icon';
import { PersonaModalWrapper } from './PersonaModalWrapper';
import { FrameProvider } from 'lib/hooks/useFrame';
import { PRIMARY_THEME } from 'lib/const';

interface PersonaErrorPopupProps {
  error: string | null;
  onClick: () => void;
}

/**
 * PersonaErrorPopup component displays an error modal with retry functionality
 * Used when persona access verification fails
 * Blur is managed at Layout level
 */
export const PersonaErrorPopup: React.FC<PersonaErrorPopupProps> = ({ error, onClick }) => {
  const { t } = useTranslation();
  const [closeModal, setCloseModal] = useState(false);

  const handleClose = () => {
    setCloseModal(true);
  };

  if (!error || closeModal) {
    return null;
  }

  return (
    <FrameProvider params={{ Styles: 'theme:primary' }}>
      <PersonaModalWrapper
        titleId="persona-error-title"
        descriptionId="persona-error-description"
        maxWidth="md"
        theme={PRIMARY_THEME}
      >
        <div className="p-6">
          <Button
            iconLeft="xmark"
            variant="button"
            color="primary"
            onClick={handleClose}
            className="absolute right-4 top-4 p-0"
            iconClasses="mr-0 w-5 h-5"
            aria-label={t('Close modal')}
          />

          <div className="mb-4 flex justify-center">
            <Icon icon="circle-exclamation" prefix="fas" className="h-12 w-12" color="error" />
          </div>

          <p id="persona-error-title" className="heading-xl mb-4 text-center text-content">
            {t('Persona Loading Error')}
          </p>

          <div className="text-center text-content/70">
            <p id="persona-error-description" className="copy-base">
              {error}
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              className="flex items-center justify-center"
              color="secondary"
              variant="button"
              onClick={onClick}
            >
              {t('Retry')}
            </Button>
          </div>
        </div>
      </PersonaModalWrapper>
    </FrameProvider>
  );
};
