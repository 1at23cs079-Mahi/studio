
'use server';

import { ai } from '@/ai/genkit';
import { stream } from '@genkit-ai/next/server';
import { z } from 'zod';
import { chat } from '@/ai/flows/chat';
import type { ModelReference } from 'genkit/model';


const ChatRequestSchema = z.object({
  message: z.string(),
  history: z.array(z.any()).optional(),
  userRole: z.enum(['Advocate', 'Student', 'Public']),
  model: z.custom<ModelReference>().optional(),
});

export const POST = async (req: Request) => {
  const {
    message,
    history,
    userRole,
    model,
  } = ChatRequestSchema.parse(await req.json());

  return stream(
    async () => {
      const stream = await chat({
        input: { message, history, userRole, model }
      });

      let text = '';
      for await (const chunk of stream) {
        text += chunk.text;
      }
      return text;
    }
  );
};
