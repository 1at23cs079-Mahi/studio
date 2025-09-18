'use server';

import db from '@/lib/case-law-db.json';
import type { CaseLaw } from '@/ai/flows/search-case-law';

/**
 * Searches the local case law JSON database.
 * This is a simplified simulation of a real database search.
 * @param query The search query string.
 * @param filters Optional filters for court, judge, year, etc. (currently unused in this simulation).
 * @returns A promise that resolves to an array of matching case law.
 */
export async function searchCaseLawDatabase(
  query: string,
  filters?: { [key: string]: any },
  limit: number = 5
): Promise<CaseLaw[]> {
  const queryLower = query.toLowerCase();
  
  const results = db.cases.filter(c => 
    c.title.toLowerCase().includes(queryLower) ||
    c.summary.toLowerCase().includes(queryLower) ||
    c.subject.toLowerCase().includes(queryLower) ||
    c.citation.toLowerCase().includes(queryLower) ||
    c.court.toLowerCase().includes(queryLower) ||
    c.status.toLowerCase().includes(queryLower)
  ).slice(0, limit);

  // In a real scenario, you'd apply filters here.
  // For example:
  // if (filters?.court) {
  //   results = results.filter(c => c.court.toLowerCase() === filters.court.toLowerCase());
  // }
  // if (filters?.year) {
  //   results = results.filter(c => new Date(c.date).getFullYear() === filters.year);
  // }

  return results;
}
