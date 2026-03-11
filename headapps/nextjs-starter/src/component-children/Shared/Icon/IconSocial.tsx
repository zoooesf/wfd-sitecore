import { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIconDefinition, IconName } from '@fortawesome/fontawesome-svg-core';
import { getIconClasses } from './Icon';

const IconSocial = ({ icon, className, spin, color }: IconProps): JSX.Element => {
  return (
    <FontAwesomeIcon
      icon={findIconDefinition({
        prefix: 'fab',
        iconName: icon,
      })}
      className={getIconClasses(className, color)}
      spin={spin}
    />
  );
};

type IconProps = {
  icon: IconName;
  className?: string;
  color?: string;
  spin?: boolean;
};

export default IconSocial;
