/** Local mentor replies when OpenAI / backend is unavailable in dig mode */

function replyFor(messageText = '') {
  const t = messageText.toLowerCase();

  if (/motivat|inspire|fire|🔥/.test(t)) {
    return `Arre yaar! Yeh sun 🔥

Tu seedha "Motivate me" likh raha hai — matlab andar se energy chahiye. Bilkul sahi.

Yaad rakh:
1️⃣ Motivation feeling nahi hai — ACTION se aati hai.
2️⃣ 90 din ka ek clear goal fix kar. Aaj nahi toh kab?
3️⃣ Roz subah 25 minute deep work — phone doosri room mein.

Champ, tu average nahi bana. Tu ban-ne ke liye aaya hai.
Ab bata — agle 90 din mein EXACTLY kya achieve karna hai? 🎯`;
  }

  if (/stress|anxious|tension|😰|overwhelm/.test(t)) {
    return `Arre beta, tension normal hai — collapse nahi.

Fast reset (2 minutes):
1) 4 seconds inhale → 4 hold → 6 exhale (×5)
2) Likh: "Right now I can control _____"
3) Ek chhoti win complete kar (10 minute task)

Stress ko enemy mat bana — signal hai. Ab bata: stress kis cheez se aa raha hai — exams, parents, career, ya something else?`;
  }

  if (/stud(y|ies)|tips|📚|focus|exam/.test(t)) {
    return `Study tips jo actually kaam karte hain 📚

• Pomodoro: 25 min focus + 5 min break
• Active recall: notes mat padh — baar baar yaad kar
• Sleep > late night grinding
• Phone airplane mode during deep work

Linking tool use kar memory stories ke liye — concepts permanently stick ho jaayenge.

Bata — konse subject mein stuck hai?`;
  }

  if (/goal|90|target|🎯/.test(t)) {
    return `Goal setting time! 🎯

90-day framework:
1) ONE big outcome (measurable)
2) Weekly milestones (12 weeks)
3) Daily 1–3 actions

Example: "I will score 85%+ in finals" → weekly mock tests → daily 2 hours focused revision.

Apna 90-day goal ek line mein likh — main usko breakdown karunga.`;
  }

  if (/career|job|💼|future|college/.test(t)) {
    return `Career clarity aati hai exploration se, overthinking se nahi 💼

Do this week:
1) 3 roles shortlist kar (interest + skill)
2) Har role ke 2 people se baat kar / videos dekh
3) Ek skill choose kar jo 90 din mein improve karega

Bata — school/college mein hai, aur kis area mein lean kar raha hai?`;
  }

  if (/memor(y|ize)|linking|🧠|trick|palace/.test(t)) {
    return `Memory Man mode ON 🧠

Best tricks:
• Linking / story method — bizarre stories stick forever
• Peg system — numbers to pictures
• Memory palace — familiar rooms + vivid images

Linking page pe text paste kar — main usse crazy story banaata hoon.

Kya yaad karna hai abhi?`;
  }

  if (/help|stuck|confused|don't know|dont know/.test(t)) {
    return `Main yahin hoon — judgment free zone.

Quick triage:
1) Emotional (stress / confidence)?
2) Academic (study / exams)?
3) Direction (goals / career)?

Jo bhi hai seedha bol. Ek problem, ek plan. 💪`;
  }

  return `Samajh gaya yaar.

Tu bola: "${messageText.trim().slice(0, 120)}${messageText.trim().length > 120 ? '…' : ''}"

Ab seedha jawab:
• Clear goal + daily action = progress
• Overwhelm feel ho toh 10-min task se start kar
• Consistency motivation se badi cheez hai

Dev mode mein main local mentor replies de raha hoon. Real AI streaming ke liye \`backend/.env\` mein OPENAI_API_KEY add kar.

Ab bata — naam, current struggle, aur 90-day goal? 🔥`;
}

export function generateDevChatReply(messageText) {
  return replyFor(messageText);
}
