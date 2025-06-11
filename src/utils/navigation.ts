// Navigation utility for clean URL routing
export const navigateTo = (path: string) => {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  // Scroll to top when navigating to a new page
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Navigation routes
export const routes = {
  home: '/',
  reservation: '/reservation',
  gallery: '/gallery',
  ourStory: '/our-story',
  events: '/events',
  menu: '/menu',
  faq: '/faq'
} as const;

// Helper functions for common navigation actions
export const goHome = () => navigateTo(routes.home);
export const goToReservation = () => navigateTo(routes.reservation);
export const goToGallery = () => navigateTo(routes.gallery);
export const goToOurStory = () => navigateTo(routes.ourStory);
export const goToEvents = () => navigateTo(routes.events);
export const goToMenu = () => navigateTo(routes.menu);
export const goToFAQ = () => navigateTo(routes.faq);
