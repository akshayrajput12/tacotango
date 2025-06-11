import { CustomerStoriesHero, ReviewsList, WriteReviewButton } from './components';

export const CustomerStoriesPage = () => {
  return (
    <div>
      <CustomerStoriesHero />
      <WriteReviewButton />
      <ReviewsList />
    </div>
  );
};
