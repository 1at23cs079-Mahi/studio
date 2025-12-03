'use server';

import { appRoute } from '@genkit-ai/next';
import { searchCaseLaw } from '@/ai/flows/search-case-law';

export const POST = appRoute(searchCaseLaw);
