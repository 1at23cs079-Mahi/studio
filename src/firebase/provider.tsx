
'use client';

import {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { User } from './index';

export type AuthContextValue = {
  user: User;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
  value: AuthContextValue;
};

export function FirebaseProvider({ children, value }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within an AuthProvider');
  }
  return context;
};

export const useAuth = () => useFirebase();
