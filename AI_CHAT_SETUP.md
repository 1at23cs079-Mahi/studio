# 🤖 AI Chat API Setup & Usage

## 📋 API Endpoint

**URL:** `http://localhost:3000/api/chat-simple`  
**Method:** `POST`  
**Content-Type:** `application/json`

---

## 🔑 Setup Instructions

### Step 1: Add AI API Key

Edit `.env.local` and add **ONE** of these:

#### Option 1: OpenAI (Recommended)
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```
- Get your key: https://platform.openai.com/api-keys
- Free tier: $5 credit for new accounts
- Model: GPT-4o-mini (fast & affordable)

#### Option 2: Google AI
```env
GOOGLE_AI_API_KEY=your-google-ai-api-key-here
```
- Get your key: https://makersuite.google.com/app/apikey
- Free tier: 60 requests/minute
- Model: Gemini-pro

### Step 2: Restart Dev Server

```powershell
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 💬 API Usage

### Example Request

```javascript
// Send a message to AI
const response = await fetch('http://localhost:3000/api/chat-simple', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: "What is Section 498A of IPC?",
    userRole: "Public", // or "Advocate", "Student"
    history: [] // Optional: previous conversation
  })
});

const data = await response.json();
console.log(data.content); // AI response
```

### Request Body

```typescript
{
  message: string;        // Required: User's question
  userRole?: string;      // Optional: "Public" | "Advocate" | "Student"
  history?: Array<{       // Optional: Conversation history
    role: "user" | "assistant";
    content: string;
  }>;
}
```

### Response Format

```typescript
{
  role: "model",
  content: string  // AI's response text
}
```

---

## 🧪 Test with cURL

```powershell
# Simple test
curl -X POST http://localhost:3000/api/chat-simple `
  -H "Content-Type: application/json" `
  -d '{"message":"Explain anticipatory bail","userRole":"Public"}'
```

---

## ⚡ Features

✅ **Automatic Fallback:** Uses OpenAI → Google AI → Demo Mode  
✅ **Role-Based Responses:** Tailored for Advocates, Students, Public  
✅ **Conversation History:** Maintains context across messages  
✅ **Indian Law Focus:** Specialized in Indian legal system  
✅ **Error Handling:** Graceful error messages  

---

## 🎯 Example Queries

```javascript
// For legal professionals
{
  "message": "Draft a notice for recovery of dues under Order 37 CPC",
  "userRole": "Advocate"
}

// For students
{
  "message": "Explain the concept of 'mens rea' in criminal law",
  "userRole": "Student"
}

// For public
{
  "message": "How do I file a consumer complaint?",
  "userRole": "Public"
}
```

---

## 🐛 Troubleshooting

### Error: "No AI service configured"
**Solution:** Add API key to `.env.local` and restart server

### Error: "Invalid API key"
**Solution:** Check your API key is correct and has credits

### Error: "Rate limit exceeded"
**Solution:** Wait a minute or upgrade your API plan

### No Response / Timeout
**Solution:** Check internet connection and API status

---

## 🔗 Connect to Frontend

Update your dashboard chat component to use this endpoint:

```typescript
// In your chat component
const sendMessage = async (message: string) => {
  const response = await fetch('/api/chat-simple', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      userRole: role, // from user session
      history: chatHistory
    })
  });
  
  const data = await response.json();
  return data.content;
};
```

---

## 📊 API Costs (Approximate)

**OpenAI GPT-4o-mini:**
- ~$0.00015 per message (150 tokens)
- 1000 messages ≈ $0.15

**Google Gemini-pro:**
- Free tier: 60 requests/minute
- Paid: $0.00025 per 1000 characters

---

## 🔐 Security Notes

- Never expose API keys in frontend code
- Use server-side API routes only
- Implement rate limiting in production
- Add authentication before deployment

---

## ✅ Next Steps

1. Add API key to `.env.local`
2. Restart server: `npm run dev`
3. Test API with cURL or Postman
4. Connect frontend chat component
5. Deploy to production with secure keys

**Need help?** Check the demo mode response for configuration instructions!
