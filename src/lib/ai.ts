const getKey = () => import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

async function callGemini(prompt: string) {
  const res = await fetch(`${GEMINI_URL}?key=${getKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2500 },
    }),
  })
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return JSON.parse(text.replace(/```json\s*|```\s*/g, '').trim())
}

export async function decodeVideo({ viralLink, viralScript }: { viralLink: string; viralScript: string }) {
  return callGemini(`You are ViralLens, an expert AI that analyzes viral video content.

VIDEO LINK: ${viralLink}
VIDEO SCRIPT/CAPTION: ${viralScript}

Analyze this viral video. Consider the hook technique, script pacing, emotional triggers, CTA placement, caption/hashtag strategy, trend alignment, shareability, watch-time optimization, and replay value.

Respond with ONLY valid JSON, no markdown, no backticks:
{
  "hook": "Detailed breakdown of the first 3 seconds — what grabbed attention, why people stopped scrolling, what visual/audio/text elements created the hook. Be extremely specific and actionable.",
  "scriptStructure": "Full script structure breakdown: Opening hook → Build-up → Core message → CTA/ending. Explain pacing, emotional arc, and how each section drives virality.",
  "whyViral": "Specific psychological and algorithmic reasons this went viral: emotional triggers (curiosity, shock, relatability, aspiration), trend alignment, shareability factor, comment-bait elements, watch-time optimization, replay value, and platform algorithm signals.",
  "keyTakeaways": [
    "First specific, actionable takeaway to replicate",
    "Second takeaway about hook or structure technique",
    "Third takeaway about caption/hashtag/posting strategy",
    "Fourth takeaway about format or niche angle",
    "Fifth takeaway about what made this stand out"
  ]
}`)
}

export async function diagnoseFlop({ viralLink, viralScript, userLink, userScript }: { viralLink: string; viralScript: string; userLink: string; userScript: string }) {
  return callGemini(`You are ViralLens, an expert AI that diagnoses why a creator's content underperformed compared to a viral original.

VIRAL ORIGINAL:
- Link: ${viralLink}
- Script/Caption: ${viralScript}

USER'S VERSION (the flop):
- Link: ${userLink}
- Script/Caption: ${userScript}

Compare both videos across hook effectiveness, script structure, pacing, caption strategy, emotional triggers, CTA, and algorithmic signals. Be brutally honest but constructive.

Respond with ONLY valid JSON, no markdown, no backticks:
{
  "hookComparison": {
    "viral": "What the viral hook did right in the first 3 seconds — specific technique breakdown",
    "yours": "What the user's hook did differently and why it was weaker — be honest and specific"
  },
  "structureComparison": {
    "viral": "Viral video's script flow, pacing, narrative arc breakdown",
    "yours": "Where the user's structure diverged and how it hurt engagement"
  },
  "captionComparison": {
    "viral": "Viral caption/hashtag strategy analysis — what worked and why",
    "yours": "User's caption approach analysis and what to improve"
  },
  "verdict": "Direct, honest 2-3 sentence verdict on THE core reason the user's version flopped. Don't sugarcoat but be encouraging. Focus on the #1 fixable issue.",
  "actionPlan": [
    "First specific action for their next video",
    "Second specific improvement",
    "Third concrete change to implement",
    "Fourth tip about timing, hashtags, or format",
    "Fifth — what they did RIGHT (always end positive)"
  ]
}`)
}

export async function chatWithCoach({ messages }: { messages: { role: string; content: string }[] }) {
  const systemPrompt = `You are ViralLens Coach, an expert AI mentor for UGC creators on TikTok, Instagram Reels, and YouTube Shorts. You give SPECIFIC, ACTIONABLE advice — never generic fluff. You understand hooks, scripting, pacing, trends, hashtag strategy, posting times, audience psychology, lighting, props, transitions, and content formats. Be encouraging but brutally honest. Keep responses concise (2-4 paragraphs max). Include action items they can implement TODAY. Never say "I'm just an AI".`

  const conversationText = messages.map(m => `${m.role === 'user' ? 'Creator' : 'Coach'}: ${m.content}`).join('\n\n')

  const res = await fetch(`${GEMINI_URL}?key=${getKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\nConversation so far:\n${conversationText}\n\nCoach:` }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 1000 },
    }),
  })
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Having trouble connecting. Try again!"
  return { response: text }
}
