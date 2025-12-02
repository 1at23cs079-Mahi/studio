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
  limit: number = 5
): Promise<CaseLaw[]> {
  const queryLower = query.toLowerCase();
  
  let results = db.cases.filter(c => 
    c.court.toLowerCase().includes('high court') && (
      c.title.toLowerCase().includes(queryLower) ||
      c.summary.toLowerCase().includes(queryLower) ||
      c.subject.toLowerCase().includes(queryLower) ||
      c.citation.toLowerCase().includes(queryLower) ||
      c.status.toLowerCase().includes(queryLower)
    )
  );

  // Apply other filters if they exist
  if (filters) {
    if (filters.court) {
      // The user can still filter by a *specific* high court, e.g. "High Court of Delhi"
      results = results.filter(c => c.court.toLowerCase().includes(filters.court.toLowerCase()));
    }
    if (filters.year) {
        // Assuming date is DD/MM/YYYY
        results = results.filter(c => c.date.endsWith(String(filters.year)));
    }
  }

  return results.slice(0, limit);
}
