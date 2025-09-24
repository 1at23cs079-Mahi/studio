'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from '@/app/layout';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '../icons/logo';
import { Sun, Moon, User, LogOut, LifeBuoy, Bot, Maximize, Minimize2 } from 'lucide-react';
import type { ModelReference } from 'genkit/model';

export type ModelId = ModelReference;

const llms: { id: ModelId; name: string }[] = [
    { id: 'googleai/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'googleai/gemini-pro', name: 'Gemini Pro' },
];

export function DashboardHeader({ selectedLlm, setSelectedLlm }: { selectedLlm: ModelId, setSelectedLlm: (id: ModelId) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const role = searchParams.get('role') || 'public';
  const name = searchParams.get('name') || 'User';
  const email = searchParams.get('email') || 'user@example.com';
  const initial = name ? name[0].toUpperCase() : 'U';

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  
  const handleLogout = async () => {
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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-2 md:hidden">
        <Logo iconClassName="text-primary" />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                    {llms.find(llm => llm.id === selectedLlm)?.name}
                    <Bot className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]">
                <DropdownMenuLabel>Select LLM</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={selectedLlm as string} onValueChange={(v) => setSelectedLlm(v as ModelId)}>
                    {llms.map(llm => (
                        <DropdownMenuRadioItem key={llm.id as string} value={llm.id as string}>{llm.name}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon"><Minimize2 className="h-4 w-4"/></Button>
        <Button variant="ghost" size="icon"><Maximize className="h-4 w-4"/></Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border-2 border-primary/50">
                <AvatarImage
                  src={`https://picsum.photos/seed/${email}/40/40`}
                  alt={name}
                  data-ai-hint="professional headshot"
                />
                <AvatarFallback className="bg-primary/20 text-primary">{initial}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {email}
                </p>
                <p className="text-xs leading-none text-muted-foreground pt-1">
                  {capitalize(role)}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
             <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                    </DropdownMenuItem>
                </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
