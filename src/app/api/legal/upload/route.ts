import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { extractTextFromDocument, detectDocumentType } from '@/lib/document-processor';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(extension || '')) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text
    const text = await extractTextFromDocument(buffer, extension as any);

    // Detect document type
    const documentType = detectDocumentType(text);

    // Create metadata
    const metadata = {
      fileName: file.name,
      fileSize: file.size,
      fileType: extension,
      wordCount: text.split(/\s+/).length,
      characterCount: text.length,
      documentType,
      uploadDate: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        text,
        metadata,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Document upload API error:', error);
    return NextResponse.json(
      {
        error: 'Document processing failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
