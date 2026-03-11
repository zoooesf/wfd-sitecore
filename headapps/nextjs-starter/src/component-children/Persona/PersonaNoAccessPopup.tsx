import { Persona } from 'lib/types/persona';
import { useTranslation } from 'lib/hooks/useTranslation';
import { Button } from 'component-children/Shared/Button/Button';
import Icon from 'component-children/Shared/Icon/Icon';
import { PersonaModalWrapper } from './PersonaModalWrapper';
import { FrameProvider } from 'lib/hooks/useFrame';
import { PRIMARY_THEME, SECONDARY_THEME } from 'lib/const';
import { useRouter } from 'next/router';
import { ThemeType } from 'lib/types';

interface PersonaNoAccessPopupProps {
  allowedPersonas: Persona[];
  /** Theme variant for the popup (default: 'primary') */
  theme?: ThemeType;
}

/**
 * PersonaNoAccessPopup component displays an access denied popup
 * Blur is managed at Layout level
 */
export const PersonaNoAccessPopup: React.FC<PersonaNoAccessPopupProps> = ({
  allowedPersonas,
  theme = PRIMARY_THEME,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleGoBackClick = () => {
    router.push('/');
  };

  const modalContent = (
    <div className="p-6">
      <div className="mb-4 flex justify-center">
        <Icon icon="lock" prefix="fas" className="h-12 w-12" color="primary" />
      </div>

      <p id="access-denied-title" className="heading-xl mb-4 text-center text-content">
        {t(`Access Restricted`)}
      </p>

      <div className="space-y-3 text-center text-content/70">
        <p className="copy-base">
          {t(`You do not have the matching persona to view this page content`)}.
        </p>
        {allowedPersonas.length > 0 && (
          <div>
            <p className="heading-sm mb-2">{t(`Required persona(s)`)}</p>
            <ul className="copy-sm max-h-25 space-y-1 overflow-y-auto text-content/60">
              {allowedPersonas.map((persona: Persona) => (
                <li key={persona.id}>{persona.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          className="flex flex-1 items-center justify-center"
          color={theme === SECONDARY_THEME ? PRIMARY_THEME : SECONDARY_THEME}
          variant="button"
          onClick={handleGoBackClick}
        >
          {t(`Go Back to Homepage`)}
        </Button>
      </div>
    </div>
  );

  return (
    <FrameProvider params={{ Styles: `theme:${theme}` }}>
      <PersonaModalWrapper
        titleId="access-denied-title"
        descriptionId="access-denied-description"
        maxWidth="md"
        theme={theme}
      >
        {modalContent}
      </PersonaModalWrapper>
    </FrameProvider>
  );
};
