require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const verifyToken = require('./middleware/verifyToken');
const adminOnly = require('./middleware/adminOnly');
const openAIService = require('./services/openai');
const emailService = require('./services/sendgrid');
const localStore = require('./services/localStore');

/** App runs with server-backed JSON store — no Firebase. */

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

// Basic health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Email/password login (server store — no Firebase)
app.post('/api/auth/local-login', async (req, res) => {
  try {
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
function detectLanguage(messages, userProfile) {
  const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
  const pref = (userProfile?.onboardingData?.language || '').toLowerCase();

  if (lastMsg.includes('gujarat') || lastMsg.includes('gujrat') || pref === 'gujarati') {
    return 'gujarati';
  }
  if (lastMsg.includes('hindi') || pref === 'hindi') {
    return 'hindi';
  }
  if (lastMsg.includes('english') || pref === 'english') {
    return 'english';
  }
  return 'hinglish';
}

app.post('/api/chat', verifyToken, async (req, res) => {
  try {
    const { messages, userProfile, isGoalCheckin } = req.body || {};
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const lang = detectLanguage(messages, userProfile);

    let systemPrompt = `You are Sajan Shah, India's Youngest Motivational Speaker, Memory Man of India, and Life Coach.
Your tone is high-energy, encouraging, strict but loving, like an elder brother.
Focus on actionable advice, memory techniques (Memory Palace, Peg system), and 90-day goal setting.
Never provide medical advice. If a user expresses severe depression or self-harm, immediately provide the helpline numbers: iCall India (9152987821) and Vandrevala Foundation (1860-2662-345).`;

    if (lang === 'gujarati') {
      systemPrompt += `\n\nCRITICAL LANGUAGE MANDATE: The user requested GUJARATI. You MUST reply 100% in pure GUJARATI script (ગુજરાતી)! Do NOT use English, Hinglish, or Hindi script! All sentences must be written in full Gujarati script.`;
    } else if (lang === 'hindi') {
      systemPrompt += `\n\nCRITICAL LANGUAGE MANDATE: The user requested HINDI. You MUST reply 100% in pure HINDI script (Devanagari - हिंदी)!`;
    } else if (lang === 'english') {
      systemPrompt += `\n\nCRITICAL LANGUAGE MANDATE: Reply in clear, professional English.`;
    } else {
      systemPrompt += `\n\nBy default, reply in a high-energy mix of Hindi and English (Hinglish). Use words like "Arre yaar", "Champ", "Dhyan se suno".`;
    }

    if (userProfile) {
      systemPrompt += `\n\nContext about the student you are talking to:
Name: ${userProfile.name || 'Student'}
Goal: ${userProfile.onboardingData?.goal90Day || 'Not specified'}
Challenges: ${userProfile.onboardingData?.challenges?.join(', ') || 'Not specified'}`;
    }

    if (isGoalCheckin) {
      const lastMessage = messages[messages.length - 1]?.content || '';
      systemPrompt += `\n\nCRITICAL INSTRUCTION FOR THIS TURN: The user just clicked a weekly goal progress check-in button saying "${lastMessage}". You MUST specifically analyze their 90-day goal progress. Provide highly personalized feedback based on their specific goal (${userProfile?.onboardingData?.goal90Day || 'their goal'}), give them actionable advice to improve their situation, and ask a follow-up question to keep them on track. Speak directly to their goal.`;
    }

    try {
      const stream = await openAIService.generateChatStream(messages, systemPrompt);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
    } catch (openAiErr) {
      console.error('OpenAI Stream Error:', openAiErr.message);
      const studentName = userProfile?.name || 'Champ';
      const lastMsg = messages[messages.length - 1]?.content || '';
      
      let fallbackText = '';
      if (lang === 'gujarati') {
        fallbackText = `અરે ${studentName}! ધ્યાનમાં રાખો! 🌟\n\nતમે પૂછ્યું: "${lastMsg}"\n\nએક વાત હંમેશા યાદ રાખો: સફળતા એક દિવસમાં મળતી નથી, પરંતુ દરરોજની સખત મહેનતથી ચોક્કસ મળે છે! Overthinking બંધ કરો, તમારા ૯૦ દિવસના લક્ષ્યો પર ધ્યાન આપો અને દરરોજ મહેનત કરો! 💥\n\nતમારી સૌથી મોટી તાકાત તમારો માઇન્ડસેટ છે. કોઈ પણ સમસ્યા હોય, હું હંમેશાં તમારા મોટા ભાઈ તરીકે તમારી સાથે છું! ચાલો આજે કઈક અદભુત કરીએ! 🔥`;
      } else if (lang === 'hindi') {
        fallbackText = `अरे ${studentName}! ध्यान से सुनो! 🌟\n\nआपने पूछा: "${lastMsg}"\n\nएक बात हमेशा याद रखो: सफलता एक दिन में नहीं मिलती, लेकिन हर रोज़ की कड़ी मेहनत से ज़रूर मिलती है! Overthinking बंद करो, अपने 90-दिन के लक्ष्यों पर ध्यान दो और रोज़ काम करो! 💥\n\nआपकी सबसे बड़ी ताकत आपका माइंडसेट है। कोई भी समस्या हो, मैं हमेशा आपके बड़े भाई के रूप में आपके साथ हूँ! चलिए आज कमाल करते हैं! 🔥`;
      } else {
        fallbackText = `Arre ${studentName}! Dhyan se suno! 🌟\n\nTumne bola: "${lastMsg}"\n\nEk baat hamesha yaad rakhna: Success ek din me nahi milti, lekin har roz ki mehnat se zaroor milti hai! Stop overthinking, focus on your goals, and execute daily! 💥\n\nTumhaari sabse badi strength tumhaara mindset hai. Kuch bhi problem ho, I am always here with you as your mentor and elder brother! Let's crush your goals today! 🔥`;
      }

      const words = fallbackText.split(' ');
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ content: word + ' ' })}\n\n`);
        await new Promise((r) => setTimeout(r, 25));
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Chat API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate response', details: error.message });
    } else {
      res.end();
    }
  }
});

// --- MEMORY STORY ENDPOINT ---
app.post('/api/memory-story', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const systemPrompt = `You are Sajan Shah, master memory coach and Memory Man of India. Your job is to transform any educational text into a FUNNY, ABSURD, ILLOGICAL memory story (12-15 sentences).

CRITICAL RULE - VERY SIMPLE LANGUAGE FOR KIDS:
1. Write in SUPER SIMPLE, EASY English mixed with friendly Hinglish so small kids (aged 6 to 12) can easily understand and picture the story in their minds!
2. Use short sentences, basic everyday words, simple grammar, and exciting actions. NEVER use hard vocabulary, complex jargon, or complicated words in the story narrative.
3. NEVER use cliché flying elephants or dancing robots. Invent 100% unique, funny characters (e.g., superhero pizza slice, skateboarding dinosaur, laser-eyed owl, magical submarine, roller-skating wizard).
4. Extract key facts/concepts from the user's text and link them to these funny story elements.

OUTPUT FORMAT (respond ONLY with valid JSON, no markdown formatting):
{
  "title": "A fun, simple title for kids",
  "story": "12-15 short, super simple, exciting sentences explaining the illogical story for kids",
  "conceptMap": [
    { "storyElement": "Funny Story Character/Object", "realConcept": "Simple concept name from text", "emoji": "🚀" },
    { "storyElement": "Second Story Character/Object", "realConcept": "Second concept from text", "emoji": "🌋" }
  ],
  "memoryHook": "A very simple, catchy line to repeat out loud",
  "quickRevision": "Super simple 3-line explanation of the topic"
}`;

    try {
      const completion = await openAIService.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Transform this educational text into a 15-line illogical memory story with unique characters using VERY SIMPLE English/Hinglish for kids:\n\n${text}` }
        ],
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content);
      return res.status(200).json(result);
    } catch (openAiErr) {
      console.error('Memory Story OpenAI Error:', openAiErr.message);

      const words = text.trim().split(/\s+/);
      const keywords = words.filter(w => w.length > 3).slice(0, 5);
      const k1 = keywords[0] || 'Concept Alpha';
      const k2 = keywords[1] || 'Concept Beta';
      const k3 = keywords[2] || 'Concept Gamma';
      const k4 = keywords[3] || 'Concept Delta';

      const archetypes = [
        { c1: 'Space Dragon', c2: 'Skateboarding T-Rex', e1: '🐉', e2: '🦖' },
        { c1: 'Superhero Avocado', c2: 'Quantum Shark', e1: '🥑', e2: '🦈' },
        { c1: 'Roller-skating Wizard', c2: 'Time-traveling Pizza', e1: '🧙‍♂️', e2: '🍕' },
        { c1: 'Laser-eyed Owl', c2: 'Flying Submarine', e1: '🦉', e2: '🛸' },
        { c1: 'Disco Samurai', c2: 'Dancing Gorilla', e1: '⚔️', e2: '🦍' },
      ];
      const arch = archetypes[Math.floor(Math.random() * archetypes.length)];

      const dynamicStory = `1. Ek din ek chhota aur funny ${arch.c1} sky se zameen par aakar dance karne laga.
2. Usne head par ${k1} ko crown ki tarah pehna aur zor-zor se gaane laga!
3. Tabhi zameen se ek cool ${arch.c2} nikla jo ${k2} ko haath me lekar zabardast tricks dikhane laga.
4. Usne bola: "Chalo dosto, aaj hum ${k3} ki magical duniya me ghumne chalte hain!"
5. Aasmaan se chamakne wale stars girne lage aur ${k4} un stars par baithkar mazaak karne laga.
6. ${arch.c1} ne ${arch.c2} ko ek magic toy diya jisse poori jagah lights chamakne lagi.
7. Dono dosto ne milkar ek magical Memory House banaya.
8. House ke har room me ${k1} aur ${k2} ki funny pictures lagi hui thi.
9. Ek magic mirror muskura kar bola: "${k3} toh bohot hi easy hai!"
10. Mirror me se colorful light nikli aur aasmaan me magical pictures dikhne lagi.
11. Sabhi chhotey bacche un pictures ko dekhkar khush hone lage aur ${k4} ko samajhne lage.
12. Ek magic clock ne bajna shuru kiya aur sab kuch ek fun movie jaisa dikhne laga.
13. Ye mazedaar kahani aapke dimaag me hamesha ke liye fixed ho gayi!
14. Ab jab bhi aap ${k1} ya ${k2} ka naam sunoge, ye funny ${arch.c1} aur ${arch.c2} aapko turant yaad aayenge!
15. Aapki memory ab super-strong ho gayi hai!`;

      return res.status(200).json({
        title: `The Illogical Memory Legend of ${k1}`,
        story: dynamicStory,
        conceptMap: [
          { storyElement: `${arch.c1} with Magic Crown`, realConcept: k1, emoji: arch.e1 },
          { storyElement: `Spinning ${arch.c2}`, realConcept: k2, emoji: arch.e2 },
          { storyElement: "Guitar Playing Stars", realConcept: k3, emoji: "⭐" },
          { storyElement: "3D Hologram Clock", realConcept: k4, emoji: "⏰" }
        ],
        memoryHook: `Jab bhi ${k1} ya ${k2} yaad karna ho, ${arch.c1} & ${arch.c2} ko yaad karo!`,
        quickRevision: `Main concepts: 1. ${k1} | 2. ${k2} | 3. ${k3} | 4. ${k4}. Revise daily for 2 minutes!`
      });
    }
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
    const result = localStore.updateScore(uid, xpGained);
    res.status(200).json(result);
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

    const systemPrompt = `You are Sajan Shah, master life coach and career mentor for students. Analyze the user's career query: "${query}".

CRITICAL INSTRUCTIONS & SAFETY RULES:
1. HARMFUL/ILLEGAL/BAD PROFESSIONS:
   - If the requested profession is illegal, unethical, violent, destructive, or harmful (e.g. terrorist, thief, criminal, killer, scammer, drug dealer, smuggler, hacker, extortionist, etc.):
     - Set "isHarmful": true
     - Set "warningTitle": "⚠️ Unethical & Destructive Path Detected"
     - Set "warningMessage": Explain firmly and mentor-like why "${query}" is destructive, illegal, and unacceptable. Explain that true courage, power, and leadership come from building and protecting society, not destroying it.
     - PIVOT to a noble, legal, high-impact alternative (e.g. for "hacker" -> pivot to "Ethical Hacker & Cybersecurity Specialist"; for "terrorist/killer" -> pivot to "National Security Officer / Defense Services / Law Enforcement Leader").
     - Set "match": 5.
2. REAL & POSITIVE PROFESSIONS:
   - Set "isHarmful": false.
   - Set "match": A realistic score between 85 and 98.
3. SPECIFIC & RELEVANT ACTION PLAN (NO GENERIC TEMPLATES):
   - You MUST generate 4 SPECIFIC, STEP-BY-STEP ACTIONABLE steps tailored EXACTLY to the specific requested profession (or noble alternative if flagged).
   - NEVER output generic advice like "Research 5 real people" or "Master foundational skills".
   - Each step MUST contain exact tools, exams, certifications, practices, or skills relevant to THAT SPECIFIC PROFESSION.

OUTPUT FORMAT (respond ONLY with valid JSON, no markdown formatting):
{
  "isHarmful": false,
  "warningTitle": "",
  "warningMessage": "",
  "title": "Specific Career Trajectory Title",
  "match": 92,
  "description": "2-3 sentence inspiring description tailored specifically to this profession from Sajan Shah",
  "steps": [
    "Highly specific Step 1 for this exact profession",
    "Highly specific Step 2 for this exact profession",
    "Highly specific Step 3 for this exact profession",
    "Highly specific Step 4 for this exact profession"
  ],
  "skills": ["Specific Skill 1", "Specific Skill 2", "Specific Skill 3", "Specific Skill 4", "Specific Skill 5", "Specific Skill 6"]
}`;

    try {
      const analysisResult = await openAIService.generateAnalysis(query, systemPrompt);
      return res.status(200).json(analysisResult);
    } catch (openAiErr) {
      console.error('Career Analysis OpenAI Error:', openAiErr.message);

      const q = query.toLowerCase().trim();
      const isBad = /terror|thief|robber|killer|murder|criminal|scammer|drug|smuggl|extort|mafia|gangster|crime/.test(q);

      if (isBad) {
        return res.status(200).json({
          isHarmful: true,
          warningTitle: '⚠️ Unethical & Destructive Path Detected',
          warningMessage: `"${query}" is illegal, dangerous, and destructive to society. True courage, intelligence, and leadership come from protecting people and leaving a legacy of honor. Here is how you can channel your courage into a noble Defense & Security career!`,
          title: 'National Defense & Security Officer Trajectory',
          match: 5,
          description: 'Channel your drive for action and high-stakes decision-making into protecting the nation and leading elite teams with honor.',
          steps: [
            'Prepare for NDA / CDS / Defense Service entrance examinations with daily physical fitness.',
            'Master Strategic Tactics, Leadership principles, and Crisis Management skills.',
            'Join NCC (National Cadet Corps) or local physical endurance bootcamps.',
            'Develop unshakeable mental resilience, ethical discipline, and tactical intelligence.'
          ],
          skills: ['Tactical Leadership', 'Physical Endurance', 'Ethics & Honor', 'Crisis Management', 'Strategic Decision Making', 'Team Command']
        });
      }

      return res.status(200).json({
        isHarmful: false,
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Professional Roadmap`,
        match: 92,
        description: `Exciting choice! ${query} requires targeted skill mastery, practical execution, and consistent dedication. Here is your customized 90-day trajectory.`,
        steps: [
          `Master core theoretical foundations and key tools needed for professional ${query} work.`,
          `Build 2-3 specialized real-world projects showcasing your domain expertise in ${query}.`,
          `Obtain industry-recognized certifications and clear competitive benchmark assessments.`,
          `Connect with active ${query} professionals and submit high-impact portfolio applications.`
        ],
        skills: ['Domain Expertise', 'Tool Proficiency', 'Critical Thinking', 'Problem Solving', 'Portfolio Building', 'Professional Networking']
      });
    }
  } catch (error) {
    console.error('Career AI Error:', error);
    res.status(500).json({ error: 'Failed to analyze career path', details: error.message });
  }
});

// --- ADMIN ENDPOINTS ---

app.get('/api/admin/stats', verifyToken, adminOnly, async (req, res) => {
  try {
    return res.status(200).json(localStore.getStats());
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/admin/students', verifyToken, adminOnly, async (req, res) => {
  try {
    return res.status(200).json(localStore.listStudents());
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
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student', details: error.message });
  }
});

app.delete('/api/admin/students/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    try {
      localStore.deleteStudent(id);
      return res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
      if (err.code === 'not-found') {
        return res.status(404).json({ error: err.message });
      }
      throw err;
    }
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
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student', details: error.message });
  }
});

app.post('/api/admin/bulk-upload', verifyToken, adminOnly, async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ error: 'Students array is required' });
    }

    return res.status(200).json(localStore.bulkCreate(students));
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Failed to process bulk upload', details: error.message });
  }
});

app.get('/api/admin/email-logs', verifyToken, adminOnly, async (req, res) => {
  try {
    return res.status(200).json(localStore.listEmailLogs());
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

    try {
      const profile = localStore.completeOnboarding(uid, { name, onboardingData });
      return res.status(200).json({ message: 'Onboarding completed', user: profile });
    } catch (err) {
      if (err.code === 'not-found') {
        return res.status(404).json({ error: err.message });
      }
      throw err;
    }
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Failed to save onboarding', details: error.message });
  }
});

app.post('/api/student/activity', verifyToken, async (req, res) => {
  try {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = days[new Date().getDay()];
    const dailyActivity = { [currentDay]: 1 };
    return res.status(200).json({ dailyActivity });
  } catch (error) {
    console.error('Activity Tracking Error:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// Serve static frontend files from parent directory (web root) and dist
const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname, '..');
const distDir = path.join(__dirname, '..', 'frontend', 'dist');

app.use(express.static(rootDir));
app.use(express.static(distDir));

// SPA Fallback for client-side routing (fixes 404 on refresh for /login, /student, /admin)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const rootIndex = path.join(rootDir, 'index.html');
  const distIndex = path.join(distDir, 'index.html');
  if (fs.existsSync(rootIndex)) {
    return res.sendFile(rootIndex);
  } else if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
  next();
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
