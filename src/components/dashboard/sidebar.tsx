'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Search,
  FileUp,
  Briefcase,
  ShieldCheck,
  LogOut,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const role = searchParams.get('role');
  const mode = searchParams.get('mode');

  const preservedSearchParams = new URLSearchParams();
  if (role) preservedSearchParams.set('role', role);
  if (mode) preservedSearchParams.set('mode', mode);
  const queryString = preservedSearchParams.toString();


  const menuItems = [
    { href: `/dashboard?${queryString}`, label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
    { href: `#`, label: 'Search Judgments', icon: Search, tooltip: 'Search Judgments' },
    { href: '#', label: 'Upload Document', icon: FileUp, tooltip: 'Upload & Analyze' },
    { href: '#', label: 'My Cases', icon: Briefcase, tooltip: 'My Cases' },
    { href: '#', label: 'Compliance Audit', icon: ShieldCheck, tooltip: 'Compliance Audit' },
  ];

  return (
    <Sidebar collapsible="icon" className="group-data-[variant=inset]:bg-transparent">
      <SidebarHeader>
        <Logo iconClassName="text-sidebar-primary" />
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href.split('?')[0] && item.label === 'Dashboard'}
              tooltip={{ children: item.tooltip, side: 'right' }}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
         <SidebarMenuButton asChild tooltip={{ children: 'Settings', side: 'right' }}>
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
         </SidebarMenuButton>
         <SidebarMenuButton asChild tooltip={{ children: 'Log out', side: 'right' }}>
              <Link href="/">
                <LogOut />
                <span>Log Out</span>
              </Link>
         </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
