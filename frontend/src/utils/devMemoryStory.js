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
    title: `The ${w(0, 'Magic')} Elephant's Wild Adventure`,
    story: `Arre yaar, picture this: A flying elephant named ${w(0, 'Bholu')} wearing orange sunglasses crash-landed on a giant textbook about "${w(1, 'history')}". Beside him, a dancing robot kept shouting "${w(2, 'revolution')}" while juggling ${w(3, 'facts')} like cricket balls! A talking parrot narrated the story of ${w(4, 'communists')} who split from a party to lead peasant struggles — all while riding a bicycle made of ${w(5, 'memories')}. Totally illogical. Totally unforgettable. 🐘🤖🦜`,
    conceptMap: [
      { storyElement: `flying elephant ${w(0, 'Bholu')}`, realConcept: `Key theme: ${w(0, 'main concept from your text')}`, emoji: '🐘' },
      { storyElement: 'dancing robot', realConcept: `Related idea: ${w(1, 'second concept')}`, emoji: '🤖' },
      { storyElement: 'talking parrot', realConcept: `Movement/event: ${w(2, 'third concept')}`, emoji: '🦜' },
      { storyElement: 'bicycle of memories', realConcept: `Important detail: ${w(3, 'fourth concept')}`, emoji: '🚲' },
      { storyElement: 'orange sunglasses', realConcept: `Context: ${w(4, 'fifth concept')}`, emoji: '🕶️' },
      { storyElement: 'giant textbook', realConcept: `Summary anchor: ${w(5, 'sixth concept')}`, emoji: '📚' },
    ],
    memoryHook: `Elephant + Robot + Parrot = ${w(0, 'your topic')} locked forever!`,
    quickRevision: text.trim().slice(0, 280) + (text.length > 280 ? '…' : ''),
  };
}
