import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useRef, Dispatch, SetStateAction, useCallback } from 'react';
import { useClickOutside } from 'lib/hooks/useClickOutside';
import Button from 'component-children/Shared/Button/Button';
import Image from 'next/image';
import { cn } from 'lib/helpers';
import { OAuthProviderType } from 'next-auth/providers/oauth-types';
import { Session } from 'next-auth';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useRouter } from 'next/router';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { AuthConfig } from 'lib/helpers/site-config-helpers';
import { useFrame } from 'lib/hooks/useFrame';
import { ThemeType } from 'lib/types';

type LoginProps = {
  authConfig?: AuthConfig | null;
};

export const Login: React.FC<LoginProps> = ({ authConfig }) => {
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { effectiveTheme } = useFrame();

  useClickOutside([dropdownRef], () => setIsOpen(false));

  return (
    <div className={cn('relative z-50 w-full lg:w-auto lg:px-0', effectiveTheme)} ref={dropdownRef}>
      <AuthButton session={session} isOpen={isOpen} setIsOpen={setIsOpen} theme={effectiveTheme} />
      <AuthDrawer
        session={session}
        isOpen={isOpen}
        authConfig={authConfig}
        theme={effectiveTheme}
      />
    </div>
  );
};
const AuthButton: React.FC<AuthButtonProps> = ({ session, isOpen, setIsOpen, theme }) => {
  const { t } = useTranslation();
  const authProvider: OAuthProviderType = 'auth0';
  const { page } = useSitecore();

  const handleLogInButtonClick = useCallback(() => {
    if (page?.mode.isEditing) return;
    signIn(authProvider);
  }, [page?.mode.isEditing, authProvider]);

  // To give room to drag and drop components in the placeholder when editing
  const editingClass = page?.mode.isEditing ? 'lg:py-4' : '';

  if (!session) {
    return (
      <Button
        onClick={handleLogInButtonClick}
        variant="button"
        color={theme}
        className={cn(
          'flex w-full items-center justify-between rounded-none bg-surface px-8 pb-4 pt-0 capitalize text-content',
          'lg:w-auto lg:justify-start lg:p-0',
          editingClass
        )}
      >
        <p className="lg:copy-xs copy-sm font-normal group-hover:underline lg:text-content/90">
          {t('Log in')}
        </p>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => setIsOpen((previousValue) => !previousValue)}
      color={theme}
      variant="button"
      iconRight={isOpen ? 'chevron-up' : 'chevron-down'}
      iconClasses="w-3 ml-auto lg:ml-3"
      className={cn(
        'group flex w-full items-center justify-start rounded-none bg-surface p-0 px-8 text-content/90',
        'lg:w-auto lg:justify-start lg:px-0',
        editingClass
      )}
    >
      <div className="flex items-center">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session?.user?.name || t('Account avatar')}
            className="mr-2 h-7 w-7 rounded-full border-2 border-content"
            width={24}
            height={24}
          />
        )}
        <p className="lg:copy-xs copy-sm font-normal group-hover:underline lg:text-content/90">
          {session.user?.name || t('Account')}
        </p>
      </div>
    </Button>
  );
};

const AuthDrawer: React.FC<AuthCommonProps & { authConfig?: AuthConfig | null }> = ({
  session,
  isOpen,
  authConfig,
  theme,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const accountInfo = () => {
    // Use Sitecore accountPageLink if available, fallback to /account
    const accountUrl = authConfig?.accountPageLink || '/account';
    router.push(accountUrl);
  };

  const handleSignOut = async () => {
    // Use Sitecore signOutPageLink as redirect URL, fallback to home page
    const redirectUrl = authConfig?.signOutPageLink || '/';

    // Sign out without automatic redirect, then manually redirect to desired page
    await signOut({ redirect: false });
    router.push(redirectUrl);
  };

  if (!session || !isOpen) {
    return null;
  }
  const { user } = session;
  if (!user) {
    console.error('AuthDrawer: user is ', user);
    return null;
  }

  return (
    <div className="static right-0 top-full z-50 mt-2 flex min-h-28 w-full flex-col items-end justify-between border border-content/20 bg-surface px-8 py-4 text-content lg:absolute lg:w-auto lg:min-w-56 lg:rounded-md lg:p-4 lg:shadow-md">
      <div className="flex w-full flex-row lg:w-[max-content]">
        <div className="flex-shrink-0">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name || t('Account avatar')}
              className="h-8 w-8 rounded-full"
              width={32}
              height={32}
            />
          )}
        </div>
        <div className="ml-3 flex flex-col">
          {user.name && <div className="text-sm font-medium text-content">{user.name}</div>}
          {user.email && <div className="text-sm text-content/70">{user.email}</div>}
        </div>
      </div>
      <div className="flex w-full flex-row justify-between">
        <Button onClick={() => accountInfo()} variant="link" className="heading-sm" color={theme}>
          {t('Account Mgmt')}
        </Button>
        <Button onClick={() => handleSignOut()} variant="link" className="heading-sm" color={theme}>
          {t('Log out')}
        </Button>
      </div>
    </div>
  );
};

type AuthCommonProps = {
  session: Session | null;
  isOpen: boolean;
  theme?: ThemeType;
};

type AuthButtonProps = AuthCommonProps & {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
