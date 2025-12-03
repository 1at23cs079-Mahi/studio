# Deploying to Vercel with MongoDB

This guide will help you deploy your Next.js app with MongoDB to Vercel.

## Prerequisites

- MongoDB Atlas account (free tier works)
- Vercel account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare MongoDB Atlas for Production

### 1.1 Network Access Configuration

1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is necessary for Vercel's dynamic IP addresses
4. Click **"Confirm"**

### 1.2 Get Your Connection String

1. In MongoDB Atlas, click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your actual database password
5. Add your database name before the `?` in the URI

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/myapp?retryWrites=true&w=majority
```

## Step 2: Push Your Code to Git

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "MongoDB integration complete"

# Add remote (if using GitHub)
git remote add origin https://github.com/yourusername/yourrepo.git

# Push
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect Next.js
4. Click **"Environment Variables"**
5. Add these variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=another-super-secret-key-min-32-chars
```

6. Click **"Deploy"**

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

## Step 4: Add Environment Variables in Vercel

If you didn't add them during deployment:

1. Go to your project in Vercel dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add each variable:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
4. Select all environments (Production, Preview, Development)
5. Click **"Save"**

### Generate Secure Secrets

For `JWT_SECRET` and `NEXTAUTH_SECRET`, use secure random strings:

**Windows PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

## Step 5: Update NEXTAUTH_URL

After your first deployment, update the `NEXTAUTH_URL` variable:

1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` with your actual URL
4. Redeploy the app

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Try registering a new user
3. Try logging in
4. Check MongoDB Atlas to see if data is being saved

## Vercel Configuration

### vercel.json (Optional)

Create `vercel.json` in your project root for custom configuration:

```json
{
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "JWT_SECRET": "@jwt-secret"
  },
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### Edge Runtime Compatibility

MongoDB works with Vercel's Node.js runtime but NOT with Edge Runtime. The API routes are already configured for Node.js runtime.

## Troubleshooting

### "MongoServerError: bad auth"
- Check your MongoDB password in the connection string
- Make sure you URL-encoded special characters

### "Connection timeout"
- Verify Network Access allows 0.0.0.0/0
- Check your connection string is correct

### "Cannot find module 'mongodb'"
- Make sure `mongodb` and `mongoose` are in `dependencies`, not `devDependencies`
- Run `npm install` and redeploy

### Cold Start Issues
- MongoDB connections in serverless environments may have cold starts
- The connection pooling is optimized for Vercel

## Monitoring

### Vercel Logs
View logs in Vercel dashboard:
1. Go to your project
2. Click **"Deployments"**
3. Click on a deployment
4. View **"Functions"** logs

### MongoDB Atlas Monitoring
1. Go to MongoDB Atlas
2. Click **"Metrics"**
3. Monitor connections, operations, and performance

## Best Practices for Production

1. **Use connection pooling** (already implemented)
2. **Set appropriate indexes** in MongoDB for better performance
3. **Enable MongoDB Atlas monitoring**
4. **Use environment-specific databases**:
   - Production: `myapp-prod`
   - Preview: `myapp-preview`
   - Development: `myapp-dev`

5. **Secure your secrets**:
   - Never commit `.env.local` to git
   - Use Vercel's environment variables
   - Rotate JWT secrets periodically

## Automatic Deployments

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Your changes"
git push
```

Each push creates a new deployment!

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain

## Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Next.js on Vercel: https://nextjs.org/docs/deployment
