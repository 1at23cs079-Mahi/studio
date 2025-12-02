
'use client';

import { Translation } from '@/components/dashboard/translation';
import type { ModelId } from '@/components/dashboard/header';

export default function TranslationPage({ selectedLlm }: { selectedLlm: ModelId }) {
  return (
    <div className="h-full">
      <Translation />
    </div>
  );
}
