import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { LanguageSwitcher } from 'component-children/Navigation/LanguageSwitcher/LanguageSwitcher';
import { availableLanguages } from 'lib/i18n/i18n-config';
import Frame from 'component-children/Shared/Frame/Frame';

export const Default = (props: ComponentProps): JSX.Element => {
  return (
    <Frame params={props.params} className="w-full lg:w-auto">
      <LanguageSwitcher {...props} languages={availableLanguages} />
    </Frame>
  );
};
