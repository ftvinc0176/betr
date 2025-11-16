# Quick Start Guide - ProBets Sports Betting Website

## 🎯 Project Summary

Your professional sports betting website is ready! It includes:

✅ Professional home page with hero section
✅ User registration with full validation
✅ User login system
✅ MongoDB data logging
✅ Secure password hashing
✅ Mobile-responsive design
✅ Ready for Vercel deployment

## 🚀 Next Steps

### 1. Set Up MongoDB Atlas (REQUIRED for data logging)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier is fine)
4. Create a database user
5. Whitelist your IP address in Network Access
6. Get your connection string
7. Add to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sportbetting?retryWrites=true&w=majority
   ```

### 2. Test Locally

```bash
npm run dev
```

Then visit:
- Home: http://localhost:3000
- Register: http://localhost:3000/register
- Login: http://localhost:3000/login

Try registering a test account and watch the data appear in MongoDB!

### 3. Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository
3. Follow GitHub's instructions to push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sportbetting.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. In Environment Variables, add:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string
5. Click "Deploy"

## 📁 Project Structure

```
sportbetting/
├── app/
│   ├── api/
│   │   ├── login/route.ts       ← Login API
│   │   └── register/route.ts    ← Registration API
│   ├── login/page.tsx           ← Login page
│   ├── register/page.tsx        ← Registration page
│   ├── page.tsx                 ← Home page
│   └── layout.tsx               ← Root layout
├── lib/
│   ├── models/User.ts           ← MongoDB user schema
│   ├── mongodb.ts               ← DB connection
│   └── types.ts                 ← TypeScript types
└── .env.local                   ← Environment config
```

## 🔐 Data Collection

When users register, the following data is logged:
- Full Name ✓
- Date of Birth ✓
- Social Security Number ✓
- Full Address ✓
- Email ✓
- Password (hashed) ✓

All data is stored in MongoDB and visible in your Vercel logs!

## 🛠️ Available Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Run production server
npm run lint       # Check code quality
```

## ⚙️ Customization Ideas

- Change brand name from "ProBets" to your name
- Add your logo in the header
- Modify colors in Tailwind CSS classes
- Add more sports categories
- Implement betting slip functionality
- Add email verification on signup

## ⚠️ Important Security Notes

- **NEVER** commit `.env.local` to git (it's in .gitignore)
- SSNs and addresses are sensitive - consider additional encryption
- Set up rate limiting in production
- Enable 2FA on your Vercel account
- Review MongoDB connection string permissions

## 🐛 Troubleshooting

**Can't connect to MongoDB:**
- Check connection string in `.env.local`
- Verify IP is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions

**Data not saving:**
- Check browser console for errors
- Check terminal for API errors
- Verify MongoDB URI is correct
- Check Vercel logs after deployment

**Build errors:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📞 Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Test locally with `npm run dev`
3. ✅ Create GitHub repository
4. ✅ Push code to GitHub
5. ✅ Deploy to Vercel
6. ✅ Share your live URL!

---

**Congratulations on your new sports betting website!** 🎉

For detailed information, see README.md
