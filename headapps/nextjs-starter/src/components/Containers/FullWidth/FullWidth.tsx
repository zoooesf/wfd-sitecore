import { Placeholder, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { placeholderGenerator } from 'lib/helpers';
import Frame from 'component-children/Shared/Frame/Frame';
import { useFrame } from 'lib/hooks/useFrame';
import { FullWidthWrapper } from 'component-children/Shared/Containers/FullWidthWrapper';
import { BackgroundImage } from 'component-children/Shared/BackgroundImage/BackgroundImage';
import { BackgroundImageProps } from 'lib/hooks/useBackgroundImage';
import { cn } from 'lib/helpers/classname';

const FullWidthDefault: React.FC<FullWidthProps> = (props) => {
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <FullWidth {...props} />
    </Frame>
  );
};

const FullWidth: React.FC<FullWidthProps> = ({ fields, params, rendering }) => {
  const { maxWidth, effectiveTheme, contentAlignment } = useFrame();
  const id = params.anchorId ?? params.RenderingIdentifier;
  const classes = fields?.backgroundImage?.value?.src ? 'bg-surface/5' : 'bg-surface';
  const innerClasses = cn('mx-auto flex flex-col', maxWidth, contentAlignment);

  return (
    <FullWidthWrapper
      theme={effectiveTheme}
      id={id}
      className={classes}
      innerClassName={innerClasses}
    >
      <Placeholder name={placeholderGenerator(params, 'fullwidth')} rendering={rendering} />
      <BackgroundImage fields={fields} />
    </FullWidthWrapper>
  );
};

type FullWidthFieldsType = {
  fields: BackgroundImageProps;
};

type FullWidthProps = ComponentProps & FullWidthFieldsType;

export const Default = withDatasourceCheck()<FullWidthProps>(FullWidthDefault);
