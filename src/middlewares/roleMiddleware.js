const requireRole = (...roles) => {
//...roles is the rest parameter — it collects all arguments into an array. 
  return (req, res, next) => {// This is the actual middleware function that will be called for each request
    // req.user was set by authMiddleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};

module.exports = requireRole;