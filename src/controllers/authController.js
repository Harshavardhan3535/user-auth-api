const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const jwt = require('jsonwebtoken');

// ─── REGISTER ─────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input exists
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // 2. Check if email already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // 3. Create user — password gets hashed by pre-save hook automatically
    const user = await User.create({ name, email, password });

    // 4. Return success — never send password back
    // Note: You might want to generate tokens here as well, depending on your flow
    //201 Created. Notice — you manually pick which fields to return. Never do res.json(user) directly because that would include the hashed password and refreshToken in the response.
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input exists
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Compare password
    //Calls the instance method you wrote in the User model. bcrypt compares the plain password with the stored hash.
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5. Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // 6. Send refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,  //Prevents client-side JS from accessing the cookie. Helps mitigate XSS attacks.
      secure: process.env.NODE_ENV === 'production',  //Ensures the cookie is sent only over HTTPS in production.
      sameSite: 'Strict',  //Prevents the browser from sending this cookie along with cross-site requests. Helps mitigate CSRF attacks.
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds & Cookie expires automatically
    });

    // 7. Send access token in response body
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// ─── REFRESH TOKEN ────────────────────────────────────────────
const refresh = async (req, res) => {
  try {
    // 1. Read refresh token from cookie
    const token = req.cookies.refreshToken;//The refresh token is stored in an httpOnly cookie, so it cannot be accessed by client-side JavaScript. This helps mitigate XSS attacks. The cookie is sent automatically with the request to the server.

    if (!token) {
      return res.status(401).json({ message: 'No refresh token found' });//401 Unauthorized. The client must provide a valid refresh token to get a new access token.
    }

    // 2. Verify the refresh token signature and expiry
    let decoded;//The jwt.verify() method checks the token's signature and expiration. If the token is invalid or expired, it throws an error.
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);//If the token is valid, decoded will contain the payload (e.g., user ID and role) that was originally signed into the token.
    } catch (err) {
      return res.status(403).json({ message: 'Refresh token expired or invalid' });//403 Forbidden. The refresh token is either expired or invalid, so the client cannot get a new access token.
    }

    // 3. Find user in DB
    const user = await User.findById(decoded.id);//The decoded token contains the user ID, which is used to look up the user in the database. This ensures that the refresh token is still valid for an existing user.
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    // 4. Check DB token matches the cookie token(logout enforcement)
    // This is what makes logout actually work
    if (user.refreshToken !== token) {//If the refresh token stored in the database does not match the one sent in the cookie, it means the user has logged out or the token has been invalidated. In this case, the server denies the request for a new access token.
      return res.status(403).json({ message: 'Refresh token mismatch — please login again' });
    }//This is how you make stateless JWTs revocable.

    // 5. Generate new access token 
    const newAccessToken = generateAccessToken(user);
    //Only generates a new access token. Does NOT generate a new refresh token. The same refresh token keeps working until it expires or user logs out.

    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken
    });

  } catch (err) {
    console.error('Refresh error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    // 1. Read refresh token from cookie
    const token = req.cookies.refreshToken;

    if (token) {
      // 2. Find user by refresh token and clear it in DB
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    // 3. Clear the cookie from client //clearCookie must pass the same options as when the cookie was set. If options don't match, the browser won't actually clear it.
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });//Clears the refresh token cookie from the client. This ensures that the client no longer has a valid refresh token to use for obtaining new access tokens.

    res.status(200).json({ message: 'Logged out successfully' });

  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { register, login, refresh, logout };