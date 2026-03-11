import type { Metadata } from 'next';
import { Suspense } from 'react'; // Import Suspense

import { LeaveAReview } from './LeaveAReview';
// Removed import for {components} as it's not safe to use in server-rendered fallback directly

export const metadata: Metadata = {
  title: 'Leave a Review',
  description: 'Leave a review for a product.',
};

// A very simple fallback component compatible with server rendering
const SimpleLoadingFallback = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      {/* Basic header structure without client-side dependencies */}
      <div style={{ width: '100%', textAlign: 'center', padding: '10px 0', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
        <h1>Leave a review</h1>
      </div>
      <p>Loading review form...</p>
      {/* You could add a simple SVG spinner here if needed, directly embedded or imported if it's pure SVG */}
    </div>
  );
};

export default function LeaveAReviewPage() {
  return (
    <Suspense fallback={<SimpleLoadingFallback />}>
      <LeaveAReview />
    </Suspense>
  );
}
