const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

const isFirebaseConfigured = Boolean(
  process.env.FIREBASE_PROJECT_ID?.trim() &&
  process.env.FIREBASE_CLIENT_EMAIL?.trim() &&
  privateKey
);

if (isFirebaseConfigured && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const db = isFirebaseConfigured ? admin.firestore() : null;
const auth = isFirebaseConfigured ? admin.auth() : null;

module.exports = { admin, db, auth, isFirebaseConfigured };
