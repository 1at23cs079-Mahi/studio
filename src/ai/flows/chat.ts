'use server';

/**
 * @fileOverview A conversational AI agent for legal queries.
 *
 * - chat - A function that handles conversational legal queries.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { draftLegalPetition, DraftLegalPetitionInput, DraftLegalPetitionOutput } from './draft-legal-petition';
import { summarizeLegalDocument, SummarizeLegalDocumentInput, SummarizeLegalDocumentOutput } from './summarize-legal-document';
import { generateCaseTimeline, GenerateCaseTimelineInput, GenerateCaseTimelineOutput } from './generate-case-timeline';
import { analyzeDocumentAndSuggestEdits, AnalyzeDocumentAndSuggestEditsInput, AnalyzeDocumentAndSuggestEditsOutput } from './analyze-document-and-suggest-edits';
import { searchCaseLaw, SearchCaseLawInput, SearchCaseLawOutput } from './search-case-law';
import { translateText, TranslateTextInput, TranslateTextOutput } from './translate-text';
import { transcribeAudio, TranscribeAudioInput, TranscribeAudioOutput } from './transcribe-audio';

export const ChatInputSchema = z.object({
  message: z.string().describe('The user message'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
  userRole: z
    .enum(['Advocate', 'Student', 'Public'])
    .describe('The role of the user.'),
  documentDataUri: z.string().optional().describe('A document for analysis or summarization, as a data URI.'),
  audioDataUri: z.string().optional().describe('An audio file for transcription, as a data URI.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  role: z.literal('model'),
  content: z.string().describe('The model\'s response.'),
  citations: z.array(z.string()).optional().describe('Relevant citations.'),
  analysisResults: z.string().optional().describe('The analysis results for a document.'),
  timeline: z.string().optional().describe('A timeline of events.'),
  searchResult: z.any().optional().describe('The search result'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


const determineTool = ai.defineTool({
    name: 'determineTool',
    description: 'Determines which tool to use based on the user query.',
    inputSchema: z.object({
      query: z.string(),
    }),
    outputSchema: z.object({
      tool: z.enum(['draft', 'summarize', 'timeline', 'analyze', 'search', 'translate', 'transcribe', 'chat']),
      reasoning: z.string(),
    }),
}, async ({ query }) => {
    const { output } = await ai.generate({
        prompt: `You are an expert at determining which tool to use. The user has provided the following query: "${query}".

        Based on the query, choose one of the following tools:
        - 'draft': For drafting legal petitions, notices, contracts.
        - 'summarize': For summarizing legal documents.
        - 'timeline': For generating a case timeline.
        - 'analyze': For analyzing a document and suggesting edits.
        - 'search': For searching case law.
        - 'translate': For translating text.
        - 'transcribe': For transcribing audio.
        - 'chat': For all other general legal questions and conversation.

        If the user uses a slash command like /draft, /summarize, etc., you must choose the corresponding tool.
        `,
        output: {
            schema: z.object({
              tool: z.enum(['draft', 'summarize', 'timeline', 'analyze', 'search', 'translate', 'transcribe', 'chat']),
              reasoning: z.string(),
            }),
        }
    });

    return output!;
});


export async function chat(input: ChatInput): Promise<ChatOutput> {
  const toolChoice = await determineTool({ query: input.message });

  let response: Partial<ChatOutput> = {};

  const commandRegex = /^\/(\w+)\s*(.*)/;
  const match = input.message.match(commandRegex);
  const queryText = match ? match[2] : input.message;


  switch (toolChoice.tool) {
    case 'draft':
      const draftInput: DraftLegalPetitionInput = { query: queryText, userRole: input.userRole };
      const draftOutput = await draftLegalPetition(draftInput);
      response = { content: draftOutput.draft, citations: draftOutput.citations };
      break;
    case 'summarize':
      if (!input.documentDataUri) throw new Error('Document required for summarization.');
      const summarizeInput: SummarizeLegalDocumentInput = { documentDataUri: input.documentDataUri };
      const summarizeOutput = await summarizeLegalDocument(summarizeInput);
      response = { content: summarizeOutput.summary, citations: summarizeOutput.citations };
      break;
    case 'timeline':
      const timelineInput: GenerateCaseTimelineInput = { caseDetails: queryText };
      const timelineOutput = await generateCaseTimeline(timelineInput);
      response = { content: timelineOutput.timeline, timeline: timelineOutput.timeline };
      break;
    case 'analyze':
      if (!input.documentDataUri) throw new Error('Document required for analysis.');
      const analyzeInput: AnalyzeDocumentAndSuggestEditsInput = { documentDataUri: input.documentDataUri };
      const analyzeOutput = await analyzeDocumentAndSuggestEdits(analyzeInput);
      response = { content: analyzeOutput.analysisResults, analysisResults: analyzeOutput.analysisResults };
      break;
    case 'search':
        const searchInput: SearchCaseLawInput = { query: queryText };
        const searchOutput = await searchCaseLaw(searchInput);
        response = { content: `Found ${searchOutput.results.length} cases.`, searchResult: searchOutput };
        break;
    case 'translate':
        const translateRegex = /\/(translate)\s*(to\s*)?(\w+)\s*(.*)/i;
        const translateMatch = input.message.match(translateRegex);
        if(!translateMatch) throw new Error('Invalid translate command. Use /translate to <language> <text>');
        const targetLanguage = translateMatch[3];
        const textToTranslate = translateMatch[4];
        const translateInput: TranslateTextInput = { text: textToTranslate, targetLanguage };
        const translateOutput = await translateText(translateInput);
        response = { content: translateOutput.translatedText };
        break;
    case 'transcribe':
        if (!input.audioDataUri) throw new Error('Audio file required for transcription.');
        const transcribeInput: TranscribeAudioInput = { audioDataUri: input.audioDataUri };
        const transcribeOutput = await transcribeAudio(transcribeInput);
        response = { content: transcribeOutput.transcript };
        break;
    default:
        const { text } = await ai.generate({
            prompt: `You are LegalAi. You are a multilingual India-focused AI assistant for legal research, case review, drafting, compliance, and education.
            User role: ${input.userRole}.
            Conversation History:
            ${input.history?.map(h => `${h.role}: ${h.content}`).join('\n') || ''}
            User: ${input.message}
            LegalAi:`,
        });
        response = { content: text };
  }

  return { role: 'model', ...response, content: response.content || "Sorry, I couldn't process that request." };
}
