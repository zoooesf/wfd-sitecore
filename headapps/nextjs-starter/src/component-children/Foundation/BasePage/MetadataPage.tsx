import Head from 'next/head';
import { MetadataProps } from './Metadata';
import { CustomPageMetaFieldsType } from 'lib/types';
import {
  safeStripHtmlTags,
  groupSxaTagsByPrefix,
  formatGroupedTagsForMeta,
  normalizeDateTimeFieldValue,
} from 'lib/helpers';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { MetadataFeatureImages } from './MetadataFeatureImages';
import { decodeHTML } from 'entities';
import { PAGE_TITLE_SUFFIX } from 'lib/const';
import { mainLanguage } from 'lib/i18n/i18n-config';

export const MetadataPage: React.FC<MetadataProps> = ({ route }) => {
  const { heading, subheading, datePublished, lastUpdated, SxaTags, image, imageMobile } = (
    route as CustomPageMetaFieldsType
  )?.fields;
  const titleText = `${safeStripHtmlTags(heading?.value) || 'Page'}${PAGE_TITLE_SUFFIX}`;
  const groupedTags = groupSxaTagsByPrefix(SxaTags);
  const formattedTags = formatGroupedTagsForMeta(groupedTags);
  const keywords = Array.isArray(SxaTags)
    ? SxaTags.map((tag) => tag?.fields?.Title?.value).join(', ')
    : '';
  const subheadingText = decodeHTML(safeStripHtmlTags(subheading?.value));
  const datePublishedText = normalizeDateTimeFieldValue(datePublished?.value);
  const lastUpdatedText = normalizeDateTimeFieldValue(lastUpdated?.value);
  const templateId = (route as { templateId?: string })?.templateId ?? undefined;
  const desktopImageUrl = image?.value?.src || '';
  const desktopImageAlt = image?.value?.alt?.toString() || '';
  const mobileImageUrl = imageMobile?.value?.src || '';
  const mobileImageAlt = imageMobile?.value?.alt?.toString() || '';

  const { page } = useSitecore();
  const currentLocale = page?.locale || mainLanguage;
  const siteName = page?.siteName;

  return (
    <>
      <Head>
        <title>{titleText}</title>
        <meta name="description" content={subheadingText} />
        <meta name="tags" content={formattedTags} />
        <meta name="keywords" content={keywords} />
        <meta property="og:subheading" content={subheadingText} />
        {datePublishedText && <meta property="og:datePublished" content={datePublishedText} />}
        {lastUpdatedText && <meta property="og:lastUpdated" content={lastUpdatedText} />}
        <meta property="templateId" content={templateId} />
        <meta property="lang" content={currentLocale} />
        <meta property="site" content={siteName} />
      </Head>
      <MetadataFeatureImages
        desktopImageUrl={desktopImageUrl}
        desktopImageAlt={desktopImageAlt}
        mobileImageUrl={mobileImageUrl}
        mobileImageAlt={mobileImageAlt}
      />
    </>
  );
};
