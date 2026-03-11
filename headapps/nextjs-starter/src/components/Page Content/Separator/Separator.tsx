import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';

export const Default: React.FC<SeparatorProps> = (props) => {
  return (
    <Frame params={props.params} className="w-full">
      <Separator {...props} />
    </Frame>
  );
};

const Separator: React.FC<SeparatorProps> = () => {
  const { effectiveTheme } = useFrame();
  return (
    <ContainedWrapper>
      <div
        data-component="Separator"
        className={cn('h-0.5 w-full bg-surface/10', effectiveTheme)}
      ></div>
    </ContainedWrapper>
  );
};

type SeparatorProps = ComponentProps;
