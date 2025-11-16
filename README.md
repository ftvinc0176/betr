# ProBets - Professional Sports Betting Website

A modern, professional sports betting website built with Next.js, React, and MongoDB. Features user registration, login, and live data logging to your Vercel deployment.

## Features

- **Professional Home Page**: Modern, responsive design with hero section and call-to-action buttons
- **User Registration**: Complete registration form with validation (Full Name, DOB, SSN, Address, Email, Password)
- **User Login**: Secure login with email and password
- **Live Data Logging**: All user data is logged to MongoDB and visible in your deployment
- **Secure Password Storage**: Passwords are hashed using bcryptjs
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **API Routes**: RESTful API endpoints for registration and login

## Tech Stack

- **Frontend**: React 19, Next.js 16, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: bcryptjs for password hashing
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ and npm
- MongoDB account (MongoDB Atlas recommended for cloud deployment)
- Git
- Vercel account (for deployment)

## Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB

Create a `.env.local` file in the root directory:

```env
# For MongoDB Atlas (recommended for Vercel)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/sportbetting?retryWrites=true&w=majority

# For local MongoDB
# MONGODB_URI=mongodb://localhost:27017/sportbetting
```

**To set up MongoDB Atlas:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string and add it to `.env.local`

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Pages

- **Home Page** (`/`): Landing page with features and call-to-action buttons
- **Register** (`/register`): User registration form
- **Login** (`/login`): User login page

### API Routes

- **POST** `/api/register`: Register a new user
  - Body: `{ fullName, dateOfBirth, socialSecurityNumber, address, email, password, confirmPassword }`
  - Returns: User object and success message

- **POST** `/api/login`: Login user
  - Body: `{ email, password }`
  - Returns: User object and success message

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. Create Vercel Project

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. Add Environment Variables

In Vercel Project Settings:
1. Go to Settings → Environment Variables
2. Add `MONGODB_URI` with your MongoDB connection string

### 4. Deploy

Click "Deploy" - Vercel will automatically build and deploy your site.

## Data Logging

All registration and login data is automatically logged to the console and MongoDB:

- Registration data includes: Full Name, DOB, Address, Email, Timestamp
- Login data includes: Full Name, Email, Timestamp

You can view logs:
- **Local**: Check your terminal/console output
- **Vercel**: Check the Deployment Logs in your Vercel dashboard

## File Structure

```
sportbetting/
├── app/
│   ├── api/
│   │   ├── login/route.ts          # Login API endpoint
│   │   └── register/route.ts       # Registration API endpoint
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── register/
│   │   └── page.tsx                # Registration page
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── lib/
│   ├── models/
│   │   └── User.ts                 # User MongoDB model
│   ├── mongodb.ts                  # MongoDB connection utility
│   └── types.ts                    # TypeScript type definitions
├── public/                         # Static assets
├── .env.local                      # Environment variables (not in git)
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── tailwind.config.ts              # Tailwind CSS config
└── next.config.ts                  # Next.js config
```

## Development

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

## Troubleshooting

### MongoDB Connection Issues

- Ensure your MongoDB Atlas connection string is in `.env.local`
- Check that your IP address is whitelisted in MongoDB Atlas (Security → Network Access)
- For local MongoDB, ensure the MongoDB service is running

### Build Errors

- Clear the `.next` folder and reinstall dependencies
- Run `npm run build` to verify

### Data Not Logging

- Check the Vercel deployment logs
- Ensure MongoDB URI is correctly set in Vercel environment variables
- Check browser console for frontend errors

## Security Notes

- **Never commit** `.env.local` to git
- Social Security Numbers and addresses are sensitive - consider additional encryption for production
- Always use HTTPS in production (Vercel handles this automatically)
- Implement rate limiting on API routes for production
- Add CSRF protection for form submissions

## Future Enhancements

- Password reset functionality
- User profile page
- Email verification
- Two-factor authentication
- Betting slip functionality
- Real-time odds updates
- Admin dashboard for monitoring

---

**Happy Betting!** 🎯
