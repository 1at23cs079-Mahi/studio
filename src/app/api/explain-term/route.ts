'use server';

import { appRoute } from '@genkit-ai/next';
import { explainLegalTerm } from '@/ai/flows/explain-legal-term';

export const POST = appRoute(explainLegalTerm);
