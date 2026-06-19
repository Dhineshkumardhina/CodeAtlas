const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getTokenFromHeader = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

/**
 * Protect routes - ensures request is authenticated with valid JWT
 */
const protect = async (req, res, next) => {
  const token = getTokenFromHeader(req.headers.authorization);

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123456');

    // Get user from the token, excluding password
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, user not found'));
    }

    return next();
  } catch (error) {
    console.error('Auth verification error:', error.message);
    res.status(401);
    return next(new Error('Not authorized, token failed'));
  }
};

/**
 * Optional Auth - extracts user if token present, but doesn't block if missing
 */
const optionalAuth = async (req, res, next) => {
  const token = getTokenFromHeader(req.headers.authorization);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123456');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Just log and continue, we don't block
      console.warn('Optional auth token validation failed:', error.message);
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
