
'use client';

import {
  Sidebar,
  SidebarBody,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Settings,
  LogOut,
  MessageSquare,
  Plus,
  FileText,
  Home,
  BookOpen,
  Gavel,
  Mic,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { ScrollArea } from '../ui/scroll-area';

const conversations = [
    { id: '1', title: 'Anticipatory Bail under 438' },
    { id: '2', title: 'Civil Suit for Recovery' },
    { id: '3', title: 'Drafting a Lease Agreement' },
    { id: '4', title: 'PIL for Environmental Issue' },
    { id: '5', title: 'Consumer Complaint about Defective Product' },
    { id: '6', title: 'Landmark Judgements on Article 21' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { auth } = useFirebase();

  const role = searchParams.get('role');
  const name = searchParams.get('name');
  const email = searchParams.get('email');

  const preservedSearchParams = new URLSearchParams();
  if (role) preservedSearchParams.set('role', role);
  if (name) preservedSearchParams.set('name', name);
  if (email) preservedSearchParams.set('email', email);
  const queryString = preservedSearchParams.toString();
  
  const handleLogout = async () => {
    if (!auth) return;
    try {
      await auth.signOut();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message,
      });
    }
  };


  return (
    <Sidebar collapsible="icon" className="group-data-[variant=inset]:bg-transparent">
      <SidebarHeader>
        <Logo iconClassName="text-sidebar-primary" />
      </SidebarHeader>
      <SidebarBody className="flex-1 overflow-hidden">
        <div className="p-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton 
                        asChild
                        isActive={pathname === '/dashboard'}
                        tooltip={{ children: 'Dashboard', side: 'right' }}
                    >
                        <Link href={`/dashboard?${queryString}`}>
                            <Home />
                            <span>Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton 
                        asChild
                        isActive={pathname === '/dashboard/legal-terminology'}
                        tooltip={{ children: 'Legal Terminology', side: 'right' }}
                    >
                        <Link href={`/dashboard/legal-terminology?${queryString}`}>
                            <BookOpen />
                            <span>Legal Terminology</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === '/dashboard/document-review'}
                        tooltip={{ children: 'Document Review', side: 'right' }}
                    >
                        <Link href={`/dashboard/document-review?${queryString}`}>
                            <FileText />
                            <span>Document Review</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === '/dashboard/transcription'}
                        tooltip={{ children: 'Audio Transcription', side: 'right' }}
                    >
                        <Link href={`/dashboard/transcription?${queryString}`}>
                            <Mic />
                            <span>Audio Transcription</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === '/dashboard/search'}
                        tooltip={{ children: 'Case Law Search', side: 'right' }}
                    >
                        <Link href={`/dashboard/search?${queryString}`}>
                            <Gavel />
                            <span>Case Law Search</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </div>
        <SidebarSeparator />
         <div className="flex items-center justify-between p-2">
            <p className="text-sm font-medium text-muted-foreground px-2 group-data-[collapsible=icon]:hidden">
                Chats
            </p>
             <SidebarMenuButton size="icon" variant="ghost" className="h-8 w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                <Plus className="h-4 w-4" />
            </SidebarMenuButton>
        </div>
        <ScrollArea className="flex-1 px-2">
            <SidebarMenu>
                {conversations.map(convo => (
                     <SidebarMenuItem key={convo.id}>
                        <SidebarMenuButton 
                             asChild
                             isActive={pathname.startsWith(`/dashboard/case-management`)} // will be `/chat/${convo.id}`
                             tooltip={{ children: convo.title, side: 'right' }}
                        >
                            <Link href={`/dashboard/case-management?${queryString}`}>
                                <MessageSquare />
                                <span>{convo.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </ScrollArea>

      </SidebarBody>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: 'Settings', side: 'right' }}>
                    <Link href="#">
                        <Settings />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{ children: 'Log out', side: 'right' }}>
                    <LogOut />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
