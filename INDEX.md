# 📚 Documentation Index - ProBets

Welcome to your professional sports betting website! Here's a guide to all the documentation files.

---

## 🚀 START HERE

### For the Fastest Start
👉 **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- MongoDB setup
- Local testing
- Deploy to Vercel
- Test live site

### For Complete Setup Instructions  
👉 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - GitHub & Vercel guide
- Create GitHub repository
- Push code to GitHub
- Deploy to Vercel
- Troubleshooting

### For Project Overview
👉 **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - What's been built
- Feature checklist
- Project statistics
- File structure
- Next steps

---

## 📖 DETAILED DOCUMENTATION

### Main Documentation
- **[README.md](./README.md)** - Complete project guide
  - Features overview
  - Prerequisites
  - Local setup detailed steps
  - File structure
  - Troubleshooting guide
  - Security notes

### API Reference
- **[API.md](./API.md)** - API endpoint documentation
  - POST /api/register - Registration endpoint
  - POST /api/login - Login endpoint
  - Request/response examples
  - Error handling
  - Data logging details
  - Testing instructions

### Deployment Guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to production
  - GitHub setup
  - Vercel deployment
  - MongoDB URI configuration
  - Environment variables
  - Automatic deployments
  - Custom domain setup

---

## 🗂️ PROJECT FILES

### Configuration Files
```
tsconfig.json              TypeScript configuration
next.config.ts             Next.js configuration  
tailwind.config.ts         Tailwind CSS configuration
postcss.config.mjs         PostCSS configuration
.eslintrc.json             ESLint configuration
.env.local                 Environment variables (git-ignored)
.gitignore                 Git exclusions
```

### Application Code
```
app/
├── page.tsx               Home page component
├── layout.tsx             Root layout
├── globals.css            Global styles
├── register/
│   └── page.tsx          Registration form page
├── login/
│   └── page.tsx          Login form page
└── api/
    ├── register/
    │   └── route.ts      Registration API endpoint
    └── login/
        └── route.ts      Login API endpoint

lib/
├── mongodb.ts            MongoDB connection utility
├── types.ts              TypeScript type definitions
└── models/
    └── User.ts           MongoDB User schema
```

---

## 🎯 What Each File Does

### Homepage (`app/page.tsx`)
- Professional landing page
- Navigation menu
- Hero section with CTA buttons
- Features showcase
- Statistics section
- Footer with links

### Registration (`app/register/page.tsx`)
- Registration form component
- Form fields: name, DOB, SSN, address, email, password
- Form validation
- Error/success messages
- Link to login page

### Login (`app/login/page.tsx`)
- Login form component
- Fields: email, password
- Validation
- Error/success messages
- Link to registration

### Registration API (`app/api/register/route.ts`)
- Handles POST requests to `/api/register`
- Validates all fields
- Checks for duplicate emails
- Hashes password with bcryptjs
- Saves to MongoDB
- Logs to console and MongoDB

### Login API (`app/api/login/route.ts`)
- Handles POST requests to `/api/login`
- Validates email and password
- Compares password hashes
- Returns user data on success
- Logs login to console

### Database Connection (`lib/mongodb.ts`)
- Establishes MongoDB connection
- Reuses connection (connection pooling)
- Uses environment variable `MONGODB_URI`
- Handles connection errors

### User Model (`lib/models/User.ts`)
- Defines MongoDB schema
- Fields: fullName, dateOfBirth, socialSecurityNumber, address, email, password
- Password hashing middleware
- Email validation
- Password comparison method

---

## 📋 Common Tasks

### View Your Live Site
1. Deploy to Vercel (see DEPLOYMENT.md)
2. Your URL: `https://your-app-name.vercel.app`

### Check Registered Users
1. Go to MongoDB Atlas
2. Click "Collections"
3. View "users" collection
4. See all registered data

### View Server Logs
**Local:** 
```bash
npm run dev
# Logs appear in terminal
```

**Production (Vercel):**
1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click latest deployment
5. Click "Logs" tab

### Make Code Changes
1. Edit files locally
2. Test: `npm run dev`
3. Push: `git push origin main`
4. Vercel auto-deploys!

### Add New Fields to Registration
1. Edit `lib/models/User.ts` - Add field to schema
2. Edit `app/register/page.tsx` - Add form input
3. Edit `app/api/register/route.ts` - Handle field
4. Test locally

---

## 🔄 Development Workflow

```
1. Make changes locally
   ↓
2. Test with: npm run dev
   ↓
3. Commit to git: git add . && git commit -m "message"
   ↓
4. Push to GitHub: git push origin main
   ↓
5. Vercel auto-deploys your site!
   ↓
6. Check live at: https://your-app.vercel.app
```

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Start production server | `npm start` |
| Check code quality | `npm run lint` |
| View MongoDB | Atlas → Collections |
| View Vercel logs | Dashboard → Deployments → Logs |
| Update live site | `git push origin main` |

---

## 🎓 Learning Path

### Phase 1: Understand the Project
1. Read PROJECT_SUMMARY.md
2. Explore the file structure
3. Review app/page.tsx (home page)

### Phase 2: Set Up Locally
1. Follow QUICKSTART.md
2. Run `npm run dev`
3. Test registration/login

### Phase 3: Deploy to Web
1. Follow DEPLOYMENT.md
2. Create GitHub repo
3. Deploy to Vercel
4. Share live URL!

### Phase 4: Customize
1. Edit brand name "ProBets"
2. Change colors (modify Tailwind classes)
3. Add your logo
4. Add more fields to registration

### Phase 5: Add Features
1. Email verification
2. Password reset
3. User dashboard
4. Admin panel
5. Betting functionality

---

## 🆘 Help & Support

### Can't get it working?

**Problem: MongoDB connection failed**
- Check `.env.local` has correct URI
- Verify IP whitelisted in MongoDB Atlas
- Ensure database user has permissions

**Problem: Site won't deploy**
- Check Vercel build logs
- Verify environment variables are set
- Ensure GitHub push succeeded

**Problem: Registration not saving**
- Check browser console (F12)
- Check Vercel logs
- Verify MongoDB is connected
- Test locally first

**Problem: Can't find MongoDB URI**
- Go to MongoDB Atlas
- Click "Connect"
- Choose "Drivers"
- Copy connection string

---

## 📚 External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 🎉 You're Ready!

Everything is set up and ready to go! 

**Next steps:**
1. ✅ Read QUICKSTART.md
2. ✅ Set up MongoDB
3. ✅ Test locally
4. ✅ Deploy to Vercel
5. ✅ Share your live site!

---

**Questions?** Check the relevant documentation file above or review inline code comments.

**Happy coding!** 🚀
