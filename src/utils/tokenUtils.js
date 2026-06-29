const jwt = require('jsonwebtoken');

// Generates a short-lived access token (15 minutes)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },//Payload — the data you want to store inside the token
    process.env.ACCESS_TOKEN_SECRET,//Secret key used to sign the token
    { expiresIn: '15m' }
  );
};

// Generates a long-lived refresh token (7 days)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };


//Why different secrets for access and refresh tokens?
//If your ACCESS_TOKEN_SECRET leaks, an attacker cannot use it to forge refresh tokens because they're signed with a different secret. Security in layers.
