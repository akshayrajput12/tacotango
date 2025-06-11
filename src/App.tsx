import { useState, useEffect } from 'react';
import { Navigation, Footer } from './components';
import { Home } from './pages';
import { ReservationPage } from './pages/reservation';
import { GalleryPage } from './pages/gallery';
import { OurStoryPage } from './pages/our-story';
import { EventsPage } from './pages/events';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Clean URL routing without hash
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;

      // Route mapping
      const routes: { [key: string]: string } = {
        '/': 'home',
        '/reservation': 'reservation',
        '/gallery': 'gallery',
        '/our-story': 'our-story',
        '/events': 'events'
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
      case 'reservation':
        return <ReservationPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'our-story':
        return <OurStoryPage />;
      case 'events':
        return <EventsPage />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFAF7' }}>
      <Navigation />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;
