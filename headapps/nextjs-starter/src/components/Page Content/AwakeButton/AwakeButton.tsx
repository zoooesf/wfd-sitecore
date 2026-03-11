import { LinkField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import Frame from 'component-children/Shared/Frame/Frame';
import {AwakeToggle} from 'component-children/Shared/Button/AwakeToggle';

const ButtonDefault: React.FC<ButtonProps> = (props) => {
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ButtonRendering {...props} />
    </Frame>
  );
};

const ButtonRendering: React.FC<ButtonProps> = () => {

  // Smart color logic:
  // effectiveTheme already provides the computed theme value with fallback
  // Map theme to button color: light themes get dark buttons, dark theme gets yellow button


  return (
    <AwakeToggle />
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
