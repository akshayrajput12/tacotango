import { Hero, MenuHighlights, UpcomingEvents, InstagramFeed, BookTableSection, AboutUs, FAQ } from './components';
import { Gallery } from '../../components';
import { goToGallery, goToReservation, goToOurStory } from '../../utils/navigation';

export const Home = () => {
  const handleViewAllGallery = () => {
    goToGallery();
  };

  const handleBookTable = () => {
    goToReservation();
  };

  const handleLearnMore = () => {
    goToOurStory();
  };

  const handleViewFAQs = () => {
    // Navigate to FAQ page or show more info
    console.log('View FAQs clicked');
    // You can implement navigation to an FAQ page here
    // navigateTo('/faq');
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
