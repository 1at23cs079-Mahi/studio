import mammoth from 'mammoth';

const pdfParse = require('pdf-parse');

export type DocumentType = 'pdf' | 'docx' | 'txt';

export async function extractTextFromDocument(
  buffer: Buffer,
  fileType: DocumentType
): Promise<string> {
  try {
    switch (fileType) {
      case 'pdf':
        const pdfData = await pdfParse(buffer);
        return pdfData.text;

      case 'docx':
        const result = await mammoth.extractRawText({ buffer });
        return result.value;

      case 'txt':
        return buffer.toString('utf-8');

      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error: any) {
    console.error('Document extraction error:', error);
    throw new Error(`Failed to extract text from ${fileType}: ${error.message}`);
  }
}

export async function processUploadedDocument(
  file: File
): Promise<{ text: string; metadata: DocumentMetadata }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const extension = file.name.split('.').pop()?.toLowerCase() as DocumentType;
  if (!['pdf', 'docx', 'txt'].includes(extension)) {
    throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
  }

  const text = await extractTextFromDocument(buffer, extension);

  const metadata: DocumentMetadata = {
    fileName: file.name,
    fileSize: file.size,
    fileType: extension,
    wordCount: text.split(/\s+/).length,
    characterCount: text.length,
    uploadDate: new Date().toISOString(),
  };

  return { text, metadata };
}

export type DocumentMetadata = {
  fileName: string;
  fileSize: number;
  fileType: string;
  wordCount: number;
  characterCount: number;
  uploadDate: string;
};

export function detectDocumentType(text: string): string {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes('agreement') ||
    lowerText.includes('contract') ||
    lowerText.includes('party') && lowerText.includes('whereas')
  ) {
    return 'Contract/Agreement';
  }

  if (lowerText.includes('terms of service') || lowerText.includes('terms and conditions')) {
    return 'Terms of Service';
  }

  if (lowerText.includes('privacy policy') || lowerText.includes('personal data')) {
    return 'Privacy Policy';
  }

  if (lowerText.includes('non-disclosure') || lowerText.includes('confidential')) {
    return 'NDA (Non-Disclosure Agreement)';
  }

  if (lowerText.includes('lease') || lowerText.includes('tenant') || lowerText.includes('landlord')) {
    return 'Lease Agreement';
  }

  if (lowerText.includes('employment') || lowerText.includes('employee')) {
    return 'Employment Document';
  }

  return 'General Legal Document';
}
