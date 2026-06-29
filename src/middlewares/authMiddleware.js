const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers['authorization'];

    // 2. Check if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // 3. Extract token — remove "Bearer " prefix
    const token = authHeader.split(' ')[1];

    // 4. Verify the token 
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //->This single line does three things automatically:
    // Checks the signature — was this token signed with our secret?
    // Checks expiry — is exp timestamp in the future?
    // Decodes the payload — returns { id, role, iat, exp }


    // 5. Attach decoded payload to req.user
    req.user = decoded;

    // 6. Move to next middleware or controller
    next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;