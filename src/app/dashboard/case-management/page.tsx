'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { AssistantChat } from '@/components/dashboard/assistant-chat';
import { DocumentReview } from '@/components/dashboard/document-review';
import { Separator } from '@/components/ui/separator';

export default function CaseManagementPage() {
  return (
    <div className="h-[calc(100vh_-_8rem)]">
      <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
        <ResizablePanel defaultSize={50} minSize={30}>
            <DocumentReview />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
            <div className="flex flex-col h-full">
                <AssistantChat />
            </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
