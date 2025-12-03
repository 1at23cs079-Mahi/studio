# MongoDB Migration Guide

## What Changed

The application has been migrated to MongoDB for a flexible, scalable NoSQL database backend with JWT authentication.

## Setup Instructions

### 1. Create a MongoDB Atlas Account (Free)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a new cluster (select the free tier M0)
4. Wait for the cluster to be created (2-3 minutes)

### 2. Get Your Connection String

1. In MongoDB Atlas, click "Connect" on your cluster
2. Select "Connect your application"
3. Copy the connection string
4. It looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`

### 3. Set Up Database Access

1. Go to "Database Access" in Atlas
2. Click "Add New Database User"
3. Create a username and password
4. Give the user "Read and write to any database" permissions

### 4. Set Up Network Access

1. Go to "Network Access" in Atlas
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Or add your specific IP address

### 5. Update Environment Variables

Edit `.env.local` and add your credentials:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=another-super-secret-key-for-nextauth-min-32-chars
```

**Important:** Replace `username`, `password`, and `cluster` with your actual values!

### 6. Generate Secure Secrets

For production, generate secure random strings:

```bash
# On Windows PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# On Linux/Mac:
openssl rand -base64 32
```

## API Routes

The app now uses REST API routes instead of direct database access:

### Authentication APIs

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```

- `POST /api/auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/logout` - Logout

- `GET /api/auth/me` - Get current user

### Data APIs

- `GET /api/collections/[collection]` - Get all documents
  - Query params: `filter`, `sort`, `limit`
  
- `POST /api/collections/[collection]` - Create document

- `GET /api/collections/[collection]/[id]` - Get single document

- `PUT /api/collections/[collection]/[id]` - Update document

- `DELETE /api/collections/[collection]/[id]` - Delete document

## Hooks Usage

### useUser Hook
```typescript
import { useUser } from '@/firebase';

const { user, isLoading } = useUser();
// user: { id, email, name, role } | null
```

### useCollection Hook
```typescript
import { useCollection } from '@/firebase';

const { data, isLoading, error } = useCollection({
  collection: 'posts',
  filter: { published: true },
  sort: { createdAt: -1 },
  limit: 10
});
```

### useDoc Hook
```typescript
import { useDoc } from '@/firebase';

const { data, isLoading, error } = useDoc({
  collection: 'posts',
  id: '507f1f77bcf86cd799439011'
});
```

## Authentication Flow

1. User registers via `/api/auth/register`
2. Server creates user in MongoDB with hashed password
3. Server generates JWT token and sets HTTP-only cookie
4. Subsequent requests include the cookie automatically
5. API routes verify the JWT token from cookie

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('public' | 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

✅ Passwords hashed with bcrypt (10 rounds)
✅ JWT tokens with 7-day expiration
✅ HTTP-only cookies (XSS protection)
✅ Server-side authentication on all API routes
✅ Password validation and email uniqueness

## Need Help?

- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Mongoose Docs: https://mongoosejs.com/docs/
- MongoDB Node Driver: https://www.mongodb.com/docs/drivers/node/current/

## Testing the Setup

Once configured, restart the dev server. The app should:
1. Connect to MongoDB on startup
2. Allow user registration
3. Allow user login
4. Maintain sessions via cookies
5. Protect API routes with authentication
