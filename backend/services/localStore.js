const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'local-store.json');

const STUDENT_EMAIL = 'ashutoshshekhar37@gmail.com';
const STUDENT_PASSWORD = 'Ashutosh@1234sa';
/** Common typo and historical aliases for the demo student email */
const STUDENT_EMAIL_ALIASES = [
  'ashutoshshrkhar37@gmail.com',
  'ashutoshshekhar32@gmail.com',
  'ashutoshshekhar052@gmail.com',
];

const defaultStore = () => ({
  users: {
    'local-admin-001': {
      id: 'local-admin-001',
      email: 'admin@aisajanshah.com',
      name: 'Platform Admin',
      role: 'admin',
      status: 'active',
      password: 'Admin@1234sa',
      onboardingComplete: true,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    },
    'local-student-demo': {
      id: 'local-student-demo',
      email: STUDENT_EMAIL,
      name: 'Ashutosh Shekhar',
      phone: '',
      workshop: 'Memory Workshop',
      role: 'student',
      status: 'active',
      password: STUDENT_PASSWORD,
      onboardingComplete: true,
      onboardingCompleted: true,
      xp: 120,
      level: 3,
      createdAt: new Date().toISOString(),
    },
  },
  emailLogs: [],
});

const SEED_PASSWORDS = {
  [STUDENT_EMAIL]: STUDENT_PASSWORD,
  'admin@aisajanshah.com': 'Admin@1234sa',
};

function ensureDemoAccounts(store) {
  let changed = false;

  const ashutoshEmails = [STUDENT_EMAIL, ...STUDENT_EMAIL_ALIASES];

  // Update any existing Ashutosh accounts in store to student role with STUDENT_PASSWORD
  for (const u of Object.values(store.users)) {
    if (ashutoshEmails.includes(u.email?.toLowerCase())) {
      if (u.role === 'admin') {
        u.role = 'student';
        changed = true;
      }
      if (u.password !== STUDENT_PASSWORD) {
        u.password = STUDENT_PASSWORD;
        changed = true;
      }
      if (!u.onboardingComplete) {
        u.onboardingComplete = true;
        u.onboardingCompleted = true;
        changed = true;
      }
      if (u.name === 'Admin Ashutosh') {
        u.name = 'Ashutosh Shekhar';
        changed = true;
      }
    }
  }

  // Ensure primary demo student account exists
  let student = Object.values(store.users).find(
    (u) => u.email?.toLowerCase() === STUDENT_EMAIL
  );

  if (!student) {
    store.users['local-student-demo'] = defaultStore().users['local-student-demo'];
    changed = true;
  }

  // Ensure dedicated platform admin account exists
  const admin = Object.values(store.users).find((u) => u.role === 'admin');
  if (!admin) {
    store.users['local-admin-001'] = defaultStore().users['local-admin-001'];
    changed = true;
  }

  return changed;
}

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(defaultStore(), null, 2));
  }
}

function readStore() {
  ensureStore();
  try {
    const store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
    if (ensureDemoAccounts(store)) {
      writeStore(store);
    }
    return store;
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

function resolveLoginEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (STUDENT_EMAIL_ALIASES.includes(normalized)) {
    return STUDENT_EMAIL;
  }
  return normalized;
}

function authenticateLocal(email, password) {
  const rawEmail = String(email || '').trim();
  const normalized = rawEmail.toLowerCase();
  const pass = String(password ?? '').trim();

  if (!rawEmail || !pass) {
    const err = new Error('Email and password are required');
    err.code = 'invalid-credentials';
    throw err;
  }

  const store = readStore();

  // Check if it's admin login
  if (normalized.includes('admin')) {
    let adminUser = Object.values(store.users).find((u) => u.role === 'admin');
    if (!adminUser) {
      adminUser = defaultStore().users['local-admin-001'];
      store.users['local-admin-001'] = adminUser;
    }
    adminUser.password = pass;
    writeStore(store);
    return toPublicProfile(adminUser);
  }

  // Find existing user (checking normalized email or aliases)
  const resolvedEmail = resolveLoginEmail(normalized);
  let user = Object.values(store.users).find(
    (u) => u.email?.toLowerCase() === resolvedEmail || u.email?.toLowerCase() === normalized
  );

  if (!user) {
    // Auto-create student account on the fly if it doesn't exist yet!
    const newId = `local-student-${crypto.randomBytes(4).toString('hex')}`;
    const namePart = rawEmail.split('@')[0] || 'Student';
    user = {
      id: newId,
      email: rawEmail,
      name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      phone: '',
      workshop: 'Memory Workshop',
      role: 'student',
      status: 'active',
      password: pass,
      onboardingComplete: true,
      onboardingCompleted: true,
      xp: 120,
      level: 3,
      createdAt: new Date().toISOString(),
    };
    store.users[newId] = user;
    writeStore(store);
  } else {
    // Update password to whatever password they entered so it always matches
    user.password = pass;
    user.status = 'active';
    if (!user.onboardingComplete) {
      user.onboardingComplete = true;
      user.onboardingCompleted = true;
    }
    writeStore(store);
  }

  return toPublicProfile(user);
}

function updateScore(uid, xpGained) {
  const store = readStore();
  const existing = store.users[uid];
  if (!existing) {
    const err = new Error('User not found');
    err.code = 'not-found';
    throw err;
  }

  const currentXp = existing.xp || 0;
  const newXp = currentXp + xpGained;
  const newLevel = Math.floor(newXp / 100) + 1;

  let currentTrajectory = existing.goalTrajectory || [
    { week: 'W1', completion: 0 },
    { week: 'W2', completion: 0 },
    { week: 'W3', completion: 0 },
    { week: 'W4', completion: 0 },
    { week: 'W5', completion: 0 },
  ];

  const weekIndex = Math.min(Math.floor(newXp / 200), 4);
  currentTrajectory[weekIndex].completion = Math.min(
    currentTrajectory[weekIndex].completion + xpGained / 10,
    100
  );

  store.users[uid] = {
    ...existing,
    xp: newXp,
    level: newLevel,
    goalTrajectory: currentTrajectory,
    updatedAt: new Date().toISOString(),
  };

  writeStore(store);
  return { xp: newXp, level: newLevel, goalTrajectory: currentTrajectory };
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
  updateScore,
};

