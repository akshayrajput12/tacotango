import { useState, useEffect } from 'react';
import { Navigation, Footer } from './components';
import { Home } from './pages';
import { ReservationPage } from './pages/reservation';
import { GalleryPage } from './pages/gallery';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Simple routing based on URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Set initial page

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'reservation':
        return <ReservationPage />;
      case 'gallery':
        return <GalleryPage />;
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
