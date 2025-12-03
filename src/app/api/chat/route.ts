
'use server';

import { appRoute } from '@genkit-ai/next';
import { chatWithTools } from '@/ai/flows/chat';

export const POST = appRoute(chatWithTools);
