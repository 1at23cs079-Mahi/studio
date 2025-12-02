
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-document-and-suggest-edits.ts';
import '@/ai/flows/draft-legal-petition.ts';
import '@/ai/flows/generate-case-timeline.ts';
import '@/ai/flows/search-case-law.ts';
import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/translate-text.ts';
import { chatPrompt } from '@/ai/flows/chat.ts';
import '@/ai/flows/explain-legal-term.ts';

export const_ = {
    chatPrompt
};
