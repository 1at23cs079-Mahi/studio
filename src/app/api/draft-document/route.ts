'use server';

import { appRoute } from '@genkit-ai/next';
import { draftLegalDocumentFlow } from '@/ai/flows/draft-legal-document';

export const POST = appRoute(draftLegalDocumentFlow);
