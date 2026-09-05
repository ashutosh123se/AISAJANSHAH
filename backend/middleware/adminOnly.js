const { db, isFirebaseConfigured } = require('../firebase-admin');
const { isLocalAdmin } = require('../services/localStore');

const adminOnly = async (req, res, next) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(403).json({ error: 'Forbidden: Missing user' });
    }

    // Dig / local mode
    if (req.user.dig || !isFirebaseConfigured || !db) {
      if (isLocalAdmin(uid) || String(uid).includes('admin')) {
        return next();
      }
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(403).json({ error: 'User not found in database' });
    }

    const userData = userDoc.data();
    if (userData.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ error: 'Internal server error checking permissions' });
  }
};

module.exports = adminOnly;
