import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  async function login(formData: FormData) {
    'use server';
    const role = 'advocate';
    const mode = 'fast';
    redirect(`/dashboard?role=${role}&mode=${mode}`);
  }

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-[#0A2540] to-[#1D4ED8] text-white p-8">
        <Logo
          iconClassName="size-20"
          textClassName="text-7xl"
        />
        <p className="text-lg text-center max-w-sm">
          A multilingual, India-focused AI assistant for legal research, case
          review, drafting, compliance, and education.
        </p>
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md shadow-2xl">
          <form action={login}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Welcome back to LegalAi</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email / Bar Council ID</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="advocate@example.com"
                  required
                  defaultValue="advocate@example.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required defaultValue="password" />
              </div>

            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Login
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">
                      {/* Placeholder for Aadhaar icon */}
                      <span className="mr-2">🇮🇳</span>
                      Aadhaar OTP
                  </Button>
                  <Button variant="outline">
                      {/* Placeholder for Google icon */}
                      <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 76.2C313.6 113.4 283.7 96 248 96c-88.8 0-160 71.3-160 160s71.2 160 160 160c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
                      Google
                  </Button>
              </div>

               <p className="text-center text-sm text-muted-foreground">
                New user?{' '}
                <Link href="#" className="font-semibold text-primary hover:underline">
                  Register as Advocate / Student / Public
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
