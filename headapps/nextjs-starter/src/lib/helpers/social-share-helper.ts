export const SHARE_WINDOW_SPECS =
  'left=0,top=0,width=650,height=420,personalbar=0,toolbar=0,scrollbars=0,resizable=0';

export const shareUrls = {
  facebook: (url: string) => `http://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (url: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  linkedin: (url: string) =>
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`,
  email: (url: string) => {
    const subject = 'Check out this article post!';
    const body = `I found this article post and thought you might be interested in it: ${url}`;
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  },
};

export const shareTo = (social: keyof typeof shareUrls, url: string): void => {
  if (social === 'email') {
    window.open(shareUrls[social](url));
    return;
  }
  window.open(shareUrls[social](url), '', SHARE_WINDOW_SPECS);
};
