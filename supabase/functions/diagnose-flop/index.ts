// supabase/functions/diagnose-flop/index.ts
// Deploy: supabase functions deploy diagnose-flop

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
    const { viralLink, viralScript, userLink, userScript } = await req.json();

    const prompt = `You are ViralLens, an expert AI that diagnoses why a creator's content underperformed compared to a viral original they tried to replicate.

VIRAL ORIGINAL:
- Link: ${viralLink}
- Script/Caption: ${viralScript}

USER'S VERSION (the flop):
- Link: ${userLink}
- Script/Caption: ${userScript}

Compare both videos and respond with ONLY a valid JSON object (no markdown, no backticks). Use this exact structure:

{
  "hookComparison": {
    "viral": "Describe what the viral video's hook did right in the first 3 seconds. Be specific about technique.",
    "yours": "Describe what the user's hook did differently and why it was weaker. Be honest but constructive."
  },
  "structureComparison": {
    "viral": "Break down the viral video's script flow, pacing, and narrative arc.",
    "yours": "Break down where the user's structure diverged and how it hurt engagement."
  },
  "captionComparison": {
    "viral": "Analyze the viral caption/hashtags strategy — what worked and why.",
    "yours": "Analyze the user's caption approach and what could improve."
  },
  "verdict": "A direct, honest but supportive 2-3 sentence verdict on the core reason(s) the user's version flopped. Don't sugarcoat it but be encouraging. Focus on the #1 fixable issue.",
  "actionPlan": [
    "First specific action to take for their next video",
    "Second specific improvement to make",
    "Third concrete change to implement",
    "Fourth tip about timing, hashtags, or format",
    "Fifth encouragement + what they did right (always end positive)"
  ]
}`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2500,
        },
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = text.replace(/```json\s*|```\s*/g, "").trim();
    const result = JSON.parse(cleaned);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to diagnose" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
