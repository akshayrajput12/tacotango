import { useState, useEffect } from 'react';
import { Navigation, Footer } from './components';
import { Home } from './pages';
import { ReservationPage } from './pages/reservation';
import { GalleryPage } from './pages/gallery';
import { OurStoryPage } from './pages/our-story';
import { EventsPage } from './pages/events';
import { MenuPage } from './pages/menu';
import { CustomerStoriesPage } from './pages/customer-stories';
import { ContactPage } from './pages/contact';
import { FAQPage } from './pages/faq';
import { Admin, AuthProvider } from './admin';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Clean URL routing without hash
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;

      // Check if it's an admin route
      if (path.startsWith('/admin')) {
        setCurrentPage('admin');
        return;
      }

      // Route mapping for public pages
      const routes: { [key: string]: string } = {
        '/': 'home',
        '/reservation': 'reservation',
        '/gallery': 'gallery',
        '/our-story': 'our-story',
        '/events': 'events',
        '/menu': 'menu',
        '/customer-stories': 'customer-stories',
        '/contact': 'contact',
        '/faq': 'faq'
      };

      const page = routes[path];

      if (page) {
        setCurrentPage(page);
      } else {
        // Default to home for unknown routes and update URL
        setCurrentPage('home');
        window.history.replaceState(null, '', '/');
      }
    };

    // Handle browser back/forward buttons and initial load
    window.addEventListener('popstate', handleRouteChange);

    // Set initial page on component mount
    handleRouteChange();

    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'admin':
        return <Admin />;
      case 'reservation':
        return <ReservationPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'our-story':
        return <OurStoryPage />;
      case 'events':
        return <EventsPage />;
      case 'menu':
        return <MenuPage />;
      case 'customer-stories':
        return <CustomerStoriesPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FAQPage />;
      default:
        return <Home />;
    }
  };

  // Don't render Navigation and Footer for admin pages
  if (currentPage === 'admin') {
    return (
      <AuthProvider>
        {renderPage()}
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#FCFAF7' }}>
        <Navigation />
        {renderPage()}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
