# Next.js Studio with MongoDB

A modern full-stack Next.js application with MongoDB database and JWT authentication.

# Legal AI NOVA - Next.js Studio with MongoDB & AI

A modern full-stack Next.js application for legal document analysis powered by AI, MongoDB database, and JWT authentication.

## ✨ Features

### 🤖 AI-Powered Legal Analysis
- **Document Analysis** - Automated legal document review and insights
- **Risk Assessment** - Identify potential legal risks and liabilities
- **Clause Extraction** - Extract and categorize important clauses
- **Compliance Checking** - Verify compliance with regulations
- **Document Generation** - AI-powered legal document creation

### 🔐 Authentication & Security
- JWT Authentication with HTTP-only cookies
- Bcrypt password hashing
- Secure session management
- CORS protection

### 🗄️ Database & Storage
- MongoDB with Mongoose ODM
- Flexible NoSQL schema
- Optimized for Vercel serverless
- Document versioning support

### 📄 Document Processing
- PDF document parsing
- DOCX file extraction
- Text analysis and processing
- Automatic document type detection

### 🎨 Modern UI
- Built with Radix UI components
- Tailwind CSS styling
- Responsive design
- Dark mode support

## ✅ Features

- 🔐 **JWT Authentication** - Secure user authentication with HTTP-only cookies
- 🗄️ **MongoDB Database** - Flexible NoSQL database with Mongoose ODM
- 🎨 **Modern UI** - Built with Radix UI and Tailwind CSS
- 🚀 **Server-Side Rendering** - Optimized Next.js 15 with App Router
- 🔒 **Security** - Bcrypt password hashing, CORS protection
- 📱 **Responsive** - Mobile-first design
- ⚡ **API Routes** - RESTful API for all operations
- 🎯 **TypeScript** - Full type safety

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/1at23cs079-Mahi/studio.git
cd studio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp
JWT_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars

# AI Configuration (at least one required)
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

- [MongoDB Setup Guide](./MIGRATION_GUIDE.md)
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Quick Deploy Guide](./DEPLOY.md)

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/1at23cs079-Mahi/studio)

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with bcrypt
- **AI:** OpenAI GPT-4 & Google Gemini
- **Document Processing:** pdf-parse, mammoth
- **UI:** Radix UI + Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel-optimized

## 📂 Project Structure

```
studio/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/           # API Routes
│   │   │   ├── auth/     # Authentication endpoints
│   │   │   └── collections/ # Database operations
│   │   ├── login/        # Login page
│   │   └── register/     # Register page
│   ├── components/        # React components
│   ├── firebase/         # Auth hooks & providers
│   ├── lib/              # Utilities
│   │   ├── mongodb.ts   # MongoDB connection
│   │   ├── mongoose.ts  # Mongoose connection
│   │   └── auth.ts      # JWT utilities
│   └── models/           # Mongoose schemas
├── public/               # Static files
└── docs/                # Documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Legal AI
- `POST /api/legal/upload` - Upload and process legal document
- `POST /api/legal/analyze` - Analyze document (summary, risks, clauses, compliance)
- `POST /api/legal/generate` - Generate legal documents with AI

### Collections
- `GET /api/collections/[collection]` - Get all documents
- `POST /api/collections/[collection]` - Create document
- `GET /api/collections/[collection]/[id]` - Get document
- `PUT /api/collections/[collection]/[id]` - Update document
- `DELETE /api/collections/[collection]/[id]` - Delete document

## 🎨 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler
```

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ HTTP-only cookies (XSS protection)
- ✅ CSRF protection
- ✅ Server-side authentication on all API routes
- ✅ Environment variable protection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Vercel](https://vercel.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ by [Mahesh R](https://github.com/1at23cs079-Mahi)
