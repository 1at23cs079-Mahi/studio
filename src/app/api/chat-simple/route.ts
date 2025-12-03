import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Runtime configuration
export const runtime = 'nodejs';
export const maxDuration = 60;

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const genAI = process.env.GOOGLE_AI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  : null;

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [], userRole = 'Public' }: {
      message: string;
      history?: Message[];
      userRole?: string;
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if any AI service is configured
    if (!openai && !genAI) {
      return NextResponse.json(
        { 
          role: 'model',
          content: `🔧 **AI Service Not Configured**

To enable AI chat responses, you need to add an API key to your \`.env.local\` file:

**Option 1: OpenAI (Recommended)**
\`\`\`
OPENAI_API_KEY=sk-your-openai-api-key-here
\`\`\`
Get your key from: https://platform.openai.com/api-keys

**Option 2: Google AI**
\`\`\`
GOOGLE_AI_API_KEY=your-google-ai-api-key-here
\`\`\`
Get your key from: https://makersuite.google.com/app/apikey

**Demo Mode:** This is a placeholder response. Configure an API key for real AI responses.`
        },
        { status: 200 }
      );
    }

    const systemPrompt = `You are an expert legal AI assistant specializing in Indian law. You provide clear, accurate legal information and guidance.

User Role: ${userRole}
- For Advocates: Provide detailed legal analysis and case references
- For Students: Explain concepts clearly with examples
- For Public: Use simple language and practical guidance

Guidelines:
1. Always clarify you provide information, not legal advice
2. Cite relevant Indian laws, acts, and sections when applicable
3. Be concise but thorough
4. Use bullet points for clarity
5. If unsure, acknowledge limitations

Current query context: Legal assistance for Indian jurisdiction`;

    let response: string;

    // Try OpenAI first
    if (openai) {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      });

      response = completion.choices[0]?.message?.content || 'No response generated';
    }
    // Fallback to Google Gemini
    else if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      // Build conversation context
      const conversationContext = history
        .slice(-10)
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n');
      
      const prompt = `${systemPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}User: ${message}
      const result = await model.generateContent(prompt);
      response = result.response.text();
    } else {
      response = 'No AI service available';
    }

    return NextResponse.json({
      role: 'model',
      content: response
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
