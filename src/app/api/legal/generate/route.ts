import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateLegalDocument } from '@/lib/ai';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { templateType, parameters } = body;

    if (!templateType || !parameters) {
      return NextResponse.json(
        { error: 'Missing required fields: templateType and parameters' },
        { status: 400 }
      );
    }

    const document = await generateLegalDocument(templateType, parameters);

    return NextResponse.json(
      {
        success: true,
        document,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Document generation API error:', error);
    return NextResponse.json(
      {
        error: 'Document generation failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
