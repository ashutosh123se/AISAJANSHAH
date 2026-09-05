const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'local-store.json');

const defaultStore = () => ({
  users: {
    'local-admin-001': {
      id: 'local-admin-001',
      email: 'ashutoshshekhar37@gmail.com',
      name: 'Ashutosh Shekhar',
      role: 'student',
      status: 'active',
      password: 'Ashutosh@1234sa',
      onboardingComplete: true,
      onboardingCompleted: true,
      xp: 120,
      level: 3,
      createdAt: new Date().toISOString(),
    },
    'local-student-001': {
      id: 'local-student-001',
      email: 'sharma.dhruv@mca.christuniversity.in',
      name: 'Dhruv Sharma',
      phone: '',
      workshop: 'Memory Workshop',
      role: 'student',
      status: 'active',
      password: 'Password@123',
      onboardingComplete: true,
      onboardingCompleted: true,
      xp: 40,
      level: 1,
      createdAt: new Date().toISOString(),
    },
  },
  emailLogs: [],
});

const SEED_PASSWORDS = {
  'ashutoshshekhar37@gmail.com': 'Ashutosh@1234sa',
  'sharma.dhruv@mca.christuniversity.in': 'Password@123',
};

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(defaultStore(), null, 2));
  }
}

function readStore() {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  } catch {
    const fresh = defaultStore();
    writeStore(fresh);
    return fresh;
  }
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function listStudents() {
  const store = readStore();
  return Object.values(store.users)
    .filter((u) => u.role !== 'admin')
    .map((u) => {
      const { password, ...safe } = u;
      return { ...safe };
    });
}

function getUser(uid) {
  const store = readStore();
  return store.users[uid] ? { ...store.users[uid] } : null;
}

