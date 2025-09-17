'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/review-document.ts';
import '@/ai/flows/draft-legal-petition.ts';
import '@/ai/flows/generate-case-timeline.ts';
import '@/ai/flows/search-case-law.ts';
import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/chat.ts';
