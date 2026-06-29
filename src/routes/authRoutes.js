const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login',    login);
router.post('/refresh',  refresh);
router.post('/logout',   verifyToken, logout);//The logout route is protected by the verifyToken middleware, which checks for a valid access token. This ensures that only authenticated users can log out.

module.exports = router;