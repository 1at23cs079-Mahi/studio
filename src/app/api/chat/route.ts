
'use server';

import { nextJSStream } from '@genkit-ai/next/server';
import { chatWithTools } from '@/ai/flows/chat';

export const POST = nextJSStream(chatWithTools);
