// jwtUtils.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET; // ← use this
if (!JWT_SECRET) {
  console.error('❌ ACCESS_TOKEN_SECRET not set in environment!');
  process.exit(1);
}

const TOKEN_EXPIRATION = '1d';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    return null;
  }
}

function createAuthToken(account) {
  const payload = {
    userId: account.account_id || account.id,
    email: account.account_email,
    role: account.account_type
  };
  return signToken(payload);
}

function setAuthCookie(res, token) {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  });
}

function clearAuthCookie(res) {
  res.clearCookie('jwt');
}

function extractToken(req) {
  if (req.cookies && req.cookies.jwt) return req.cookies.jwt;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
}

module.exports = {
  signToken,
  verifyToken,
  createAuthToken,
  setAuthCookie,
  clearAuthCookie,
  extractToken
};
