const express = require('express');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'User Auth API is running' });
});

module.exports = app;