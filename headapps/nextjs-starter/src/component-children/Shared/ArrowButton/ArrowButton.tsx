import { cn } from 'lib/helpers/classname';
import { IconFas } from '../Icon/Icon';
import { useTranslation } from 'lib/hooks/useTranslation';

export const ArrowButton: React.FC<ArrowProps> = ({
  direction = SCROLL_DIRECTION.LEFT,
  size = ARROW_SIZE.LARGE,
  onClick,
  disabled,
  ariaLabel,
}) => {
  const { t } = useTranslation();

  const buttonClasses = cn(
    'secondary flex items-center justify-center rounded-lg transition-all duration-300',
    size === ARROW_SIZE.LARGE && 'h-14 w-14',
    size === ARROW_SIZE.SMALL && 'h-10 w-10',
    disabled
      ? 'cursor-not-allowed bg-surface/50 text-content/30'
      : 'bg-surface text-content hover:bg-surface/80'
  );

  return (
    <button
      data-component="ArrowButton"
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel || `${direction === SCROLL_DIRECTION.LEFT ? t('Previous') : t('Next')}`}
    >
      <IconFas
        icon={`chevron-${direction}`}
        className={cn(size === ARROW_SIZE.LARGE && 'h-7', size === ARROW_SIZE.SMALL && 'h-5')}
        variant="white"
      />
    </button>
  );
};

type ArrowProps = {
  size?: ArrowSize;
  direction?: ScrollDirection;
  disabled: boolean;
  onClick: () => void;
  ariaLabel?: string;
};

export const SCROLL_DIRECTION = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;
export type ScrollDirection = (typeof SCROLL_DIRECTION)[keyof typeof SCROLL_DIRECTION];

export const ARROW_SIZE = {
  SMALL: 'small',
  LARGE: 'large',
} as const;
export type ArrowSize = (typeof ARROW_SIZE)[keyof typeof ARROW_SIZE];
