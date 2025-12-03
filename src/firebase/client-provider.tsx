
'use client';

import { FirebaseProvider } from './provider';
import { useUser } from './use-user';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();

  return (
    <FirebaseProvider
      value={{
        user,
        isLoading,
      }}
    >
      {children}
    </FirebaseProvider>
  );
}
