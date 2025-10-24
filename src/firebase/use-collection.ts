
'use client';

import {
  onSnapshot,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  endBefore,
  limitToLast,
  startAt,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useAuth, useFirestore } from './provider';
import { useUser } from './use-user';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

export type UseCollectionOptions = {
  disabled?: boolean;
};

export function useCollection<T>(
  query: Query<DocumentData> | null,
  options: UseCollectionOptions = {}
) {
  const { disabled } = options;
  const [data, setData] = useState<T[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError>();

  const memoizedQuery = useMemo(() => query, [JSON.stringify(query)]);

  useEffect(() => {
    if (!memoizedQuery || disabled) {
      setData(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot: QuerySnapshot) => {
        const data: any[] = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setData(data as T[]);
        setIsLoading(false);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
            path: memoizedQuery.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);

        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery, disabled]);

  return { data, isLoading, error };
}
