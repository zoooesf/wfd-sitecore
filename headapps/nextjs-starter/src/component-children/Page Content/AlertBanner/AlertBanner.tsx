import React from 'react';
import { ComponentProps } from 'lib/component-props';
import { Field, LayoutServiceData, Text, RichText } from '@sitecore-content-sdk/nextjs';
import { addQueryStringParameters } from 'lib/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { cn } from 'lib/helpers/classname';
import { QueryField } from 'lib/types';
import { mainLanguage } from 'lib/i18n/i18n-config';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useFrame } from 'lib/hooks/useFrame';

/**
 * AlertBanner Component
 * Displays a full-width banner with heading and body text
 * @param {AlertBannerProps} props - Component props
 * @returns {JSX.Element} Rendered banner component
 */

export const AlertBanner: React.FC<AlertBannerProps> = ({
  fields,
  className,
  storageKey,
}: AlertBannerProps) => {
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();
  const [isVisible, setIsVisible] = React.useState(true);
  const category = fields?.alertCategory?.value || DEFAULT_ALERT_CATEGORY;
  const isDefaultCategory = category === 'default';
  const textColorClass = isDefaultCategory ? 'text-content' : 'text-gray-900';

  const bannerClasses = cn(
    'relative flex w-full px-6 py-3',
    'lg:px-20',
    ALERT_CATEGORY_COLORS[category],
    effectiveTheme,
    className
  );

  React.useEffect(() => {
    if (typeof window === 'undefined' || !storageKey) return;

    const isDismissed = sessionStorage.getItem(storageKey) === 'dismissed';
    if (isDismissed) setIsVisible(false);
  }, [storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (storageKey) sessionStorage.setItem(storageKey, 'dismissed');
  };

  if (!isVisible) return null;

  return (
    <div
      className={bannerClasses}
      aria-live="polite"
      role="alert"
      aria-label={fields?.heading?.jsonValue?.value || t('Site Alert')}
      aria-atomic="true"
    >
      <div className="m-auto flex w-full max-w-inner-content flex-col items-center justify-center">
        <div
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 text-center',
            'lg:flex-row lg:gap-4 lg:text-left'
          )}
        >
          <Text
            className={cn('body-bold', textColorClass)}
            field={fields?.heading?.jsonValue}
            tag="h1"
          />
          <RichText
            className={cn('body-regular', textColorClass)}
            field={fields?.body?.jsonValue}
          />
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className={cn(
          'absolute right-4 top-1/2 -translate-y-1/2 p-2',
          textColorClass,
          'hover:opacity-75'
        )}
        aria-label={t('Close Alert')}
      >
        <FontAwesomeIcon icon={faXmark} className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export const AlertBannerEditRendering: React.FC<EditRenderingProps> = ({ title, id }) => {
  const editBannerData: AlertBannerFields = {
    id: id,
    heading: { jsonValue: { value: title } },
    body: { jsonValue: { value: `This is a ${title} message!` } },
    alertCategory: { value: 'warning' },
  };

  return <AlertBanner fields={editBannerData} />;
};

export const fetchAlertBannerData = async (
  url: string,
  datasourceId: string,
  language = mainLanguage
): Promise<AlertBannerApiResponse | null> => {
  if (!datasourceId) return null;

  try {
    const finalSubmitPath = addQueryStringParameters(url, {
      datasourceId,
      language,
    });
    const response = await fetch(finalSubmitPath);

    if (!response.ok) throw new Error(`Failed to fetch alert banner data: ${response.statusText}`);

    const data = await response.json();
    const dataItem = data?.data?.item;

    if (!dataItem) {
      console.warn('Alert banner data structure is invalid');
      return null;
    }

    const alertBanner = dataItem.alertBanner?.targetItem as AlertBannerFields;

    return {
      alert: alertBanner,
      isActive: Boolean(dataItem.overridePageSettings?.boolValue),
    };
  } catch (error) {
    console.error(
      'Error fetching alert banner data:',
      error instanceof Error ? error.message : error
    );
    return null;
  }
};

const DEFAULT_ALERT_CATEGORY = 'default';

const ALERT_CATEGORY_COLORS = {
  default: 'bg-surface border-l-4 border-content/20',
  warning: 'bg-red/10 border-l-4 border-red',
  information: 'bg-blue-400/10 border-l-4 border-blue-400',
};

type AlertCategoryType = 'warning' | 'information' | 'default';

type EditRenderingProps = {
  title: string;
  id: string;
};

export type AlertBannerFields = {
  id: string;
  heading: QueryField;
  body: QueryField;
  alertCategory?: Field<AlertCategoryType>;
};

export type AlertBannerComponentProps = ComponentProps & {
  datasourceId?: string;
  layoutData?: LayoutServiceData;
  storageKey?: string;
};

type AlertBannerProps = {
  fields: AlertBannerFields;
  className?: string;
  storageKey?: string;
};

type AlertBannerApiResponse = {
  alert: AlertBannerFields;
  isActive: boolean;
};
