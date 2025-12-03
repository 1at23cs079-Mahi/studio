
'use client';

import { useState, useEffect } from 'react';

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
} | null;

export type AuthServices = {
  user: User;
  isLoading: boolean;
};

let currentUser: User = null;
let authListeners: Array<(user: User) => void> = [];

export function setCurrentUser(user: User) {
  currentUser = user;
  authListeners.forEach((listener) => listener(user));
}

export function getCurrentUser(): User {
  return currentUser;
}

export function subscribeToAuth(callback: (user: User) => void) {
  authListeners.push(callback);
  return () => {
    authListeners = authListeners.filter((listener) => listener !== callback);
  };
}

// Initialize auth from cookie on page load
if (typeof window !== 'undefined') {
  fetch('/api/auth/me')
    .then((res) => res.json())
    .then((data) => {
      if (data.user) {
        setCurrentUser(data.user);
      }
    })
    .catch(() => {
      // User not authenticated
    });
}

export * from './provider';
export * from './use-collection';
export * from './use-doc';
export * from './use-user';

