import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState, JSX } from 'react';
import { useRouter } from 'next/router';
import { ComponentProps } from 'lib/component-props';
import { useClickOutside } from 'lib/hooks/useClickOutside';
import { cn, getLanguageName } from 'lib/helpers';
import Button from 'component-children/Shared/Button/Button';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { useFrame } from 'lib/hooks/useFrame';
import { ThemeType } from 'lib/types';

const LANGUAGE_SWITCHER_API = `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/v1/language-switcher`;

export const LanguageSwitcher = (props: LanguageSwitcherProps): JSX.Element => {
  const { page } = useSitecore();
  const { effectiveTheme } = useFrame();
  const [displayDropdown, setDisplayDropdown] = useState(false);
  const langSwitcherRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Close the dropdown when the language is changed
    if (page?.locale !== router.locale) setDisplayDropdown(false);
  }, [page?.locale, router.locale]);

  useClickOutside([langSwitcherRef], () => setDisplayDropdown(false));

  return (
    <div ref={langSwitcherRef} className={cn('component relative w-full', 'lg:w-auto')}>
      <LanguageSwitcherToggle
        contextLanguage={page?.locale ?? ''}
        displayDropdown={displayDropdown}
        setDisplayDropdown={setDisplayDropdown}
        theme={effectiveTheme}
      />
      <LanguageSwitcherDropdown
        contextLanguage={page?.locale ?? ''}
        displayDropdown={displayDropdown}
        languages={props.languages}
        theme={effectiveTheme}
      />
    </div>
  );
};

const LanguageSwitcherToggle = ({
  contextLanguage,
  displayDropdown,
  setDisplayDropdown,
  theme,
}: LanguageSwitcherToggleProps) => {
  const { page } = useSitecore();

  const handleClick = useCallback(() => {
    if (page?.mode.isEditing) return;
    setDisplayDropdown((displayDropdown) => !displayDropdown);
  }, [page?.mode.isEditing, setDisplayDropdown]);

  // To give room to drag and drop components in the placeholder when editing
  const editingClass = page?.mode.isEditing ? 'lg:py-4' : '';

  return (
    <Button
      onClick={handleClick}
      variant="button"
      color={theme}
      iconRight={displayDropdown ? 'chevron-up' : 'chevron-down'}
      className={cn(
        'group flex w-full items-center justify-between rounded-none px-8 py-3 capitalize',
        'lg:w-auto lg:justify-start lg:p-0',
        editingClass
      )}
    >
      <p
        className={cn('lg:copy-xs copy-sm font-normal lg:text-content/90', 'group-hover:underline')}
      >
        {getLanguageName(contextLanguage)}
      </p>
    </Button>
  );
};

const LanguageSwitcherDropdown = ({
  contextLanguage,
  displayDropdown,
  languages,
  theme,
}: LanguageSwitcherDropdownProps) => {
  return (
    <div
      className={cn(
        'static left-0 top-0 z-50 flex flex-col border border-content/20 bg-surface text-content shadow-md',
        'lg:absolute lg:top-full lg:mt-[9px] lg:-translate-x-1 lg:rounded-md',
        theme,
        displayDropdown ? 'block' : 'hidden'
      )}
    >
      <ul>
        {languages?.map((locale: string) => {
          return (
            <li key={locale} className={cn('flex border-b border-content/20', 'last:border-b-0')}>
              <LanguageSwitcherItem
                locale={locale}
                contextLanguage={contextLanguage}
                languageName={getLanguageName(contextLanguage, locale) ?? ''}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const LanguageSwitcherItem = ({
  locale,
  contextLanguage,
  languageName,
}: LanguageSwitcherItemProps) => {
  const { page } = useSitecore();
  const router = useRouter();
  const isContextLanguage = locale === contextLanguage;
  const commonClasses = cn(
    'copy-xs w-full cursor-pointer px-8 py-3 capitalize text-content/90',
    'lg:px-6',
    'hover:underline',
    isContextLanguage && 'font-bold'
  );

  const handleLanguageSwitch = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!page?.layout?.sitecore?.route?.itemId) return;
    try {
      const path = await fetchLanguageSwitchPath(locale, page.layout.sitecore.route.itemId);
      if (path) {
        /*
        The shallow: false option only relates to same-page navigation, such as changing query parameters.
        It does not force a full page reload when changing the locale property.
        This works fine for all the other pages except for the pages that use Sitecore Search.
        We need to reload the page to pass the correct locale in the Sitecore Search API, else it won't return the correct results.
        */

        // Define the handler function so we can remove it after it fires
        const handleRouteChangeComplete = () => {
          router.reload();
          // Cleanup: Remove the event listener after it fires once
          router.events.off('routeChangeComplete', handleRouteChangeComplete);
        };

        // Attach the event handler BEFORE pushing to avoid race condition
        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        // Now push the route
        router.push(path, undefined, { locale, shallow: true });
      }
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  if (locale === contextLanguage) {
    return <p className={commonClasses}>{languageName}</p>;
  } else {
    return (
      <a href="#" className={commonClasses} onClick={handleLanguageSwitch}>
        {languageName}
      </a>
    );
  }
};

const fetchLanguageSwitchPath = async (locale: string, itemId: string) => {
  if (!locale || !itemId) {
    console.error('Locale and Item ID are required to fetch language switch path');
    throw new Error('Locale and Item ID are required to fetch language switch path');
  }

  try {
    const queryParams = new URLSearchParams({
      destinationLanguage: locale,
      itemId: itemId,
    });

    const response = await fetch(`${LANGUAGE_SWITCHER_API}?${queryParams.toString()}`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      return data.path;
    } else {
      console.error('Failed to get language switch path');
      throw new Error('Failed to get language switch path');
    }
  } catch (error) {
    console.error('Error calling language switcher API:', error);
    throw new Error('Error calling language switcher API');
  }
};

type LanguageSwitcherLanguagesProps = {
  languages: string[];
};

type LanguageSwitcherCommonProps = {
  displayDropdown: boolean;
  contextLanguage: string;
};

type LanguageSwitcherItemProps = {
  locale: string;
  contextLanguage: string;
  languageName: string;
};

type LanguageSwitcherToggleProps = LanguageSwitcherCommonProps & {
  setDisplayDropdown: Dispatch<SetStateAction<boolean>>;
  theme?: ThemeType;
};

type LanguageSwitcherDropdownProps = LanguageSwitcherCommonProps &
  LanguageSwitcherLanguagesProps & {
    theme?: ThemeType;
  };

type LanguageSwitcherProps = ComponentProps & LanguageSwitcherLanguagesProps;
