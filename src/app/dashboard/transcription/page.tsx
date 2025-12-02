
'use client';

import { Transcription } from '@/components/dashboard/transcription';
import type { ModelId } from '@/components/dashboard/header';

export default function TranscriptionPage({ selectedLlm }: { selectedLlm: ModelId }) {
  return (
    <div className="h-full">
      <Transcription />
    </div>
  );
}
