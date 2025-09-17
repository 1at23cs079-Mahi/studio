import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Briefcase, BookOpen, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RoleCardProps {
  role: 'advocate' | 'student' | 'public';
  title: string;
  description: string;
  icon: React.ElementType;
}

export default function LoginPage() {

  async function loginWithRole(formData: FormData) {
    'use server';
    const role = formData.get('role') as string;
    const name = role.charAt(0).toUpperCase() + role.slice(1);
    const email = `${role}@example.com`;

    if (role) {
      redirect(
        `/dashboard?role=${role}&name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(email)}`
      );
    }
  }

  const RoleCard = ({ role, title, description, icon: Icon }: RoleCardProps) => (
    <form action={loginWithRole}>
      <input type="hidden" name="role" value={role} />
      <button type="submit" className="w-full h-full text-left">
        <Card className="hover:border-primary hover:bg-muted/30 transition-all duration-200 ease-in-out h-full shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          <CardHeader className="flex-row items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-xl">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{description}</p>
            <div className="flex items-center text-primary font-semibold">
              <span>Continue as {title}</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </button>
    </form>
  );

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-primary/10">
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <Logo iconClassName="size-16 text-primary mx-auto" textClassName="text-6xl" />
          <p className="mt-4 text-2xl font-headline">
            Welcome to Your AI-Powered Legal Assistant
          </p>
          <p className="mt-2 text-lg text-muted-foreground">
            Please select your role to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoleCard 
                role="advocate"
                title="Advocate"
                description="Access powerful tools for case management, legal research, and document drafting."
                icon={Briefcase}
            />
            <RoleCard 
                role="student"
                title="Law Student"
                description="Your study partner for legal research, case summarization, and exam preparation."
                icon={BookOpen}
            />
            <RoleCard 
                role="public"
                title="Public User"
                description="Understand your rights, get information on legal procedures, and ask legal questions."
                icon={Users}
            />
        </div>
        
        <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
                By continuing, you agree to our <Link href="#" className="underline hover:text-primary">Terms of Service</Link> and <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>.
            </p>
        </div>
      </div>
    </main>
  );
}
