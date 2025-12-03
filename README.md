# Lexica - AI-Powered Legal Assistant

An AI-powered legal assistant built with Next.js, Firebase, and Google's Genkit AI framework.

## Features

- Hybrid Legal Retrieval: Combines BM25 and vector search for precise statute and case retrieval
- AI-Powered Summarization: Provides concise summaries of legal documents and cases
- Drafting Assistant: Assists in drafting petitions and legal documents
- Interactive Timeline Generation: Generates case timelines with key events
- Document Analysis Tool: Annotates uploaded documents and suggests edits
- Role-Based Login: UI adapts to user role (Advocate, Student, Public)

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Firebase project with Authentication and Firestore enabled
- Google AI API key (for Genkit)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/1at23cs079-Mahi/studio.git
cd studio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Firebase and Google AI credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Google AI Configuration (for Genkit)
GOOGLE_GENAI_API_KEY=your-google-ai-api-key-here
```

#### How to Get Firebase Credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Click "Add app" and select Web
6. Copy the configuration values to your `.env.local`

#### How to Get Google AI API Key:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env.local` as `GOOGLE_GENAI_API_KEY`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. Build for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit in watch mode

## Project Structure

```
├── src/
│   ├── ai/              # AI flows and Genkit configuration
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   ├── firebase/        # Firebase configuration
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── services/        # Business logic services
├── docs/                # Documentation
├── public/              # Static assets
└── ...config files
```

## Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with ShadCN UI components
- **Backend**: Next.js API Routes with Server Actions
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **AI**: Google Genkit with Google AI models
- **Language**: TypeScript

## User Roles

The application supports three user roles:

1. **Admin**: Access to analytics and user management
2. **Advocate**: Professional legal work features
3. **Student**: Legal studies and research features
4. **Public**: General legal information and terminology

## Troubleshooting

### Build Fails with Font Errors

If you encounter errors fetching Google Fonts, the application will use system fonts as fallback. This is already configured in the codebase.

### Firebase Authentication Errors

Make sure all Firebase environment variables are correctly set in `.env.local` and that your Firebase project has Authentication enabled.

### Type Errors

Run `npm run typecheck` to see all TypeScript errors. Some errors may be informational and won't prevent the application from running in development mode.

## Contributing

Please read the documentation in the `docs/` folder for more details about the system architecture and features.

## License

Apache-2.0
