import Head from 'next/head';
import { ProfileGQL } from 'lib/types';
import { removeAccents, safeStripHtmlTags } from 'lib/helpers';
import { decodeHTML } from 'entities';
import { NON_ALPHABETIC_INITIAL } from 'lib/const/search-const';

export const PersonMetadata: React.FC<{ profileData: ProfileGQL }> = ({ profileData }) => {
  const firstName = profileData?.firstName?.value.trim();
  const lastName = profileData?.lastName?.value.trim();
  const fullName = `${firstName} ${lastName}`.trim();
  const lastNameInitial = lastName
    ? (() => {
        const initial = removeAccents(lastName.charAt(0)).toLocaleUpperCase();
        return /^[A-Z]$/i.test(initial) ? initial : NON_ALPHABETIC_INITIAL;
      })()
    : NON_ALPHABETIC_INITIAL;
  const email = profileData?.email?.value;
  const phone = profileData?.phone?.value;
  const role = profileData?.role?.value;
  const description = decodeHTML(safeStripHtmlTags(profileData?.description?.value));
  const desktopImage = profileData?.image?.jsonValue?.value?.src;
  const desktopImageAlt = profileData?.image?.jsonValue?.value?.alt;
  const mobileImage = profileData?.imageMobile?.jsonValue?.value?.src;
  const mobileImageAlt = profileData?.imageMobile?.jsonValue?.value?.alt;
  const expertise = profileData?.expertise?.jsonValue
    ?.map((item) => item.fields?.Title?.value)
    .join(', ');
  const location = profileData?.location?.jsonValue
    .map((item) => item.fields?.contentName?.value)
    .join(', ');
  const company = profileData?.company?.value.trim();
  const website = profileData?.website?.jsonValue?.value?.href;
  const linkedInLink = profileData?.linkedInLink?.jsonValue?.value?.href;

  return (
    <Head>
      {fullName && (
        <>
          <meta property="profile:fullName" content={fullName} />
          <meta property="profile:profiles" content={fullName} />
        </>
      )}
      {lastName && <meta property="profile:lastName" content={lastName} />}
      {lastNameInitial && <meta property="profile:lastNameInitial" content={lastNameInitial} />}
      {role && <meta property="profile:role" content={role} />}
      {email && <meta property="profile:email" content={email} />}
      {phone && <meta property="profile:phone" content={phone} />}
      {description && <meta property="profile:description" content={description} />}
      {expertise && <meta property="profile:expertise" content={expertise} />}
      {company && <meta property="profile:company" content={company} />}
      {location && <meta property="profile:location" content={location} />}
      {website && <meta property="profile:website" content={website} />}
      {linkedInLink && <meta property="profile:linkedInLink" content={linkedInLink} />}
      {desktopImage && <meta property="profile:desktopPortrait" content={desktopImage} />}
      {desktopImageAlt && <meta property="profile:desktopPortraitAlt" content={desktopImageAlt} />}
      {mobileImage && <meta property="profile:mobilePortrait" content={mobileImage} />}
      {mobileImageAlt && <meta property="profile:mobilePortraitAlt" content={mobileImageAlt} />}
    </Head>
  );
};
