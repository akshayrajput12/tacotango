import { Hero, MenuHighlights, UpcomingEvents, InstagramFeed, BookTableSection, AboutUs, FAQ } from './components';
import { Gallery } from '../../components';
import { CustomerReviews } from '../../components/CustomerReviews';
import { goToGallery, goToReservation, goToOurStory, goToFAQ } from '../../utils/navigation';

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
    goToFAQ();
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
      <CustomerReviews />
      <BookTableSection onBookTable={handleBookTable} />
      <AboutUs onLearnMore={handleLearnMore} />
      <FAQ onViewFAQs={handleViewFAQs} />

    </div>
  );
};
