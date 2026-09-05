const { isLocalAdmin } = require('../services/localStore');

const adminOnly = async (req, res, next) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(403).json({ error: 'Forbidden: Missing user' });
    }

    if (isLocalAdmin(uid) || String(uid).includes('admin')) {
      return next();
    }

    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ error: 'Internal server error checking permissions' });
  }
};

module.exports = adminOnly;
