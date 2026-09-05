require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { db, auth: adminAuth, isFirebaseConfigured } = require('./firebase-admin');
const verifyToken = require('./middleware/verifyToken');
const adminOnly = require('./middleware/adminOnly');
const openAIService = require('./services/openai');
const emailService = require('./services/sendgrid');
const localStore = require('./services/localStore');

const useLocalAdmin = !isFirebaseConfigured || !db || !adminAuth;

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

// Basic health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Dig / local login (used when Firebase is not configured)
app.post('/api/auth/local-login', async (req, res) => {
  try {
    if (!useLocalAdmin) {
      return res.status(400).json({
        error: 'Local login is only available when Firebase Admin is not configured.',
      });
    }

    const { email, password } = req.body || {};
    if (!email || password === undefined || password === null) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const profile = localStore.authenticateLocal(email, password);
    return res.status(200).json({ user: profile });
  } catch (error) {
    const status = error.code === 'inactive' ? 403 : 401;
    return res.status(status).json({ error: error.message || 'Invalid email or password.' });
  }
});

// --- CHAT ENDPOINTS ---
app.post('/api/chat', verifyToken, async (req, res) => {
  try {
    const { messages, userProfile, isGoalCheckin } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    let systemPrompt = `You are Sajan Shah, India's Youngest Motivational Speaker, Memory Man of India, and Life Coach.
IMPORTANT LANGUAGE RULE: You MUST strictly obey explicit language requests!
1. If the user asks you to "write in Hindi", you MUST reply entirely in pure Hindi script (Devanagari).
2. If the user asks you to "write in Gujarati", you MUST reply entirely in Gujarati script.
3. If there is no explicit request, reply in the EXACT SAME LANGUAGE and SCRIPT the user uses.
4. By default, if the user writes in English, reply in a mix of Hindi and English (Hinglish).
When speaking in Hinglish or Hindi, use words like "Arre yaar", "Champ", "Beta", "Dhyan se suno".
Your tone is high-energy, encouraging, strict but loving, like an elder brother.
Focus on actionable advice, memory techniques (Memory Palace, Peg system), and 90-day goal setting.
Never provide medical advice. If a user expresses severe depression or self-harm, immediately provide the helpline numbers: iCall India (9152987821) and Vandrevala Foundation (1860-2662-345).`;

    if (userProfile) {
      systemPrompt += `\n\nContext about the student you are talking to:
Name: ${userProfile.name || 'Student'}
Goal: ${userProfile.onboardingData?.goal90Day || 'Not specified'}
Challenges: ${userProfile.onboardingData?.challenges?.join(', ') || 'Not specified'}`;
    }

    if (isGoalCheckin) {
      const lastMessage = messages[messages.length - 1]?.content || '';
      systemPrompt += `\n\nCRITICAL INSTRUCTION FOR THIS TURN: The user just clicked a weekly goal progress check-in button saying "${lastMessage}". You MUST specifically analyze their 90-day goal progress. Provide highly personalized feedback based on their specific goal (${userProfile?.onboardingData?.goal90Day || 'their goal'}), give them actionable advice to improve their situation, and ask a follow-up question to keep them on track. Do NOT give a generic response. Speak directly to their goal.`;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openAIService.generateChatStream(messages, systemPrompt);

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
});

// --- MEMORY STORY ENDPOINT ---
app.post('/api/memory-story', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const systemPrompt = `You are a master memory coach and storyteller. Your job is to read any educational text and transform it into an ILLOGICAL, ABSURD, VIVID, and FUNNY memory story that makes the concepts permanently stick in a student's mind.

RULES FOR THE STORY:
1. Extract ALL key concepts, facts, names, dates, and ideas from the text.
2. Create a crazy, impossible, funny story where each character/event/object represents a concept.
3. The story must be illogical and wild (flying elephants, dancing robots, talking vegetables — anything absurd!).
4. Make it VISUAL — describe scenes so vividly the student can "see" it in their head like a movie.
5. Every absurd element MUST map to a real concept from the text.
6. Keep it simple, fun, and easy to remember.
7. Write in a mix of English and Hinglish for relatability.

OUTPUT FORMAT (respond ONLY with valid JSON, no markdown):
{
  "title": "A catchy, fun title for the memory story (max 10 words)",
  "story": "The full vivid, illogical, funny memory story (4-8 sentences, rich with imagery)",
  "conceptMap": [
    { "storyElement": "the flying elephant", "realConcept": "The actual concept from the text", "emoji": "🐘" },
    { "storyElement": "the dancing robot", "realConcept": "Another concept from the text", "emoji": "🤖" }
  ],
  "memoryHook": "One powerful one-liner the student should repeat to lock this in memory",
  "quickRevision": "A 2-3 line super simple revision of the original topic in plain language"
}

Extract at least 4-6 concepts and map them. Make the story truly memorable and crazy!`;

    const completion = await openAIService.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Transform this text into a memory story:\n\n${text}` }
      ],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(result);
  } catch (error) {
    console.error('Memory Story Error:', error);
    res.status(500).json({ error: 'Failed to generate memory story', details: error.message });
  }
});

// --- BRAIN GYM ENDPOINTS ---
app.post('/api/braingym/score', verifyToken, async (req, res) => {
  try {
    const { xpGained } = req.body;
    
    if (!xpGained || typeof xpGained !== 'number') {
      return res.status(400).json({ error: 'Invalid XP amount' });
    }

    const uid = req.user.uid;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const currentXp = userData.xp || 0;
    const currentLevel = userData.level || 1;

    const newXp = currentXp + xpGained;
    // Simple leveling formula: Level 1 = 0-99 XP, Level 2 = 100-199 XP, etc.
    const newLevel = Math.floor(newXp / 100) + 1;
    
    // Goal Trajectory Logic: Update W1, W2, etc. based on XP
    // Every 10 XP = 1% completion. Grouped into 5 weeks for simplicity.
    let currentTrajectory = userData.goalTrajectory || [
      { week: 'W1', completion: 0 }, { week: 'W2', completion: 0 }, { week: 'W3', completion: 0 },
      { week: 'W4', completion: 0 }, { week: 'W5', completion: 0 }
    ];
    
    // We boost the current active week by the xpGained / 10
    const weekIndex = Math.min(Math.floor((newXp / 200)), 4); // Max week 5
    currentTrajectory[weekIndex].completion = Math.min(currentTrajectory[weekIndex].completion + (xpGained / 10), 100);

    await userRef.update({ 
      xp: newXp, 
      level: newLevel,
      goalTrajectory: currentTrajectory
    });

    res.status(200).json({ xp: newXp, level: newLevel, goalTrajectory: currentTrajectory });
  } catch (error) {
    console.error('Brain Gym Score Error:', error);
    res.status(500).json({ error: 'Failed to update score', details: error.message });
  }
});

// --- CAREER AI ENDPOINTS ---
app.post('/api/career/analyze', verifyToken, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Valid career query is required' });
    }

    const systemPrompt = `You are Sajan Shah, an expert life coach and mentor. A student is asking you for career advice based on their interest: "${query}".
Your goal is to provide a structured, encouraging career roadmap.
Analyze their input and determine the most suitable career path.

You MUST return a JSON object with the exact following structure:
{
  "title": "Name of the Career Path (e.g., Data Scientist Path)",
  "match": 95, // A number between 80 and 99 indicating how well it matches their interest
  "description": "A 1-2 sentence personalized encouragement explaining why this fits them based on their query.",
  "steps": [
    "Step 1: Actionable advice",
    "Step 2: Actionable advice",
    "Step 3: Actionable advice",
    "Step 4: Actionable advice"
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
}`;

    // Pass the query as the 'text' to analyze
    const analysisResult = await openAIService.generateAnalysis(query, systemPrompt);

    res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Career AI Error:', error);
    res.status(500).json({ error: 'Failed to analyze career path', details: error.message });
  }
});

// --- ADMIN ENDPOINTS ---

app.get('/api/admin/stats', verifyToken, adminOnly, async (req, res) => {
  try {
    if (useLocalAdmin) {
      return res.status(200).json(localStore.getStats());
    }

    const usersSnapshot = await db.collection('users').get();
    
    let totalStudents = 0;
    let newThisMonth = 0;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.role !== 'admin') {
        totalStudents++;
        
        if (data.createdAt) {
          const createdDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
            newThisMonth++;
          }
        }
      }
    });

    const emailsSnapshot = await db.collection('email_logs').get();
    const emailsSent = emailsSnapshot.size;

    res.status(200).json({
      totalStudents,
      activeThisWeek: Math.floor(totalStudents * 0.8), // Placeholder heuristic
      emailsSent,
      newThisMonth
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/admin/students', verifyToken, adminOnly, async (req, res) => {
  try {
    if (useLocalAdmin) {
      return res.status(200).json(localStore.listStudents());
    }

    const usersSnapshot = await db.collection('users').where('role', '!=', 'admin').get();
    const students = [];
    usersSnapshot.forEach(doc => {
      students.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(students);
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/admin/students', verifyToken, adminOnly, async (req, res) => {
  try {
    const { email, password, name, phone, workshop, sendEmail } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (useLocalAdmin) {
      try {
        const created = localStore.createStudent({
          email,
          password,
          name,
          phone,
          workshop,
          sendEmail,
        });
        return res.status(201).json({
          message: 'Student created successfully',
          uid: created.uid,
          emailStatus: created.emailStatus,
        });
      } catch (err) {
        if (err.code === 'already-exists') {
          return res.status(409).json({ error: 'Failed to create student', details: err.message });
        }
        throw err;
      }
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Save to Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      phone: phone || '',
      workshop: workshop || '',
      role: 'student',
      status: 'active',
      createdAt: new Date().toISOString(),
      onboardingCompleted: false
    });

    // Send Welcome Email if requested
    let emailStatus = 'skipped';
    if (sendEmail) {
      try {
        await emailService.sendWelcomeEmail(email, name, password);
        emailStatus = 'sent';
        // Log email
        await db.collection('email_logs').add({
          to: email,
          type: 'welcome',
          sentAt: new Date().toISOString(),
          status: 'delivered'
        });
      } catch (emailErr) {
        console.error('Welcome email failed to send:', emailErr.message);
        emailStatus = 'not_delivered';
        await db.collection('email_logs').add({
          to: email,
          type: 'welcome',
          sentAt: new Date().toISOString(),
          status: 'not_delivered',
          error: emailErr.message
        });
      }
    }

    res.status(201).json({ 
      message: 'Student created successfully', 
      uid: userRecord.uid,
      emailStatus 
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student', details: error.message });
  }
});

app.delete('/api/admin/students/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (useLocalAdmin) {
      try {
        localStore.deleteStudent(id);
        return res.status(200).json({ message: 'Student deleted successfully' });
      } catch (err) {
        if (err.code === 'not-found') {
          return res.status(404).json({ error: err.message });
        }
        throw err;
      }
    }
    
    // Delete from Firestore
    await db.collection('users').doc(id).delete();
    
    // Delete from Firebase Auth
    try {
      await adminAuth.deleteUser(id);
    } catch (authErr) {
      console.error('Auth deletion error (user may not exist in Auth):', authErr.message);
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student', details: error.message });
  }
});

app.put('/api/admin/students/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, workshop, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    if (useLocalAdmin) {
      try {
        const updated = localStore.updateStudent(id, { name, email, phone, workshop, status });
        return res.status(200).json({ message: 'Student updated successfully', student: updated });
      } catch (err) {
        if (err.code === 'not-found') {
          return res.status(404).json({ error: err.message });
        }
        if (err.code === 'already-exists' || err.code === 'invalid') {
          return res.status(409).json({ error: err.message });
        }
        throw err;
      }
    }

    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists || userDoc.data()?.role === 'admin') {
      return res.status(404).json({ error: 'Student not found' });
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone || '',
      workshop: workshop || '',
      status: status || 'active',
      updatedAt: new Date().toISOString(),
    };

    await userRef.update(payload);

    try {
      await adminAuth.updateUser(id, {
        email: payload.email,
        displayName: payload.name,
      });
    } catch (authErr) {
      console.error('Auth update error:', authErr.message);
    }

    res.status(200).json({
      message: 'Student updated successfully',
      student: { id, ...userDoc.data(), ...payload },
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student', details: error.message });
  }
});

app.post('/api/admin/bulk-upload', verifyToken, adminOnly, async (req, res) => {
  try {
    const { students } = req.body; // Array of {name, email, phone, workshop}

    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ error: 'Students array is required' });
    }

    if (useLocalAdmin) {
      return res.status(200).json(localStore.bulkCreate(students));
    }

    const results = { successful: 0, failed: 0, errors: [] };

    for (const student of students) {
      try {
        const password = Math.random().toString(36).slice(-8) + 'A1!'; // Generate random strong password
        
        const userRecord = await adminAuth.createUser({
          email: student.email,
          password: password,
          displayName: student.name,
        });

        await db.collection('users').doc(userRecord.uid).set({
          email: student.email,
          name: student.name,
          phone: student.phone || '',
          workshop: student.workshop || 'Bulk Upload',
          role: 'student',
          status: 'active',
          createdAt: new Date().toISOString(),
          onboardingCompleted: false
        });

        // Send Welcome Email
        try {
          await emailService.sendWelcomeEmail(student.email, student.name, password);
          await db.collection('email_logs').add({
            to: student.email,
            type: 'welcome',
            sentAt: new Date().toISOString(),
            status: 'delivered'
          });
        } catch (emailErr) {
          console.error('Bulk upload email failed:', emailErr.message);
          await db.collection('email_logs').add({
            to: student.email,
            type: 'welcome',
            sentAt: new Date().toISOString(),
            status: 'not_delivered',
            error: emailErr.message
          });
        }

        results.successful++;
      } catch (err) {
        results.failed++;
        results.errors.push({ email: student.email, error: err.message });
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Failed to process bulk upload', details: error.message });
  }
});

app.get('/api/admin/email-logs', verifyToken, adminOnly, async (req, res) => {
  try {
    if (useLocalAdmin) {
      return res.status(200).json(localStore.listEmailLogs());
    }

    const logsSnapshot = await db.collection('email_logs').orderBy('sentAt', 'desc').limit(50).get();
    const logs = [];
    logsSnapshot.forEach(doc => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Fetch email logs error:', error);
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

// --- ACTIVITY TRACKING ENDPOINT ---
app.post('/api/student/onboarding', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name, onboardingData } = req.body || {};

    if (useLocalAdmin || !db) {
      try {
        const profile = localStore.completeOnboarding(uid, { name, onboardingData });
        return res.status(200).json({ message: 'Onboarding completed', user: profile });
      } catch (err) {
        if (err.code === 'not-found') {
          return res.status(404).json({ error: err.message });
        }
        throw err;
      }
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {
      name: name || userDoc.data()?.name,
      onboardingComplete: true,
      onboardingCompleted: true,
      onboardingData: onboardingData || {},
      updatedAt: new Date().toISOString(),
    };

    await userRef.update(updateData);
    res.status(200).json({
      message: 'Onboarding completed',
      user: { uid, ...userDoc.data(), ...updateData },
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Failed to save onboarding', details: error.message });
  }
});

app.post('/api/student/activity', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    if (useLocalAdmin || !db) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = days[new Date().getDay()];
      const dailyActivity = { [currentDay]: 1 };
      return res.status(200).json({ dailyActivity });
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    let dailyActivity = userData.dailyActivity || {};
    
    // Get current day name (e.g. "Mon")
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = days[new Date().getDay()];
    
    // If it's a new week, we could clear it, but for simplicity we just overwrite the day
    // A better approach is to store full dates, but the UI expects days.
    // We'll increment the current day.
    dailyActivity[currentDay] = (dailyActivity[currentDay] || 0) + 1; // +1 minute

    await userRef.update({ dailyActivity });
    res.status(200).json({ success: true, dailyActivity });
  } catch (error) {
    console.error('Activity Tracking Error:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Handle port-in-use error cleanly so nodemon can restart
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Kill the process using that port and restart.`);
    process.exit(1); // Clean exit so nodemon restarts
  } else {
    console.error('❌ Server error:', err);
  }
});

// Keep process alive and log unhandled errors instead of crashing
process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Exiting so nodemon can restart...`);
    process.exit(1);
  }
  console.error('❌ Uncaught Exception:', err.message, err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});
