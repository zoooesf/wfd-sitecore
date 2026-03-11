import { useContainer } from 'lib/hooks/useContainer';
import { ContainedWrapper } from './ContainedWrapper';
import { FullWidthWrapper } from './FullWidthWrapper';
import { ThemeType } from 'lib/types';

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  wrapper = 'contained',
  theme,
  className,
}) => {
  const { containerName } = useContainer();

  const WrapperElem = wrapper === 'contained' ? ContainedWrapper : FullWidthWrapper;

  if (
    containerName === 'TwoColumn' ||
    containerName === 'ColumnSplitter' ||
    containerName === 'RowSplitter'
  )
    return <>{children}</>;

  return (
    <WrapperElem theme={theme} className={className}>
      {children}
    </WrapperElem>
  );
};

type WrapperProps = {
  children: React.ReactNode;
  wrapper?: 'contained' | 'full-width';
  theme?: ThemeType;
  className?: string;
};
