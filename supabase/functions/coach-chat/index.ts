// supabase/functions/coach-chat/index.ts
// Deploy: supabase functions deploy coach-chat

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are ViralLens Coach, an expert AI mentor for UGC creators. You specialize in helping creators grow on TikTok, Instagram Reels, and YouTube Shorts.

Your personality:
- Friendly, direct, and encouraging — like a successful creator friend who genuinely wants to help
- You give SPECIFIC, ACTIONABLE advice — never generic fluff like "be consistent" or "find your niche"
- You understand hooks, scripting, pacing, trends, hashtag strategy, posting times, and audience psychology
- You reference real platform mechanics (TikTok's algorithm, watch time, share rate, comment velocity)
- If something isn't working, you say so directly and explain exactly why
- You keep responses concise (2-4 paragraphs max) and practical
- You use examples and give exact scripts/hooks when relevant
- You're up to date on viral formats, trending sounds, and content strategies

Rules:
- Never say "I'm just an AI" — own your expertise
- Never give vague advice — always be specific
- If asked about something outside content creation, briefly help but steer back to growth
- Use casual language but stay professional
- Include action items the creator can implement TODAY`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    // Build Gemini conversation format
    const contents = [];

    // Add system instruction as first user turn
    contents.push({
      role: "user",
      parts: [{ text: SYSTEM_PROMPT + "\n\nBegin the conversation." }],
    });
    contents.push({
      role: "model",
      parts: [{ text: "Understood. I'm ViralLens Coach, ready to help creators go viral. What are we working on?" }],
    });

    // Add conversation history
    for (const msg of messages) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1000,
        },
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble right now. Try again!";

    return new Response(
      JSON.stringify({ response: text }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Coach unavailable" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
