
'use server';

/**
 * @fileOverview A conversational AI agent for legal queries using RAG and tools.
 *
 * - chatWithTools - A function that handles conversational legal queries.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchCaseLawDatabase } from '@/services/legal-search';
import { draftLegalDocument } from './draft-legal-document';
import { explainLegalTerm } from './explain-legal-term';
import { translateText } from './translate-text';
import { analyzeDocumentAndSuggestEdits } from './analyze-document-and-suggest-edits';
import { transcribeAudio } from './transcribe-audio';
import { summarizeVideo } from './summarize-video';
import { ModelReference } from 'genkit/model';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message'),
  history: z.array(z.object({
    role: z.enum(['user', 'model', 'tool']),
    content: z.array(z.object({
      text: z.string().optional(),
    }))
  })).optional().describe('The conversation history.'),
  userRole: z
    .enum(['Advocate', 'Student', 'Public'])
    .describe('The role of the user.'),
  model: z.string().optional().describe('The model to use for the response.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  role: z.literal('model'),
  content: z.string().describe('The model\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// Tool for searching the case law database
const legalSearchTool = ai.defineTool(
    {
      name: 'legalSearch',
      description: 'Search for relevant legal documents, precedents, and case law from the Indian legal knowledge base.',
      inputSchema: z.object({
        query: z.string().describe('A specific search query about legal topics, cases, or statutes in the Indian context.'),
      }),
      outputSchema: z.object({
        results: z.array(z.object({
            source: z.string().describe('The document source or case citation.'),
            content: z.string().describe('The content or summary of the document.'),
        })),
      }),
    },
    async (input) => {
        const searchResults = await searchCaseLawDatabase(input.query);
        return {
            results: searchResults.map(c => ({
                source: c.citation,
                content: c.summary,
            }))
        };
    }
);

// Tool for drafting legal documents
const draftDocumentTool = ai.defineTool({
    name: 'draftLegalDocument',
    description: "Drafts a legal document like a petition, agreement, or affidavit based on the user's detailed request, tailored for the Indian legal system. The user must provide sufficient details for the draft to be created.",
    inputSchema: z.object({
        query: z.string().describe('The details of the legal document to draft.'),
        userRole: z.enum(['Advocate', 'Student', 'Public']).describe('The role of the user.'),
    }),
    outputSchema: z.string(),
}, async (input) => {
    const result = await draftLegalDocument(input);
    return result.draft;
});


// Tool for explaining legal terms
const explainTermTool = ai.defineTool({
    name: 'explainLegalTerm',
    description: 'Explains a complex Indian legal term in a simple and easy-to-understand manner.',
    inputSchema: z.object({
        term: z.string().describe('The legal term to explain.'),
    }),
    outputSchema: z.string(),
}, async (input) => {
    const result = await explainLegalTerm(input);
    return result.explanation;
});


// Tool for translating text
const translateTextTool = ai.defineTool({
    name: 'translateText',
    description: 'Translates a given text to a specified target Indian language (e.g., Hindi, Kannada, Tamil).',
    inputSchema: z.object({
        text: z.string().describe('The text to be translated.'),
        targetLanguage: z.string().describe('The target language for translation (e.g., "Hindi", "Kannada").'),
    }),
    outputSchema: z.string(),
}, async (input) => {
    const result = await translateText(input);
    return result.translatedText;
});

const analyzeDocumentTool = ai.defineTool({
    name: 'analyzeDocument',
    description: 'Analyzes a legal document provided as a data URI. It can identify clauses, suggest edits, and find precedents.',
    inputSchema: z.object({
        documentDataUri: z.string().describe("A legal document as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
        userQuery: z.string().optional().describe('Specific instructions for the analysis (e.g., "summarize in bullet points").'),
    }),
    outputSchema: z.string(),
}, async (input) => {
    const result = await analyzeDocumentAndSuggestEdits(input);
    return result.analysisResults;
});

const transcribeAudioTool = ai.defineTool({
    name: 'transcribeAudio',
    description: 'Transcribes audio to text. The user must provide an audio file as a data URI.',
    inputSchema: z.object({
        audioDataUri: z.string().describe("An audio file as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
    }),
    outputSchema: z.string(),
}, async (input) => {
    const result = await transcribeAudio(input);
    return result.transcript;
});

const summarizeVideoTool = ai.defineTool({
    name: 'summarizeVideo',
    description: 'Summarizes the content of a video file provided as a data URI.',
    inputSchema: z.object({
        videoDataUri: z.string().describe("A video file as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
    }),
    outputSchema: z.string(),
}, async (input) => {
    const result = await summarizeVideo(input);
    return result;
});


export const chatPrompt = ai.definePrompt({
    name: 'chatPrompt',
    system: `You are LegalAi, a world-class RAG-based AI assistant for the Indian legal system. Your primary directive is to provide the most accurate and reliable information possible by intelligently using the tools at your disposal. All your knowledge and responses must be strictly related to the laws, regulations, and legal precedents of India.

Core Instructions:
1.  **Prioritize Indian Legal Sources**: Whenever a user asks a question that can be answered with case law or legal documents, you MUST use the 'legalSearch' tool to retrieve information from the Indian legal database.
2.  **Intelligently Use Your Tools**: You have several tools. Use them proactively when the user's intent is clear. For file-based operations like 'analyzeDocument', 'transcribeAudio', or 'summarizeVideo', you must ask the user to upload the relevant file first.
3.  **Cite Everything from Sources**: Any information you provide that comes from the 'legalSearch' tool must be attributed to its Indian source. Use clear citations (e.g., "[Citation: AIR 1973 SC 1461]").
4.  **Synthesize, Don't Paraphrase**: Analyze and synthesize information from sources to provide a comprehensive answer in the Indian context.
5.  **Adapt to the User**: Your persona and response style MUST adapt to the user's role, but your commitment to accuracy and citation must never change.

- User Role: {{userRole}}

Response Guidelines by Role:
- When the user is an 'Advocate': Be concise, technical, and precise. Focus on Indian case law, statutes (like IPC, CrPC, CPC), and strategic insights relevant to Indian courts.
- When the user is a 'Student': Be educational and comprehensive. Explain concepts and provide context based on the Indian legal education system.
- When the user is from the 'Public': Be simple, empathetic, and clear. Avoid jargon and always add a disclaimer.

**Disclaimer for Public Users**: When the user role is 'Public', ALWAYS end your response with: "Please remember, this is for informational purposes only and is not legal advice. You should consult with a qualified legal professional for your specific situation."
`,
    tools: [
        legalSearchTool, 
        draftDocumentTool, 
        explainTermTool, 
        translateTextTool,
        analyzeDocumentTool,
        transcribeAudioTool,
        summarizeVideoTool
    ],
    input: {
      schema: z.object({
        userRole: z.string(),
      }),
    },
    output: {
      format: 'text'
    }
});


export const chatWithTools = ai.defineFlow(
  {
    name: 'chatWithToolsFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.any(),
    stream: true,
  },
  async (input, streamingCallback) => {
    const model = input.model ? ai.getModel(input.model as ModelReference) : ai.getModel('googleai/gemini-1.5-pro');
    
    const {stream, response} = ai.generateStream({
        model,
        prompt: input.message,
        history: input.history,
        context: { userRole: input.userRole },
        promptName: 'chatPrompt',
    });

    for await (const chunk of stream) {
      streamingCallback(chunk);
    }

    const final = await response;
    
    return {
      role: 'model',
      content: final.text,
    };
  }
);

    