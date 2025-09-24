'use client';

import { AssistantChat } from '@/components/dashboard/assistant-chat';
import type { ModelId } from '@/components/dashboard/header';

export default function CaseManagementPage({ selectedLlm }: { selectedLlm: ModelId }) {
  return (
    <div className="h-[calc(100vh_-_5rem)] w-full">
      <AssistantChat selectedLlm={selectedLlm} />
    </div>
  );
}
