'use server';

import { appRoute } from '@genkit-ai/next';
import { translateText } from '@/ai/flows/translate-text';

export const POST = appRoute(translateText);
