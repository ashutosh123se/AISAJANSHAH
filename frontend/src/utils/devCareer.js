/** Local career roadmap when OpenAI is unavailable in dig mode */

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

  if (/doctor|medic|mbbs|surgeon|physician|nurse|health/.test(q)) {
    return {
      title: 'Medicine & Healthcare Path',
      match: 94,
      description: `Arre yaar! "${pretty}" ke peeche service ka jadoo hai. Health careers need science foundation, empathy, and long-term focus — perfect for a championship mindset.`,
      steps: [
        'Master Biology + Chemistry basics (NEET / pre-med fundamentals if India-track).',
        'Shadow a doctor / volunteer at a clinic for 4–6 weeks to confirm fit.',
        'Build daily discipline: 3–4 focused study hours + sleep schedule.',
        'Choose next milestone: entrance exam date OR university prerequisites list.',
      ],
      skills: ['Biology', 'Chemistry', 'Patient Empathy', 'Discipline', 'Critical Thinking', 'Communication'],
    };
  }

  if (/data|ml|ai|analyst|scientist|coding|software|developer|engineer/.test(q)) {
    return {
      title: `${/data|ml|ai|analyst|scientist/.test(q) ? 'Data & AI' : 'Software Engineering'} Path`,
      match: 93,
      description: `Your interest in "${pretty}" maps to a high-growth tech path. Skill > degree titles — consistent building wins.`,
      steps: [
        'Pick one stack and go deep for 90 days (Python + SQL OR JS + React).',
        'Ship 2 portfolio projects and put them on GitHub.',
        'Practice problem-solving 30 mins/day (LeetCode / HackerRank lite).',
        'Apply for internships / open-source contributions with a clear goal.',
      ],
      skills: ['Problem Solving', 'Python/JS', 'SQL', 'Git', 'Communication', 'System Thinking'],
    };
  }

  if (/design|ui|ux|graphics|creative|artist/.test(q)) {
    return {
      title: 'UI/UX & Product Design Path',
      match: 91,
      description: `Design is problem-solving with beauty. "${pretty}" means you care how people experience things — that's gold.`,
      steps: [
        'Learn Figma fundamentals this week.',
        'Redesign 3 real apps and document your thinking.',
        'Study UX case studies (NN/g, GoodUI) 20 mins daily.',
        'Build a Behance/Dribbble portfolio of 4–6 pieces.',
      ],
      skills: ['Figma', 'Visual Design', 'User Research', 'Prototyping', 'Storytelling', 'Empathy'],
    };
  }

  return {
    title: `${pretty} Career Trajectory`,
    match: 88,
    description: `Based on "${pretty}", here's a practical 90-day launchpad. Clarity comes from action — start small, stay consistent.`,
    steps: [
      `Research 5 real people already succeeding in ${pretty} fields.`,
      'List 5 required skills and pick ONE to improve this month.',
      'Create a weekly plan: learning + practice + reflection.',
      'Do one outreach/network action every week (mentor, alumni, community).',
    ],
    skills: ['Self-discipline', 'Communication', 'Research', 'Time Management', 'Resilience', 'Networking'],
  };
}
