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
  Database,
  Upload,
  Users,
  LineChart,
  GitBranch,
  LogOut,
  Settings,
  LayoutDashboard,
  Briefcase,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const role = searchParams.get('role');
  const mode = searchParams.get('mode');
  const name = searchParams.get('name');
  const email = searchParams.get('email');

  const preservedSearchParams = new URLSearchParams();
  if (role) preservedSearchParams.set('role', role);
  if (mode) preservedSearchParams.set('mode', mode);
  if (name) preservedSearchParams.set('name', name);
  if (email) preservedSearchParams.set('email', email);
  const queryString = preservedSearchParams.toString();


  const menuItems = [
    { href: `/dashboard?${queryString}`, label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
    { href: `/dashboard/case-management?${queryString}`, label: 'LegalAI', icon: Briefcase, tooltip: 'LegalAI' },
    { href: `#`, label: 'Database Sources', icon: Database, tooltip: 'Database Sources' },
    { href: '#', label: 'Uploads', icon: Upload, tooltip: 'Uploads' },
    { href: '#', label: 'Users', icon: Users, tooltip: 'Users' },
    { href: '#', label: 'Analytics', icon: LineChart, tooltip: 'Analytics' },
    { href: '#', label: 'Logs', icon: GitBranch, tooltip: 'Logs' },
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
              isActive={pathname === item.href.split('?')[0]}
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

    