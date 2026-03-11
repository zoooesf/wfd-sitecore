/**
 * Function used to scroll back to the top, with a smooth animation
 */

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
