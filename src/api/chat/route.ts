
'use server';

import { nextJSAdapter } from '@genkit-ai/next/server';
import { chatWithTools } from '@/ai/flows/chat';
import { searchCaseLaw } from '@/ai/flows/search-case-law';
import { draftLegalDocumentFlow } from '@/ai/flows/draft-legal-document';
import { explainLegalTerm } from '@/ai/flows/explain-legal-term';
import { translateText } from '@/ai/flows/translate-text';
import { summarizeVideoFlow } from '@/ai/flows/summarize-video';

export const POST = nextJSAdapter({
  'chatWithTools': chatWithTools,
  'searchCaseLaw': searchCaseLaw,
  'draftLegalDocumentFlow': draftLegalDocumentFlow,
  'explainLegalTerm': explainLegalTerm,
  'translateText': translateText,
  'summarizeVideoFlow': summarizeVideoFlow
});
