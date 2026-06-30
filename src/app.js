const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();

// ─── Global Middlewares ───────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ─── Rate Limiter ─────────────────────────────────────────────
// Limits login attempts to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 requests per window
  standardHeaders: true,     // sends rate limit info in headers
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts. Please try again after 15 minutes.'
  }
});

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth/login', loginLimiter); // apply only to login
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'User Auth API is running' });
});

module.exports = app;