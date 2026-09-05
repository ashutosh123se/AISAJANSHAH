const { auth, isFirebaseConfigured } = require('../firebase-admin');
const { isLocalAdmin } = require('../services/localStore');

const isDevAuth = process.env.DEV_AUTH === 'true' || !isFirebaseConfigured;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  if (isDevAuth && idToken.startsWith('dev-token-')) {
    const uid = idToken.replace('dev-token-', '');
    req.user = { uid, dig: true };
    return next();
  }

  if (!auth) {
    return res.status(403).json({
      error: 'Unauthorized: Firebase Admin not configured. Set DEV_AUTH=true for dig mode.',
    });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;
module.exports.isDevAuth = isDevAuth;
module.exports.isLocalAdmin = isLocalAdmin;
