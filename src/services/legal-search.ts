'use server';

import db from '@/lib/case-law-db.json';
import type { CaseLaw } from '@/ai/flows/search-case-law';

/**
 * Searches the local case law JSON database.
 * This is a simplified simulation of a real database search.
 * @param query The search query string.
 * @param filters Optional filters for court, judge, year, etc.
 * @returns A promise that resolves to an array of matching case law.
 */
export async function searchCaseLawDatabase(
  query: string,
  filters?: { [key: string]: any },
  limit: number = 10
): Promise<CaseLaw[]> {
  const queryLower = query.toLowerCase();
  
  let results = db.cases.filter(c => 
    query.trim() === '' || // if query is empty, don't filter by it
    c.title.toLowerCase().includes(queryLower) ||
    c.summary.toLowerCase().includes(queryLower) ||
    c.subject.toLowerCase().includes(queryLower) ||
    c.citation.toLowerCase().includes(queryLower) ||
    c.status.toLowerCase().includes(queryLower)
  );

  // Apply other filters if they exist
  if (filters) {
    if (filters.court) {
      results = results.filter(c => c.court.toLowerCase() === filters.court.toLowerCase());
    }
    if (filters.subject) {
      results = results.filter(c => c.subject.toLowerCase() === filters.subject.toLowerCase());
    }
    if (filters.year) {
        // Assuming date is DD/MM/YYYY
        results = results.filter(c => c.date.endsWith(String(filters.year)));
    }
    // A judge filter is not in the data, so we don't implement it
  }

  return results.slice(0, limit);
}
