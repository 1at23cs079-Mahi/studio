
'use client';

import { useEffect, useState } from 'react';

export type UseDocOptions = {
  disabled?: boolean;
};

export type DocRef = {
  collection: string;
  id: string;
};

export function useDoc<T>(
  ref: DocRef | null,
  options: UseDocOptions = {}
) {
  const { disabled = false } = options;
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (!ref || disabled) {
      setData(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/collections/${ref.collection}/${ref.id}`);
        if (!response.ok) throw new Error('Failed to fetch document');
        
        const result = await response.json();
        setData(result.data as T);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(ref), disabled]);

  return { data, isLoading, error };
}
