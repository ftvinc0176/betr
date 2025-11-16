# Deployment Guide - GitHub to Vercel

## Overview

This guide walks you through pushing your code to GitHub and deploying to Vercel so your site is live on the internet.

---

## Part 1: Push to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Enter repository name: `sportbetting`
3. Add description: "Professional sports betting website"
4. Choose visibility: **Public** (free) or **Private** (requires plan)
5. Click "Create repository"
6. **DO NOT** initialize with README (we already have one!)

### Step 2: Connect Local Git to GitHub

Copy the commands from your GitHub repo page. They'll look like this:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sportbetting.git
git branch -M main
git push -u origin main
```

Paste each command into your terminal:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/sportbetting.git

# Rename branch to main
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Step 3: Verify on GitHub

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/sportbetting`
2. You should see all your project files
3. You should see 4 commits in the history
4. ✅ You're ready to deploy!

---

## Part 2: Deploy to Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 2: Import Repository

1. In Vercel dashboard, click "Add New..."
2. Select "Project"
3. Click "Import Git Repository"
4. Find and select `sportbetting`
5. Click "Import"

### Step 3: Configure Project

In the "Configure Project" page:

**Framework Preset:** Next.js (should be auto-detected ✅)

**Root Directory:** ./

**Environment Variables:** 
Click "Add Environment Variable"

| Name | Value |
|------|-------|
| MONGODB_URI | `mongodb+srv://username:password@cluster.mongodb.net/sportbetting?retryWrites=true&w=majority` |

**Replace with your actual MongoDB URI!**

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. See "Congratulations! Your site is live" ✅

### Step 5: Access Your Live Site

After deployment completes:
- Your site URL appears at the top: `https://sportbetting-xxx.vercel.app`
- Click it to visit your live website!
- Share this URL with others

---

## Getting Your MongoDB URI

### For MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in (or create account)
3. Create a new cluster (free tier works!)
4. Click "Connect"
5. Choose "Drivers" option
6. Copy the connection string
7. Replace `<password>` and `<dbname>`

Example:
```
mongodb+srv://myuser:mypassword@myCluster.mongodb.net/sportbetting?retryWrites=true&w=majority
```

**Save this string!** You need it for:
- Local development (.env.local)
- Vercel deployment (Environment Variables)

---

## What Happens After Deployment

### 1. Vercel Builds Your Site
- Installs dependencies
- Compiles TypeScript
- Optimizes for production
- Deploys to Vercel's CDN

### 2. Your Site Goes Live
- Available at `https://your-name.vercel.app`
- Automatically HTTPS secured
- Fast CDN delivery worldwide

### 3. Database Connection
- When users register, data goes to MongoDB
- Vercel logs show registration/login events
- MongoDB Atlas shows all stored users

### 4. Live Monitoring
In Vercel dashboard:
- **Deployments tab**: See build logs
- **Logs tab**: See real-time console output
- **Settings tab**: Manage environment variables

---

## Testing Your Live Deployment

1. Go to your live URL: `https://your-app.vercel.app`
2. Click "Register" button
3. Fill out the registration form
4. Submit
5. Check Vercel logs for "New User Registered" message
6. Go to MongoDB Atlas → Collections to see your data saved!

---

## After First Deployment

### Making Changes

```bash
# Make changes to your code locally
# Edit a file...

# Add changes to git
git add .

# Commit with a message
git commit -m "Your change description"

# Push to GitHub
git push origin main
```

### Automatic Deployment

- Vercel automatically detects your GitHub push
- Builds new version automatically
- Deploys in 1-2 minutes
- Your live site updates!

---

## Troubleshooting Deployment

### "Build Failed"
Check the build log in Vercel:
1. Go to Deployments tab
2. Click the failed deployment
3. Click "Logs"
4. Look for error messages
5. Common issues:
   - Missing environment variable
   - TypeScript error
   - Missing dependency

### "Database Connection Error"
1. Check MongoDB URI in Vercel settings
2. Verify IP is whitelisted in MongoDB Atlas
3. Test connection locally first

### "Blank Page / 404 Error"
1. Wait 5 minutes for CDN to update
2. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
3. Clear browser cache

### "Registration Not Working"
1. Check browser console for errors (F12)
2. Check Vercel logs
3. Verify MongoDB URI is correct
4. Test locally first

---

## Custom Domain (Optional)

To use a custom domain like `mybetting.com`:

1. In Vercel Project Settings → Domains
2. Enter your domain
3. Add DNS records to your domain provider
4. Verify ownership
5. Done! Your site is at your custom domain

---

## Environment Variables Reference

### Local Development (.env.local)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sportbetting
```

### Vercel Production (Project Settings → Environment Variables)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sportbetting
```

**Keep these SECRET!** Never commit .env.local to git.

---

## Git Workflow Going Forward

```bash
# 1. Make code changes
# 2. Test locally with: npm run dev

# 3. Commit to git
git add .
git commit -m "Describe your changes"

# 4. Push to GitHub
git push origin main

# 5. Vercel automatically deploys!
# → Check Vercel dashboard for build status
```

---

## Viewing Logs

### Local Development
```bash
npm run dev
# Logs appear in your terminal
```

### Vercel Production
1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click latest deployment
5. Click "Logs" tab
6. See all console output and errors

---

## Security Reminders

✅ **DO:**
- Keep MongoDB URI secret
- Never commit .env.local
- Use strong passwords
- Enable 2FA on GitHub and Vercel

❌ **DON'T:**
- Share your MongoDB connection string
- Commit .env files to git
- Use weak passwords
- Leave MongoDB open to all IPs

---

## Quick Reference

| Task | Command/Action |
|------|----------------|
| Test locally | `npm run dev` |
| View local logs | Check terminal output |
| Build for production | `npm run build` |
| Push to GitHub | `git push origin main` |
| View Vercel logs | Vercel dashboard → Logs tab |
| Check MongoDB data | MongoDB Atlas → Collections |
| Set env variables | Vercel Settings → Environment Variables |
| View live site | Click URL in Vercel dashboard |

---

## Help & Support

**Issue: Can't connect to MongoDB**
- Verify connection string is correct
- Check IP is whitelisted in MongoDB Atlas
- Ensure database user has permissions

**Issue: Code changes not showing up**
- Hard refresh browser (Ctrl+F5)
- Wait 5 minutes for CDN
- Check Vercel build was successful

**Issue: Registration form not working**
- Check browser console (F12)
- Check Vercel logs
- Test locally first with `npm run dev`

---

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Push your code to GitHub
3. ✅ Create Vercel account
4. ✅ Import repository to Vercel
5. ✅ Add MongoDB URI to Vercel
6. ✅ Deploy
7. ✅ Test registration on live site
8. ✅ Share URL with others!

---

## Congratulations! 🎉

Your professional sports betting website is now **LIVE ON THE INTERNET**!

Share your live URL: `https://your-app-name.vercel.app`

Every change you push to GitHub automatically deploys!

Happy betting! 🎯
