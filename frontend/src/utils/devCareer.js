/** Local career roadmap when OpenAI is unavailable in dev/demo mode */

function titleCase(s = '') {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function generateDevCareerAnalysis(query = '') {
  const q = query.trim().toLowerCase();
  const pretty = titleCase(query) || 'Your Path';

  // 1. HARMFUL / ILLEGAL / BAD PROFESSIONS DETECTION
  const harmfulRegex = /terror|theft|thief|theift|steal|stole|stolen|rob|kill|murder|crime|criminal|scam|fraud|cheat|drug|smuggl|extort|mafia|gangster|hitman|assassin|thug|hack/i;
  if (harmfulRegex.test(q)) {
    if (/hack/.test(q)) {
      return {
        isHarmful: true,
        warningTitle: '⚠️ Unauthorized Hacking is Illegal & Destructive',
        warningMessage: `Unethical hacking can lead to severe criminal charges and ruins lives. Real technical genius is used to protect infrastructure! Here is how you can become a certified Ethical Hacker / Cybersecurity Specialist earning top industry rewards legally.`,
        title: 'Certified Ethical Hacker & Cybersecurity Specialist',
        match: 15,
        description: 'Transform your curiosity about digital networks into an honorable, high-demand cybersecurity career defending critical systems.',
        steps: [
          'Master Networking Fundamentals (TCP/IP, OSI layers) & Linux CLI / Kali Linux basics.',
          'Earn CompTIA Security+ or Certified Ethical Hacker (CEH) certification.',
          'Practice penetration testing legally on platforms like TryHackMe and Hack The Box.',
          'Participate in CTF (Capture The Flag) competitions and build a verified bug bounty profile.'
        ],
        skills: ['Linux System Admin', 'Network Security', 'Penetration Testing', 'Python Scripting', 'Cryptography', 'Ethical Hacking']
      };
    }

    return {
      isHarmful: true,
      warningTitle: '⚠️ Unethical & Destructive Path Detected',
      warningMessage: `"${pretty}" is illegal, harmful, and unacceptable. Real power, courage, and leadership come from building and protecting society, not destroying it. Sajan AI has redirected your energy into a high-status Defense & National Security leadership career!`,
      title: 'National Defense & Security Officer Trajectory',
      match: 5,
      description: 'Channel your courage and high-stakes decision-making into protecting the nation and leading elite tactical teams with honor.',
      steps: [
        'Prepare for NDA / CDS / Defense Service entrance examinations with rigorous daily academics.',
        'Build peak physical conditioning: 5km daily runs, pushups, and agility drills.',
        'Develop tactical intelligence, strategy analysis, and crisis management protocols.',
        'Enroll in NCC (National Cadet Corps) or military leadership bootcamps.'
      ],
      skills: ['Tactical Leadership', 'Physical Endurance', 'Ethics & Honor', 'Crisis Management', 'Strategic Thinking', 'Team Command']
    };
  }

  // 2. MEDICINE & HEALTHCARE
  if (/doctor|medic|mbbs|surgeon|physician|nurse|health|dentist|pharma/.test(q)) {
    return {
      isHarmful: false,
      title: `${pretty} Trajectory (Medicine & Healthcare)`,
      match: 95,
      description: `Healthcare requires rigorous scientific mastery and deep empathy. Sajan's mentorship strategy will help you conquer the grueling study schedule with peak mental focus.`,
      steps: [
        'Master Biology, Physics & Chemistry fundamentals — practice 100+ MCQs daily for entrance exams (e.g. NEET / MCAT).',
        'Volunteer at a local hospital or shadow a senior doctor for 4 weeks to observe live patient care.',
        'Develop 4 hours of uninterrupted deep study habits using spaced-repetition flashcards for medical terminology.',
        'Clear pre-med qualifying boards with 90%+ scores and complete clinical rotation prerequisites.'
      ],
      skills: ['Biology & Chemistry', 'Clinical Diagnosis', 'Patient Empathy', 'Surgical Precision', 'Spaced Repetition', 'High-Stress Focus']
    };
  }

  // 3. SOFTWARE & TECH / AI
  if (/data|ml|ai|analyst|scientist|coding|software|developer|engineer|coder|tech|web|app/.test(q)) {
    return {
      isHarmful: false,
      title: `${pretty} Trajectory (Tech & Software)`,
      match: 94,
      description: `Software engineering is a high-growth super-skill where your GitHub portfolio speaks louder than degrees. Consistent daily code commits win.`,
      steps: [
        'Master one core stack deeply (Python/Node.js + React/SQL) and learn Data Structures & Algorithms.',
        'Build and deploy 3 production-ready full-stack projects on Vercel / GitHub with documentation.',
        'Solve 1 LeetCode/HackerRank problem daily to sharpen algorithmic problem-solving speed.',
        'Contribute to open-source repositories and prepare for technical system design interviews.'
      ],
      skills: ['Data Structures', 'Python / JavaScript', 'SQL & Databases', 'Git / GitHub', 'System Architecture', 'Algorithmic Logic']
    };
  }

  // 4. DESIGN & CREATIVE ARTS
  if (/design|ui|ux|graphics|creative|artist|animat|fashion|architect/.test(q)) {
    return {
      isHarmful: false,
      title: `${pretty} Trajectory (Design & Creative)`,
      match: 92,
      description: `Design is human psychology combined with visual elegance. Your portfolio is your ultimate passport to world-class studios.`,
      steps: [
        'Master industry tools (Figma, Adobe Creative Suite, AutoCAD, or Blender) through daily practice.',
        'Redesign 3 existing real-world products/apps and publish comprehensive UI/UX case studies.',
        'Study design systems, typography hierarchy, and color theory principles for 30 mins daily.',
        'Build a polished Behance/Dribbble/Framer portfolio showcasing 4 end-to-end design solutions.'
      ],
      skills: ['Figma / Adobe Suite', 'Visual Hierarchy', 'User Research', 'Wireframing', 'Prototyping', 'Design Thinking']
    };
  }

  // 5. CIVIL SERVICES, LAW & GOVERNANCE
  if (/ias|ips|upsc|law|lawyer|judge|advocate|civil service|police|government/.test(q)) {
    return {
      isHarmful: false,
      title: `${pretty} Trajectory (Civil Services & Law)`,
      match: 93,
      description: `Public administration and law require deep constitutional knowledge, analytical clarity, and unshakeable ethics to serve the nation.`,
      steps: [
        'Analyze UPSC / CLAT syllabus and maintain a daily 2-hour newspaper analysis notebook (The Hindu / Express).',
        'Master Indian Constitution, Polity, History, and IPC / Evidence Act fundamentals.',
        'Practice answer writing daily for Mains exams or draft 5 sample legal petitions.',
        'Join mock interview panels and debate forums to build authoritative public speaking skills.'
      ],
      skills: ['Constitutional Law', 'Analytical Writing', 'Current Affairs', 'Public Speaking', 'Policy Analysis', 'Ethical Governance']
    };
  }

  // 6. SPORTS & ATHLETICS
  if (/cricket|football|athlete|sport|player|tennis|fitness|gym|trainer/.test(q)) {
    return {
      isHarmful: false,
      title: `${pretty} Trajectory (Sports & Performance)`,
      match: 96,
      description: `Championship sports performance is 80% mental discipline and 20% elite physical execution. Training consistency determines champions.`,
      steps: [
        'Enroll in a certified sports academy and commit to 4 hours of daily physical & technical drills.',
        'Work with a strength & conditioning coach on VO2 max, explosive power, and recovery protocols.',
        'Participate in district and state tournaments to build match temperment and scout visibility.',
        'Perform weekly video analysis of your gameplay mechanics with a senior coach to refine technique.'
      ],
      skills: ['Sports Fitness', 'Tactical Gameplay', 'Mental Toughness', 'Reaction Time', 'Physical Endurance', 'Team Synergy']
    };
  }

  // 7. BUSINESS, ENTREPRENEURSHIP & FINANCE
  if (/business|entrepreneur|startup|ceo|finance|ca|chartered|trader|stock|invest/.test(q)) {
    return {
      isHarmful: false,
      title: `${pretty} Trajectory (Business & Finance)`,
      match: 91,
      description: `Building wealth and enterprise requires financial literacy, risk management, and the ability to solve big problems for thousands of customers.`,
      steps: [
        'Master Financial Accounting, Cash Flow Modeling, and Economics fundamentals.',
        'Identify a real market problem, interview 20 potential customers, and build a Minimum Viable Product (MVP).',
        'Learn unit economics, marketing funnels, and pitch deck creation.',
        'Obtain professional certifications (CA / CFA / NISM) or launch your first revenue-generating pilot.'
      ],
      skills: ['Financial Modeling', 'Customer Research', 'Sales & Marketing', 'Risk Management', 'Negotiation', 'Strategic Planning']
    };
  }

  // 8. DYNAMIC FALLBACK FOR ALL OTHER PROFESSIONS
  return {
    isHarmful: false,
    title: `${pretty} Professional Trajectory`,
    match: 89,
    description: `Pursuing a career in ${pretty} requires targeted skill mastery, dedicated focus, and a strategic 90-day action plan designed for excellence.`,
    steps: [
      `Master core theoretical concepts and specialized tools required for high-level ${pretty} performance.`,
      `Create a practical portfolio or project archive demonstrating your direct capabilities in ${pretty}.`,
      `Seek mentorship from active ${pretty} industry professionals and participate in domain workshops.`,
      `Apply for specialized internships or entry-level positions to gain hands-on field experience.`
    ],
    skills: [`${pretty} Fundamentals`, 'Practical Execution', 'Domain Research', 'Professional Communication', 'Time Management', 'Continuous Learning']
  };
}

