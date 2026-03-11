import { RichText, Field, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import Frame from 'component-children/Shared/Frame/Frame';
import { Wrapper } from 'component-children/Shared/Containers/Wrapper';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers/classname';

const CommonRichtextDefault: React.FC<CommonRichtextProps> = (props) => {
  return (
    <Frame params={props.params}>
      <Rendering {...props} />
    </Frame>
  );
};

const Rendering: React.FC<CommonRichtextProps> = ({ fields }) => {
  const { effectiveTheme } = useFrame();
  const richtextClasses = cn('richtext relative w-full', effectiveTheme);
  return (
    <Wrapper theme={effectiveTheme} className="bg-surface">
      <RichText className={richtextClasses} field={fields.body} />
    </Wrapper>
  );
};

type CommonRichtextProps = ComponentProps & {
  params: { [key: string]: string };
  fields: {
    body: Field<string>;
  };
};

export const Default = withDatasourceCheck()<CommonRichtextProps>(CommonRichtextDefault);
