# API Documentation - ProBets

## Overview

All API endpoints are prefixed with `/api/` and use JSON for request/response bodies.

## Base URL

- **Local**: `http://localhost:3000/api`
- **Production**: `https://your-vercel-app.vercel.app/api`

## Endpoints

### 1. User Registration

**Endpoint:** `POST /api/register`

**Purpose:** Create a new user account

**Request Body:**
```json
{
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "socialSecurityNumber": "123-45-6789",
  "address": "123 Main St, New York, NY 10001",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

- **400 - Missing Fields:**
```json
{
  "error": "Please provide all required fields"
}
```

- **400 - Passwords Don't Match:**
```json
{
  "error": "Passwords do not match"
}
```

- **400 - Email Already Registered:**
```json
{
  "error": "Email already registered"
}
```

- **500 - Server Error:**
```json
{
  "error": "Failed to register user"
}
```

**Field Validation:**
- `fullName`: Required, string
- `dateOfBirth`: Required, valid date (YYYY-MM-DD)
- `socialSecurityNumber`: Required, string
- `address`: Required, string
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `confirmPassword`: Required, must match password

**Data Logging:**
When a user registers, the following is logged to MongoDB and console:
```
New User Registered: {
  id: "user_mongo_id",
  fullName: "John Doe",
  email: "john@example.com",
  dateOfBirth: "1990-01-15",
  address: "123 Main St, New York, NY 10001",
  timestamp: "2024-11-16T10:30:00.000Z"
}
```

---

### 2. User Login

**Endpoint:** `POST /api/login`

**Purpose:** Authenticate user with email and password

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

- **400 - Missing Fields:**
```json
{
  "error": "Please provide email and password"
}
```

- **401 - Invalid Credentials:**
```json
{
  "error": "Invalid email or password"
}
```

- **500 - Server Error:**
```json
{
  "error": "Failed to login"
}
```

**Data Logging:**
When a user logs in successfully, the following is logged:
```
User Login: {
  id: "user_mongo_id",
  fullName: "John Doe",
  email: "john@example.com",
  timestamp: "2024-11-16T10:35:00.000Z"
}
```

---

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful login |
| 201 | Created | Successful registration |
| 400 | Bad Request | Validation errors, missing fields |
| 401 | Unauthorized | Invalid credentials |
| 500 | Internal Server Error | Database or server errors |

---

## Error Handling

All errors follow this format:
```json
{
  "error": "Error message describing what went wrong"
}
```

**Client-side error handling example:**
```javascript
const response = await fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

const result = await response.json();

if (!response.ok) {
  console.error(result.error); // Display error to user
} else {
  console.log('Success:', result.user);
}
```

---

## Rate Limiting Recommendations

For production deployment, add rate limiting to prevent abuse:

```typescript
// Example: Implement in production
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 requests per windowMs
});

app.post('/api/register', limiter, registerHandler);
app.post('/api/login', limiter, loginHandler);
```

---

## Security Best Practices

1. **Always use HTTPS** in production (Vercel handles this)
2. **Validate all inputs** on both client and server
3. **Hash passwords** with bcryptjs (already implemented)
4. **Never log sensitive data** like passwords or SSNs
5. **Implement CORS** if calling from different domains
6. **Add rate limiting** to prevent brute force attacks
7. **Use strong database passwords** with special characters
8. **Enable encryption** for sensitive fields in MongoDB

---

## Testing the APIs

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "dateOfBirth": "1990-01-01",
    "socialSecurityNumber": "123-45-6789",
    "address": "123 Test St",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Set request type to `POST`
2. Enter endpoint URL: `http://localhost:3000/api/register`
3. Set Header: `Content-Type: application/json`
4. Paste JSON body from examples above
5. Click "Send"

---

## Viewing Logged Data

### In Local Development
Check your terminal where `npm run dev` is running. You'll see logs like:
```
New User Registered: { id: '...', fullName: 'John Doe', ... }
User Login: { id: '...', fullName: 'John Doe', ... }
```

### In MongoDB
1. Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Navigate to your cluster
3. Click "Collections"
4. View your `users` collection to see all registered data

### In Vercel
1. Go to your Vercel project dashboard
2. Click "Deployments"
3. Select the latest deployment
4. Click "Logs" tab
5. Scroll to see API request logs and console output

---

## Database Schema

### User Collection

```typescript
{
  _id: ObjectId,
  fullName: String,
  dateOfBirth: Date,
  socialSecurityNumber: String,
  address: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Future API Endpoints to Add

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete account
- `POST /api/password-reset` - Reset forgotten password
- `POST /api/email-verify` - Verify email address
- `GET /api/bets` - Get user's bets
- `POST /api/bets` - Place a new bet

---

## Support

For issues or questions:
1. Check the README.md
2. Review QUICKSTART.md
3. Check Vercel deployment logs
4. Verify MongoDB connection string
