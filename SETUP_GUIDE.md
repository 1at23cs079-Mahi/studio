# Setup Guide - Lexica AI Legal Assistant

This guide will help you clone and run the Lexica application on your local machine.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Firebase Setup](#firebase-setup)
5. [Google AI Setup](#google-ai-setup)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 10.x or higher (comes with Node.js)
- **Git**: For cloning the repository ([Download](https://git-scm.com/))

Verify your installations:

```bash
node --version  # Should be v20.x or higher
npm --version   # Should be 10.x or higher
git --version   # Any recent version
```

## Quick Start

For experienced developers, here's the quick start:

```bash
# 1. Clone the repository
git clone https://github.com/1at23cs079-Mahi/studio.git
cd studio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Detailed Setup

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/1at23cs079-Mahi/studio.git
cd studio
```

### Step 2: Install Dependencies

Install all required Node.js packages:

```bash
npm install
```

This will:
- Install React 19, Next.js 15.1, and all dependencies
- Set up Firebase SDK
- Install Genkit AI framework
- Install Tailwind CSS and UI components

**Expected output**: Should complete without errors. If you see peer dependency warnings, they can be safely ignored.

### Step 3: Configure Environment Variables

Create your local environment configuration:

```bash
cp .env.example .env.local
```

Now edit `.env.local` with your actual credentials (see sections below).

## Firebase Setup

Firebase is used for authentication and database storage.

### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter a project name (e.g., "lexica-legal-ai")
4. Follow the setup wizard (disable Google Analytics if not needed)
5. Click **"Create project"**

### Enable Firebase Authentication

1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click on the **"Sign-in method"** tab
4. Enable **"Email/Password"** authentication
5. Click **"Save"**

### Enable Firestore Database

1. Click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to you
5. Click **"Enable"**

### Get Firebase Credentials

1. Click the gear icon ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"**
4. Click the **"Web"** icon (`</>`)
5. Register your app with a nickname (e.g., "Lexica Web App")
6. Copy the configuration values

Your `.env.local` should look like:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcd1234
```

## Google AI Setup

Google AI (via Genkit) powers the AI features.

### Get Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select a Google Cloud project (or create a new one)
5. Copy the generated API key

Add it to your `.env.local`:

```env
GOOGLE_GENAI_API_KEY=AIzaSyD...
```

### Important Notes

- Keep your API keys secret - never commit them to Git
- The `.env.local` file is already in `.gitignore`
- Free tier limits apply to Google AI API calls

## Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:3000
- **Network**: http://YOUR_IP:3000

You should see:
```
▲ Next.js 15.1.0
- Local:        http://localhost:3000
✓ Ready in ~1300ms
```

### Production Build

Build and run the production version:

```bash
npm run build
npm start
```

### Other Commands

- **Type checking**: `npm run typecheck`
- **Linting**: `npm run lint`
- **Genkit dev**: `npm run genkit:dev`

## Troubleshooting

### Issue: npm install fails with dependency conflicts

**Solution**: Make sure you're using Node.js 20.x or higher:

```bash
node --version
```

If older, update Node.js and try again.

### Issue: Firebase Authentication errors

**Symptoms**: "Firebase: Error (auth/invalid-api-key)"

**Solution**: 
1. Verify your `.env.local` file exists and has correct Firebase credentials
2. Make sure all `NEXT_PUBLIC_FIREBASE_*` variables are set
3. Restart the development server after changing `.env.local`

### Issue: Google Fonts fail to load

**Solution**: This is expected in offline/restricted environments. The app will use system fonts automatically.

### Issue: Port 3000 already in use

**Solution**: Either:
- Stop other processes using port 3000
- Or run on a different port:
  ```bash
  npm run dev -- -p 3001
  ```

### Issue: TypeScript errors

**Solution**: Run type checking to see all errors:

```bash
npm run typecheck
```

Most type errors won't prevent the app from running in development mode.

### Issue: "Cannot find module" errors

**Solution**: 
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: Build fails

**Solution**:
1. Ensure all environment variables are set in `.env.local`
2. Check that Firebase credentials are valid
3. Try cleaning the build cache:
   ```bash
   rm -rf .next
   npm run build
   ```

## Getting Help

If you encounter issues not covered here:

1. Check the main [README.md](README.md) for project overview
2. Review the documentation in the `docs/` folder
3. Check the GitHub repository issues
4. Verify all prerequisites are correctly installed

## Next Steps

Once the application is running:

1. Visit http://localhost:3000
2. Click **"Get Started"** 
3. Register a new account or try the demo login
4. Explore the AI-powered legal features:
   - Chat with the AI legal assistant
   - Search case law database
   - Draft legal documents
   - Analyze and summarize documents

## Production Deployment

For deploying to production:

1. Set up environment variables on your hosting platform
2. Configure Firebase for production mode
3. Set appropriate Firestore security rules
4. Enable proper authentication methods
5. Consider rate limiting for API calls

Recommended platforms:
- **Vercel** (recommended for Next.js)
- **Google Cloud Run** (for Firebase integration)
- **Netlify**
- **AWS Amplify**

---

**Happy coding!** If you find this project useful, please consider starring it on GitHub. 🌟
