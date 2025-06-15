import { useState, useRef } from 'react';
import { CustomerStoriesHero, ReviewsList, WriteReviewButton } from './components';

export const CustomerStoriesPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const reviewsListRef = useRef<{ refetch: () => void } | null>(null);

  const handleReviewSubmitted = () => {
    // Trigger refresh of the reviews list
    if (reviewsListRef.current?.refetch) {
      reviewsListRef.current.refetch();
    } else {
      // Fallback: trigger re-render
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return (
    <div>
      <CustomerStoriesHero />
      <WriteReviewButton onReviewSubmitted={handleReviewSubmitted} />
      <ReviewsList key={refreshTrigger} ref={reviewsListRef} />
    </div>
  );
};
