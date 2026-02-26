import { supabase } from "@/lib/supabase";
import { matchResumeWithLLM } from "@/lib/llmService";

export async function POST(req: Request) {
  try {
    const { jobRequirements } = await req.json();

    // Fetch resumes safely
    const { data: resumes, error } = await supabase
      .from("resumes")
      .select("*");

    if (error) {
      console.error("Supabase fetch error:", error);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
      });
    }

    // If no resumes, return empty array
    if (!resumes || resumes.length === 0) {
      return new Response(JSON.stringify([]));
    }

    const results = [];

    // Async parallel matching for speed
    for (const resume of resumes) {
      try {
        const match = await matchResumeWithLLM(
          jobRequirements,
          JSON.stringify(resume)
        );

        results.push({
          ...resume,
          ...match,
        });
      } catch (llmError) {
        console.error("LLM match error:", llmError);
      }
    }

    // Sort by match_score safely
    results.sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0));

    return new Response(JSON.stringify(results));
  } catch (err) {
    console.error("POST /resumes/match error:", err);
    return new Response(JSON.stringify([]));
  }
}