// supabase/functions/decode-video/index.ts
// Deploy: supabase functions deploy decode-video
// Set secret: supabase secrets set GEMINI_API_KEY=your_key

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { viralLink, viralScript } = await req.json();

    const prompt = `You are ViralLens, an expert AI that analyzes viral video content. A user has provided a viral video for analysis.

VIDEO LINK: ${viralLink}
VIDEO SCRIPT/CAPTION: ${viralScript}

Analyze this viral video and respond with ONLY a valid JSON object (no markdown, no backticks, no extra text). Use this exact structure:

{
  "hook": "Detailed breakdown of the first 3 seconds. What grabbed attention? Why did people stop scrolling? What visual/audio/text elements created the hook? Be specific and actionable.",
  "scriptStructure": "Break down the full script structure: Opening hook → Build-up → Core message → CTA/ending. Explain the pacing, emotional arc, and how each section serves the virality.",
  "whyViral": "Explain the specific psychological and algorithmic reasons this went viral. Cover: emotional triggers (curiosity, shock, relatability, aspiration), trend alignment, shareability factor, comment-bait elements, watch-time optimization, and replay value.",
  "keyTakeaways": [
    "First specific, actionable takeaway a creator can replicate",
    "Second specific takeaway about structure or hook technique",
    "Third takeaway about caption/hashtag/posting strategy",
    "Fourth takeaway about the content format or niche angle",
    "Fifth takeaway about what made this stand out from similar content"
  ]
}`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse JSON from response (handle markdown fences)
    const cleaned = text.replace(/```json\s*|```\s*/g, "").trim();
    const result = JSON.parse(cleaned);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to decode video" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