function getStats() {
  const students = listStudents();
  const store = readStore();
  const now = new Date();
  const newThisMonth = students.filter((s) => {
    if (!s.createdAt) return false;
    const d = new Date(s.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return {
    totalStudents: students.length,
    activeThisWeek: Math.max(1, Math.floor(students.length * 0.8)),
    emailsSent: store.emailLogs.length,
    newThisMonth,
  };
}

function createStudent({ email, password, name, phone, workshop, sendEmail }) {
  const store = readStore();
  const exists = Object.values(store.users).some(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    const err = new Error('Email already exists');
    err.code = 'already-exists';
    throw err;
  }

  const id = `local-student-${crypto.randomBytes(4).toString('hex')}`;
  store.users[id] = {
    id,
    email,
    name,
    phone: phone || '',
    workshop: workshop || '',
    role: 'student',
    status: 'active',
    password, // dig-only, not for production Firebase path
    createdAt: new Date().toISOString(),
    onboardingComplete: false,
    onboardingCompleted: false,
    xp: 0,
    level: 1,
  };

  let emailStatus = 'skipped';
  if (sendEmail) {
    // Dig mode has no SendGrid — mail is not actually delivered
    emailStatus = 'not_delivered';
    store.emailLogs.unshift({
      id: `log-${Date.now()}`,
      to: email,
      type: 'welcome',
      subject: 'Welcome to AI Sajan Shah',
      sentAt: new Date().toISOString(),
      status: 'not_delivered',
      note: 'Email not sent — SendGrid is not configured in dig mode',
    });
  }

  writeStore(store);
  return { uid: id, emailStatus, password };
}

function deleteStudent(id) {
  const store = readStore();
  if (!store.users[id] || store.users[id].role === 'admin') {
    const err = new Error('Student not found');
    err.code = 'not-found';
    throw err;
  }
  delete store.users[id];
  writeStore(store);
}

function updateStudent(id, updates) {
  const store = readStore();
  const existing = store.users[id];
  if (!existing || existing.role === 'admin') {
    const err = new Error('Student not found');
    err.code = 'not-found';
    throw err;
  }

  const nextEmail = (updates.email || existing.email || '').trim();
  if (!nextEmail || !(updates.name || existing.name)) {
    const err = new Error('Name and email are required');
    err.code = 'invalid';
    throw err;
  }

  const emailTaken = Object.values(store.users).some(
    (u) => u.id !== id && u.email?.toLowerCase() === nextEmail.toLowerCase()
  );
  if (emailTaken) {
    const err = new Error('Email already exists');
    err.code = 'already-exists';
    throw err;
  }

  store.users[id] = {
    ...existing,
    name: (updates.name ?? existing.name).trim(),
    email: nextEmail,
    phone: updates.phone !== undefined ? updates.phone : existing.phone,
    workshop: updates.workshop !== undefined ? updates.workshop : existing.workshop,
    status: updates.status !== undefined ? updates.status : existing.status,
    updatedAt: new Date().toISOString(),
  };

  writeStore(store);
  return { ...store.users[id] };
}

function bulkCreate(students) {
  const results = { successful: 0, failed: 0, errors: [] };
  for (const student of students) {
    try {
      if (!student.email || !student.name) {
        throw new Error('name and email are required');
      }
      const password = Math.random().toString(36).slice(-8) + 'A1!';
      createStudent({
        email: student.email,
        name: student.name,
        phone: student.phone || '',
        workshop: student.workshop || 'Bulk Upload',
        password,
        sendEmail: true,
      });
      results.successful++;
    } catch (err) {
      results.failed++;
      results.errors.push({ email: student.email, error: err.message });
    }
  }
  return results;
}

function listEmailLogs() {
  return readStore().emailLogs.slice(0, 50);
}

function isLocalAdmin(uid) {
  const user = getUser(uid);
  return Boolean(user && user.role === 'admin');
}

function toPublicProfile(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return {
    ...safe,
    uid: user.id || user.uid,
    onboardingComplete: Boolean(user.onboardingComplete || user.onboardingCompleted),
  };
}

function completeOnboarding(uid, { name, onboardingData }) {
  const store = readStore();
  const existing = store.users[uid];
  if (!existing || existing.role === 'admin') {
    const err = new Error('Student not found');
    err.code = 'not-found';
    throw err;
  }

  store.users[uid] = {
    ...existing,
    name: name || existing.name,
    onboardingComplete: true,
    onboardingCompleted: true,
    onboardingData: onboardingData || existing.onboardingData || {},
    updatedAt: new Date().toISOString(),
  };

  writeStore(store);
  return toPublicProfile(store.users[uid]);
}

function authenticateLocal(email, password) {
  const normalized = String(email || '').trim().toLowerCase();
  const pass = String(password ?? '');
  const store = readStore();
  const user = Object.values(store.users).find(
    (u) => u.email?.toLowerCase() === normalized
  );

  if (!user) {
    const err = new Error('Invalid email or password.');
    err.code = 'invalid-credentials';
    throw err;
  }

  if (user.status && user.status !== 'active') {
    const err = new Error('Account is inactive. Contact an admin.');
    err.code = 'inactive';
    throw err;
  }

  const expected =
    user.password !== undefined && user.password !== null && user.password !== ''
      ? String(user.password)
      : SEED_PASSWORDS[normalized];

  if (!expected || expected !== pass) {
    const err = new Error('Invalid email or password.');
    err.code = 'invalid-credentials';
    throw err;
  }

  // Persist seed password onto legacy rows so later edits stay consistent
  if (!user.password && SEED_PASSWORDS[normalized]) {
    store.users[user.id].password = SEED_PASSWORDS[normalized];
    writeStore(store);
  }

  return toPublicProfile(user);
}

module.exports = {
  listStudents,
  getUser,
  getStats,
  createStudent,
  deleteStudent,
  updateStudent,
  bulkCreate,
  listEmailLogs,
  isLocalAdmin,
  authenticateLocal,
  completeOnboarding,
};
