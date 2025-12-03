
'use client';

import { useEffect, useState, useMemo } from 'react';
import { User, subscribeToAuth, getCurrentUser } from './index';

export function useUser() {
  const [user, setUser] = useState<User>(getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth status on mount
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
        setIsLoading(false);
      })
      .catch(() => {
        setUser(null);
        setIsLoading(false);
      });

    // Subscribe to auth changes
    const unsubscribe = subscribeToAuth((newUser) => {
      setUser(newUser);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(() => ({ user, isLoading }), [user, isLoading]);

  return value;
}
