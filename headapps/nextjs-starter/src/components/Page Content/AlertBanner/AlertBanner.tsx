import { useState, useRef, useEffect } from 'react';
import {
  GetComponentServerProps,
  useSitecore,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import {
  fetchAlertBannerData,
  AlertBanner,
  AlertBannerEditRendering,
} from 'component-children/Page Content/AlertBanner/AlertBanner';
import {
  AlertBannerFields,
  AlertBannerComponentProps,
} from 'component-children/Page Content/AlertBanner/AlertBanner';

const ALERT_BANNER_API = `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/v1/alert-banner`;

const AlertBannerDefault: React.FC<AlertBannerComponentProps> = (props) => {
  return (
    <Frame params={props.params}>
      <AlertBannerContent {...props} />
    </Frame>
  );
};

const AlertBannerContent: React.FC<AlertBannerComponentProps> = ({ datasourceId }) => {
  const { page } = useSitecore();
  const [bannerData, setBannerData] = useState<AlertBannerFields | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const shouldSkipFetch =
      page?.mode.isEditing || typeof window === 'undefined' || !datasourceId || initialized.current;

    if (shouldSkipFetch) return;

    initialized.current = true;

    void fetchAlertBannerData(ALERT_BANNER_API, datasourceId, page?.locale).then((data) => {
      if (data) {
        setBannerData(data.alert);
      }
    });
  }, [datasourceId, page?.mode.isEditing, page?.locale]);

  if (page?.mode.isEditing) {
    return <AlertBannerEditRendering id="alert-banner-id" title="Alert Banner" />;
  }
  if (!bannerData) return null;

  return (
    <div data-component="AlertBanner" className="relative w-full">
      <AlertBanner fields={bannerData} storageKey={`alert-banner-${bannerData.id}`} />
    </div>
  );
};

export const getComponentServerProps: GetComponentServerProps = async () => {
  const alertBannerFolderId = process.env.ALERT_BANNER_FOLDER_ID;

  return {
    datasourceId: alertBannerFolderId || null,
  };
};

export const Default = withDatasourceCheck()<AlertBannerComponentProps>(AlertBannerDefault);
