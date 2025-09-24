
'use client';

import { LegalTerminology } from '@/components/dashboard/legal-terminology';
import type { ModelId } from '@/components/dashboard/header';

export default function LegalTerminologyPage({ selectedLlm }: { selectedLlm: ModelId }) {
  return (
    <div className="h-full">
      <LegalTerminology />
    </div>
  );
}
