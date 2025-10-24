
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
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, db } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);

  const handleSuccessfulLogin = async (user: User) => {
    if (!db) {
        toast({
            variant: 'destructive',
            title: 'Database Error',
            description: 'Could not connect to the database.',
        });
        return;
    }
    let name = user.displayName || 'User';
    let role = 'public'; // default

    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          name = userData.name;
          role = userData.role;
        }
    } catch (e) {
        console.error("Error fetching user data from Firestore:", e);
        toast({
            variant: 'destructive',
            title: 'Profile Error',
            description: 'Could not fetch user profile. Using default values.',
        });
    }
    
    toast({
      title: 'Login Successful',
      description: 'Welcome back!',
    });

    if (role === 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    const queryParams = new URLSearchParams({
        name,
        role,
        email: user.email!,
    });

    router.push(`/dashboard?${queryParams.toString()}`);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'Could not connect to authentication service.',
        });
        setIsLoading(false);
        return;
    }

    // --- DEMO MODE ---
    if (password === 'password') {
        let demoUser: { name: string; role: string; email: string; uid?: string } | null = null;
        if (email === 'admin@legalai.com') {
            demoUser = { uid: 'demo-admin', name: 'Demo Admin', role: 'admin', email: 'admin@legalai.com' };
        } else if (email === 'advocate@legalai.com') {
            demoUser = { uid: 'demo-advocate', name: 'Demo Advocate', role: 'advocate', email: 'advocate@legalai.com' };
        } else if (email === 'student@legalai.com') {
            demoUser = { uid: 'demo-student', name: 'Demo Student', role: 'student', email: 'student@legalai.com' };
        } else if (email === 'public@legalai.com') {
            demoUser = { uid: 'demo-public', name: 'Demo User', role: 'public', email: 'public@legalai.com' };
        }

        if (demoUser) {
            await handleSuccessfulLogin(demoUser as User);
            setIsLoading(false);
            return;
        }
    }
    // --- END DEMO MODE ---

    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleSuccessfulLogin(userCredential.user);
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
    if (!auth || !db) {
         toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'Could not connect to authentication service.',
        });
        setSocialLoading(null);
        return;
    }

    const authProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      const result = await signInWithPopup(auth, authProvider);
      // For social logins, we create the Firestore doc if it's the first time
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            uid: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
            role: 'public', // Default role for social sign-ups
            createdAt: new Date().toISOString(),
        });
      }
      await handleSuccessfulLogin(result.user);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Social Login Failed',
        description: error.message,
      });
    } finally {
      setSocialLoading(null);
    }
  };


  const handleForgotPassword = async () => {
    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'Could not connect to authentication service.',
        });
        return;
    }
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email address to reset your password.',
      });
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for instructions to reset your password.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
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
