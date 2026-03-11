import Head from 'next/head';
import { MetadataProps } from './Metadata';
import { CustomPageMetaFieldsType } from 'lib/types';
import { getFieldValue, safeStripHtmlTags } from 'lib/helpers';
import { decodeHTML } from 'entities';

const MetadataTwitter: React.FC<MetadataProps> = ({ route }) => {
  if (route == null) return null;
  const {
    heading,
    subheading,
    TwitterTitle,
    TwitterSite,
    TwitterDescription,
    TwitterCardType,
    TwitterImage,
  } = (route as CustomPageMetaFieldsType)?.fields;

  const twitterDescSelected = decodeHTML(
    safeStripHtmlTags(getFieldValue(TwitterDescription, subheading))
  );
  const twitterTitleSelected = safeStripHtmlTags(getFieldValue(TwitterTitle, heading));
  const twitterSite = TwitterSite?.value ?? '';
  const twitterCardType = TwitterCardType?.fields?.Value?.value ?? '';
  const twitterImage = TwitterImage?.value?.src ?? '';

  return (
    <Head>
      <meta property="twitter:description" content={twitterDescSelected} />
      <meta property="twitter:title" content={twitterTitleSelected} />
      <meta property="twitter:site" content={twitterSite} />
      <meta property="twitter:card" content={twitterCardType} />
      <meta property="twitter:image" content={twitterImage} />
    </Head>
  );
};

export default MetadataTwitter;
