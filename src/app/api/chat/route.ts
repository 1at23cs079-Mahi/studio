
'use server';

import { nextJSAdapter } from '@genkit-ai/next/server';
import { chatWithTools } from '@/ai/flows/chat';
import { searchCaseLaw } from '@/ai/flows/search-case-law';
import { draftLegalPetition } from '@/ai/flows/draft-legal-petition';
import { explainLegalTerm } from '@/ai/flows/explain-legal-term';
import { translateText } from '@/ai/flows/translate-text';

export const POST = nextJSAdapter({
  'chatWithTools': chatWithTools,
  'searchCaseLaw': searchCaseLaw,
  'draftLegalPetition': draftLegalPetition,
  'explainLegalTerm': explainLegalTerm,
  'translateText': translateText
});
