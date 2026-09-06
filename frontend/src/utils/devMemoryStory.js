/** Demo memory story when backend/OpenAI is unavailable in dev mode */

function pickWords(text, count = 6) {
  return text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, count);
}

export function generateDevMemoryStory(text) {
  const words = pickWords(text, 8);
  const w = (i, fallback) => words[i] || fallback;

  return {
    title: `The Super Funny ${w(0, 'Magic')} Dino Adventure! 🦖✨`,
    story: `1. Ek din ek super-cool skateboarding dino named ${w(0, 'Bholu')} wearing red sunglasses came flying down!
2. Usne head par giant book pehni thi jisme "${w(1, 'topic')}" likha tha.
3. Beside him, a magical parrot kept shouting "${w(2, 'key fact')}" while eating yummy ice-cream!
4. Parrot ne bola: "Chalo, aaj hum ${w(3, 'concept')} ke baare me seekhenge!"
5. A magic bicycle made of glowing stars rolled by, carrying ${w(4, 'detail')} all over the town!
6. All the kids laughed and danced together because learning ${w(5, 'summary')} became as easy as playing a fun game.
7. Ye funny kahani aapke dimaag me fixed ho gayi! 🚀`,
    conceptMap: [
      { storyElement: `Skateboarding Dino ${w(0, 'Bholu')}`, realConcept: `Main Topic: ${w(0, 'first key word')}`, emoji: '🦖' },
      { storyElement: 'Giant Book Crown', realConcept: `Key Idea: ${w(1, 'second key word')}`, emoji: '📚' },
      { storyElement: 'Talking Parrot', realConcept: `Important Fact: ${w(2, 'third key word')}`, emoji: '🦜' },
      { storyElement: 'Magic Star Bicycle', realConcept: `Detail: ${w(3, 'fourth key word')}`, emoji: '🚲' },
      { storyElement: 'Red Sunglasses', realConcept: `Extra Context: ${w(4, 'fifth key word')}`, emoji: '🕶️' },
    ],
    memoryHook: `Dino + Parrot + Star Bicycle = ${w(0, 'your topic')} locked in memory forever! 🔒✨`,
    quickRevision: `Super Simple Summary: ${text.trim().slice(0, 200)}${text.length > 200 ? '…' : ''}`,
  };
}
