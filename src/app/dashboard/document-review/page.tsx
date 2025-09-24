
'use client';

import { DocumentReview } from '@/components/dashboard/document-review';
import type { ModelId } from '@/components/dashboard/header';

export default function DocumentReviewPage({ selectedLlm }: { selectedLlm: ModelId }) {
  return (
    <div className="h-full">
      <DocumentReview />
    </div>
  );
}
