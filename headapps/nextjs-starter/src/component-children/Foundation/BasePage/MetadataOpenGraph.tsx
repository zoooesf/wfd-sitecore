import { MetadataProps } from './Metadata';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getFieldValue, safeStripHtmlTags } from 'lib/helpers';
import { CustomPageMetaFieldsType } from 'lib/types';
import { decodeHTML } from 'entities';

const MetadataOpenGraph: React.FC<MetadataProps> = ({ route }) => {
  const router = useRouter();

  if (router == null) return null;
  const {
    heading,
    subheading,
    OpenGraphTitle,
    OpenGraphDescription,
    OpenGraphType,
    OpenGraphSiteName,
    OpenGraphAdmins,
    OpenGraphAppId,
    OpenGraphImageUrl,
  } = (route as CustomPageMetaFieldsType)?.fields;

  const ogType = OpenGraphType?.value ?? '';
  const ogSiteName = OpenGraphSiteName?.value ?? '';
  const ogAdmins = OpenGraphAdmins?.value ?? '';
  const ogAppId = OpenGraphAppId?.value ?? '';
  const ogImage = OpenGraphImageUrl?.value?.src ?? '';

  return (
    <Head>
      <meta
        property="og:title"
        content={safeStripHtmlTags(getFieldValue(OpenGraphTitle, heading))}
      />
      <meta
        property="og:description"
        content={decodeHTML(safeStripHtmlTags(getFieldValue(OpenGraphDescription, subheading)))}
      />
      <meta property="og:type" content={ogType} />
      <meta property="og:sitename" content={ogSiteName} />
      <meta property="og:admins" content={ogAdmins} />
      <meta property="og:appid" content={ogAppId} />
      <meta property="og:image" content={ogImage} />
    </Head>
  );
};

export default MetadataOpenGraph;
