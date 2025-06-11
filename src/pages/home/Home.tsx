import { Hero, MenuHighlights, UpcomingEvents, InstagramFeed, BookTableSection, AboutUs, FAQ } from './components';
import { Gallery } from '../../components';

export const Home = () => {
  const handleViewAllGallery = () => {
    window.location.hash = 'gallery';
  };

  const handleBookTable = () => {
    window.location.hash = 'reservation';
  };

  const handleLearnMore = () => {
    // Navigate to about page or show more info
    console.log('Learn more about us clicked');
    // You can implement navigation to an about page here
    // window.location.hash = 'about';
  };

  const handleViewFAQs = () => {
    // Navigate to FAQ page or show more info
    console.log('View FAQs clicked');
    // You can implement navigation to an FAQ page here
    // window.location.hash = 'faq';
  };

  return (
    <div>
      <Hero />
      <MenuHighlights />
      <UpcomingEvents />
      <Gallery
        showTitle={true}
        maxImages={10}
        showViewAll={true}
        onViewAll={handleViewAllGallery}
      />
      <InstagramFeed />
      <BookTableSection onBookTable={handleBookTable} />
      <AboutUs onLearnMore={handleLearnMore} />
      <FAQ onViewFAQs={handleViewFAQs} />
      
    </div>
  );
};
