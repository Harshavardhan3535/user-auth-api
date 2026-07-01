# 🔐 User Authentication API

A secure RESTful Authentication API built using **Node.js**, **Express.js**, **MongoDB**, **JWT Authentication**, and **Role-Based Access Control (RBAC)**.

This project demonstrates how modern backend authentication systems are implemented using secure password hashing, access and refresh tokens, authentication middleware, protected routes, and role-based authorization.

The project was developed as part of my backend development learning journey, with daily implementation, debugging, testing, and deployment documented throughout the repository.

---

# 🚀 Live Deployment

| Service | URL |
|---------|-----|
| Production API | https://user-auth-api-tzwz.onrender.com |
| Health Check | https://user-auth-api-tzwz.onrender.com/ |

---

## Local Setup

### Prerequisites
- Node.js v18 or above
- MongoDB installed locally
- npm v9 or above

### Steps

1. Clone the repository
```bash
   git clone https://github.com/Harshavardhan3535/user-auth-api.git
   cd user-auth-api
```

2. Install dependencies
```bash
   npm install
```

3. Create environment file
```bash
   cp .env.example .env
```
   Open `.env` and fill in your values.

4. Start development server
```bash
   npm run dev
```

5. Server runs at `http://localhost:5000`

6. Import `UserAuthAPI.postman_collection.json` into Postman to test all endpoints

---

# ✨ Features

- User Registration
- Secure Login
- Password Hashing using bcrypt
- JWT Authentication
- Refresh Token Authentication
- HTTP-only Cookie Support
- Protected Routes
- Role-Based Access Control (RBAC)
- User Authorization
- MongoDB Integration
- API Testing with Postman
- Production Deployment on Render

---

# 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (Access Token + Refresh Token)
- **Password Hashing:** bcryptjs
- **Deployment:** Render
- **Cloud Database:** MongoDB Atlas
- **API Testing:** Postman
- **Version Control:** Git & GitHub

---

## Security Features
- Passwords hashed with bcrypt (cost factor 10)
- JWT access tokens expire in 15 minutes
- Refresh tokens stored in httpOnly cookies (XSS protection)
- Refresh tokens persisted in DB — enables real logout
- Rate limiting on login endpoint (10 requests per 15 minutes)
- Input validation on all endpoints
- Role-Based Access Control (admin/user)

---

# 📁 Project Structure

```
user-auth-api/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── utils/
│
├── package.json
├── server.js
├── .env
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Harshavardhan3535/user-auth-api.git
```

Move into the project directory

