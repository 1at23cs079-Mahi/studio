# Legal AI NOVA - AI Features Guide

## 🤖 AI-Powered Legal Document Analysis

This application provides powerful AI capabilities for analyzing and generating legal documents.

## Features

### 1. Document Upload & Processing

Upload legal documents in multiple formats:
- **PDF** - Portable Document Format
- **DOCX** - Microsoft Word documents  
- **TXT** - Plain text files

**API Endpoint:** `POST /api/legal/upload`

```typescript
const formData = new FormData();
formData.append('file', documentFile);

const response = await fetch('/api/legal/upload', {
  method: 'POST',
  body: formData,
});

const { text, metadata } = await response.json();
```

**Response:**
```json
{
  "success": true,
  "text": "Extracted document text...",
  "metadata": {
    "fileName": "contract.pdf",
    "fileSize": 102400,
    "fileType": "pdf",
    "wordCount": 1500,
    "characterCount": 8500,
    "documentType": "Contract/Agreement",
    "uploadDate": "2025-12-03T10:00:00.000Z"
  }
}
```

### 2. Legal Document Analysis

Four types of AI-powered analysis:

#### A. Document Summary
Get a concise overview of the document including:
- Main purpose
- Key parties involved
- Important obligations
- Key dates and terms

#### B. Risk Assessment
Identify and categorize legal risks:
- High-risk clauses
- Medium-risk concerns
- Low-risk items
- Recommendations

#### C. Clause Extraction
Extract and categorize important clauses:
- Termination clauses
- Liability provisions
- Confidentiality terms
- Payment terms
- Intellectual property
- Dispute resolution

#### D. Compliance Check
Review for compliance issues:
- Jurisdiction-specific requirements
- Missing required provisions
- Non-compliant clauses
- Areas needing legal review

**API Endpoint:** `POST /api/legal/analyze`

```typescript
const response = await fetch('/api/legal/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: documentText,
    analysisType: 'risk-assessment', // or 'summary', 'clause-extraction', 'compliance-check'
    jurisdiction: 'US' // optional
  }),
});

const { analysis } = await response.json();
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "analysis": "Detailed analysis text...",
    "keyPoints": [
      "Key point 1",
      "Key point 2",
      "Key point 3"
    ],
    "risks": [
      "Identified risk 1",
      "Identified risk 2"
    ],
    "suggestions": [
      "Recommendation 1",
      "Recommendation 2"
    ],
    "confidence": 0.85
  }
}
```

### 3. AI Document Generation

Generate legal documents using AI:

**Supported Templates:**
- Non-Disclosure Agreement (NDA)
- Service Agreement
- Employment Contract
- Consulting Agreement
- Partnership Agreement
- Terms of Service
- Privacy Policy

**API Endpoint:** `POST /api/legal/generate`

```typescript
const response = await fetch('/api/legal/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    templateType: 'Non-Disclosure Agreement',
    parameters: {
      parties: {
        disclosingParty: 'Company A Inc.',
        receivingParty: 'Company B LLC'
      },
      effectiveDate: '2025-01-01',
      term: '2 years',
      jurisdiction: 'California',
      purpose: 'Business partnership discussions'
    }
  }),
});

const { document } = await response.json();
```

## AI Configuration

### Option 1: OpenAI (Recommended)

Best quality results with GPT-4.

**Setup:**
1. Go to https://platform.openai.com/api-keys
2. Create an API key
3. Add to `.env.local`:
```env
OPENAI_API_KEY=sk-your-key-here
```

**Models Used:**
- `gpt-4o-mini` - Fast, cost-effective, high quality

**Pricing:**
- ~$0.15 per 1K tokens input
- ~$0.60 per 1K tokens output
- Typical document analysis: $0.05-$0.20

### Option 2: Google Gemini (Free Tier)

Free tier available with good quality.

**Setup:**
1. Go to https://makersuite.google.com/app/apikey
2. Create an API key
3. Add to `.env.local`:
```env
GOOGLE_AI_API_KEY=your-key-here
```

**Models Used:**
- `gemini-pro` - Free tier available

**Pricing:**
- Free tier: 60 requests/minute
- Paid: From $0.0005 per 1K characters

## Usage Examples

### Example 1: Analyze Contract Risks

```typescript
// Upload document
const formData = new FormData();
formData.append('file', contractFile);

const uploadRes = await fetch('/api/legal/upload', {
  method: 'POST',
  body: formData,
});

const { text } = await uploadRes.json();

// Analyze for risks
const analysisRes = await fetch('/api/legal/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text,
    analysisType: 'risk-assessment',
    jurisdiction: 'US'
  }),
});

const { analysis } = await analysisRes.json();
console.log('Risks:', analysis.risks);
console.log('Suggestions:', analysis.suggestions);
```

### Example 2: Extract Contract Clauses

```typescript
const response = await fetch('/api/legal/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: contractText,
    analysisType: 'clause-extraction'
  }),
});

const { analysis } = await response.json();
console.log('Key Clauses:', analysis.keyPoints);
```

### Example 3: Generate NDA

```typescript
const response = await fetch('/api/legal/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    templateType: 'Non-Disclosure Agreement',
    parameters: {
      parties: {
        disclosingParty: 'Acme Corp',
        receivingParty: 'Tech Solutions LLC'
      },
      effectiveDate: '2025-01-15',
      term: '3 years',
      jurisdiction: 'Delaware',
      purpose: 'Software development collaboration'
    }
  }),
});

const { document } = await response.json();
console.log(document); // Generated NDA
```

## Best Practices

### 1. Document Preparation
- Ensure documents are clear and readable
- Remove unnecessary images or formatting
- Use OCR for scanned documents before upload

### 2. Analysis Tips
- Start with a summary to understand the document
- Use risk assessment for contract review
- Extract clauses for detailed clause-by-clause review
- Run compliance checks for regulatory requirements

### 3. Security
- All API endpoints require authentication
- Documents are processed in-memory (not stored unless you save them)
- AI providers (OpenAI/Google) process data according to their privacy policies

### 4. Limitations
- AI analysis is assistive, not a replacement for legal counsel
- Always have important documents reviewed by a qualified attorney
- Confidence scores indicate AI certainty, not legal validity
- Different jurisdictions have different requirements

## Error Handling

```typescript
try {
  const response = await fetch('/api/legal/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, analysisType: 'summary' }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Analysis failed:', error.details);
    return;
  }

  const { analysis } = await response.json();
  // Use analysis
} catch (error) {
  console.error('Request failed:', error);
}
```

## Rate Limits

- OpenAI: 3,500 requests/minute (depends on your tier)
- Google Gemini Free: 60 requests/minute
- Vercel Functions: 10-second timeout default (configured to 60s)

## Support

For issues or questions:
- Check the [main README](./README.md)
- Review [deployment guide](./VERCEL_DEPLOYMENT.md)
- Open an issue on GitHub

## Legal Disclaimer

⚠️ **Important:** This AI tool is designed to assist with legal document review and generation but does NOT constitute legal advice. Always consult with a qualified attorney for important legal matters. The creators and operators of this tool are not responsible for any legal consequences arising from the use of AI-generated content or analysis.
