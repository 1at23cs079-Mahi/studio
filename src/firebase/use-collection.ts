
'use client';

import { useEffect, useState } from 'react';

export type UseCollectionOptions = {
  disabled?: boolean;
};

export type CollectionQuery = {
  collection: string;
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
};

export function useCollection<T>(
  query: CollectionQuery | null,
  options: UseCollectionOptions = {}
) {
  const { disabled } = options;
  const [data, setData] = useState<T[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (!query || disabled) {
      setData(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (query.filter) params.append('filter', JSON.stringify(query.filter));
        if (query.sort) params.append('sort', JSON.stringify(query.sort));
        if (query.limit) params.append('limit', query.limit.toString());

        const response = await fetch(`/api/collections/${query.collection}?${params}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const result = await response.json();
        setData(result.data as T[]);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(query), disabled]);

  return { data, isLoading, error };
}