```bash
cd user-auth-api
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

Start the server

```bash
npm start
```

---

# 🧪 API Testing

The repository includes a complete Postman Collection and Environment.

## Local Testing

1. Import the Postman Collection.
2. Import the Postman Environment.
3. Select the Local Environment.
4. Run the Login request.
5. The access token will automatically be stored.
6. All protected requests will automatically use the stored token.

## Production Testing

Update the Postman environment variable:

```text
https://user-auth-api-tzwz.onrender.com
```

Then execute the collection against the deployed API.

---

# 📌 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login and receive access & refresh tokens |
| POST | /api/auth/refresh | Public | Generate a new access token |
| POST | /api/auth/logout | Authenticated | Logout and invalidate refresh token |
| GET | /api/user/profile | User / Admin | Retrieve authenticated user's profile |
| GET | /api/admin/users | Admin | Retrieve all users |
| DELETE | /api/admin/users/:id | Admin | Delete a user |

---

# 🔐 Authentication Flow

## Registration

1. User submits registration details.
2. Input validation is performed.
3. Duplicate email addresses are checked.
4. Password is automatically hashed using bcrypt.
5. User data is stored in MongoDB.

---

## Login

1. User submits email and password.
2. Credentials are verified.
3. Password is compared using bcrypt.
4. Access Token is generated.
5. Refresh Token is generated.
6. Refresh Token is stored in MongoDB.
7. Refresh Token is sent as an HTTP-only cookie.
8. Access Token is returned to the client.

---

## Protected Routes

1. Client sends the Access Token.
2. Authentication middleware verifies the JWT.
3. User information is attached to the request.
4. Role middleware checks permissions.
5. Access is granted or denied.

---

## Token Refresh

1. Client sends Refresh Token.
2. Server validates the token.
3. New Access Token is generated.
4. User continues without logging in again.

---

## Logout

1. Refresh Token is removed from MongoDB.
2. HTTP-only cookie is cleared.
3. User session becomes invalid.

---

# 🛡 Security Features

- Password Hashing using bcrypt
- JWT Authentication
- Access Tokens
- Refresh Tokens
- HTTP-only Cookies
- Protected Routes
- Role-Based Access Control
- Authentication Middleware
- Authorization Middleware
- Session Invalidation
- Basic XSS Protection through HTTP-only Cookies

---

# 📈 Development Journey

## Day 1 – Project Setup

- Initialized Node.js project
- Configured Express server
- Connected MongoDB
- Created project folder structure
- Implemented MVC architecture

---

## Day 2 – User Model & Password Hashing

### Challenges

#### Windows vs Linux Commands

**Issue**

`touch` command unavailable in PowerShell.

**Solution**

Used `New-Item`.

---

#### Express Route Handler Error

**Issue**

```
Route.get() requires a callback function but got undefined
```

**Root Cause**

Routes were not exported.

**Solution**

Added:

```javascript
module.exports = router;
```

---

#### Express 5 Compatibility

**Issue**

```
next is not a function
```

**Root Cause**

Breaking changes introduced in Express 5.

**Solution**

Downgraded to Express 4.

---

#### Mongoose 9 Middleware

**Issue**

```
next is not a function
```

**Root Cause**

Async middleware API changed.

**Solution**

Removed `next`.

### Key Takeaway

Framework version compatibility is just as important as writing the feature itself.

---

## Day 3 – Registration & Login

### Implemented

- Register API
- Login API
- bcrypt password hashing
- JWT authentication
- Refresh Tokens
- HTTP-only Cookies

### Learned

- Password security
- JWT Authentication
- Access vs Refresh Tokens
- Cookie Security

---

## Day 4 – Authentication & Authorization

### Implemented

- JWT Authentication Middleware
- RBAC Middleware
- Protected Routes

### Learned

- Authentication
- Authorization
- Middleware Chaining

---

## Day 5 – Refresh Tokens

### Implemented

- Refresh Token API
- Logout API
- Token Invalidation

### Learned

- Session Management
- Secure Logout
- Refresh Token Lifecycle

---

## Day 6 – API Testing

### Implemented

- Complete Postman Collection
- Environment Variables
- Automated Token Storage

### Learned

- API Testing
- Authorization Headers
- Environment Variables

---

## Day 7 – Production Deployment

### Deployment

- Deployed Node.js API on Render
- Connected MongoDB Atlas
- Configured Production Environment Variables
- Verified Live API

### Challenges

#### Incorrect Repository Structure

Render could not locate `package.json`.

**Solution**

Configured the Root Directory as `user-auth-api`.

---

#### MongoDB Authentication Failed

```
bad auth: authentication failed
```

**Root Cause**

Password contained placeholder brackets copied from Atlas.

**Solution**

Updated the connection string with the correct password.

### Key Takeaway

Production deployment introduces configuration and infrastructure challenges that do not appear during local development.

---

# 📚 What I Learned

Throughout this project I gained practical experience with:

- Backend project structure
- REST API development
- MongoDB integration
- Authentication & Authorization
- JWT Security
- Password Hashing
- Protected Routes
- Refresh Token Flow
- Middleware
- API Testing
- Production Deployment
- Debugging Framework Compatibility Issues
- Environment Variables
- Git & GitHub Workflow

---

# 👨‍💻 Author

**Harsha Vardhan**

GitHub: https://github.com/Harshavardhan3535

LinkedIn: https://www.linkedin.com/in/harsha-vardhan-6367bb28b

---
*Last updated: June 30, 2026*
.
.
