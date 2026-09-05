const { isLocalAdmin } = require('../services/localStore');

/**
 * Accepts Bearer local-token-{uid} or dev-token-{uid}.
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  if (idToken.startsWith('local-token-') || idToken.startsWith('dev-token-')) {
    const uid = idToken.replace(/^(local-token-|dev-token-)/, '');
    if (!uid) {
      return res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
    req.user = { uid, local: true };
    return next();
  }

  return res.status(403).json({
    error: 'Unauthorized: Invalid token. Use email/password login.',
  });
};

module.exports = verifyToken;
module.exports.isLocalAdmin = isLocalAdmin;
