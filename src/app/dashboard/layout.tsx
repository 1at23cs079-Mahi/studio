import type { ReactNode } from 'react';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
            <DashboardHeader />
            <main className="flex-1 p-4 md:p-8">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
