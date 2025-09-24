'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';

export default function RegistrationDisabledPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-primary/10">
      <Card className="mx-auto max-w-sm w-full animate-fade-in shadow-2xl">
        <CardHeader className="text-center">
          <Logo iconClassName="size-12 text-primary mx-auto" textClassName="text-4xl" />
          <CardTitle className="text-2xl font-headline mt-4">Registration Disabled</CardTitle>
          <CardDescription>
            New user accounts must be created by an administrator.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-center text-muted-foreground">
                If you need an account, please contact a system administrator.
            </p>
            <Button asChild className="w-full">
                <Link href="/login">
                  Return to Login
                </Link>
            </Button>
        </CardContent>
      </Card>
    </main>
  );
}
