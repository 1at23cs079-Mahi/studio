'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons/logo';
import { Github, Chrome, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);

  const handleSuccessfulLogin = async (userData: { name: string; email: string; role: string }) => {
    toast({
      title: 'Login Successful',
      description: 'Welcome back!',
    });

    if (userData.role === 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    const queryParams = new URLSearchParams({
        name: userData.name,
        role: userData.role,
        email: userData.email,
    });

    router.push(`/dashboard?${queryParams.toString()}`);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // --- DEMO MODE ---
    if (password === 'password') {
        let demoUser: { name: string; role: string; email: string } | null = null;
        if (email === 'admin@legalai.com') {
            demoUser = { name: 'Demo Admin', role: 'admin', email: 'admin@legalai.com' };
        } else if (email === 'advocate@legalai.com') {
            demoUser = { name: 'Demo Advocate', role: 'advocate', email: 'advocate@legalai.com' };
        } else if (email === 'student@legalai.com') {
            demoUser = { name: 'Demo Student', role: 'student', email: 'student@legalai.com' };
        } else if (email === 'public@legalai.com') {
            demoUser = { name: 'Demo User', role: 'public', email: 'public@legalai.com' };
        }

        if (demoUser) {
            await handleSuccessfulLogin(demoUser);
            setIsLoading(false);
            return;
        }
    }
    // --- END DEMO MODE ---

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      await handleSuccessfulLogin(data.user);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    toast({
      variant: 'destructive',
      title: 'Coming Soon',
      description: `${provider === 'google' ? 'Google' : 'GitHub'} login will be available soon.`,
    });
    setSocialLoading(null);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email address to reset your password.',
      });
      return;
    }
    toast({
      title: 'Coming Soon',
      description: 'Password reset functionality will be available soon.',
    });
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-primary/10">
      <Card className="mx-auto max-w-sm w-full animate-fade-in shadow-2xl">
        <CardHeader className="text-left">
          <Logo iconClassName="size-12 text-primary" textClassName="text-4xl" className="justify-start" />
          <CardTitle className="text-2xl font-headline mt-4">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || !!socialLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="ml-auto inline-block text-sm underline"
                    disabled={isLoading || !!socialLoading}
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || !!socialLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                <Label htmlFor="remember-me">Remember me</Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !!socialLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : 'Sign In'}
              </Button>
            </form>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={isLoading || !!socialLoading}>
                    {socialLoading === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />}
                     Google
                </Button>
                <Button variant="outline" onClick={() => handleSocialLogin('github')} disabled={isLoading || !!socialLoading}>
                    {socialLoading === 'github' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Github className="mr-2 h-4 w-4" />}
                     GitHub
                </Button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
