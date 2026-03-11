import Head from 'next/head';

type MetadataFeatureImagesProps = {
  desktopImageUrl?: string;
  desktopImageAlt?: string;
  mobileImageUrl?: string;
  mobileImageAlt?: string;
};

export const MetadataFeatureImages: React.FC<MetadataFeatureImagesProps> = ({
  desktopImageUrl,
  desktopImageAlt,
  mobileImageUrl,
  mobileImageAlt,
}) => {
  return (
    <Head>
      {desktopImageUrl && <meta property="featuredImage" content={desktopImageUrl} />}
      {desktopImageAlt && <meta property="featuredImageAlt" content={desktopImageAlt} />}
      {mobileImageUrl && <meta property="mobileImage" content={mobileImageUrl} />}
      {mobileImageAlt && <meta property="mobileImageAlt" content={mobileImageAlt} />}
    </Head>
  );
};
