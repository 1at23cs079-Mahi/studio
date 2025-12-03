'use server';

import { appRoute } from '@genkit-ai/next';
import { summarizeVideo } from '@/ai/flows/summarize-video';

export const POST = appRoute(summarizeVideo);
