# Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/1at23cs079-Mahi/studio)

## 🚀 One-Click Deployment Steps

### 1. Click the "Deploy to Vercel" button above

### 2. Configure Environment Variables

When prompted, add these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `your-random-secret-key-here-min-32-chars` |
| `NEXTAUTH_URL` | Your Vercel deployment URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for NextAuth (min 32 chars) | `another-random-secret-key-min-32-chars` |

### 3. Generate Secure Secrets

**Windows PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Linux/Mac/Git Bash:**
```bash
openssl rand -base64 32
```

### 4. Set Up MongoDB Atlas (if you haven't already)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster
3. Create a database user
4. **Important:** Network Access → Add IP → "Allow Access from Anywhere" (0.0.0.0/0)
5. Get your connection string from "Connect" → "Connect your application"

### 5. Deploy!

Click "Deploy" and wait ~2 minutes. Your app will be live! 🎉

## 📦 Manual Deployment

If you prefer the CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

## 🔄 Automatic Deployments

Every push to your `main` branch automatically deploys to Vercel!

```bash
git add .
git commit -m "Update app"
git push origin main
```

## 📚 Full Documentation

- [Complete Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [MongoDB Setup Guide](./MIGRATION_GUIDE.md)

## 🆘 Troubleshooting

**Connection Error?**
- Check MongoDB Network Access allows 0.0.0.0/0
- Verify your connection string password is correct

**Authentication Not Working?**
- Make sure JWT_SECRET and NEXTAUTH_SECRET are set
- Check that NEXTAUTH_URL matches your deployment URL

**Build Failed?**
- Ensure all dependencies are in `dependencies`, not `devDependencies`
- Check Vercel build logs for specific errors

## 🌐 After First Deploy

1. Copy your Vercel URL (e.g., `https://your-app-abc123.vercel.app`)
2. Go to Vercel Project → Settings → Environment Variables
3. Update `NEXTAUTH_URL` with your actual URL
4. Redeploy

## ✨ Features

- ✅ MongoDB Database
- ✅ JWT Authentication
- ✅ User Registration/Login
- ✅ Secure HTTP-only Cookies
- ✅ RESTful API Routes
- ✅ Server-Side Rendering
- ✅ Automatic HTTPS

## 📊 Monitor Your App

- **Vercel Dashboard:** View deployments, logs, and analytics
- **MongoDB Atlas:** Monitor database performance and connections

---

Need help? Check the [documentation](./VERCEL_DEPLOYMENT.md) or open an issue!
