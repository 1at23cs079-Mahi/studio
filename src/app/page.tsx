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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  async function login(formData: FormData) {
    'use server';
    const role = formData.get('role') || 'public';
    const mode = formData.get('mode') || 'fast';
    redirect(`/dashboard?role=${role}&mode=${mode}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Logo
          iconClassName="text-primary size-12"
          textClassName="text-primary text-5xl"
        />
        <p className="text-muted-foreground max-w-md text-center">
          A multilingual, India-focused AI assistant for legal research, case
          review, drafting, compliance, and education.
        </p>
      </div>

      <Card className="w-full max-w-md shadow-2xl">
        <form action={login}>
          <CardHeader>
            <CardTitle className="font-headline">Welcome Back</CardTitle>
            <CardDescription>
              Select your role to tailor your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required defaultValue="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Select name="role" defaultValue="advocate">
                <SelectTrigger id="role" aria-label="Select role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advocate">Advocate</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="court-admin" disabled>
                    Court Admin
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search Mode</Label>
              <RadioGroup
                defaultValue="fast"
                name="mode"
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fast" id="fast" />
                  <Label htmlFor="fast" className="font-normal">
                    Fast Q&amp;A
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="precise" id="precise" />
                  <Label htmlFor="precise" className="font-normal">
                    Precise Drafting
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="text-xs text-muted-foreground mt-8 text-center max-w-md">
        ⚖ LegalAi Disclaimer: This is not legal advice. Please consult a licensed advocate for legal decisions.
      </p>
    </main>
  );
}
