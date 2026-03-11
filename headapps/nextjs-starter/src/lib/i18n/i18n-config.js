// Available locales for the application
// This should match the locales supported in Sitecore
const defaultLocale = 'default';
const mainLanguage = 'en';
// Make sure to import the moment locales in the helpers/time-date-helper.ts file if you add a new locales here
const applicationLocales = [defaultLocale, mainLanguage, 'fr-CA'];
const availableLanguages = applicationLocales.filter((language) => language !== defaultLocale);

module.exports = {
  defaultLocale,
  mainLanguage,
  applicationLocales,
  availableLanguages,
};
