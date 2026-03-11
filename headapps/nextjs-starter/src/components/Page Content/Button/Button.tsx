import { LinkField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import Frame from 'component-children/Shared/Frame/Frame';
import Button from 'component-children/Shared/Button/Button';
import { useFrame } from 'lib/hooks/useFrame';
import { ButtonColorType, ButtonVariant } from 'lib/types';
import { PRIMARY_THEME, SECONDARY_THEME, TERTIARY_THEME } from 'lib/const';

const ButtonDefault: React.FC<ButtonProps> = (props) => {
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ButtonRendering {...props} />
    </Frame>
  );
};

const ButtonRendering: React.FC<ButtonProps> = ({ fields }) => {
  const { effectiveTheme, outline, contentAlignment } = useFrame();
  const type = outline ? 'outline' : 'button';

  // Smart color logic:
  // effectiveTheme already provides the computed theme value with fallback
  // Map theme to button color: light themes get dark buttons, dark theme gets yellow button
  const buttonColor =
    effectiveTheme === PRIMARY_THEME || effectiveTheme === TERTIARY_THEME
      ? 'secondary' // Parent uses light theme → button defaults to dark
      : effectiveTheme === SECONDARY_THEME
        ? 'tertiary' // Parent uses dark theme → button defaults to yellow
        : 'primary'; // Fallback to primary

  return (
    <Button
      link={fields.link}
      variant={type as ButtonVariant}
      color={buttonColor as ButtonColorType}
      className={contentAlignment}
    />
  );
};

type ButtonFields = {
  link: LinkField;
};

type ButtonProps = ComponentProps & {
  fields: ButtonFields;
  params?: {
    styles?: string[] | string;
    className?: string;
    [key: string]: string | string[] | undefined;
  };
};

export const Default = withDatasourceCheck()<ButtonProps>(ButtonDefault);
