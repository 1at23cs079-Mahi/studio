'use client';
import { useState, type ReactNode } from 'react';
import {
  SidebarProvider
} from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader, type ModelId } from '@/components/dashboard/header';
import CaseManagementPage from './case-management/page';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [selectedLlm, setSelectedLlm] = useState<ModelId>('googleai/gemini-2.5-flash');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <div className="flex flex-col flex-1">
          <DashboardHeader selectedLlm={selectedLlm} setSelectedLlm={setSelectedLlm} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
