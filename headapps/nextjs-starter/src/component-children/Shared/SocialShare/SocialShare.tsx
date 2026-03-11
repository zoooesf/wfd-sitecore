import { IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { IconType } from 'lib/types';
import ButtonIcon from '../Button/ButtonIcon';
import { shareTo } from 'lib/helpers/social-share-helper';
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { cn } from 'lib/helpers/classname';
import { useEffect, useState } from 'react';
import { useTranslation } from 'lib/hooks/useTranslation';

export const SocialShare: React.FC<SocialShareProps> = ({
  url = '',
  facebook = true,
  twitter = true,
  linkedin = true,
  email = true,
  className,
  iconClassName,
  shareLabel,
}) => {
  const [shareUrl, setShareUrl] = useState(url);
  const { t } = useTranslation();
  const shareLabelField: Field<string> = shareLabel || { value: `${t('Share')}: ` };
  const shareButtons = [
    {
      onClick: () => shareTo('facebook', shareUrl),
      icon: { type: 'facebook' as IconType },
      disabled: !facebook,
    },
    {
      onClick: () => shareTo('twitter', shareUrl),
      icon: { type: 'x-twitter' as IconType },
      disabled: !twitter,
    },
    {
      onClick: () => shareTo('linkedin', shareUrl),
      icon: { type: 'linkedin' as IconType },
      disabled: !linkedin,
    },
    {
      onClick: () => shareTo('email', shareUrl),
      icon: { type: 'envelope' as IconType, prefix: 'fas' as IconPrefix },
      disabled: !email,
    },
  ] as SocialShareButtonProps[];

  useEffect(() => {
    setShareUrl(url || window?.location?.href);
  }, [url]);

  return (
    <div className={cn('flex items-center gap-2', className)} data-component="Social Share">
      <Text className="heading-base text-content" field={shareLabelField} tag="p" />
      {shareButtons
        .filter((button) => !button.disabled)
        .map((button) => (
          <SocialShareButton
            key={button.icon.type}
            icon={button.icon}
            onClick={button.onClick}
            iconClassName={iconClassName}
          />
        ))}
    </div>
  );
};

const SocialShareButton: React.FC<SocialShareButtonProps> = ({ icon, onClick, iconClassName }) => {
  return (
    <ButtonIcon
      className={cn('h-4 w-4', iconClassName)}
      icon={icon.type as IconType}
      label={icon.type}
      onClick={onClick}
      iconPrefix={icon.prefix}
      unsetDefaultSize
      withBackground={false}
      iconColor="text-content"
    />
  );
};

type SocialShareProps = {
  url?: string;
  facebook?: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  email?: boolean;
  className?: string;
  iconClassName?: string;
  shareLabel?: Field<string>;
};

type SocialShareButtonProps = {
  icon: { type: IconType; prefix?: IconPrefix | undefined };
  onClick: () => void;
  disabled?: boolean;
  iconClassName?: string;
};
